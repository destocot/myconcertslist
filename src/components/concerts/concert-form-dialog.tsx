'use client'

import { Field, Form, useForm, reset } from '@formisch/react'
import * as v from 'valibot'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConcertSchema } from '@/resources/concerts/validators'
import type { ConcertInput } from '@/resources/concerts/validators'
import type { Concert } from '@/generated/prisma/client'
import { useState } from 'react'

interface ConcertFormDialogProps {
  concert?: Concert
  onSubmit: (data: ConcertInput) => Promise<void>
  trigger: React.ReactNode
}

export const ConcertFormDialog = ({
  concert,
  onSubmit,
  trigger,
}: ConcertFormDialogProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm({
    schema: ConcertSchema,
    initialInput: concert
      ? {
          artist: concert.artist,
          venue: concert.venue ?? '',
          performedAt: new Date(concert.performedAt).toISOString().slice(0, 10),
          status: concert.status as 'confirmed' | 'maybe',
        }
      : {
          artist: '',
          venue: '',
          performedAt: new Date().toISOString().slice(0, 10),
          status: 'confirmed' as const,
        },
  })

  const handleSubmit = async (output: v.InferOutput<typeof ConcertSchema>) => {
    await onSubmit(output)
    setOpen(false)
    reset(form)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset(form)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-md' aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{concert ? 'Edit Concert' : 'Add Concert'}</DialogTitle>
        </DialogHeader>
        <Form of={form} onSubmit={handleSubmit} className='space-y-4 pt-2'>
          <Field of={form} path={['artist']}>
            {(field) => (
              <div className='space-y-1.5'>
                <Label htmlFor='artist'>Artist</Label>
                <Input
                  {...field.props}
                  id='artist'
                  value={field.input ?? ''}
                  placeholder='e.g. Radiohead'
                />
                {field.errors && (
                  <p className='text-destructive text-xs'>{field.errors[0]}</p>
                )}
              </div>
            )}
          </Field>

          <Field of={form} path={['venue']}>
            {(field) => (
              <div className='space-y-1.5'>
                <Label htmlFor='venue'>
                  Venue{' '}
                  <span className='text-muted-foreground font-normal'>
                    (optional)
                  </span>
                </Label>
                <Input
                  {...field.props}
                  id='venue'
                  value={field.input ?? ''}
                  placeholder='e.g. Madison Square Garden'
                />
              </div>
            )}
          </Field>

          <Field of={form} path={['performedAt']}>
            {(field) => (
              <div className='space-y-1.5'>
                <Label htmlFor='performedAt'>Date</Label>
                <Input
                  {...field.props}
                  id='performedAt'
                  value={field.input ?? ''}
                  type='date'
                />
                {field.errors && (
                  <p className='text-destructive text-xs'>{field.errors[0]}</p>
                )}
              </div>
            )}
          </Field>

          <Field of={form} path={['status']}>
            {(field) => (
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='status'
                  checked={field.input === 'maybe'}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? 'maybe' : 'confirmed')
                  }
                />
                <Label htmlFor='status' className='font-normal'>
                  Maybe{' '}
                  <span className='text-muted-foreground'>
                    (haven&apos;t bought tickets yet)
                  </span>
                </Label>
              </div>
            )}
          </Field>

          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>{concert ? 'Save changes' : 'Add'}</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
