import { useState } from 'react'
import { getNextServiceItems, updateCurrentKm } from '../data/store'

function StatusBadge({ count, status, label, color }) {
  if (count === 0) return null
  return (
    <div className={`rounded-xl p-4 text-white ${color} shadow-sm`}>
      <div className="text-3xl font-bold">{count}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  )
}

export default function Dashboard({ store, refresh }) {
  const [editing, setEditing] = useState(false)
  const [kmInput, setKmInput] = useState(String(store.currentKm))
  const items = getNextServiceItems(store.currentKm)
  const overdue = items.filter(i => i.status === 'overdue')
  const soon = items.filter(i => i.status === 'soon')
  const ok = items.filter(i => i.status === 'ok')

  const nearestDue = items
    .filter(i => i.remaining > 0)
    .sort((a, b) => a.remaining - b.remaining)[0]

  function handleSaveKm() {
    const km = parseInt(kmInput)
    if (!isNaN(km) && km >= 0) {
      updateCurrentKm(km)
      refresh()
      setEditing(false)
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      {/* 里程卡片 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="text-sm text-gray-500 mb-1">目前里程</div>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={kmInput}
              onChange={e => setKmInput(e.target.value)}
              className="text-2xl font-bold w-full border-b-2 border-[#1e3a5f] outline-none bg-transparent"
              autoFocus
            />
            <span className="text-gray-400 text-lg">km</span>
            <button onClick={handleSaveKm} className="bg-[#1e3a5f] text-white px-4 py-1.5 rounded-lg text-sm font-medium">
              儲存
            </button>
          </div>
        ) : (
          <div className="flex items-baseline gap-2" onClick={() => { setKmInput(String(store.currentKm)); setEditing(true) }}>
            <span className="text-3xl font-bold text-[#1e3a5f]">
              {store.currentKm.toLocaleString()}
            </span>
            <span className="text-gray-400 text-lg">km</span>
            <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        )}
      </div>

      {/* 狀態摘要 */}
      <div className="grid grid-cols-3 gap-3">
        <StatusBadge count={overdue.length} status="overdue" label="逾期必做" color="bg-red-500" />
        <StatusBadge count={soon.length} status="soon" label="即將到期" color="bg-amber-500" />
        <StatusBadge count={ok.length} status="ok" label="正常" color="bg-emerald-500" />
      </div>

      {/* 下次保養預告 */}
      {nearestDue && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="text-sm text-gray-500 mb-2">最近到期項目</div>
          <div className="font-semibold text-[#1e3a5f]">{nearestDue.name}</div>
          <div className="text-sm text-gray-500 mt-1">
            還剩 <span className="font-bold text-[#1e3a5f]">{nearestDue.remaining.toLocaleString()}</span> km
            （到期於 {nearestDue.dueKm.toLocaleString()} km）
          </div>
        </div>
      )}

      {/* 逾期項目快速列表 */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="text-sm font-semibold text-red-700 mb-2">⚠ 逾期項目</div>
          {overdue.map(item => (
            <div key={item.id} className="flex justify-between items-center py-1.5 text-sm">
              <span className="text-red-800">{item.name}</span>
              <span className="text-red-600 font-medium">超過 {Math.abs(item.remaining).toLocaleString()} km</span>
            </div>
          ))}
        </div>
      )}

      {/* 輪胎狀態 */}
      {store.tireTargetKm && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="text-sm text-gray-500 mb-1">輪胎</div>
          {(() => {
            const remaining = store.tireTargetKm - store.currentKm
            const lastTire = store.tires?.[store.tires.length - 1]
            return (
              <>
                {lastTire && (
                  <div className="text-xs text-gray-400 mb-1">
                    目前：{lastTire.to}（{lastTire.date} / {lastTire.km.toLocaleString()} km 更換）
                  </div>
                )}
                <div className={`font-semibold ${remaining <= 5000 ? 'text-amber-600' : remaining <= 0 ? 'text-red-600' : 'text-[#1e3a5f]'}`}>
                  {remaining > 0
                    ? `距離換胎還有 ${remaining.toLocaleString()} km`
                    : `已超過換胎目標 ${Math.abs(remaining).toLocaleString()} km`}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">目標 {store.tireTargetKm.toLocaleString()} km</div>
              </>
            )
          })()}
        </div>
      )}

      {/* 上次保養 */}
      {store.history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="text-sm text-gray-500 mb-1">上次保養</div>
          <div className="flex justify-between items-baseline">
            <div>
              <span className="font-semibold">第 {store.history[store.history.length - 1].seq} 次</span>
              <span className="text-gray-400 text-sm ml-2">{store.history[store.history.length - 1].date}</span>
            </div>
            <div className="text-sm">
              {store.history[store.history.length - 1].km.toLocaleString()} km
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
