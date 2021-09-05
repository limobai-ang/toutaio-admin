import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    component: () => import('@/views/home/Home.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/home/indexHoem.vue')
      },
      {
        name: 'article',
        path: 'article',
        component: () => import('@/views/article')
      },
      {
        name: 'publish',
        path: 'publish',
        component: () => import('@/views/publish')
      },
      {
        name: 'image',
        path: 'image',
        component: () => import('@/views/images')
      },
      {
        name: 'comment',
        path: 'comment',
        component: () => import('@/views/comment')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    const islogin = localStorage.getItem('token')
    if (islogin) {
      next()
    } else {
      next('/login')
    }
  }
  next()
})

export default router
