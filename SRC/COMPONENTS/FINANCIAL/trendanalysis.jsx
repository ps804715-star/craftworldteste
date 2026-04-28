import React, { useState, useEffect } from 'react'
import { getFromStorage } from '../../utils/storage'

function TrendAnalysis() {
  const [priceHistory, setPriceHistory] = useState([])
  const [analysis, setAnalysis] = useState({})

  useEffect(() => {
    const saved = getFromStorage('cw_price_history')
    if (saved && saved.length >= 10) {
      setPriceHistory(saved)
      analyzeTrends(saved)
    }
  }, [])

  const analyzeTrends = (history) => {
    const tokens = Object.keys(history[0] || {}).filter(k => k !== 'timestamp')
    const results = {}

    tokens.forEach(token => {
      const prices = history.map(p => p[token]).filter(Boolean)
      if (prices.length < 10) return

      const recent5 = prices.slice(-5)
      const previous5 = prices.slice(-10, -5)
      const recentAvg = recent5.reduce((a, b) => a + b, 0) / 5
      const previousAvg = previous5.reduce((a, b) => a + b, 0) / 5

      let trend = 'NEUTRO', signal = '⚪'
      if (recentAvg > previousAvg * 1.05) { trend = 'ALTA FORTE'; signal = '🟢' }
      else if (recentAvg > previousAvg) { trend = 'ALTA'; signal = '🟢' }
      else if (recentAvg < previousAvg * 0.95) { trend = 'BAIXA FORTE'; signal = '🔴' }
      else if (recentAvg < previousAvg) { trend = 'BAIXA'; signal = '🔴' }

      const avg = prices.reduce((a, b) => a + b, 0) / prices.length
      const variance = prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length
      const volatility = Math.sqrt(variance) / avg

      let recommendation = 'AGUARDAR'
      if (trend.includes('ALTA') && volatility < 0.1) recommendation = 'COMPRAR'
      else if (trend.includes('BAIXA') && volatility < 0.1) recommendation = 'VENDER'

      results[token] = { trend, signal, volatility: volatility.toFixed(4), recommendation, currentPrice: prices[prices.length - 1] }
    })

    setAnalysis(results)
  }

  return (
    <div className="card">
      <h2 className="card-title">🤖 AI Trend Analysis</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>Mínimo 10 pontos históricos necessários.</p>

      {Object.keys(analysis).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Sem dados suficientes. Guarda mais preços na aba "Gráficos".</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Preço</th>
                <th>Tendência</th>
                <th>Volatilidade</th>
                <th>Recomendação</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analysis).map(([token, data]) => (
                <tr key={token}>
                  <td><strong>{token}</strong></td>
                  <td>{data.currentPrice?.toFixed(4)}</td>
                  <td>{data.signal} {data.trend}</td>
                  <td>{data.volatility}</td>
                  <td>
                    <span className={`badge ${data.recommendation === 'COMPRAR' ? 'badge-success' : data.recommendation === 'VENDER' ? 'badge-danger' : 'badge-warning'}`}>
                      {data.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TrendAnalysis
