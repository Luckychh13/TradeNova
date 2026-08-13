export const CoinOverviewFallback = () => {
    return (
        <div id="coin-overview-fallback">
            <div className="header pt-2">
                <div className="header-image skeleton"/>
                <div className="info">
                    <div className="header-line-sm skeleton" />
                    <div className="header-line-lg skeleton" />
                </div>
            </div>
            <div className="chart">
                <div className="chart-skeleton skeleton"/>
            </div>
        </div>
    )
}

export const TrendingCoinFallback = () => {
    return (
        <div id="trending-coin-fallback">
            <div className="trending-list">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div className="trending-item" key={i}>
                        <div className="item-avatar skeleton" />
                        <div className="item-info">
                            <div className="item-line-sm skeleton" />
                            <div className="item-line-lg skeleton" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}