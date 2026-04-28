import React, { useState } from 'react'
import Header from './components/Header'
import PriceTracker from './components/Prices/PriceTracker'
import FactoryManager from './components/Industry/FactoryManager'
import ProfitCalculator from './components/Profit/ProfitCalculator'
import PriceChart from './components/Financial/PriceChart'
import TrendAnalysis from './components/Financial/TrendAnalysis'

function App() {
  const [activeTab, setActiveTab] = useState('prices')

  const tabs = [
    { id: 'prices', label: '📊 Preços', icon: '📊' },
    { id: 'industry', label: '🏭 Indústria', icon: '🏭' },
    { id: 'profit', label: '💰 Lucros', icon: '💰' },
    { id: 'charts', label: '📈 Gráficos', icon: '📈' },
    { id: 'trends', label: '🤖 AI Trends', icon: '🤖' },
  ]

  return (
    <div className="container">
      <Header />
      
      {/* Navigation Tabs */}
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

      {/* Content */}
      <div style={{ marginTop: '20px' }}>
        {activeTab === 'prices' && <PriceTracker />}
        {activeTab === 'industry' && <FactoryManager />}
        {activeTab === 'profit' && <ProfitCalculator />}
        {activeTab === 'charts' && <PriceChart />}
        {activeTab === 'trends' && <TrendAnalysis />}
      </div>
    </div>
  )
}

export default App
