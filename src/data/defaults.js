// 從 Excel R19~R30 + 保養歷史 R1~R13 轉換而來

export const DEFAULT_SCHEDULE = [
  { id: 'oil',        name: '機油',                     intervalKm: 10000,  lastReplacedKm: 37251, spec: '5W-20 符合 Ford WSS-M2C948-B｜1.5T 濕式皮帶設計，機油品質極重要，禁用不符規範機油' },
  { id: 'oil_filter', name: '機油芯',                   intervalKm: 10000,  lastReplacedKm: 37251, spec: 'Ford 原廠或同規格' },
  { id: 'drain_plug', name: '油底殼螺絲/墊片',          intervalKm: 10000,  lastReplacedKm: 37251 },
  { id: 'cabin_filter', name: 'PM2.5活性碳粉塵過濾器', intervalKm: 20000,  lastReplacedKm: 28385, spec: '活性碳型' },
  { id: 'air_filter', name: '空氣濾清器',               intervalKm: 40000,  lastReplacedKm: 28385 },
  { id: 'brake_fluid', name: '煞車油',                  intervalKm: 40000,  lastReplacedKm: 37251, spec: 'DOT 4 LV（低黏度）' },
  { id: 'atf',        name: '變速箱油',                 intervalKm: 40000,  lastReplacedKm: 37251, spec: 'Ford Mercon ULV｜8F35 8速自排' },
  { id: 'spark_plug', name: '火星塞',                   intervalKm: 60000,  lastReplacedKm: 0,     spec: '銥合金｜EcoBoost 缸內直噴渦輪，損耗較快' },
  { id: 'coolant',    name: '防凍冷卻液',               intervalKm: 160000, lastReplacedKm: 0,     spec: 'Ford 橘色/黃色冷卻液 WSS-M97B44-D2' },
  { id: 'belt',       name: '傳動皮帶',                 intervalKm: 160000, lastReplacedKm: 0 },
  { id: 'transfer',   name: '加力箱油 (AWD)',           intervalKm: 240000, lastReplacedKm: 37251, spec: 'Ford WSS-M2C200-D2 PTU 專用油' },
  { id: 'diff',       name: '差速器油 (AWD)',           intervalKm: 240000, lastReplacedKm: 37251, spec: 'Ford WSS-M2C200-D2 RDU 專用油' },
  { id: 'brake_clean', name: '煞車清洗劑',             intervalKm: 10000,  lastReplacedKm: 37251 },
  { id: 'throttle',   name: '電子節氣門清潔劑',         intervalKm: 20000,  lastReplacedKm: 37251 },
  { id: 'fuel_additive', name: '汽油添加劑',           intervalKm: 40000,  lastReplacedKm: 37251 },
]

export const DEFAULT_HISTORY = [
  {
    seq: 1, km: 5015, date: '2023-04-23', cost: 4771,
    items: ['oil', 'oil_filter', 'drain_plug'],
    prices: { labor: 648, oil_filter: 263, drain_plug: 200, oil: 3660 }
  },
  {
    seq: 2, km: 12039, date: '2023-10-22', cost: 6519,
    items: ['oil', 'oil_filter', 'drain_plug', 'cabin_filter', 'air_filter', 'brake_clean', 'throttle'],
    prices: { labor: 1008, oil_filter: 263, drain_plug: 200, oil: 3050, cabin_filter: 830, air_filter: 460, brake_clean: 390, throttle: 318 }
  },
  {
    seq: 3, km: 20171, date: '2024-04-05', cost: 4953,
    items: ['oil', 'oil_filter', 'drain_plug'],
    prices: { labor: 1440, oil_filter: 263, drain_plug: 200, oil: 3050 }
  },
  {
    seq: 4, km: 28385, date: '2024-10-04', cost: 6303,
    items: ['oil', 'oil_filter', 'drain_plug', 'cabin_filter', 'air_filter'],
    prices: { labor: 1500, oil_filter: 263, drain_plug: 200, oil: 3050, cabin_filter: 830, air_filter: 460 }
  },
  {
    seq: 5, km: 37251, date: '2025-04-28', cost: 14210,
    items: ['oil', 'oil_filter', 'drain_plug', 'brake_clean', 'throttle', 'atf', 'diff', 'transfer', 'brake_fluid', 'fuel_additive'],
    prices: { labor: 1875, oil_filter: 263, drain_plug: 200, oil: 3050, brake_clean: 390, throttle: 318, atf: 2750, diff: 4199, transfer: 390, brake_fluid: 440, fuel_additive: 335 }
  },
]

export const DEFAULT_TIRES = [
  { km: 32680, from: '馬牌 PC6', to: '米其林 Primacy+ SUV', date: '2025-02' }
]

export const DEFAULT_CURRENT_KM = 37251
