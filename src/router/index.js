import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/home/Home')
const Cart = () => import('../views/cart/Cart')
const Class = () => import('../views/class/Class')
const Profile = () => import('../views/profile/Profile')
const Details = () => import('../views/details/Details')

// 1.安装插件
Vue.use(VueRouter)

// 2.创建router
const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/class',
    component: Class
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/details/:iid',
    component: Details
  }
]
const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router