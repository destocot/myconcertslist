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
import type { ConcertWithOpeners } from '@/resources/concerts/queries'
import { useState } from 'react'
import { X } from 'lucide-react'

interface ConcertFormDialogProps {
  concert?: ConcertWithOpeners
  onSubmit: (data: ConcertInput) => Promise<void>
  trigger: React.ReactNode
}

export const ConcertFormDialog = ({
  concert,
  onSubmit,
  trigger,
}: ConcertFormDialogProps) => {
  const [open, setOpen] = useState(false)
  const [openers, setOpeners] = useState<string[]>(
    concert?.openers.map((o) => o.name) ?? [],
  )
  const [openerInput, setOpenerInput] = useState('')

  const form = useForm({
    schema: ConcertSchema,
    initialInput: concert
      ? {
          headliner: concert.headliner,
          venue: concert.venue ?? '',
          performedAt: new Date(concert.performedAt).toISOString().slice(0, 10),
          time: (() => {
            const d = new Date(concert.performedAt)
            const h = d.getUTCHours()
            const m = d.getUTCMinutes()
            return h === 0 && m === 0
              ? ''
              : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          })(),
          status: concert.status as 'confirmed' | 'maybe',
        }
      : {
          headliner: '',
          venue: '',
          performedAt: new Date().toISOString().slice(0, 10),
          time: '',
          status: 'confirmed' as const,
        },
  })

  const addOpener = () => {
    const name = openerInput.trim()
    if (name && !openers.includes(name)) {
      setOpeners((prev) => [...prev, name])
      setOpenerInput('')
    }
  }

  const removeOpener = (name: string) =>
    setOpeners((prev) => prev.filter((o) => o !== name))

  const handleClose = () => {
    setOpen(false)
    reset(form)
    setOpeners(concert?.openers.map((o) => o.name) ?? [])
    setOpenerInput('')
  }

  const handleSubmit = async (output: v.InferOutput<typeof ConcertSchema>) => {
    await onSubmit({ ...output, openers })
    setOpen(false)
    reset(form)
    setOpeners([])
    setOpenerInput('')
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-md' aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{concert ? 'Edit Concert' : 'Add Concert'}</DialogTitle>
        </DialogHeader>
        <Form of={form} onSubmit={handleSubmit} className='space-y-4 pt-2'>
          <Field of={form} path={['headliner']}>
            {(field) => (
              <div className='space-y-1.5'>
                <Label htmlFor='headliner'>Headliner</Label>
                <Input
                  {...field.props}
                  id='headliner'
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

          <Field of={form} path={['time']}>
            {(field) => (
              <div className='space-y-1.5'>
                <Label htmlFor='time'>
                  Start time{' '}
                  <span className='text-muted-foreground font-normal'>
                    (optional)
                  </span>
                </Label>
                <Input
                  {...field.props}
                  id='time'
                  value={field.input ?? ''}
                  type='time'
                />
                {field.errors && (
                  <p className='text-destructive text-xs'>{field.errors[0]}</p>
                )}
              </div>
            )}
          </Field>

          <div className='space-y-1.5'>
            <Label>
              Openers{' '}
              <span className='text-muted-foreground font-normal'>(optional)</span>
            </Label>
            <div className='flex gap-2'>
              <Input
                value={openerInput}
                onChange={(e) => setOpenerInput(e.target.value)}
                placeholder='e.g. Cold War Kids'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addOpener()
                  }
                }}
              />
              <Button type='button' variant='outline' size='sm' onClick={addOpener}>
                Add
              </Button>
            </div>
            {openers.length > 0 && (
              <div className='flex flex-wrap gap-1.5 pt-0.5'>
                {openers.map((name) => (
                  <span
                    key={name}
                    className='bg-secondary text-secondary-foreground flex items-center gap-1 rounded px-2 py-0.5 text-xs'
                  >
                    {name}
                    <button
                      type='button'
                      onClick={() => removeOpener(name)}
                      className='text-secondary-foreground/60 hover:text-secondary-foreground'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

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
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit'>{concert ? 'Save changes' : 'Add'}</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
