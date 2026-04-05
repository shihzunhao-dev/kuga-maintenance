import { getStore } from '../data/store'

function getItemName(id) {
  const store = getStore()
  const found = store.schedule.find(s => s.id === id)
  return found ? found.name : id
}

export default function History({ store }) {
  const history = [...store.history].reverse()

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h2 className="text-sm font-bold text-gray-500">保養紀錄</h2>

      {history.map(entry => (
        <div key={entry.seq} className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="inline-block bg-[#1e3a5f] text-white text-xs font-bold px-2.5 py-1 rounded-lg mr-2">
                第 {entry.seq} 次
              </span>
              <span className="text-sm text-gray-500">{entry.date}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{entry.km.toLocaleString()} km</div>
              {entry.cost > 0 && (
                <div className="text-base font-bold text-[#1e3a5f]">${entry.cost.toLocaleString()}</div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {entry.items.map(id => (
              <span key={id} className="inline-block bg-blue-50 text-[#1e3a5f] text-xs px-2.5 py-1 rounded-lg">
                {getItemName(id)}
              </span>
            ))}
          </div>

          {entry.prices && Object.keys(entry.prices).length > 0 && (
            <details className="mt-3">
              <summary className="text-xs text-gray-400 cursor-pointer">費用明細</summary>
              <div className="mt-2 space-y-1">
                {Object.entries(entry.prices).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs text-gray-500">
                    <span>{key}</span>
                    <span>${val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      ))}

      {/* 輪胎紀錄 */}
      {store.tires && store.tires.length > 0 && (
        <>
          <h2 className="text-sm font-bold text-gray-500 mt-6">輪胎更換紀錄</h2>
          {store.tires.map((t, i) => (
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
        </>
      )}
    </div>
  )
}
