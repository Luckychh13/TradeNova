'use client'

import { useEffect, useRef, useState, useCallback } from "react"

const API_BASE = "/api/geckoterminal"

type GeckoPoolResponse = {
    data?: {
        attributes?: {
            base_token_price_usd?: number | string
            name?: string
            price_change_percentage?: { h24?: number | string }
            market_cap_usd?: number | string
            fdv_usd?: number | string
            volume_usd?: { h24?: number | string }
        }
    }
}

type GeckoTradesResponse = {
    data?: Array<{
        attributes?: {
            price_from_in_usd?: number | string
            price_to_in_usd?: number | string
            volume_in_usd?: number | string
            block_timestamp?: string
            kind?: string
            from_token_amount?: number | string
            to_token_amount?: number | string
        }
    }>
}

type GeckoOHLCResponse = {
    data?: {
        attributes?: {
            ohlcv_list?: Array<[number, number, number, number, number]>
        }
    }
}

function parseInterval(liveInterval = "1m"): { timeframe: string; aggregate: number } {
    const match = liveInterval.match(/^(\d+)([mhd])$/)
    if (!match) return { timeframe: "minute", aggregate: 1 }

    const [, amountStr, unit] = match
    const amount = Number(amountStr)

    if (unit === "m") return { timeframe: "minute", aggregate: amount }
    if (unit === "h") return { timeframe: "hour", aggregate: amount }
    return { timeframe: "day", aggregate: amount }
}

export const useGeckoTerminalPool = ({
    poolId,
    coinId,
    liveInterval = "1m",
    pollMs = 30000,
}: UseGeckoTerminalPoolProps): UseGeckoTerminalPoolReturn => {
    const [price, setPrice] = useState<ExtendedPriceData | null>(null)
    const [trades, setTrades] = useState<Trade[]>([])
    const [ohlcv, setOhlcv] = useState<OHLCData | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const rateLimitUntilRef = useRef<number>(0)

    const [network, poolAddress] = poolId.includes("_")
        ? [poolId.slice(0, poolId.indexOf("_")), poolId.slice(poolId.indexOf("_") + 1)]
        : [poolId, ""]

    const fetchAll = useCallback(async () => {
        if (!network || !poolAddress) {
            setIsConnected(false)
            return
        }

        if (Date.now() < rateLimitUntilRef.current) {
            return
        }

        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        try {
            const { timeframe, aggregate } = parseInterval(liveInterval)

            const [poolRes, tradesRes, ohlcvRes] = await Promise.all([
                fetch(`${API_BASE}/networks/${network}/pools/${poolAddress}`, {
                    signal: controller.signal,
                }),
                fetch(`${API_BASE}/networks/${network}/pools/${poolAddress}/trades`, {
                    signal: controller.signal,
                }),
                fetch(
                    `${API_BASE}/networks/${network}/pools/${poolAddress}/ohlcv/${timeframe}?aggregate=${aggregate}&limit=1`,
                    { signal: controller.signal }
                ),
            ])

            const sawRateLimit = [poolRes, tradesRes, ohlcvRes].some((response) => response.status === 429)

            if (sawRateLimit) {
                rateLimitUntilRef.current = Date.now() + 60000
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = null
                }
                throw new Error("GeckoTerminal rate limit reached")
            }

            if (!poolRes.ok || !tradesRes.ok || !ohlcvRes.ok) {
                const responseText = await Promise.all([
                    poolRes.text().catch(() => ""),
                    tradesRes.text().catch(() => ""),
                    ohlcvRes.text().catch(() => ""),
                ]).then((parts) => parts.filter(Boolean).join(" | "))
                throw new Error(`GeckoTerminal request failed: ${responseText || "unknown error"}`)
            }

            const [poolJson, tradesJson, ohlcvJson] = await Promise.all([
                poolRes.json() as Promise<GeckoPoolResponse>,
                tradesRes.json() as Promise<GeckoTradesResponse>,
                ohlcvRes.json() as Promise<GeckoOHLCResponse>,
            ])

            const attrs = poolJson?.data?.attributes
            if (attrs) {
                setPrice({
                    usd: Number(attrs.base_token_price_usd ?? 0),
                    coin: coinId ?? "",
                    price: Number(attrs.base_token_price_usd ?? 0),
                    change24h: Number(attrs.price_change_percentage?.h24 ?? 0),
                    marketCap: Number(attrs.market_cap_usd ?? attrs.fdv_usd ?? 0),
                    volume24h: Number(attrs.volume_usd?.h24 ?? 0),
                    timestamp: Date.now(),
                })
            }

            const tradeRows = tradesJson?.data ?? []
            const parsedTrades: Trade[] = tradeRows.slice(0, 7).map((trade) => ({
                price: Number(trade.attributes?.price_from_in_usd ?? trade.attributes?.price_to_in_usd ?? 0),
                value: Number(trade.attributes?.volume_in_usd ?? 0),
                timestamp: new Date(trade.attributes?.block_timestamp ?? Date.now()).getTime(),
                type: trade.attributes?.kind ?? "unknown",
                amount: Number(trade.attributes?.from_token_amount ?? trade.attributes?.to_token_amount ?? 0),
            }))
            setTrades(parsedTrades)

            const list = ohlcvJson?.data?.attributes?.ohlcv_list
            if (Array.isArray(list) && list.length > 0) {
                const [ts, open, high, low, close] = list[0]
                setOhlcv([Number(ts) * 1000, Number(open), Number(high), Number(low), Number(close)])
            }

            setIsConnected(true)
        } catch (err: unknown) {
            const isAbort = err instanceof Error && err.name === "AbortError"
            if (!isAbort) {
                setIsConnected(false)

                const isRateLimitError = err instanceof Error && err.message.includes("rate limit")
                if (isRateLimitError && intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = null
                }
            }
        }
    }, [network, poolAddress, coinId, liveInterval])

    useEffect(() => {
        if (!network || !poolAddress) {
            return
        }

        const timer = setTimeout(() => {
            void fetchAll()
        }, 0)

        if (Date.now() < rateLimitUntilRef.current) {
            clearTimeout(timer)
            return
        }

        intervalRef.current = setInterval(fetchAll, pollMs)

        return () => {
            clearTimeout(timer)
            if (intervalRef.current) clearInterval(intervalRef.current)
            abortRef.current?.abort()
        }
    }, [fetchAll, network, poolAddress, pollMs])

    return { price, trades, ohlcv, isConnected }
}