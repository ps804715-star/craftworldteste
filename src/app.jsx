import React, { useState } from 'react'
import Header from './components/Header'
import PriceTracker from './components/Prices/PriceTracker'
import FactoryManager from './components/Industry/FactoryManager'
import PriceChart from './components/Financial/PriceChart'
import TrendAnalysis from './components/Financial/TrendAnalysis'

function App() {
  const [activeTab, setActiveTab] = useState('prices')

  const tabs = [
    { id: 'prices', label: '📊 Preços' },
    { id: 'industry', label: '🏭 Fábricas' },
    { id: 'charts', label: '📈 Gráficos' },
    { id: 'trends', label: '🤖 Trends' },
  ]

  return (
    <div className="container">
      <Header />
      
      <div className="card" style={{ padding: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? 'btn-success' : 'btn-secondary'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        {activeTab === 'prices' && <PriceTracker />}
        {activeTab === 'industry' && <FactoryManager />}
        {activeTab === 'charts' && <PriceChart />}
        {activeTab === 'trends' && <TrendAnalysis />}
      </div>
    </div>
  )
}

export default App
