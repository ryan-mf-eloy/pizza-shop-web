import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Search, X } from 'lucide-react'
import { useState } from 'react'

import { queryClient } from '@/api/react-query'
import { cancelOrder } from '@/api/requests/cancel-order'
import { GetOrdersResponse } from '@/api/requests/get-orders'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDateDistanceToNow } from '@/lib/utils'

import OrderDetails from './order-details'
import { OrderStatus } from './order-status'

interface OrderTableRoweProps {
  order: GetOrdersResponse['orders'][0]
}

export default function OrderTableRow({ order }: OrderTableRoweProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const isDisabledCancelButton = ['', 'processing', 'canceled'].includes(
    order.status,
  )

  const { mutateAsync: cancelOrderFn } = useMutation({
    mutationFn: cancelOrder,
    async onSuccess(_, { orderId }) {
      const cachedOrders = queryClient.getQueriesData<GetOrdersResponse>({
        queryKey: ['orders'],
      })

      cachedOrders.forEach(([cacheKey, cacheData]) => {
        if (!cacheData) return

        queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
          ...cacheData,
          orders: cacheData.orders.map((order) => {
            if (order.orderId === orderId) {
              return { ...order, status: 'canceled' }
            }

            return order
          }),
        })
      })

      cancelOrder({ orderId })
    },
  })

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          <OrderDetails orderId={order.orderId} open={isDetailsOpen} />
        </Dialog>
      </TableCell>

      <TableCell className="font-xs font-mono font-medium">
        {order.orderId}
      </TableCell>

      <TableCell className="text-muted-foreground">
        {formatDateDistanceToNow(order.createdAt, true)}
      </TableCell>

      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>

      <TableCell className="font-medium">{order.customerName}</TableCell>

      <TableCell>
        <span className="font-medium">{formatCurrency(order.total / 100)}</span>
      </TableCell>

      <TableCell>
        <Button variant="outline" size="xs">
          <ArrowRight className="mr-2 h-3 w-3" />
          Aprovar
        </Button>
      </TableCell>

      <TableCell>
        <Button
          onClick={() => cancelOrderFn({ orderId: order.orderId })}
          disabled={isDisabledCancelButton}
          variant="ghost"
          size="xs"
        >
          <X className="mr-2 h-3 w-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  )
}
