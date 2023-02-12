import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import IndexPage from '@/views/IndexPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[
      { path: '/', component: IndexPage, meta:{title:"sakuyo - 首页"}},
      { path: '/msg', component:() => import('@/views/MsgPage.vue'), meta:{title:"sakuyo - 消息"}},
      { path: '/user', component:() => import('@/views/UserPage.vue'), meta:{title:"sakuyo - 个人中心"}},
      { path: '/sakuyo-fantasy', component:() => import('@/views/SakuyoFantasy.vue'), meta:{title:"sakuyo - 幻想"}},
      { path: '/true-or-false', component:() => import('@/views/TrueOrFalse.vue'), meta:{title:"sakuyo - True or False"}},
      { path: '/chat', component:() => import('@/views/ChatRoom.vue'), meta:{title:"sakuyo - Chat"}},
      { 
        path: '/draw-something', component:() => import('@/views/DrawSomething.vue'), meta:{title:"sakuyo - 你画我猜"},
        children:[
          { path: '/draw-something/', component:() => import('@/components/DrawSomething/DrawIndex.vue'), meta:{title:"sakuyo - 你画我猜"}},
          { path: '/draw-something/room', component:() => import('@/components/DrawSomething/DrawRoom.vue'), meta:{title:"sakuyo - 你画我猜：房间"}},
          { path: '/draw-something/result', component:() => import('@/components/DrawSomething/DrawResult.vue'), meta:{title:"sakuyo - 你画我猜"}}
        ]
      },
      { path: '/ff14', component:() => import('@/views/FF14Page.vue'), meta:{title:"sakuyo - FF14"}},
      { path: '/insta', component:() => import('@/views/Insta360.vue'), meta:{title:"mihoko - Insta360"}},
    ],
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router;

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