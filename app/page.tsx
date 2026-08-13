import CoinOverview from "@/components/Home/CoinOverview"
import TrendingCoins from "@/components/Home/TrendingCoins"
import { CoinOverviewFallback, TrendingCoinFallback } from "@/components/ui/fallback"
import { Suspense } from "react"



const page = async () => {

  return <main className='main-container'>
    <section className='home-grid'>
      
      <Suspense fallback={<CoinOverviewFallback />}>
        <CoinOverview />
      </Suspense>

      <Suspense fallback={<TrendingCoinFallback />}>
        <TrendingCoins />
      </Suspense>

      
    </section>

    <section className='w-full mt-7 space-y-4'>
      <p>Categories</p>
    </section>
  </main>
}

export default page
