// eslint-disable-next-line
import {
  UserLayout,
  BasicLayout,
  RouteView,
  BlankLayout,
  PageView
} from '@/layouts'
import {
  bxAnaalyse,
  iconMonitor,
  iconScheduling,
  iconFilament,
  iconPrinter,
  iconFile,
  iconOrder,
  iconSetting,
  iconPersonal
} from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/monitor/monitorManage',
    children: [
      // 监控墙
      {
        path: '/monitor',
        name: 'monitor',
        redirect: '/monitor/monitorManage',
        component: PageView,
        meta: {
          title: '首页',
          keepAlive: true,
          icon: iconMonitor,
        },
        children: [{
          path: '/monitor/monitorManage',
          name: 'monitorManage',
          component: () => import('@/views/monitor/MonitorManage'),
          meta: {
            title: '首页',
            keepAlive: false,
          }
          },
          {
            path: '/thing/borrow',
            name: 'borrowManage',
            component: () => import('@/views/thing/borrow'),
            meta: {
              title: '物品借出',
              keepAlive: false,
            }
          },
          {
          path: '/thing/sendback',
          name: 'backManage',
          component: () => import('@/views/thing/sendback'),
          meta: {
            title: '归还管理',
            keepAlive: false,
          }
        }
        ]
      },
      // 值排班Monitor
      {
        path: '/schedule',
        name: 'schedule',
        redirect: '/schedule/scheduleManage',
        component: PageView,
        meta: {
          title: '资源管理',
          keepAlive: true,
          icon: iconScheduling,
        },
        children: [{
            path: '/thing/thingList',
            name: 'thingManage',
            component: () => import('@/views/thing/thingList'),
            meta: {
              title: '资源管理',
              keepAlive: false,
            }
          },
          {
          path: '/type/typeList',
          name: 'typeManage',
          component: () => import('@/views/type/typeList'),
          meta: {
            title: '资源分类',
            keepAlive: false,
          }
        }
        ]
      },
      // 会员管理
      {
        path: '/users',
        name: 'users',
        redirect: '/users/usersList',
        component: PageView,
        meta: {
          title: '会员管理',
          keepAlive: true,
          icon: iconPrinter,
        },
        children: [{
          path: '/users/usersList',
          name: 'UsersManage',
          component: () => import('@/views/users/usersList'),
          meta: {
            title: '会员列表',
            keepAlive: false,
          }
        }]
      },
      // 部门管理
      {
        path: '/depart',
        name: 'depart',
        redirect: '/depart/list',
        component: PageView,
        meta: {
          title: '部门管理',
          keepAlive: true,
          icon: iconFilament
        },
        children: [{
            path: '/depart/list',
            name: 'departList',
            component: () => import('@/views/depart/departList'),
            meta: {
              title: '部门列表',
              keepAlive: true,
              //   permission: ['dashboard']
            }
          }
        ]
      },
      // 设置
      {
        path: '/setting',
        name: 'setting',
        redirect: '/setting/userManage',
        component: PageView,
        meta: {
          title: '设置',
          keepAlive: true,
          icon: iconSetting,
        },
        children: [{
            path: '/setting/userManage',
            name: 'userManage',
            component: () => import('@/views/setting/UserManage'),
            meta: {
              title: '人员管理',
              keepAlive: false,
            }
          },
          {
            path: '/setting/roleManage',
            name: 'roleManage',
            meta: {
              title: '角色管理',
              keepAlive: true
            },
            component: () => import('@/views/setting/RoleManage')
          }
        ]
      },
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [{
        path: 'login',
        name: 'login',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/404',
    component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]