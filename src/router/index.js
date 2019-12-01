import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
// 布局组件
const Layout = () => import('@/views/Layout')
// 首页组件
const Home = () => import('@/views/home/Index')
// 问答组件
const Question = () => import('@/views/question/Index')
// 视频组件
const Video = () => import('@/views/video/Index')
// 个人中心组件
const User = () => import('@/views/user/Index')
// 编辑资料组件
const UserProfile = () => import('@/views/user/Profile')
// 小智同学组件
const UserChat = () => import('@/views/user/Chat')
// 登录组件
const Login = () => import('@/views/user/Login')
// 搜索中心组件
const Search = () => import('@/views/search/Index')
// 搜索结果组件
const SearchResult = () => import('@/views/search/Result')
// 文章详情
const Article = () => import('@/views/home/Article')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', name: 'home', component: Home, meta: { keepAlive: true } },
      { path: '/question', name: 'question', component: Question },
      { path: '/video', name: 'video', component: Video },
      { path: '/user', name: 'user', component: User }
    ]
  },
  { path: '/user/profile', name: 'user-profile', component: UserProfile },
  { path: '/user/chat', name: 'user-chat', component: UserChat },
  { path: '/login', name: 'login', component: Login },
  { path: '/search', name: 'search', component: Search },
  { path: '/search/result', name: 'search-result', component: SearchResult },
  { path: '/article/:id', name: 'article', component: Article, meta: { keepAlive: true } }
]

const router = new VueRouter({
  routes
})

// 使用导航守卫拦截登录
// to:进入的路由； from：离开的路由，next：
router.beforeEach((to, from, next) => {
  const { user } = store.state
  if (!user.token && to.path.startsWith('/user')) {
    // 实现回调，把当前项访问的地址传递给登录页面
    return next({ path: '/login', query: { redirectUrl: to.path } })
  }
  return next()
})

export default router
