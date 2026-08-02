import * as v from 'valibot'

export const GENDERS = ['not_specified', 'male', 'female', 'non_binary'] as const

export const PROFILE_LIMITS = { location: 100, bio: 500 } as const

export const ProfileSettingsSchema = v.object({
  gender: v.optional(v.picklist(GENDERS), 'not_specified'),
  birthday: v.optional(
    v.union([v.literal(''), v.pipe(v.string(), v.isoDate('Invalid date'))]),
    '',
  ),
  location: v.optional(
    v.pipe(
      v.string(),
      v.trim(),
      v.maxLength(PROFILE_LIMITS.location, 'Max 100 characters'),
    ),
    '',
  ),
  bio: v.optional(
    v.pipe(
      v.string(),
      v.trim(),
      v.maxLength(PROFILE_LIMITS.bio, 'Max 500 characters'),
    ),
    '',
  ),
})

export type ProfileSettingsInput = v.InferInput<typeof ProfileSettingsSchema>
export type ProfileSettingsOutput = v.InferOutput<typeof ProfileSettingsSchema>
