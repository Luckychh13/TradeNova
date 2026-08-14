import { fetcher } from "@/lib/coingecko.action"
import DataTable from "../DataTable"
import Image from "next/image"
import { cn, formatCurrency, formatPercentage } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"
import { CategoriesFallback } from "../ui/fallback"


const Categories = async () => {
    let categories
    try {
        categories = await fetcher<Category[]>('coins/categories')
    } catch (error) {
        console.log('Error fetching categories:', error);
        return <CategoriesFallback />
    }

    const columns:DataTableColumn<Category>[] = [
        {
            header:'Category',
            cell:(category) => category.name,
            cellClassName:'category-cell'
        },
        {
            header:'Top Gainers',
            cell:(category)=> category.top_3_coins.map((coin) => <Image src={coin}  alt={coin} key={coin} width={28} height={28}/> ),
            cellClassName:'top-gainers-cell'
        },
        {
            header:'24h Change',
            cell:(category) => {
                const isTrendingUp = category.market_cap_change_24h > 0
                    return (
                        <div className={cn('change-cell000', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
                        <p>{isTrendingUp ? (
                            <TrendingUp width={16} height={16}/>
                        ):
                        <TrendingDown width={16} height={16} />
                        }
                        {formatPercentage(category.market_cap_change_24h)}
                        </p>
                        </div>
                    )
            },
            cellClassName:'change-header-cell'
        },
        {
            header:'Market Cap',
            cell:(category) => formatCurrency(category.market_cap),
            cellClassName:'market-cap-cell'
        },
        {
            header:'24h Volume',
            cell:(category) => formatCurrency(category.volume_24h),
            cellClassName:'volume-cell'
        }
    ]
  return (
    <div id="categories" className="custom-scrollbar">
        <h4>Top Categories</h4>

        <DataTable 
           columns={columns} 
           data={categories?.slice(0,10)} 
           rowKey={(_, index) => index} 
           tableClassName="mt-3"
           
        />
      
    </div>
  )
}

export default Categories
