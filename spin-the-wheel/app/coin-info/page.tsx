'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, TrendingUp, DollarSign, Percent, BarChart3 } from 'lucide-react'
import DynamicSnowfall from '../components/DynamicSnowfall'
import { fetchDfireData, DFIRE_CONTRACT, DfireData } from '../lib/api'

export default function CoinInfoPage() {
  const [coinData, setCoinData] = useState<DfireData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await fetchDfireData()
      console.log('Fetched coin data:', data);
      setCoinData(data)
      setLoading(false)
    }

    fetchData()
    // Update every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`
    }
    return `$${num.toLocaleString()}`
  }

  return (
    <div className="relative min-h-screen bg-[#9333EA] text-white pb-24">
      <DynamicSnowfall />
      <div className="max-w-md mx-auto p-4 relative z-10">
        <h1 className="text-2xl font-bold mb-6">Dumpster Fire Coin (DFYR)</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : coinData ? (
          <div className="space-y-6">
            <div className="bg-white/10 rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <DollarSign className="mr-2" /> Price
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">${coinData.price.toFixed(8)}</p>
                <span className={`flex items-center ${coinData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <Percent className="w-4 h-4 mr-1" />
                  {coinData.priceChange24h.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <TrendingUp className="mr-2" /> Market Cap
              </h2>
              <p className="text-2xl font-bold">{formatNumber(coinData.marketCap)}</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <BarChart3 className="mr-2" /> 24h Volume
              </h2>
              <p className="text-2xl font-bold">{formatNumber(coinData.volume24h)}</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-2">Contract Address</h2>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-sm break-all font-mono">{DFIRE_CONTRACT}</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-4">Where to Buy</h2>
              <ul className="space-y-4">
                <li>
                  <a 
                    href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${DFIRE_CONTRACT}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="flex items-center">
                      <img src="/raydium-logo.svg" alt="Raydium" className="w-6 h-6 mr-2" />
                      Raydium
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a 
                    href={`https://jup.ag/swap/SOL-${DFIRE_CONTRACT}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="flex items-center">
                      <img src="/jupiter-logo.svg" alt="Jupiter" className="w-6 h-6 mr-2" />
                      Jupiter
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a 
                    href={`https://dexscreener.com/solana/${coinData.pairAddress}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="flex items-center">
                      <img src="/dexscreener-logo.svg" alt="DEX Screener" className="w-6 h-6 mr-2" />
                      View on DEX Screener
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-red-500/20 rounded-xl p-4 text-center">
            <p>Failed to load coin data. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

