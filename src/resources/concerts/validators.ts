import * as v from 'valibot'

export const ConcertSchema = v.object({
  artist: v.pipe(v.string(), v.nonEmpty('Artist is required')),
  venue: v.optional(v.pipe(v.string(), v.trim())),
  performedAt: v.pipe(v.string(), v.nonEmpty('Date is required')),
  status: v.optional(v.picklist(['confirmed', 'maybe']), 'confirmed'),
})

export type ConcertInput = v.InferInput<typeof ConcertSchema>
export type ConcertOutput = v.InferOutput<typeof ConcertSchema>
