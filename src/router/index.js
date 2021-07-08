import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import IndexPage from '@/views/IndexPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[
      { path: '/', component: IndexPage},
      { path: '/msg', component:() => import('@/views/MsgPage.vue')},
      { path: '/user', component:() => import('@/views/UserPage.vue')},
      { path: '/sakuyo-fantasy', component:() => import('@/views/SakuyoFantasy.vue')},
      { path: '/draw-something', component: () => import('@/views/DrawSomething.vue')}
    ],
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

// routers of admin (only approached by admins)

// export const adminRoutersTable = [
//   { path: '/AdminPage',name: 'AdminPage', component:() => import('@/views/Admin/AdminPage.vue'),
//     children:[
//       { path:'/AdminPage/', component:() => import('@/components/Admin/AdminView.vue'), meta:{role:['admin','superadmin']} },      
//       { path:'/AdminPage/AdminView', component:() => import('@/components/Admin/AdminView.vue'), meta:{role:['admin','superadmin']} },
//       { path:'/AdminPage/AdminOld', component:() => import('@/components/Admin/AdminOld.vue'), meta:{role:['admin','superadmin']} },
//       { path:'/AdminPage/AdminEdit', component:() => import('@/components/Admin/AdminEdit.vue'), meta:{role:['superadmin']} }
      
//     ]
//   }
// ];