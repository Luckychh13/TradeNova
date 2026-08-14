import React from 'react'
import { fetcher } from '@/lib/coingecko.action'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { CoinOverviewFallback } from '../ui/fallback'
import CandleStickChart from '../CandleStickChart'

const CoinOverview = async () => {

  let coin
  let coinOHLCData
  try {
    [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>('coins/bitcoin', {
        dex_pair_format: 'symbol'
      }),
      fetcher<OHLCData[]>('coins/bitcoin/ohlc', {
        'vs_currency': 'usd',
        days: 1,
      })
    ])

  } catch (error) {
    console.log('Error fetching coin Overview:', error);
    return <CoinOverviewFallback />

  }

  return (
    <div id='coin-overview'>
      <CandleStickChart data={coinOHLCData} coinId="bitcoin" >
      <div className='header pt-2'>
        <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
        <div className='info'>
          <p>{coin.name} /  {coin.symbol.toUpperCase()}</p>
          <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
        </div>
      </div>
      </CandleStickChart>
    </div>
  )
}

export default CoinOverview
