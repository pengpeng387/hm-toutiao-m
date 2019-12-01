import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

const relTime = (time) => {
  // 依赖一个dayjs的插件relativeTime
  // dayjs()获取当前
  // .from(time) 获取相对时间
  // 语言本地化  local
  return dayjs().locale('zh-cn').from(time)
}

export default {
  install (Vue) {
    Vue.filter('relTime', relTime)
  }
}
