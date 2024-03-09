import { zodResolver } from '@hookform/resolvers/zod'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as zod from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signUpSchema = zod.object({
  email: zod.string().email(),
  cellphone: zod.string().min(11),
  managerName: zod.string().min(3),
  restaurantName: zod.string().min(3),
})

type SignUpForm = zod.infer<typeof signUpSchema>

export default function SignUp() {
  const defaultValues = { email: '' }
  const resolver = zodResolver(signUpSchema)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpForm>({ defaultValues, resolver })

  const navigate = useNavigate()

  const handleSignUp = async (data: SignUpForm) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log(data)

      toast.success('Restaurante cadastrado com sucesso', {
        action: {
          label: 'Login',
          onClick: () => navigate('/sign-in'),
        },
      })
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.')
    }
  }

  return (
    <>
      <Helmet title="Cadastre-se" />
      <div className="p-8">
        <Button asChild variant="link" className="absolute right-8 top-8">
          <Link to="/sign-in">Fazer login</Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center text-2xl font-semibold tracking-tight">
            <h1>Criar conta grátis</h1>
            <p className="text-sm text-muted-foreground">
              Seja um parceiro e comece a vender suas pizzas
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
              <Input
                id="restaurantName"
                placeholder="Pizzaria do Zé"
                type="text"
                {...register('restaurantName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">Seu nome</Label>
              <Input
                id="managerName"
                placeholder="Seu nome"
                type="text"
                {...register('managerName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cellphone">Seu celular</Label>
              <Input
                id="cellphone"
                placeholder="(XX) XXXXX-XXXX"
                type="tel"
                {...register('cellphone')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input
                id="email"
                placeholder="exemplo@email.com"
                type="email"
                {...register('email')}
              />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Finalizar cadastro
            </Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4">
              Ao continuar, você concorda com nossos&nbsp;
              <a href="">termos de serviço</a> e&nbsp;
              <a href="">políticas de privacidade</a>.
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
