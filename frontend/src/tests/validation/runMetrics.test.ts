import { describe, expect, it } from 'vitest'
import { number, object } from 'yup'

import { createRunMetricFields } from '@/validation/runMetrics'

const schema = object({
  id: number().nullable().optional(),
  ...createRunMetricFields(),
})
const metrics = { weight_kg: 75.5, avg_heart_rate: 140, max_heart_rate: 170 }

describe('run metric validation', () => {
  it.each(Object.keys(metrics))('requires %s for a new run', (field) => {
    const missing: Record<string, unknown> = { ...metrics }
    delete missing[field]
    expect(() => schema.validateSync(missing)).toThrow()
    expect(() => schema.validateSync({ ...metrics, [field]: null })).toThrow()
  })

  it.each([undefined, null])('requires all metrics for new run id %s', (id) => {
    expect(() => schema.validateSync({ id })).toThrow()
    expect(() => schema.validateSync({ id, ...metrics })).not.toThrow()
  })

  it('allows existing runs with no recorded metrics', () => {
    expect(() => schema.validateSync({ id: 7 })).not.toThrow()
    expect(() =>
      schema.validateSync({
        id: 7,
        weight_kg: null,
        avg_heart_rate: null,
        max_heart_rate: null,
      }),
    ).not.toThrow()
  })

  it.each(Object.keys(metrics))(
    'still rejects non-numeric %s when editing',
    (field) => {
      expect(() =>
        schema.validateSync({ id: 7, ...metrics, [field]: 'invalid' }),
      ).toThrow()
    },
  )

  it.each(['weight_kg', 'avg_heart_rate', 'max_heart_rate'] as const)(
    'prevents clearing an existing %s',
    (field) => {
      const editSchema = object({
        id: number(),
        ...createRunMetricFields({ [field]: metrics[field] }),
      })
      expect(() => editSchema.validateSync({ id: 7, [field]: null })).toThrow()
      expect(() => editSchema.validateSync({ id: 7 })).toThrow()
      expect(() =>
        editSchema.validateSync({
          id: 7,
          [field]: metrics[field] + 1,
        }),
      ).not.toThrow()
    },
  )

  it('keeps originally empty metrics optional independently', () => {
    const editSchema = object({
      id: number(),
      ...createRunMetricFields({ weight_kg: 75, avg_heart_rate: null }),
    })
    expect(() =>
      editSchema.validateSync({
        id: 7,
        weight_kg: 76,
        avg_heart_rate: null,
        max_heart_rate: null,
      }),
    ).not.toThrow()
    expect(() =>
      editSchema.validateSync({
        id: 7,
        weight_kg: null,
        avg_heart_rate: 140,
      }),
    ).toThrow()
  })

  it('accepts recorded metrics when editing', () => {
    expect(() => schema.validateSync({ id: 7, ...metrics })).not.toThrow()
  })
})
