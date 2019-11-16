// auth  认证   操作的是用户信息（token  令牌   认证信息）
// 永久保存用户信息，根据refresh_token来延长有效期

// 定义一个key
const USER_KEY = 'hm-toutiao-m-user'

// 获取用户信息
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
}

// 设置用户信息
export const setUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// 删除用户信息
export const delUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
