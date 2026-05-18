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
import { signUp } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music2 } from 'lucide-react'
import { toast } from 'sonner'

const SignUpSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty('Required')),
  username: v.pipe(
    v.string(),
    v.nonEmpty('Required'),
    v.minLength(3, 'At least 3 characters'),
    v.regex(/^\w+$/, 'Only letters, numbers, underscores'),
  ),
  email: v.pipe(v.string(), v.nonEmpty('Required'), v.email('Invalid email')),
  password: v.pipe(
    v.string(),
    v.nonEmpty('Required'),
    v.minLength(6, 'At least 6 characters'),
  ),
})

export default function SignUpPage() {
  const router = useRouter()
  const form = useForm({
    schema: SignUpSchema,
    initialInput: { name: '', username: '', email: '', password: '' },
  })

  const handleSubmit = async (output: v.InferOutput<typeof SignUpSchema>) => {
    const result = await signUp.email({
      name: output.name,
      username: output.username,
      email: output.email,
      password: output.password,
    })

    if (result.error) {
      toast.error(result.error.message ?? 'Sign up failed')
      return
    }

    toast.success('Account created — please sign in')
    router.push('/sign-in')
  }

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='text-center'>
        <div className='bg-primary text-primary-foreground mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
          <Music2 className='h-5 w-5' />
        </div>
        <CardTitle>MyConcertList</CardTitle>
        <CardDescription>Create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form of={form} onSubmit={handleSubmit} className='space-y-4'>
          <Field of={form} path={['name']}>
            {(field) => (
              <div className='space-y-1.5'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  {...field.props}
                  id='name'
                  value={field.input}
                />
                {field.errors && (
                  <p className='text-destructive text-xs'>{field.errors[0]}</p>
                )}
              </div>
            )}
          </Field>

          <Field of={form} path={['username']}>
            {(field) => (
              <div className='space-y-1.5'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  {...field.props}
                  id='username'
                  value={field.input}
                  autoComplete='username'
                />
                {field.errors && (
                  <p className='text-destructive text-xs'>{field.errors[0]}</p>
                )}
              </div>
            )}
          </Field>

          <Field of={form} path={['email']}>
            {(field) => (
              <div className='space-y-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  {...field.props}
                  id='email'
                  value={field.input}
                  type='email'
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
            Create account
          </Button>
        </Form>
      </CardContent>
      <CardFooter className='justify-center text-sm'>
        <span className='text-muted-foreground'>Have an account?&nbsp;</span>
        <Link href='/sign-in' className='text-primary font-medium hover:underline'>
          Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
