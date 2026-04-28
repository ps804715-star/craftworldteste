import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getFromStorage, saveToStorage } from '../../utils/storage'

function PriceChart() {
  const [selectedTokens, setSelectedTokens] = useState(['SCREWS', 'STEEL', 'COPPER'])
  const [priceHistory, setPriceHistory] = useState([])
  const [availableTokens, setAvailableTokens] = useState([])

  useEffect(() => {
    const saved = getFromStorage('cw_price_history')
    if (saved) {
      setPriceHistory(saved)
      setAvailableTokens(Object.keys(saved[0] || {}).filter(k => k !== 'timestamp'))
    }
  }, [])

  const savePricePoint = () => {
    const currentPrices = getFromStorage('cw_prices_cache')
    if (!currentPrices) return

    const pricePoint = {
      timestamp: Date.now(),
      ...Object.fromEntries(
        Object.entries(currentPrices)
          .filter(([, v]) => v.success)
          .map(([k, v]) => [k, v.priceInCoin])
      )
    }

    const newHistory = [...priceHistory, pricePoint].slice(-100)
    setPriceHistory(newHistory)
    saveToStorage('cw_price_history', newHistory)
    alert('Preço guardado!')
  }

  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const colors = ['#00d9ff', '#00ff88', '#ffd700', '#ff4444', '#9370db']

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 className="card-title">📈 Evolução de Preços</h2>
          <button className="btn btn-success" onClick={savePricePoint}>💾 Guardar Preço</button>
        </div>

        <div style={{ marginBottom: '15px', overflowX: 'auto' }}>
          {availableTokens.map((token, i) => (
            <label key={token} style={{ marginRight: '15px', cursor: 'pointer', display: 'inline-block' }}>
              <input type="checkbox" checked={selectedTokens.includes(token)} onChange={(e) => {
                if (e.target.checked) setSelectedTokens([...selectedTokens, token])
                else setSelectedTokens(selectedTokens.filter(t => t !== token))
              }} style={{ marginRight: '5px' }} />
              <span style={{ color: colors[i % colors.length] }}>{token}</span>
            </label>
          ))}
        </div>

        <div style={{ height: '400px' }}>
          {priceHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="timestamp" tickFormatter={formatTime} stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelFormatter={(ts) => new Date(ts).toLocaleString()} />
                <Legend />
                {selectedTokens.map((token, i) => (
                  <Line key={token} type="monotone" dataKey={token} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
              Sem dados. Clica em "Guardar Preço" para começar.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PriceChart
