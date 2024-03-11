import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface RevenueChartData {
  date: string
  revenue: number
}
export default function RevenueChart() {
  const data: RevenueChartData[] = [
    {
      date: '2024-03-10',
      revenue: getRandomArbitrary(200, 10000),
    },
    {
      date: '2024-03-11',
      revenue: getRandomArbitrary(200, 10000),
    },
    {
      date: '2024-03-12',
      revenue: getRandomArbitrary(200, 10000),
    },
    {
      date: '2024-03-13',
      revenue: getRandomArbitrary(200, 10000),
    },
    {
      date: '2024-03-14',
      revenue: getRandomArbitrary(200, 10000),
    },
    {
      date: '2024-03-15',
      revenue: getRandomArbitrary(200, 10000),
    },
    {
      date: '2024-03-16',
      revenue: getRandomArbitrary(200, 10000),
    },
  ]
  function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Receita no período
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart style={{ fontSize: 12 }} data={data}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />

            <YAxis
              stroke="#888"
              axisLine={false}
              tickLine={false}
              width={80}
              tickFormatter={formatCurrency}
            />

            <CartesianGrid vertical={false} className="stroke-muted" />

            <Tooltip
              content={({ payload }) => {
                if (payload) {
                  const hasData = payload.length > 0
                  if (hasData) {
                    const { revenue } = payload[0].payload as RevenueChartData
                    return `${formatCurrency(revenue)}`
                  }
                }
              }}
            />

            <Line
              type="linear"
              dataKey="revenue"
              strokeWidth={2}
              stroke={colors.green[500]}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
