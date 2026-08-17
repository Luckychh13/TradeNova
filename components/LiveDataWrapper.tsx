'use client'

import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'
import CandleStickChart from '@/components/CandleStickChart'
import { useGeckoTerminalPool } from '@/hooks/useCoinGeckoWebSocket'
import DataTable from './DataTable'
import { formatCurrency, timeAgo } from '@/lib/utils'
import CoinHeader from './CoinHeader'

const LiveDataWrapper = ({children, coinId, poolId, coin, coinOHLCData}:LiveDataProps) => {
    const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s')
    const {trades, ohlcv,price} = useGeckoTerminalPool({coinId, poolId, liveInterval})

    const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : "-"),
    },
    {
      header: "Amount",
      cellClassName: "amount-cell",
      cell: (trade) => trade.amount?.toFixed(4) ?? "-",
    },
    {
      header: "Value",
      cellClassName: "value-cell",
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : "-"),
    },
    {
      header: "Buy/Sell",
      cellClassName: "type-cell",
      cell: (trade) => (
        <span
          className={trade.type === "b" ? "text-green-500" : "text-red-500"}
        >
          {trade.type === "b" ? "Buy" : "Sell"}
        </span>
      ),
    },
    {
      header: "Time",
      cellClassName: "time-cell",
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : "-"),
    },
  ];

  return (
    <section id='live-data-wrapper'>
        <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={price?.change24h ?? coin.market_data.price_change_24h_in_currency.usd}
        priceChangePercentage30d = {coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h = {coin.market_data.price_change_24h_in_currency.usd}
        />
        <Separator className='relative flex justify-center items-center my-4' />

        <div className='trend'>
            <CandleStickChart 
            coinId={coinId}
             data={coinOHLCData}
             liveOhlcv={ohlcv}
              mode='live'
              liveInterval={liveInterval}
              setLiveInterval={setLiveInterval}
             >
              <h4>Trend Overview</h4>
            </CandleStickChart>
        </div>
        <Separator className='divider' />

        {tradeColumns && 
        <div className='trade'>
            <h4>Recent Trades</h4>

            <DataTable 
               columns={tradeColumns}
               data={trades}
               rowKey={(_,index) => index}
               tableClassName='trades-table'
               />
        </div>
        }
        
    </section>
  )
}

export default LiveDataWrapper
