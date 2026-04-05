import { DEFAULT_SCHEDULE, DEFAULT_HISTORY, DEFAULT_TIRES, DEFAULT_CURRENT_KM } from './defaults'

const STORAGE_KEY = 'kuga-maintenance'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getStore() {
  const stored = load()
  if (stored) return stored
  const initial = {
    currentKm: DEFAULT_CURRENT_KM,
    schedule: DEFAULT_SCHEDULE,
    history: DEFAULT_HISTORY,
    tires: DEFAULT_TIRES,
  }
  save(initial)
  return initial
}

export function updateStore(partial) {
  const current = getStore()
  const next = { ...current, ...partial }
  save(next)
  return next
}

export function getNextServiceItems(currentKm) {
  const { schedule } = getStore()
  return schedule.map(item => {
    const dueKm = item.lastReplacedKm + item.intervalKm
    const remaining = dueKm - currentKm
    let status = 'ok'       // 🟢
    if (remaining <= 0) status = 'overdue'       // 🔴
    else if (remaining <= 2000) status = 'soon'  // 🟡
    return { ...item, dueKm, remaining, status }
  })
}

export function completeService(currentKm, completedItemIds) {
  const store = getStore()
  const updatedSchedule = store.schedule.map(item =>
    completedItemIds.includes(item.id)
      ? { ...item, lastReplacedKm: currentKm }
      : item
  )
  const newHistoryEntry = {
    seq: store.history.length + 1,
    km: currentKm,
    date: new Date().toISOString().slice(0, 10),
    items: completedItemIds,
    cost: 0,
    prices: {}
  }
  return updateStore({
    currentKm,
    schedule: updatedSchedule,
    history: [...store.history, newHistoryEntry]
  })
}

export function updateCurrentKm(km) {
  return updateStore({ currentKm: km })
}

export function updateScheduleItem(id, changes) {
  const store = getStore()
  const updatedSchedule = store.schedule.map(item =>
    item.id === id ? { ...item, ...changes } : item
  )
  return updateStore({ schedule: updatedSchedule })
}

export function addScheduleItem(item) {
  const store = getStore()
  return updateStore({ schedule: [...store.schedule, item] })
}

export function removeScheduleItem(id) {
  const store = getStore()
  return updateStore({ schedule: store.schedule.filter(i => i.id !== id) })
}

export function manualReplace(itemId, km) {
  const store = getStore()
  const updatedSchedule = store.schedule.map(item =>
    item.id === itemId ? { ...item, lastReplacedKm: km } : item
  )
  const newHistoryEntry = {
    seq: store.history.length + 1,
    km,
    date: new Date().toISOString().slice(0, 10),
    items: [itemId],
    cost: 0,
    prices: {},
    note: '手動更換'
  }
  return updateStore({
    schedule: updatedSchedule,
    history: [...store.history, newHistoryEntry]
  })
}

export function updateTireTarget(nextKm) {
  return updateStore({ tireTargetKm: nextKm })
}

export function addTireRecord(record) {
  const store = getStore()
  return updateStore({ tires: [...(store.tires || []), record] })
}

export function resetToDefaults() {
  localStorage.removeItem(STORAGE_KEY)
  return getStore()
}
