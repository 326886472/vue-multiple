/*
 * @Author: wenshuang
 * @Date: 2023-11-10 14:53:56
 * @LastEditTime: 2024-05-13 16:16:36
 * @LastEditors: wenshuang
 * @Description: 授权
 * @FilePath: /mobile-server/src/utils/auth.ts
 */
import Cookies from 'js-cookie'

const TOKEN_KEY = 'c_token'
const USER_KEY = 'c_user_id'

export function isLogin() {
  return !!Cookies.get(TOKEN_KEY)
}

export function getToken() {
  return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
}

export function getUserId() {
  return Cookies.get(USER_KEY)
}

export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token)
}

export function clearToken() {
  Cookies.remove(TOKEN_KEY)
}
