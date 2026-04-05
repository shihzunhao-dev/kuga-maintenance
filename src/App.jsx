import { useState, useCallback } from 'react'
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import NextService from './pages/NextService'
import History from './pages/History'
import Settings from './pages/Settings'
import { getStore } from './data/store'

function NavIcon({ d, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
      </svg>
      <span className="text-[10px]">{label}</span>
    </div>
  )
}

export default function App() {
  const [store, setStore] = useState(getStore)
  const refresh = useCallback(() => setStore(getStore()), [])

  const nav = [
    { to: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4', label: '總覽' },
    { to: '/next', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', label: '本次保養' },
    { to: '/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: '歷史' },
    { to: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: '設定' },
  ]

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
        {/* Header */}
        <header className="bg-[#1e3a5f] text-white px-4 py-3 flex items-center gap-3 shadow-md">
          <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.3A3.7 3.7 0 001 12.8V16c0 .6.4 1 1 1h1" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
          </svg>
          <h1 className="text-lg font-bold tracking-wide">Kuga 保養助手</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          <Routes>
            <Route path="/" element={<Dashboard store={store} refresh={refresh} />} />
            <Route path="/next" element={<NextService store={store} refresh={refresh} />} />
            <Route path="/history" element={<History store={store} />} />
            <Route path="/settings" element={<Settings store={store} refresh={refresh} />} />
          </Routes>
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
          <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `flex-1 flex justify-center py-1 transition-colors ${isActive ? 'text-[#1e3a5f] font-semibold' : 'text-gray-400'}`
                }
              >
                <NavIcon d={n.icon} label={n.label} />
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </HashRouter>
  )
}
