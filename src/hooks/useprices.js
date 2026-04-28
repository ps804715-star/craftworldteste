import { useState, useCallback } from 'react'
import { fetchTokenPrice } from '../utils/api'
import { TOKENS } from '../data/tokens'
import { saveToStorage, getFromStorage } from '../utils/storage'

export function usePrices() {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadCache = useCallback(() => {
    const cached = getFromStorage('cw_prices_cache')
    if (cached) setPrices(cached)
  }, [])

  const refreshPrices = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const newPrices = {}
      const tokenKeys = Object.keys(TOKENS)

      for (const token of tokenKeys) {
        try {
          const result = await fetchTokenPrice(token, TOKENS[token])
          if (result.success) {
            newPrices[token] = {
              ...result,
              priceInCoin: token === 'COIN' ? 1 : result.priceUSD / newPrices['COIN']?.priceUSD,
              timestamp: Date.now()
            }
          } else {
            newPrices[token] = result
          }
        } catch (err) {
          newPrices[token] = { success: false, error: err.message }
        }

        // Delay para evitar rate limit
        await new Promise(r => setTimeout(r, 1000))
      }

      setPrices(newPrices)
      saveToStorage('cw_prices_cache', newPrices)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { prices, loading, error, refreshPrices, loadCache }
}
