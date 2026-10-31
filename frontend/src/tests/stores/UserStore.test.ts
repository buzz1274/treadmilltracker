import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { authStore } from '@/api/AuthStore.ts'
import { userStore as useUserStore } from '@/stores/UserStore.ts'

vi.hoisted(() => {
  vi.stubGlobal('window', { location: { hostname: 'tracker.test' } })
})

const profile = { full_name: 'Test runner', registered_date: '2026-01-15' }
const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('session restoration', () => {
  const fetchMock = vi.fn<typeof fetch>()
  let storage: Map<string, string>

  beforeEach(() => {
    storage = new Map()
    vi.stubGlobal('window', {
      location: { hostname: 'tracker.test' },
      sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    })
    vi.stubGlobal('fetch', fetchMock)
    setActivePinia(createPinia())
    authStore.setToken(null)
  })

  afterEach(() => {
    authStore.setToken(null)
  })

  it('restores a stored token and fetches a fresh user profile', async () => {
    storage.set('treadmilltracker.token', 'stored-token')
    fetchMock.mockResolvedValue(response(profile))
    const store = useUserStore()
    expect(store.user.isAuthenticated).toBe(false)
    await store.restoreSession()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://tracker.test/api/users/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer stored-token',
        }),
      }),
    )
    expect(store.user.isAuthenticated).toBe(true)
    expect(store.user.name).toBe('Test runner')
    expect(store.user.date).toBeInstanceOf(Date)
    expect(store.isRestoringSession).toBe(false)
  })

  it('persists login across a new Pinia instance and clears it on logout', async () => {
    fetchMock
      .mockResolvedValueOnce(response({ token: 'new-token' }))
      .mockResolvedValueOnce(response(profile))
      .mockResolvedValueOnce(response(profile))
    await useUserStore().login({ credential: 'google-token' })
    expect(storage.get('treadmilltracker.token')).toBe('new-token')

    setActivePinia(createPinia())
    const restoredStore = useUserStore()
    await restoredStore.restoreSession()
    expect(restoredStore.user.isAuthenticated).toBe(true)
    restoredStore.logout()
    expect(storage.has('treadmilltracker.token')).toBe(false)
    expect(restoredStore.user.isAuthenticated).toBe(false)
  })

  it('does not request a profile without a stored session', async () => {
    const store = useUserStore()
    await store.restoreSession()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(store.isRestoringSession).toBe(false)
    expect(store.user.isAuthenticated).toBe(false)
  })

  it.each([401, 403])(
    'clears a rejected session for HTTP %s',
    async (status) => {
      authStore.setToken('invalid-token')
      fetchMock.mockResolvedValue(
        response({ detail: 'Invalid credentials' }, status),
      )
      const store = useUserStore()
      await expect(store.restoreSession()).rejects.toThrow()
      expect(authStore.getToken()).toBeNull()
      expect(storage.size).toBe(0)
      expect(store.user.isAuthenticated).toBe(false)
      expect(store.isRestoringSession).toBe(false)
    },
  )

  it('keeps the stored token on a temporary network failure', async () => {
    authStore.setToken('valid-token')
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    const store = useUserStore()
    await expect(store.restoreSession()).rejects.toThrow('Failed to fetch')
    expect(storage.get('treadmilltracker.token')).toBe('valid-token')
    expect(store.user.isAuthenticated).toBe(false)
    expect(store.isRestoringSession).toBe(false)
  })

  it('does not restore a session after logout during the profile request', async () => {
    authStore.setToken('valid-token')
    let finish!: (value: Response) => void
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        finish = resolve
      }),
    )
    const store = useUserStore()
    const request = store.restoreSession()
    store.logout()
    finish(response(profile))
    await request
    expect(store.user.isAuthenticated).toBe(false)
    expect(authStore.getToken()).toBeNull()
  })

  it('clears the token when login succeeds but loading the profile fails', async () => {
    fetchMock
      .mockResolvedValueOnce(response({ token: 'new-token' }))
      .mockResolvedValueOnce(response({ detail: 'Unavailable' }, 503))
    const store = useUserStore()
    await expect(store.login({ credential: 'google-token' })).rejects.toThrow()
    expect(authStore.getToken()).toBeNull()
    expect(storage.size).toBe(0)
    expect(store.user.isAuthenticated).toBe(false)
  })
})
