import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import * as zod from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const orderFiltersSchema = zod.object({
  orderId: zod.string().optional(),
  customerName: zod.string().optional(),
  status: zod.string().optional(),
})

type OrderFilters = zod.infer<typeof orderFiltersSchema>

export default function OrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const orderId = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status')

  const defaultValues: OrderFilters = {
    customerName: customerName ?? '',
    orderId: orderId ?? '',
    status: status ?? 'all',
  }
  const { register, handleSubmit, control, reset } = useForm<OrderFilters>({
    defaultValues,
    resolver: zodResolver(orderFiltersSchema),
  })

  const handleOrdersFilter = ({
    customerName,
    orderId,
    status,
  }: OrderFilters) => {
    setSearchParams((prevParams) => {
      if (customerName) prevParams.set('customerName', customerName)
      else prevParams.delete('customerName')

      if (orderId) prevParams.set('orderId', orderId)
      else prevParams.delete('orderId')

      if (status) prevParams.set('status', status)
      else prevParams.delete('status')

      prevParams.set('page', '1')

      return prevParams
    })
  }

  const handleClearFilter = () => {
    setSearchParams((prevParams) => {
      prevParams.delete('customerName')
      prevParams.delete('orderId')
      prevParams.delete('status')
      prevParams.set('page', '1')

      return prevParams
    })

    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(handleOrdersFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="ID do pedido"
        className="h-8 w-auto"
        {...register('orderId')}
      />
      <Input
        placeholder="Nome do cliente"
        className="h-8 w-[320px]"
        {...register('customerName')}
      />
      <Controller
        name="status"
        defaultValue={defaultValues.status}
        control={control}
        render={({ field: { value, onChange, disabled, name } }) => (
          <Select
            defaultValue="all"
            name={name}
            onValueChange={onChange}
            value={value}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
              <SelectItem value="processing">Em preparo</SelectItem>
              <SelectItem value="delivery">Em entrega</SelectItem>
              <SelectItem value="develivered">Entregue</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>

      <Button
        onClick={handleClearFilter}
        type="button"
        variant="outline"
        size="xs"
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}
