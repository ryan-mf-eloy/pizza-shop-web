import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as zod from 'zod'

import { updateProfile } from '@/api/requests/update-profile'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

interface StoreProfileDialogProps {
  restaurantData: {
    name?: string
    description?: string | null
  }
}

const updateRestaurantDataSchema = zod.object({
  name: zod.string().min(1).max(50),
  description: zod.string().max(150).nullable(),
})

type UpdateRestaurantData = zod.infer<typeof updateRestaurantDataSchema>

export default function StoreProfileDialog({
  restaurantData,
}: StoreProfileDialogProps) {
  const values = {
    name: restaurantData?.name ?? '',
    description: restaurantData?.description ?? '',
  }
  const resolver = zodResolver(updateRestaurantDataSchema)
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<UpdateRestaurantData>({
    values,
    resolver,
  })

  const queryClient = useQueryClient()

  const updateManagedRestaurantCache = ({
    name,
    description,
  }: UpdateRestaurantData) => {
    const cached = queryClient.getQueryData(['managed-restaurant'])

    if (cached) {
      queryClient.setQueryData(['managed-restaurant'], {
        ...cached,
        name,
        description,
      })
    }

    return { cached }
  }

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate(variables) {
      const { cached } = updateManagedRestaurantCache(variables)
      return { cachedProfile: cached }
    },
    onError(_error, _variables, context) {
      if (context?.cachedProfile) {
        updateManagedRestaurantCache(
          context.cachedProfile as UpdateRestaurantData,
        )
      }
    },
  })

  const handleUpdateRestaurantData = async (data: UpdateRestaurantData) => {
    try {
      await updateProfileFn(data)

      toast.success('Perfil do restaurante atualizado com sucesso.')
    } catch (error) {
      toast.error('Nome ou descrição inválidas. Tente novamente.')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil do restaurante</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateRestaurantData)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              placeholder="Nome do estabelecimento"
              type="text"
              id="name"
              className="col-span-3"
              {...register('name')}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              placeholder="Descrição do estabelecimento"
              id="description"
              className="col-span-3 max-h-72"
              {...register('description')}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button disabled={isSubmitting} type="submit">
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
