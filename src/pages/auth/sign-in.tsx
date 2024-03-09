import { zodResolver } from '@hookform/resolvers/zod'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import * as zod from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signInSchema = zod.object({
  email: zod.string().email(),
})

type SignInForm = zod.infer<typeof signInSchema>

export default function SignIn() {
  const defaultValues = { email: '' }
  const resolver = zodResolver(signInSchema)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>({ defaultValues, resolver })

  const handleSignIn = async (data: SignInForm) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log(data)

      toast.success('Enviamos um link de autenticação para seu e-mail.', {
        action: {
          label: 'Re-enviar',
          onClick: () => handleSignIn(data),
        },
      })
    } catch (error) {
      toast.error('Credenciais inválidas. Tente novamente.')
    }
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <Button asChild variant="link" className="absolute right-8 top-8">
          <Link to="/sign-up">Novo estabelecimento</Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center text-2xl font-semibold tracking-tight">
            <h1>Acessar Painel</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas vendas pelo painel do parceiro
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                placeholder="exemplo@email.com"
                type="email"
                {...register('email')}
              />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Acessar painel
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
