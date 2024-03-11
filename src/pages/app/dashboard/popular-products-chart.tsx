import { BarChart } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import colors from 'tailwindcss/colors'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface PopularRevenueChartData {
  product: string
  revenue: number
}

const COLORS = [
  colors.sky[500],
  colors.amber[500],
  colors.violet[500],
  colors.emerald[500],
  colors.rose[500],
]

export default function PopularProductsChart() {
  const data: PopularRevenueChartData[] = [
    {
      product: 'Pizza Peperoni',
      revenue: getRandomArbitrary(200, 10000),
    },
    {
      product: 'Pizza Marguerita',
      revenue: getRandomArbitrary(200, 10000),
    },
    {
      product: 'Pizza Calabresa',
      revenue: getRandomArbitrary(200, 10000),
    },
    {
      product: 'Pizza Portuguesa',
      revenue: getRandomArbitrary(200, 10000),
    },
    {
      product: 'Pizza Frango com Catupiry',
      revenue: getRandomArbitrary(200, 10000),
    },
  ]
  function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  function addElipsisToLongText(text: string, length: number) {
    return text.substring(0, length).concat('...')
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Produtos populares
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart style={{ fontSize: 12 }}>
            <Pie
              data={data}
              dataKey="revenue"
              nameKey="product"
              cx="50%"
              cy="50%"
              outerRadius={86}
              innerRadius={64}
              strokeWidth={8}
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                index,
              }) => {
                const RADIAN = Math.PI / 180
                const radius = 12 + innerRadius + (outerRadius - innerRadius)
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)

                const { product, revenue } = data[index]

                const productNameLength = product.length
                const LIMIT_CHARACTERS = 15

                const productNameIsTooLong =
                  productNameLength > LIMIT_CHARACTERS

                const formattedProductName = productNameIsTooLong
                  ? addElipsisToLongText(product, LIMIT_CHARACTERS)
                  : product
                const formattedProductRevenue = formatCurrency(revenue)

                const chartLabel = `${formattedProductName} (${formattedProductRevenue})`

                return (
                  <text
                    x={x}
                    y={y}
                    className="fill-muted-foreground text-xs"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {chartLabel}
                  </text>
                )
              }}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-index`}
                  fill={COLORS[index]}
                  className="stroke-background transition-opacity duration-200 ease-in-out hover:opacity-80"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
