export async function fetchTokenPrice(token, poolAddress) {
  try {
    const url = `https://api.geckoterminal.com/api/v2/networks/ronin/pools/${poolAddress}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, { 
      signal: controller.signal, 
      headers: { 'Accept': 'application/json' } 
    })
    clearTimeout(timeout)

    if (response.status === 429) throw new Error('Rate Limit')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    if (!data.data || !data.data.attributes) throw new Error('Dados inválidos')

    const priceUSD = parseFloat(data.data.attributes.base_token_price_usd)
    const change24h = data.data.attributes.price_change_percentage?.h24 || 0

    return { success: true, priceUSD, change24h: parseFloat(change24h) }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
