import { getToken, getUserId } from '@/utils/auth'
import { getLocalStorageJsonItem, getLocalStorageString, removeLocalStorageItem, setLocalStorageJsonItem, setLocalStorageString } from '@/utils/localstorage'

export function getLocalData(date, type) {
  const uid = getUserId()
  const key = `${uid}_${date}_${type}`
  return getLocalStorageJsonItem(key)
}

export function setLocalData(date, type, data) {
  const uid = getUserId()
  const key = `${uid}_${date}_${type}`
  return setLocalStorageJsonItem(key, data)
}

export function removeLocalData(date, type) {
  const uid = getUserId()
  const key = `${uid}_${date}_${type}`
  return removeLocalStorageItem(key)
}

export function getLocalSummary(date, type) {
  const uid = getUserId()
  const key = `${uid}_${date}_${type}_summary`
  return getLocalStorageString(key)
}

export function setLocalSummary(date, type, data) {
  const uid = getUserId()
  const key = `${uid}_${date}_${type}_summary`
  return setLocalStorageString(key, data)
}

export function removeLocalSummary(date, type) {
  const uid = getUserId()
  const key = `${uid}_${date}_${type}_summary`
  return removeLocalStorageItem(key)
}
