'use client'

import { Field, Form, useForm } from '@formisch/react'
import * as v from 'valibot'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { signIn } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music2 } from 'lucide-react'
import { toast } from 'sonner'

const SignInSchema = v.object({
  email: v.pipe(v.string(), v.nonEmpty('Required'), v.email('Invalid email')),
  password: v.pipe(v.string(), v.nonEmpty('Required')),
})

export default function SignInPage() {
  const router = useRouter()
  const form = useForm({
    schema: SignInSchema,
    initialInput: { email: '', password: '' },
  })

  const handleSubmit = async (
    output: v.InferOutput<typeof SignInSchema>,
  ) => {
    const result = await signIn.email({
      email: output.email,
      password: output.password,
    })

    if (result.error) {
      toast.error(result.error.message ?? 'Sign in failed')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='text-center'>
        <div className='bg-primary text-primary-foreground mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
          <Music2 className='h-5 w-5' />
        </div>
        <CardTitle>MyConcertList</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} onSubmit={handleSubmit} className='space-y-4'>
          <Field of={form} path={['email']}>
            {(field) => (
              <div className='space-y-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  {...field.props}
                  id='email'
                  value={field.input}
                  type='email'
                  placeholder='you@example.com'
                />
                {field.errors && (
                  <p className='text-destructive text-xs'>{field.errors[0]}</p>
                )}
              </div>
            )}
          </Field>

          <Field of={form} path={['password']}>
            {(field) => (
              <div className='space-y-1.5'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  {...field.props}
                  id='password'
                  value={field.input}
                  type='password'
                />
                {field.errors && (
                  <p className='text-destructive text-xs'>{field.errors[0]}</p>
                )}
              </div>
            )}
          </Field>

          <Button type='submit' className='w-full'>
            Sign in
          </Button>
        </Form>
      </CardContent>
      <CardFooter className='justify-center text-sm'>
        <span className='text-muted-foreground'>No account?&nbsp;</span>
        <Link href='/sign-up' className='text-primary font-medium hover:underline'>
          Sign up
        </Link>
      </CardFooter>
    </Card>
  )
}
