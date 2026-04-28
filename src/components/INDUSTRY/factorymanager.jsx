import React, { useState, useEffect } from 'react'
import { getFromStorage, saveToStorage } from '../../utils/storage'
import { TRANSFORMATIONS } from '../../data/transformations'

function FactoryManager() {
  const [factories, setFactories] = useState([])
  const [workers, setWorkers] = useState(5)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const saved = getFromStorage('cw_factories')
    if (saved) setFactories(saved)
    const savedWorkers = getFromStorage('cw_workers')
    if (savedWorkers) setWorkers(savedWorkers)
  }, [])

  const saveFactories = (newFactories) => {
    setFactories(newFactories)
    saveToStorage('cw_factories', newFactories)
  }

  const addFactory = (product) => {
    const newFactory = {
      id: Date.now(),
      product,
      level: 1,
      workers: 0,
      workshop: 0,
      mastery: 0
    }
    saveFactories([...factories, newFactory])
    setShowAddModal(false)
  }

  const updateFactory = (id, updates) => {
    const newFactories = factories.map(f => 
      f.id === id ? { ...f, ...updates } : f
    )
    saveFactories(newFactories)
  }

  const removeFactory = (id) => {
    saveFactories(factories.filter(f => f.id !== id))
  }

  const totalWorkers = factories.reduce((sum, f) => sum + f.workers, 0)

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 className="card-title">🏭 Gestão de Fábricas</h2>
          <button className="btn" onClick={() => setShowAddModal(true)}>➕ Adicionar Fábrica</button>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,217,255,0.1)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>👥 Trabalhadores Totais: <strong>{workers}</strong></span>
            <span>📍 Alocados: <strong>{totalWorkers}</strong></span>
            <span>📍 Disponíveis: <strong className={workers - totalWorkers > 0 ? 'text-success' : 'text-danger'}>{workers - totalWorkers}</strong></span>
            <input
              type="number"
              className="input"
              value={workers}
              onChange={(e) => {
                setWorkers(parseInt(e.target.value) || 0)
                saveToStorage('cw_workers', parseInt(e.target.value) || 0)
              }}
              style={{ width: '80px' }}
              min="0"
              max="50"
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Nível</th>
              <th>Trabalhadores</th>
              <th>Workshop %</th>
              <th>Mastery %</th>
              <th>Velocidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {factories.map(factory => (
              <tr key={factory.id}>
                <td><strong>{factory.product}</strong></td>
                <td>
                  <input
                    type="number"
                    className="input"
                    value={factory.level}
                    onChange={(e) => updateFactory(factory.id, { level: parseInt(e.target.value) || 1 })}
                    style={{ width: '60px' }}
                    min="1"
                    max="50"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="input"
                    value={factory.workers}
                    onChange={(e) => updateFactory(factory.id, { workers: parseInt(e.target.value) || 0 })}
                    style={{ width: '60px' }}
                    min="0"
                    max="20"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="input"
                    value={factory.workshop}
                    onChange={(e) => updateFactory(factory.id, { workshop: parseFloat(e.target.value) || 0 })}
                    style={{ width: '70px' }}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="input"
                    value={factory.mastery}
                    onChange={(e) => updateFactory(factory.id, { mastery: parseFloat(e.target.value) || 0 })}
                    style={{ width: '70px' }}
                    min="0"
                    max="30"
                    step="0.01"
                  />
                </td>
                <td>
                  <span className="badge badge-success">
                    x{(1 + (factory.workers * 2 + factory.workshop) / 100).toFixed(2)}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => removeFactory(factory.id)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {factories.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  Nenhuma fábrica adicionada. Clica em "Adicionar Fábrica" para começar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Adicionar Fábrica */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
            <h3 className="card-title">➕ Adicionar Fábrica</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {Object.keys(TRANSFORMATIONS).map(product => (
                <button
                  key={product}
                  className="btn btn-secondary"
                  onClick={() => addFactory(product)}
                  style={{ padding: '15px' }}
                >
                  {product}
                </button>
              ))}
            </div>
            <button 
              className="btn btn-danger" 
              onClick={() => setShowAddModal(false)}
              style={{ marginTop: '20px', width: '100%' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FactoryManager
