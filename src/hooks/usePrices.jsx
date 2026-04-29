import { useState, useCallback } from 'react'
import { fetchTokenPrice } from '../utils/api'
import { TOKENS } from '../data/tokens'
import { saveToStorage, getFromStorage } from '../utils/storage'

export function usePrices() {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshPrices = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const newPrices = {}
      const tokenKeys = Object.keys(TOKENS)
      const coinPrice = { value: 0 }

      // Primeira passagem: obter COIN price
      for (const token of tokenKeys) {
        const result = await fetchTokenPrice(token, TOKENS[token])
        if (result.success) {
          newPrices[token] = { ...result, timestamp: Date.now() }
          if (token === 'COIN') coinPrice.value = result.priceUSD
        } else {
          newPrices[token] = result
        }
        await new Promise(r => setTimeout(r, 1000))
      }

      // Segunda passagem: calcular preço em COIN
      Object.keys(newPrices).forEach(token => {
        if (newPrices[token].success && coinPrice.value > 0) {
          newPrices[token].priceInCoin = token === 'COIN' ? 1 : newPrices[token].priceUSD / coinPrice.value
        }
      })

      setPrices(newPrices)
      saveToStorage('cw_prices_cache', newPrices)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { prices, loading, error, refreshPrices }
}
