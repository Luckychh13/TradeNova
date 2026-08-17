
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { fetcher, getPools } from '@/lib/coingecko.action';
import { formatCurrency } from '@/lib/utils';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import Converter from '@/components/Converter';

const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  let coinData: CoinDetailsData | undefined;
  let coinOHLCData: OHLCData[] | undefined;

  try {
    [coinData, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>(`coins/${id}`, {
        dex_pair_format: 'symbol'
      }),
      fetcher<OHLCData[]>(`coins/${id}/ohlc`, {
        'vs_currency': 'usd',
        days: 1,
      })
    ]);
  } catch (error) {
    console.log('Error fetching coin Overview:', error);
  }

  if (!coinData || !coinOHLCData) {
    return null;
  }

  const platform = coinData.asset_platform_id ? coinData.detail_platforms?.[coinData.asset_platform_id] : null;
  const network = platform?.geckoterminal_url.split('/')[3] || null;
  const contractAddress = platform?.contract_address || null;

  const pool = await getPools(id, network, contractAddress);

  const coinDetails = [
    {
      label: 'Market Cap',
      value:formatCurrency(coinData.market_data.market_cap.usd),
      link: undefined,
      linkText: undefined,
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank}`,
      link: undefined,
      linkText: undefined,
    },
    {
      label: 'Total Volume',
      value:formatCurrency(coinData.market_data.total_volume.usd),
      link: undefined,
      linkText: undefined,
    },
    {
      label: 'Website',
      value: '-',
      link:coinData.links.homepage[0],
      linkText: 'HomePage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community',
      value: '-',
      link: coinData.links.subreddit_url,
      linkText: 'community',
    },
  ];

  return (
    <main id='coin-details-page'>
      <section className='primary'>
        <LiveDataWrapper coinId={id} poolId={pool.id} coin={coinData} coinOHLCData={coinOHLCData}>
          <h4>Exchange Listings</h4>
        </LiveDataWrapper>
      </section>


      <section className='secondary'>
        
        <Converter
        symbol={coinData.symbol}
        icon={coinData.image.small}
        priceList={coinData.market_data.current_price}
        />

        <div className='details'>
          <h4>Coin Details</h4>
          <ul className='details-grid'>
            {coinDetails.map(({label,value,link,linkText},index) =>(
              <li key={index}>
                <p className={label}>{label}</p>

                {link ? (
                  <div className='link'>
                    <Link href={link} target='_blank'>
                    {linkText || label} 
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ):(
                  <p className='text-base font-medium'>{value}</p>
                )}
                </li>    
            ))}
            </ul>
            </div>
        <p>Top Gainers and loosers</p>
      </section>

    </main>
  );
};
export default Page;