import { useState } from 'react'
import { getStore, updateScheduleItem, addScheduleItem, removeScheduleItem, resetToDefaults, updateTireTarget, addTireRecord } from '../data/store'

function TireSection({ store, refresh }) {
  const [targetKm, setTargetKm] = useState(String(store.tireTargetKm || ''))
  const [showAddTire, setShowAddTire] = useState(false)
  const [newTire, setNewTire] = useState({ km: '', from: '', to: '', date: '' })

  function saveTarget() {
    const km = parseInt(targetKm)
    if (!isNaN(km) && km > 0) {
      updateTireTarget(km)
      refresh()
    }
  }

  function handleAddTire() {
    const km = parseInt(newTire.km)
    if (!isNaN(km) && newTire.to) {
      addTireRecord({
        km,
        from: newTire.from || '舊胎',
        to: newTire.to,
        date: newTire.date || new Date().toISOString().slice(0, 7)
      })
      refresh()
      setNewTire({ km: '', from: '', to: '', date: '' })
      setShowAddTire(false)
    }
  }

  const tireRemaining = store.tireTargetKm ? store.tireTargetKm - store.currentKm : null

  return (
    <div className="space-y-2 pt-4">
      <h2 className="text-sm font-bold text-gray-500">輪胎管理</h2>

      {/* 下次換胎目標 */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="text-sm font-semibold mb-2">下次換胎里程</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={targetKm}
            onChange={e => setTargetKm(e.target.value)}
            placeholder="例：70000"
            className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1e3a5f]"
          />
          <span className="text-xs text-gray-400">km</span>
          <button onClick={saveTarget} className="bg-[#1e3a5f] text-white px-3 py-2 rounded-lg text-sm font-medium shrink-0">
            儲存
          </button>
        </div>
        {tireRemaining !== null && (
          <div className={`text-xs mt-2 ${tireRemaining <= 5000 ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
            {tireRemaining > 0
              ? `距離換胎還有 ${tireRemaining.toLocaleString()} km`
              : `已超過目標 ${Math.abs(tireRemaining).toLocaleString()} km`}
          </div>
        )}
      </div>

      {/* 換胎紀錄 */}
      {store.tires?.map((t, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold">{t.from} → {t.to}</div>
              <div className="text-xs text-gray-400 mt-0.5">{t.date}</div>
            </div>
            <div className="text-sm text-gray-500">{t.km.toLocaleString()} km</div>
          </div>
        </div>
      ))}

      {/* 新增換胎紀錄 */}
      {showAddTire ? (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
          <div className="flex gap-2">
            <input type="number" placeholder="更換里程" value={newTire.km}
              onChange={e => setNewTire(v => ({ ...v, km: e.target.value }))}
              className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <input type="month" value={newTire.date}
              onChange={e => setNewTire(v => ({ ...v, date: e.target.value }))}
              className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="舊胎型號" value={newTire.from}
              onChange={e => setNewTire(v => ({ ...v, from: e.target.value }))}
              className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <input type="text" placeholder="新胎型號" value={newTire.to}
              onChange={e => setNewTire(v => ({ ...v, to: e.target.value }))}
              className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddTire} className="flex-1 bg-[#1e3a5f] text-white py-2 rounded-lg text-sm font-medium">新增</button>
            <button onClick={() => setShowAddTire(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm">取消</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAddTire(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-3 text-gray-400 text-sm font-medium">
          + 新增換胎紀錄
        </button>
      )}
    </div>
  )
}

export default function Settings({ store, refresh }) {
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', intervalKm: '', lastReplacedKm: '0' })
  const [showReset, setShowReset] = useState(false)

  function startEdit(item) {
    setEditingId(item.id)
    setEditValues({ intervalKm: String(item.intervalKm), lastReplacedKm: String(item.lastReplacedKm) })
  }

  function saveEdit(id) {
    const interval = parseInt(editValues.intervalKm)
    const last = parseInt(editValues.lastReplacedKm)
    if (!isNaN(interval) && !isNaN(last)) {
      updateScheduleItem(id, { intervalKm: interval, lastReplacedKm: last })
      refresh()
    }
    setEditingId(null)
  }

  function handleAdd() {
    const interval = parseInt(newItem.intervalKm)
    const last = parseInt(newItem.lastReplacedKm)
    if (newItem.name && !isNaN(interval) && !isNaN(last)) {
      const id = newItem.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now()
      addScheduleItem({ id, name: newItem.name, intervalKm: interval, lastReplacedKm: last })
      refresh()
      setNewItem({ name: '', intervalKm: '', lastReplacedKm: '0' })
      setShowAdd(false)
    }
  }

  function handleDelete(id) {
    removeScheduleItem(id)
    refresh()
  }

  function handleReset() {
    resetToDefaults()
    refresh()
    setShowReset(false)
  }

  function handleExport() {
    const data = getStore()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kuga-maintenance-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.schedule && data.history) {
          localStorage.setItem('kuga-maintenance', JSON.stringify(data))
          refresh()
        }
      } catch {}
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h2 className="text-sm font-bold text-gray-500">保養週期設定</h2>

      {store.schedule.map(item => (
        <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4">
          {editingId === item.id ? (
            <div className="space-y-2">
              <div className="font-semibold text-sm">{item.name}</div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[11px] text-gray-400">週期 (km)</label>
                  <input
                    type="number"
                    value={editValues.intervalKm}
                    onChange={e => setEditValues(v => ({ ...v, intervalKm: e.target.value }))}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-gray-400">上次更換 (km)</label>
                  <input
                    type="number"
                    value={editValues.lastReplacedKm}
                    onChange={e => setEditValues(v => ({ ...v, lastReplacedKm: e.target.value }))}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => saveEdit(item.id)} className="flex-1 bg-[#1e3a5f] text-white py-1.5 rounded-lg text-sm font-medium">儲存</button>
                <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-100 text-gray-600 py-1.5 rounded-lg text-sm">取消</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  每 {item.intervalKm.toLocaleString()} km ・ 上次 {item.lastReplacedKm.toLocaleString()} km
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(item)} className="p-2 text-gray-400 hover:text-[#1e3a5f]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* 新增項目 */}
      {showAdd ? (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
          <input
            type="text"
            placeholder="項目名稱"
            value={newItem.name}
            onChange={e => setNewItem(v => ({ ...v, name: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="週期 (km)"
              value={newItem.intervalKm}
              onChange={e => setNewItem(v => ({ ...v, intervalKm: e.target.value }))}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="上次更換 (km)"
              value={newItem.lastReplacedKm}
              onChange={e => setNewItem(v => ({ ...v, lastReplacedKm: e.target.value }))}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-[#1e3a5f] text-white py-2 rounded-lg text-sm font-medium">新增</button>
            <button onClick={() => setShowAdd(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm">取消</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-3 text-gray-400 text-sm font-medium"
        >
          + 新增保養項目
        </button>
      )}

      {/* 輪胎管理 */}
      <TireSection store={store} refresh={refresh} />

      {/* 匯���/匯入/重置 */}
      <div className="space-y-2 pt-4">
        <h2 className="text-sm font-bold text-gray-500">資料管理</h2>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex-1 bg-white border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 shadow-sm">
            匯出 JSON
          </button>
          <label className="flex-1 bg-white border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 shadow-sm text-center cursor-pointer">
            匯入 JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
        {showReset ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
            <div className="text-sm text-red-700">確定要重置為預設值？所有自訂修改將會遺失。</div>
            <div className="flex gap-2">
              <button onClick={handleReset} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium">確定重置</button>
              <button onClick={() => setShowReset(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm">取消</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowReset(true)} className="w-full bg-white border border-red-200 rounded-xl py-2.5 text-sm text-red-500 font-medium shadow-sm">
            重置為預設值
          </button>
        )}
      </div>
    </div>
  )
}
