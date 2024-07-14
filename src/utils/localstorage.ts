/**
 * 获取localStorage中指定key的值，并尝试解析为JSON对象
 * @param {string} key - 要查询的键名
 * @returns {object|undefined} - 解析后的JSON对象，若无对应键、值不是有效JSON字符串或解析失败，则返回undefined
 */
export function getLocalStorageJsonItem(key: string) {
  const value = window.localStorage.getItem(key)
  try {
    return value ? JSON.parse(value) : undefined
  } catch (error) {
    console.warn(`Failed to parse localStorage item at key "${key}" as JSON:`, error)
    return undefined
  }
}

export function getLocalStorageString(key: string) {
  const value = window.localStorage.getItem(key)
  return value || ''
}
/**
 * 设置localStorage中指定key的值，自动将JSON对象转成字符串存储
 * @param {string} key - 要存储的键名
 * @param {object} value - 要存储的JSON对象
 */
export function setLocalStorageJsonItem(key: string, value: any) {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Value must be a non-null object')
  }
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function setLocalStorageString(key: string, value: any) {
  if (typeof value !== 'string') {
    throw new TypeError('Value must be a string')
  }
  window.localStorage.setItem(key, value)
}

/**
 * 删除localStorage中指定key的值
 * @param {string} key - 要删除的键名
 */
export function removeLocalStorageItem(key: string) {
  window.localStorage.removeItem(key)
}
