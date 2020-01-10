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
          title: '监控墙',
          keepAlive: true,
          icon: iconMonitor,
        },
        children: [{
            path: '/monitor/monitorManage',
            name: 'monitorManage',
            component: () => import('@/views/monitor/MonitorManage'),
            meta: {
              title: '机器看板',
              keepAlive: false,
            }
          },
          {
            path: '/monitor/incident',
            name: 'incidentManage',
            component: () => import('@/views/monitor/IncidentManage'),
            meta: {
              title: '事件看板',
              keepAlive: false,
            }
          },
        ]
      },
      // 值排班Monitor
      {
        path: '/schedule',
        name: 'schedule',
        redirect: '/schedule/scheduleManage',
        component: PageView,
        meta: {
          title: '值排班',
          keepAlive: true,
          icon: iconScheduling,
        },
        children: [{
            path: '/schedule/scheduleManage',
            name: 'scheduleManage',
            component: () => import('@/views/schedule/ScheduleManage'),
            meta: {
              title: '值排班',
              keepAlive: false,
            }
          }, {
            path: '/schedule/rankManage',
            name: 'rankManage',
            component: () => import('@/views/schedule/RankManage'),
            meta: {
              title: '班次管理',
              keepAlive: false,
            }
          },
          {
            path: '/schedule/personManage',
            name: 'personManage',
            hidden: true,
            component: () => import('@/views/schedule/personManage'),
            meta: {
              title: '值排班人员',
              keepAlive: false,
            }
          },
          {
            path: '/schedule/person',
            name: 'person',
            hidden: true,
            component: () => import('@/views/schedule/person'),
            meta: {
              title: '值班员',
              keepAlive: false,
            }
          }
        ]
      },
      // 打印机管理Printer
      {
        path: '/printer',
        name: 'printer',
        redirect: '/printer/PrinterManage',
        component: PageView,
        meta: {
          title: '打印机管理',
          keepAlive: true,
          icon: iconPrinter,
        },
        children: [{
          path: '/printer/PrinterManage',
          name: 'PrinterManage',
          component: () => import('@/views/printer/PrinterManage'),
          meta: {
            title: '打印机列表',
            keepAlive: false,
          }
        }, {
          path: '/printer/detail',
          name: 'printerDetail',
          hidden: true,
          component: () => import('@/views/printer/printerDetail'),
          meta: {
            title: '打印机详情',
            keepAlive: true,
            //   permission: ['dashboard']
          }
        }]
      },
      // 物料管理
      {
        path: '/filament',
        name: 'filament',
        redirect: '/filament/list',
        component: PageView,
        meta: {
          title: '物料管理',
          keepAlive: true,
          icon: iconFilament,
          permission: ['filament']
        },
        children: [{
            path: '/filament/list',
            name: 'filamentList',
            component: () => import('@/views/filament/filamentList'),
            meta: {
              title: '物料列表',
              keepAlive: true,
              //   permission: ['dashboard']
            }
          },
          {
            path: '/filament/detail',
            name: 'filamentDetail',
            hidden: true,
            component: () => import('@/views/filament/filamentDetail'),
            meta: {
              title: '物料详情',
              keepAlive: true,
              //   permission: ['dashboard']
            }
          }
        ]
      },
      // 文件管理
      {
        path: '/file',
        name: 'file',
        redirect: '/file/myFile',
        component: PageView,
        meta: {
          title: '文件管理',
          keepAlive: true,
          icon: iconFile,
          permission: ['file']
        },
        children: [{
            path: '/file/myFile',
            name: 'myFile',
            component: () => import('@/views/files/MyFile'),
            meta: {
              title: '我的文件',
              keepAlive: false,
              permission: ['myFile']
            }
          },
          {
            path: '/file/publicFile',
            name: 'publicFile',
            meta: {
              title: '公海文件',
              keepAlive: true
            },
            component: () => import('@/views/files/PublicFile')
          },
          {
            path: '/file/sliceFile',
            name: 'sliceFile',
            component: () => import('@/views/files/SliceFile'),
            meta: {
              title: '我的切片模版',
              keepAlive: true
            }
          },
          {
            path: '/file/productFile',
            name: 'productFile',
            component: () => import('@/views/files/ProductFile'),
            meta: {
              title: '生产项目',
              keepAlive: true
            }
          },
          {
            path: '/file/approvalList',
            name: 'approvalList',
            hidden: true,
            component: () => import('@/views/files/ApprovalList'),
            meta: {
              title: '审批列表',
              keepAlive: true,
              permission: ['dashboard']
            }
          },
          {
            path: '/file/folders',
            name: 'folders',
            hidden: true,
            component: () => import('@/views/files/Folders'),
            meta: {
              title: '文件夹列表',
              keepAlive: true,
              permission: ['dashboard']
            }
          }
        ]
      },

      // 订单管理
      {
        path: '/order',
        name: 'order',
        redirect: '/file/myFile',
        component: PageView,
        meta: {
          title: '订单管理',
          keepAlive: true,
          icon: iconOrder,
          permission: ['order']
        },
        children: [{
            path: '/order/list',
            name: 'orderList',
            component: () => import('@/views/order/orderList'),
            meta: {
              title: '订单列表',
              keepAlive: true,
              //   permission: ['dashboard']
            }
          },
          {
            path: '/order/detail',
            name: 'orderDetail',
            hidden: true,
            component: () => import('@/views/order/orderDetail'),
            meta: {
              title: '订单详情',
              keepAlive: true,
              //   permission: ['dashboard']
            },
          },
          {
            path: '/order/deliver',
            name: 'deliverList',
            hidden: true,
            component: () => import('@/views/order/deliver/deliverList'),
            meta: {
              title: '交付单',
              keepAlive: true,
              //   permission: ['dashboard']
            }
          },
          {
            path: '/order/arrange',
            name: 'arrange',
            hidden: true,
            component: () => import('@/views/order/arrange/arrange'),
            meta: {
              title: '托盘排产',
              keepAlive: true,
              //   permission: ['dashboard']
            }
          },
          {
            path: '/order/ganttChart',
            name: 'ganttChart',
            component: () => import('@/views/order/gantt/ganttChart'),
            meta: {
              title: '甘特图',
              keepAlive: true,
              //   permission: ['dashboard']
            }
          },
          {
            path: '/order/ganttList',
            name: 'ganttList',
            hidden: true,
            component: () => import('@/views/order/gantt/ganttList'),
            meta: {
              title: '甘特图',
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