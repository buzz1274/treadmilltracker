import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { authStore } from '@/api/AuthStore.ts'
import { RunModel } from '@/models/RunModel.ts'
import { RunsModel } from '@/models/RunsModel.ts'
import { store as useStore } from '@/stores/store.ts'
import { userStore as useUserStore } from '@/stores/UserStore.ts'
import type { TInterval } from '@/types/date.constants.ts'

// HttpClient is imported by UserStore and reads the hostname at module load.
vi.hoisted(() => {
  vi.stubGlobal('window', { location: { hostname: 'tracker.test' } })
})

const runData = {
  id: 7,
  run_date: '2026-10-20',
  distance_m: 5000,
  duration_s: 1800,
  calories: 350,
  vo2max: 45,
  pace: 10,
}

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

describe('RunsModel.getRuns', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('window', { location: { hostname: 'tracker.test' } })
    vi.stubGlobal('fetch', fetchMock)
    authStore.setToken(null)
  })

  afterEach(() => {
    authStore.setToken(null)
  })

  it('requests daily runs by default with the current bearer token', async () => {
    authStore.setToken('test-token')
    fetchMock.mockResolvedValue(jsonResponse({ data: [] }))

    await new RunsModel().getRuns()

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      'https://tracker.test/api/runs/?group_by=days',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
          Accept: 'application/json',
        }),
      }),
    )
  })

  it.each<TInterval>(['days', 'weeks', 'months', 'years'])(
    'passes the %s grouping and date range to the API',
    async (interval) => {
      fetchMock.mockResolvedValue(jsonResponse({ data: [] }))
      await new RunsModel().getRuns(interval, '2026-10-01', '2026-10-31')
      expect(fetchMock).toHaveBeenCalledWith(
        `https://tracker.test/api/runs/?group_by=${interval}` +
          '&start_date=2026-10-01&end_date=2026-10-31',
        expect.any(Object),
      )
    },
  )

  it.each([
    ['2026-10-01', null, '&start_date=2026-10-01'],
    [null, '2026-10-31', '&end_date=2026-10-31'],
  ])('supports an open date range (%s, %s)', async (start, end, query) => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [] }))
    await new RunsModel().getRuns('days', start, end)
    expect(fetchMock).toHaveBeenCalledWith(
      `https://tracker.test/api/runs/?group_by=days${query}`,
      expect.any(Object),
    )
  })

  it('omits the authorization header when no token is available', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [] }))
    await new RunsModel().getRuns()
    expect(fetchMock.mock.calls[0]?.[1]?.headers).not.toHaveProperty(
      'Authorization',
    )
  })

  it('hydrates every returned run with display helpers and preserves order', async () => {
    const secondRun = { ...runData, id: 8, distance_m: 2500 }
    fetchMock.mockResolvedValue(jsonResponse({ data: [runData, secondRun] }))
    const model = new RunsModel()

    await model.getRuns()

    expect(model.runs.value).toHaveLength(2)
    expect(model.runs.value[0]).toBeInstanceOf(RunModel)
    expect(model.runs.value[0]).toMatchObject(runData)
    expect(model.runs.value[0]?.distanceKm()).toBe('5.00')
    expect(model.runs.value[0]?.secondsToHHMMSS()).toBe('00:30:00')
    expect(model.runs.value[1]).toMatchObject(secondRun)
  })

  it('replaces previous results instead of appending on refresh', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ data: [runData] }))
      .mockResolvedValueOnce(jsonResponse({ data: [{ ...runData, id: 8 }] }))
    const model = new RunsModel()
    await model.getRuns()
    await model.getRuns()
    expect(model.runs.value.map((run) => run.id)).toEqual([8])
  })

  it('clears previous runs when the API returns an empty result', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ data: [runData] }))
      .mockResolvedValueOnce(jsonResponse({ data: [] }))
    const model = new RunsModel()
    await model.getRuns()
    await model.getRuns()
    expect(model.runs.value).toEqual([])
  })

  it('treats a 404 no-runs response as an empty list', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ detail: 'Run not found' }, 404))
    const model = new RunsModel()
    await model.getRuns()
    expect(model.runs.value).toEqual([])
    expect(useStore().isLoading).toBe(false)
  })

  it.each([500, 422])('reports the API error for HTTP %s', async (status) => {
    fetchMock.mockResolvedValue(
      jsonResponse({ detail: 'Request failed' }, status),
    )
    const model = new RunsModel()
    await expect(model.getRuns()).rejects.toThrow('Request failed')
    expect(model.runs.value).toEqual([])
    expect(useStore().isLoading).toBe(false)
  })

  it('logs out on a forbidden response', async () => {
    const userStore = useUserStore()
    userStore.user.isAuthenticated = true
    const logout = vi.spyOn(userStore, 'logout')
    fetchMock.mockResolvedValue(jsonResponse({ detail: 'Forbidden' }, 403))
    await expect(new RunsModel().getRuns()).rejects.toThrow('403: Forbidden')
    expect(logout).toHaveBeenCalledOnce()
    expect(userStore.user.isAuthenticated).toBe(false)
    expect(useStore().isLoading).toBe(false)
  })

  it('propagates network failures and finishes the loading state', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(new RunsModel().getRuns()).rejects.toThrow('Failed to fetch')
    expect(useStore().isLoading).toBe(false)
  })

  it('shows loading only while the API request is pending', async () => {
    let finishRequest!: (response: Response) => void
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        finishRequest = resolve
      }),
    )
    const request = new RunsModel().getRuns()
    expect(useStore().isLoading).toBe(true)
    finishRequest(jsonResponse({ data: [runData] }))
    await request
    expect(useStore().isLoading).toBe(false)
  })
})
