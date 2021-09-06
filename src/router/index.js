import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/articleList',
    name: 'article',
    meta: { title: '文章管理', icon: 'el-icon-menu' },
    children: [
      {
        path: 'articleList',
        name: 'articleList',
        component: () => import('@/views/article/articleList'),
        meta: { title: '文章列表', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'articleAdd',
        name: 'articleAdd',
        component: () => import('@/views/article/articleAdd'),
        meta: { title: '文章操作', icon: 'el-icon-document-add' }
      }
    ]
  },

  {
    path: '/class',
    component: Layout,
    children: [
      {
        path: 'classList',
        name: '分类管理',
        component: () => import('@/views/class/classList'),
        meta: { title: '分类管理', icon: 'el-icon-s-order' }
      }
    ]
  },
  {
    path: '/label',
    component: Layout,
    children: [
      {
        path: 'labelList',
        name: '标签管理',
        component: () => import('@/views/label/labelList'),
        meta: { title: '标签管理', icon: 'el-icon-paperclip' }
      }
    ]
  },
  {
    path: '/image',
    component: Layout,
    children: [
      {
        path: 'imageList',
        name: '图片管理',
        component: () => import('@/views/image/imageList'),
        meta: { title: '图片管理', icon: 'el-icon-picture' }
      }
    ]
  },

 

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
