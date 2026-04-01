import {
  Bitcoin,
  CircleDollarSign,
  CircleUserRound,
  Coins,
  CreditCard,
  FolderKanban,
  ShoppingCart,
  Sparkles,
  Wallet
} from 'lucide-react'
import Chart from 'react-apexcharts'

import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

const statCards = [
  { title: 'Total Balance', value: '$53,252', subValue: '2.30 BTC', change: '+6.15%', icon: Wallet },
  { title: 'USD/BTC', value: '$23,077.05', subValue: '€22,617.47', change: 'Volume: 132,691 BTC', icon: CircleDollarSign },
  { title: 'LTC/BTC', value: '0.00256', subValue: '$59.02', change: 'Volume: 31,268 BTC', icon: Coins },
  { title: 'ETH/BTC', value: '0.07334', subValue: '$1,691.76', change: 'Volume: 32,982 BTC', icon: Sparkles },
  { title: 'XMR/BTC', value: '0.006854', subValue: '$157.68', change: 'Volume: 28,567 BTC', icon: Bitcoin }
]

const markets = [
  { coin: 'ETH', price: '0.02309756', volume: '427.563', change: '+1.91' },
  { coin: 'XRP', price: '0.00002205', volume: '132.691', change: '+0.64' },
  { coin: 'ETC', price: '0.00077779', volume: '32.982', change: '-6.71' },
  { coin: 'LTC', price: '0.00485685', volume: '31.268', change: '+1.88' },
  { coin: 'XMR', price: '0.00700518', volume: '28.567', change: '-1.26' },
  { coin: 'TRX', price: '0.00000165', volume: '14.106', change: '-0.61' },
  { coin: 'DASH', price: '0.00825500', volume: '6.693', change: '-1.51' }
]

const candleSeries = [
  {
    data: [
      { x: new Date('2016-01-01'), y: [52.4, 56.1, 51.2, 53.8] },
      { x: new Date('2016-03-01'), y: [53.8, 54.6, 51.4, 52.9] },
      { x: new Date('2016-05-01'), y: [52.9, 53.0, 47.7, 49.1] },
      { x: new Date('2016-07-01'), y: [49.1, 54.3, 47.4, 52.7] },
      { x: new Date('2016-09-01'), y: [52.7, 57.1, 50.2, 56.9] },
      { x: new Date('2016-11-01'), y: [56.9, 58.0, 48.8, 56.1] },
      { x: new Date('2017-01-01'), y: [56.1, 60.3, 55.2, 59.0] },
      { x: new Date('2017-03-01'), y: [59.0, 61.0, 53.1, 57.4] },
      { x: new Date('2017-05-01'), y: [57.4, 58.2, 53.6, 54.6] },
      { x: new Date('2017-07-01'), y: [54.6, 62.5, 53.4, 63.0] },
      { x: new Date('2017-09-01'), y: [63.0, 63.5, 59.6, 61.7] },
      { x: new Date('2017-11-01'), y: [61.7, 62.2, 56.4, 56.8] },
      { x: new Date('2018-01-01'), y: [56.8, 61.1, 54.6, 59.3] },
      { x: new Date('2018-03-01'), y: [59.3, 61.6, 55.5, 57.3] },
      { x: new Date('2018-05-01'), y: [57.3, 58.0, 51.0, 54.7] },
      { x: new Date('2018-07-01'), y: [54.7, 61.5, 53.1, 61.9] },
      { x: new Date('2018-09-01'), y: [61.9, 64.0, 59.6, 62.8] }
    ]
  }
]

const candleOptions = {
  chart: {
    type: 'candlestick',
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: false,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      }
    },
    zoom: {
      enabled: false
    }
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#22c55e',
        downward: '#ef4444'
      }
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '11px'
      }
    }
  },
  yaxis: {
    min: 45,
    max: 66,
    tickAmount: 4,
    labels: {
      formatter: (value) => value.toFixed(2),
      style: {
        colors: '#6b7280',
        fontSize: '11px'
      }
    },
    tooltip: {
      enabled: true
    }
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 0
  },
  tooltip: {
    theme: 'light'
  }
}

function CryptoPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crypto Dashboard</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Static crypto view with candlestick chart.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="border-0 bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.55)]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardDescription className="text-xs font-semibold uppercase tracking-wide">{card.title}</CardDescription>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--primary))]">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-2xl font-semibold leading-none">{card.value}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{card.subValue}</p>
                <p className="text-xs text-emerald-600">{card.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="border-0 bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">LTC/BTC</CardTitle>
              <div className="flex items-center gap-1 rounded-md bg-[hsl(var(--muted))] p-1 text-xs">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">1m</Button>
                <Button size="sm" className="h-7 px-2 text-xs">5m</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">30m</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-[hsl(var(--border))] p-2">
              <Chart options={candleOptions} series={candleSeries} type="candlestick" height={360} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base">Markets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--muted))] text-xs uppercase text-[hsl(var(--muted-foreground))]">
                <tr>
                  <th className="px-4 py-3 text-left">Coin</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Volume</th>
                  <th className="px-4 py-3 text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((market) => (
                  <tr key={market.coin} className="border-b border-[hsl(var(--border))] last:border-b-0">
                    <td className="px-4 py-3 font-medium">{market.coin}</td>
                    <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{market.price}</td>
                    <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{market.volume}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${market.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                      {market.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.55)]">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Sell Orders</CardTitle>
            <Button variant="outline" size="sm">View all</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-[hsl(var(--muted))] px-3 py-2 text-sm">
              <span>BTC/USD</span>
              <span className="font-semibold text-red-500">-0.81%</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[hsl(var(--muted))] px-3 py-2 text-sm">
              <span>ETH/EUR</span>
              <span className="font-semibold text-red-500">-1.03%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.55)]">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Buy Orders</CardTitle>
            <Button variant="outline" size="sm">View all</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-[hsl(var(--muted))] px-3 py-2 text-sm">
              <span>ADA/USDT</span>
              <span className="font-semibold text-emerald-600">+2.41%</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[hsl(var(--muted))] px-3 py-2 text-sm">
              <span>SOL/USD</span>
              <span className="font-semibold text-emerald-600">+1.76%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base">Operations</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button className="justify-start"><ShoppingCart className="h-4 w-4" /> Buy</Button>
            <Button variant="secondary" className="justify-start"><CreditCard className="h-4 w-4" /> Sell</Button>
            <Button variant="outline" className="justify-start"><FolderKanban className="h-4 w-4" /> Send</Button>
            <Button variant="outline" className="justify-start"><CircleUserRound className="h-4 w-4" /> Receive</Button>
          </CardContent>
        </Card>
      </section>
    </section>
  )
}

export default CryptoPage
