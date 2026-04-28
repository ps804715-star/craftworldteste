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

      // Médias móveis
      const sma5 = calculateSMA(prices, 5)
      const sma10 = calculateSMA(prices, 10)
      const sma20 = calculateSMA(prices, 20)

      // Tendência
      const recent5 = prices.slice(-5)
      const previous5 = prices.slice(-10, -5)
      const recentAvg = recent5.reduce((a, b) => a + b, 0) / 5
      const previousAvg = previous5.reduce((a, b) => a + b, 0) / 5

      let trend = 'NEUTRO'
      let signal = '⚪'
      if (recentAvg > previousAvg * 1.05) {
        trend = 'ALTA FORTE'
        signal = '🟢'
      } else if (recentAvg > previousAvg) {
        trend = 'ALTA'
        signal = '🟢'
      } else if (recentAvg < previousAvg * 0.95) {
        trend = 'BAIXA FORTE'
        signal = '🔴'
      } else if (recentAvg < previousAvg) {
        trend = 'BAIXA'
        signal = '🔴'
      }

      // Volatilidade
      const volatility = calculateVolatility(prices)

      // Recomendação
      let recommendation = 'AGUARDAR'
      if (trend.includes('ALTA') && volatility < 0.1) {
        recommendation = 'COMPRAR'
      } else if (trend.includes('BAIXA') && volatility < 0.1) {
        recommendation = 'VENDER'
      }

      results[token] = {
        trend,
        signal,
        sma5: sma5[sma5.length - 1],
        sma10: sma10[sma10.length - 1],
        sma20: sma20[sma20.length - 1],
        volatility: volatility.toFixed(4),
        recommendation,
        currentPrice: prices[prices.length - 1]
      }
    })

    setAnalysis(results)
  }

  const calculateSMA = (prices, period) => {
    return prices.map((_, i, arr) => {
      if (i < period - 1) return null
      return arr.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
    })
  }

  const calculateVolatility = (prices) => {
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length
    return Math.sqrt(variance) / avg
  }

  return (
    <div>
      <div className="card">
        <h2 className="card-title">🤖 AI Trend Analysis</h2>
        <p style={{ color: '#888', marginBottom: '20px' }}>
          Análise automática de tendências baseada em médias móveis e volatilidade. 
          Necessário mínimo de 10 pontos históricos.
        </p>

        {Object.keys(analysis).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            Sem dados suficientes. Guarda mais preços na aba "Gráficos".
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Preço Atual</th>
                <th>Tendência</th>
                <th>SMA 5</th>
                <th>SMA 10</th>
                <th>SMA 20</th>
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
                  <td>{data.sma5?.toFixed(4)}</td>
                  <td>{data.sma10?.toFixed(4)}</td>
                  <td>{data.sma20?.toFixed(4)}</td>
                  <td>{data.volatility}</td>
                  <td>
                    <span className={`badge ${
                      data.recommendation === 'COMPRAR' ? 'badge-success' :
                      data.recommendation === 'VENDER' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {data.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">📚 Como Funciona a Análise</h3>
        <div className="grid grid-3">
          <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <h4 style={{ color: '#00d9ff', marginBottom: '10px' }}>📊 Médias Móveis (SMA)</h4>
            <p style={{ fontSize: '13px', color: '#888' }}>
              Calcula a média dos últimos 5, 10 e 20 períodos. 
              Quando SMA5 > SMA10 > SMA20 = Tendência de alta.
            </p>
          </div>
          <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <h4 style={{ color: '#00d9ff', marginBottom: '10px' }}>📈 Tendência</h4>
            <p style={{ fontSize: '13px', color: '#888' }}>
              Compara a média dos últimos 5 períodos com os 5 anteriores. 
              Variação > 5% = tendência forte.
            </p>
          </div>
          <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <h4 style={{ color: '#00d9ff', marginBottom: '10px' }}>📉 Volatilidade</h4>
            <p style={{ fontSize: '13px', color: '#888' }}>
              Mede o desvio padrão dos preços. 
              Baixa volatilidade = sinal mais confiável.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendAnalysis
