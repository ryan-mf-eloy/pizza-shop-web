import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import * as zod from 'zod'

import { getOrders } from '@/api/requests/get-orders'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import OrderTableFilters from './order-table-filters'
import OrderTableRow from './order-table-row'

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = Number(searchParams.get('page'))

  const orderId = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status')

  const pageIndex = zod.coerce
    .number()
    .transform((page) => page - 1)
    .parse(currentPage ?? 0)

  const { data: result } = useQuery({
    queryKey: ['orders', pageIndex, orderId, customerName, status],
    queryFn: () =>
      getOrders({
        pageIndex,
        orderId,
        customerName,
        status: status === 'all' ? null : status,
      }),
  })

  const MAX_RESULTS_PER_PAGE = result?.meta.perPage ?? 10
  const TOTAL_PAGES =
    result && Math.ceil(result?.meta.totalCount / MAX_RESULTS_PER_PAGE)

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === TOTAL_PAGES

  const handlePagination = (page: number) => {
    const isInvalidPage = page <= 0 || page > TOTAL_PAGES!
    if (isInvalidPage) return

    setSearchParams((prevPage) => {
      prevPage.set('page', String(page))

      return prevPage
    })
  }

  return (
    <>
      <Helmet title="Pedidos" />

      <div className="mb-5 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>

        <div className="space-y-2.5">
          <OrderTableFilters />

          <div className="max-h-[65vh] overflow-auto rounded-md border dark:border-b-zinc-900">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Realizado há</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="w-[140px]">Total do pedido</TableHead>
                  <TableHead className="w-[164px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {result &&
                  result.orders.map((order) => (
                    <OrderTableRow order={order} key={order.orderId} />
                  ))}
              </TableBody>
            </Table>
          </div>

          {result && (
            <div className="flex items-center justify-between px-11">
              <span className="w-full text-sm text-muted-foreground">
                Total de {result?.meta.totalCount ?? 0} itens
              </span>

              <Pagination className="flex w-full items-center justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={
                        isFirstPage ? 'cursor-not-allowed opacity-50' : ''
                      }
                      onClick={() => handlePagination(currentPage - 1)}
                      href="#"
                    />
                  </PaginationItem>

                  <PaginationItem className="rounded-md border">
                    <PaginationLink href="#" className="cursor-default">
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      className={
                        isLastPage ? 'cursor-not-allowed opacity-50' : ''
                      }
                      href="#"
                      onClick={() => handlePagination(currentPage + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
