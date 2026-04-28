import React, { useEffect, useState } from 'react'
import { usePrices } from '../../hooks/usePrices'

function PriceTracker() {
  const { prices, loading, error, refreshPrices } = usePrices()
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    refreshPrices()
    setLastUpdate(new Date())
    const interval = setInterval(() => {
      refreshPrices()
      setLastUpdate(new Date())
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="card">A carregar preços...</div>
  if (error) return <div className="card text-danger">Erro: {error}</div>

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 className="card-title">📊 Preços de Mercado (Tempo Real)</h2>
          <button className="btn" onClick={refreshPrices}>🔄 Atualizar</button>
        </div>
        <p style={{ color: '#888', marginBottom: '15px' }}>
          Última atualização: {lastUpdate?.toLocaleTimeString()}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {Object.entries(prices).map(([token, data]) => (
            <div key={token} className="card" style={{ padding: '15px', marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: '600', color: '#00d9ff' }}>{token}</span>
                {data.success ? (
                  <span className="badge badge-success">✅</span>
                ) : (
                  <span className="badge badge-danger">❌</span>
                )}
              </div>
              {data.success ? (
                <>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffd700' }}>
                    {data.priceInCoin?.toFixed(4)} 🪙
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    ${data.priceUSD?.toFixed(6)}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '5px', className: data.change24h >= 0 ? 'text-success' : 'text-danger' }}>
                    {data.change24h >= 0 ? '+' : ''}{data.change24h?.toFixed(2)}% (24h)
                  </div>
                </>
              ) : (
                <div style={{ color: '#ff4444', fontSize: '12px' }}>{data.error}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PriceTracker
