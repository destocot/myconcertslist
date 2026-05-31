import * as v from 'valibot'

export const ConcertSchema = v.object({
  headliner: v.pipe(v.string(), v.nonEmpty('Headliner is required')),
  venue: v.optional(v.pipe(v.string(), v.trim())),
  performedAt: v.pipe(v.string(), v.nonEmpty('Date is required')),
  time: v.optional(v.union([
    v.literal(''),
    v.pipe(v.string(), v.regex(/^\d{2}:\d{2}$/, 'Invalid time')),
  ])),
  openers: v.optional(v.array(v.pipe(v.string(), v.nonEmpty())), []),
  status: v.optional(v.picklist(['confirmed', 'maybe']), 'confirmed'),
})

export type ConcertInput = v.InferInput<typeof ConcertSchema>
export type ConcertOutput = v.InferOutput<typeof ConcertSchema>
