import { useQuery } from '@tanstack/react-query'

import { getOrderDetails } from '@/api/requests/get-order-details'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDateDistanceToNow } from '@/lib/utils'

import { orderStatusMap } from './order-status'

export interface OrderDetailProps {
  orderId: string
  open: boolean
}

export default function OrderDetails({ orderId, open }: OrderDetailProps) {
  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetails({ orderId }),
    enabled: open,
  })

  return (
    <DialogContent className="select-none">
      <DialogHeader>
        <DialogTitle>Pedido: 193no1bhi10wdn1w</DialogTitle>
        <DialogDescription>Detalhes do pedido</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="flex-justify-end">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                  <span className="font-medium text-muted-foreground">
                    {order && orderStatusMap[order.status]}
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Cliente</TableCell>
              <TableCell className="flex-justify-end">
                {order?.customer.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Telefone</TableCell>
              <TableCell className="flex-justify-end">
                {order?.customer.phone || 'Não informado'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">E-mail</TableCell>
              <TableCell className="flex-justify-end">
                {order?.customer.email}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Realizado há
              </TableCell>
              <TableCell className="flex-justify-end">
                {order && formatDateDistanceToNow(order.createdAt, false)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order &&
              order.orderItems.map(
                ({ id, priceInCents, product, quantity }) => (
                  <TableRow key={id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-right">{quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(priceInCents / 100)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.totalInCents / 100)}
                    </TableCell>
                  </TableRow>
                ),
              )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-left font-medium" colSpan={3}>
                Total do pedido
              </TableCell>
              <TableCell className="text-right">
                {order && formatCurrency(order?.totalInCents / 100)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </DialogContent>
  )
}
