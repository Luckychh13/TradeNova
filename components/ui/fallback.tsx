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
            <h4 style={{ marginBottom: '16px' }}>
                <div className="skeleton" style={{ width: '150px', height: '20px' }} />
            </h4>
            <table className="trending-coins-table" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th className="py-3" style={{ textAlign: 'left' }}>
                            <div className="skeleton" style={{ width: '60px', height: '16px' }} />
                        </th>
                        <th className="py-3" style={{ textAlign: 'left' }}>
                            <div className="skeleton" style={{ width: '100px', height: '16px' }} />
                        </th>
                        <th className="py-3" style={{ textAlign: 'left' }}>
                            <div className="skeleton" style={{ width: '60px', height: '16px' }} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i}>
                            <td className="py-2 name-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                                <div className="skeleton" style={{ width: '100px', height: '16px' }} />
                            </td>
                            <td className="py-2 name-cell">
                                <div className="skeleton" style={{ width: '80px', height: '16px' }} />
                            </td>
                            <td className="py-2 price-cell">
                                <div className="skeleton" style={{ width: '90px', height: '16px' }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export const CategoriesFallback = () => {
    return (
        <div id="categories" className="custom-scrollbar">
            <h4 style={{ marginBottom: '16px' }}>
                <div className="skeleton" style={{ width: '150px', height: '20px' }} />
            </h4>
            <table className="mt-3" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '12px' }}>
                            <div className="skeleton" style={{ width: '80px', height: '16px' }} />
                        </th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>
                            <div className="skeleton" style={{ width: '100px', height: '16px' }} />
                        </th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>
                            <div className="skeleton" style={{ width: '90px', height: '16px' }} />
                        </th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>
                            <div className="skeleton" style={{ width: '100px', height: '16px' }} />
                        </th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>
                            <div className="skeleton" style={{ width: '100px', height: '16px' }} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i}>
                            <td style={{ padding: '12px' }} className="category-cell">
                                <div className="skeleton" style={{ width: '120px', height: '16px' }} />
                            </td>
                            <td style={{ padding: '12px' }} className="top-gainers-cell">
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <div key={j} className="skeleton" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                                    ))}
                                </div>
                            </td>
                            <td style={{ padding: '12px' }} className="change-header-cell">
                                <div className="skeleton" style={{ width: '70px', height: '16px' }} />
                            </td>
                            <td style={{ padding: '12px' }} className="market-cap-cell">
                                <div className="skeleton" style={{ width: '110px', height: '16px' }} />
                            </td>
                            <td style={{ padding: '12px' }} className="volume-cell">
                                <div className="skeleton" style={{ width: '110px', height: '16px' }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}