import { api } from '..'

export interface GetOrderQuery {
  pageIndex?: number | null
  orderId?: string | null
  customerName?: string | null
  status?: string | null
}

export interface GetOrdersResponse {
  orders: {
    orderId: string
    createdAt: Date
    status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
    customerName: string
    total: number
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getOrders(query: GetOrderQuery) {
  const { data } = await api.get<GetOrdersResponse>('/orders', {
    params: { ...query },
  })

  return data
}
