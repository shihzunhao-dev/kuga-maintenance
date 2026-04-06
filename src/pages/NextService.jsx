import { useState } from 'react'
import { getNextServiceItems, completeService, updateCurrentKm, manualReplace } from '../data/store'

const STATUS_CONFIG = {
  overdue: { bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-500', text: 'text-red-700', label: '逾期' },
  soon:    { bg: 'bg-amber-50', border: 'border-amber-300', dot: 'bg-amber-500', text: 'text-amber-700', label: '即將到期' },
  ok:      { bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-emerald-500', text: 'text-gray-500', label: '正常' },
}

function ItemCard({ item, checked, onToggle, onManualReplace }) {
  const [showManual, setShowManual] = useState(false)
  const [manualKm, setManualKm] = useState('')
  const cfg = STATUS_CONFIG[item.status]

  function handleManualSubmit(e) {
    e.stopPropagation()
    const km = parseInt(manualKm)
    if (!isNaN(km) && km > 0) {
      onManualReplace(item.id, km)
      setShowManual(false)
      setManualKm('')
    }
  }

  return (
    <div className={`rounded-xl p-4 border-2 ${checked ? 'border-[#1e3a5f] bg-blue-50' : cfg.border + ' ' + cfg.bg} transition-all`}>
      <div className="flex items-start gap-3 cursor-pointer active:scale-[0.98]" onClick={onToggle}>
        <div className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-[#1e3a5f] border-[#1e3a5f]' : 'border-gray-300 bg-white'}`}>
          {checked && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className="font-semibold text-[15px]">{item.name}</span>
          </div>
          <div className={`text-xs mt-1 ${cfg.text}`}>
            {item.status === 'overdue' && `已超過 ${Math.abs(item.remaining).toLocaleString()} km`}
            {item.status === 'soon' && `還剩 ${item.remaining.toLocaleString()} km`}
            {item.status === 'ok' && `還剩 ${item.remaining.toLocaleString()} km`}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            週期 {item.intervalKm.toLocaleString()} km ・ 上次 {item.lastReplacedKm.toLocaleString()} km
          </div>
          {item.spec && (
            <div className="text-[11px] text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 mt-1 inline-block">
              {item.spec}
            </div>
          )}
        </div>
        {/* 手動更換按鈕 */}
        <button
          onClick={e => { e.stopPropagation(); setShowManual(!showManual); setManualKm('') }}
          className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-[#1e3a5f] hover:bg-white/60"
          title="手動更換"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* 手動更換面板 */}
      {showManual && (
        <div className="mt-3 pt-3 border-t border-gray-200" onClick={e => e.stopPropagation()}>
          <div className="text-xs text-gray-500 mb-1.5">自行更換？輸入更換時的里程：</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={manualKm}
              onChange={e => setManualKm(e.target.value)}
              placeholder="例：45000"
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1e3a5f]"
              autoFocus
            />
            <span className="text-xs text-gray-400">km</span>
            <button
              onClick={handleManualSubmit}
              className="bg-[#1e3a5f] text-white px-3 py-2 rounded-lg text-sm font-medium shrink-0"
            >
              確認
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function NextService({ store, refresh }) {
  const [checked, setChecked] = useState(new Set())
  const [kmInput, setKmInput] = useState(String(store.currentKm))
  const [saved, setSaved] = useState(false)

  const currentKm = parseInt(kmInput) || store.currentKm
  const items = getNextServiceItems(currentKm)
  const overdue = items.filter(i => i.status === 'overdue')
  const soon = items.filter(i => i.status === 'soon')
  const ok = items.filter(i => i.status === 'ok')

  function toggle(id) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    setSaved(false)
  }

  function handleManualReplace(itemId, km) {
    manualReplace(itemId, km)
    refresh()
    setSaved(false)
  }

  function selectAllDue() {
    const dueIds = [...overdue, ...soon].map(i => i.id)
    setChecked(new Set(dueIds))
    setSaved(false)
  }

  function handleComplete() {
    if (checked.size === 0) return
    const km = parseInt(kmInput)
    if (isNaN(km) || km <= 0) return
    completeService(km, [...checked])
    refresh()
    setChecked(new Set())
    setSaved(true)
  }

  function handleKmBlur() {
    const km = parseInt(kmInput)
    if (!isNaN(km) && km >= 0) {
      updateCurrentKm(km)
      refresh()
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      {/* 里程輸入 */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <label className="text-sm text-gray-500 block mb-1">輸入目前里程（到廠時確認）</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={kmInput}
            onChange={e => { setKmInput(e.target.value); setSaved(false) }}
            onBlur={handleKmBlur}
            className="text-xl font-bold flex-1 border-b-2 border-[#1e3a5f] outline-none bg-transparent"
          />
          <span className="text-gray-400">km</span>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-sm text-emerald-700 text-center font-medium">
          ✓ 保養紀錄已儲存
        </div>
      )}

      {/* 逾期 - 必做 */}
      {overdue.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-red-600">🔴 必做（逾期）</h2>
            <button onClick={selectAllDue} className="text-xs text-[#1e3a5f] font-medium">全選到期項目</button>
          </div>
          <div className="space-y-2">
            {overdue.map(item => (
              <ItemCard key={item.id} item={item} checked={checked.has(item.id)} onToggle={() => toggle(item.id)} onManualReplace={handleManualReplace} />
            ))}
          </div>
        </section>
      )}

      {/* 即將到期 - 建議做 */}
      {soon.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-amber-600 mb-2">🟡 建議（即將到期）</h2>
          <div className="space-y-2">
            {soon.map(item => (
              <ItemCard key={item.id} item={item} checked={checked.has(item.id)} onToggle={() => toggle(item.id)} onManualReplace={handleManualReplace} />
            ))}
          </div>
        </section>
      )}

      {/* 正常 */}
      {ok.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 mb-2">🟢 未到期</h2>
          <div className="space-y-2">
            {ok.map(item => (
              <ItemCard key={item.id} item={item} checked={checked.has(item.id)} onToggle={() => toggle(item.id)} onManualReplace={handleManualReplace} />
            ))}
          </div>
        </section>
      )}

      {/* 完成保養按鈕 */}
      {checked.size > 0 && (
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-[#f0f4f8] via-[#f0f4f8] to-transparent">
          <button
            onClick={handleComplete}
            className="w-full max-w-lg mx-auto block bg-[#1e3a5f] text-white py-3.5 rounded-2xl font-bold text-base shadow-lg active:scale-[0.98] transition-transform"
          >
            完成保養（{checked.size} 項）
          </button>
        </div>
      )}
    </div>
  )
}
