'use client'

import { useState } from 'react'
import { useForm, Form, Field } from '@formisch/react'
import * as v from 'valibot'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ThemePicker } from '@/components/theme-picker'
import { updateSettingsAction } from '@/resources/profiles/actions/update-settings'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

const SettingsSchema = v.object({
  birthday: v.string(),
  location: v.pipe(v.string(), v.maxLength(100, 'Max 100 characters')),
  bio: v.pipe(v.string(), v.maxLength(500, 'Max 500 characters')),
})

type Props = {
  gender: string
  birthday: string
  location: string
  bio: string
}

export function EditProfileForm({ gender: initialGender, birthday, location, bio }: Props) {
  const [gender, setGender] = useState(initialGender)

  const form = useForm({
    schema: SettingsSchema,
    initialInput: { birthday, location, bio },
  })

  const handleSubmit = async (output: v.InferOutput<typeof SettingsSchema>) => {
    const result = await updateSettingsAction({ ...output, gender })
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success('Profile updated')
  }

  return (
    <Form of={form} onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-1.5'>
        <Label>Theme</Label>
        <ThemePicker />
      </div>

      <div className='space-y-1.5'>
        <Label>Gender</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='not_specified'>Not Specified</SelectItem>
            <SelectItem value='male'>Male</SelectItem>
            <SelectItem value='female'>Female</SelectItem>
            <SelectItem value='non_binary'>Non-Binary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Field of={form} path={['birthday']}>
        {(field) => (
          <div className='space-y-1.5'>
            <Label htmlFor='birthday'>Birthday</Label>
            <Input
              {...field.props}
              id='birthday'
              value={field.input}
              type='date'
            />
          </div>
        )}
      </Field>

      <Field of={form} path={['location']}>
        {(field) => (
          <div className='space-y-1.5'>
            <Label htmlFor='location'>Location</Label>
            <Input
              {...field.props}
              id='location'
              value={field.input}
              placeholder='City, Country'
            />
            {field.errors && (
              <p className='text-destructive text-xs'>{field.errors[0]}</p>
            )}
          </div>
        )}
      </Field>

      <Field of={form} path={['bio']}>
        {(field) => (
          <div className='space-y-1.5'>
            <Label htmlFor='bio'>About Me</Label>
            <Textarea
              {...field.props}
              id='bio'
              value={field.input}
              placeholder='Tell us about yourself…'
              rows={4}
            />
            {field.errors && (
              <p className='text-destructive text-xs'>{field.errors[0]}</p>
            )}
          </div>
        )}
      </Field>

      <Button type='submit' disabled={form.isSubmitting}>
        {form.isSubmitting ? (
          <>
            <Loader2Icon className='animate-spin' />
            Saving…
          </>
        ) : (
          'Save changes'
        )}
      </Button>
    </Form>
  )
}
