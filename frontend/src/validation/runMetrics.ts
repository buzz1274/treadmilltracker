import { number } from 'yup'

import type { IRunData } from '@/types/types'

type TOriginalMetrics = Partial<
  Pick<IRunData, 'weight_kg' | 'avg_heart_rate' | 'max_heart_rate'>
>

const metric = (message: string, hadValue: boolean) =>
  number()
    .nullable()
    .when('id', {
      is: (id: unknown) => !id || hadValue,
      then: (schema) => schema.required(message),
      otherwise: (schema) => schema.optional(),
    })

export const createRunMetricFields = (original: TOriginalMetrics = {}) => ({
  weight_kg: metric(
    'Please enter a valid value for weight',
    original.weight_kg != null,
  ),
  avg_heart_rate: metric(
    'Please enter a valid value for average heart rate',
    original.avg_heart_rate != null,
  ),
  max_heart_rate: metric(
    'Please enter a valid value for max heart rate',
    original.max_heart_rate != null,
  ),
})
