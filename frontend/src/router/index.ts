import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

const homeRoute: RouteRecordRaw = {
  path: '/',
  component: () => import('../views/HomeView.vue'),
  children: [],
}

/*
const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})

 */

export default (router: Router) => {
  router.addRoute(homeRoute)
}

//export default router
