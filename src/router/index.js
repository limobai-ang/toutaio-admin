import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

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
