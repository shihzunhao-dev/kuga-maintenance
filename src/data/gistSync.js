const GIST_ID_KEY = 'kuga-gist-id'
const TOKEN_KEY = 'kuga-gist-token'
const API = 'https://api.github.com'

export function getGistConfig() {
  return {
    gistId: localStorage.getItem(GIST_ID_KEY) || '',
    token: localStorage.getItem(TOKEN_KEY) || '',
  }
}

export function saveGistConfig(gistId, token) {
  localStorage.setItem(GIST_ID_KEY, gistId)
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearGistConfig() {
  localStorage.removeItem(GIST_ID_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

async function gistFetch(path, options = {}) {
  const { token } = getGistConfig()
  if (!token) throw new Error('未設定 GitHub Token')
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub API 錯誤 (${res.status}): ${body}`)
  }
  return res.json()
}

export async function pushToGist(data) {
  const { gistId } = getGistConfig()
  if (!gistId) throw new Error('未設定 Gist ID')
  const payload = {
    files: {
      'kuga-maintenance.json': {
        content: JSON.stringify({ ...data, _syncedAt: new Date().toISOString() }, null, 2)
      }
    }
  }
  return gistFetch(`/gists/${gistId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function pullFromGist() {
  const { gistId } = getGistConfig()
  if (!gistId) throw new Error('未設定 Gist ID')
  const gist = await gistFetch(`/gists/${gistId}`)
  const file = gist.files['kuga-maintenance.json']
  if (!file) throw new Error('Gist 中找不到 kuga-maintenance.json')
  const data = JSON.parse(file.content)
  return data
}
