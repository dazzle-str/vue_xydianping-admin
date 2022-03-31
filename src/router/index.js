import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Business from '@/components/Business.vue'
import Comment from '@/components/Comment.vue'
import News from '@/components/News/News.vue'
import AddNews from '@/components/News/AddNews.vue'
import ShowNews from '@/components/News/ShowNews.vue'
import EditNews from '@/components/News/EditNews.vue'
import Feedback from '@/components/Feedback/Feedback.vue'
import ReplyFeedback from '@/components/Feedback/ReplyFeedback.vue'
import User from '@/components/User.vue'
import Admin from '@/components/Admin.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Home,
    redirect: '/business',
    children: [
      { path: '/business', component: Business },
      { path: '/comment', component: Comment },
      { path: '/news', component: News },
      { path: '/news/add', component: AddNews },
      { path: '/news/show/:id', component: ShowNews, props: true },
      { path: '/news/edit/:id', component: EditNews, props: true },
      { path: '/feedback', component: Feedback },
      { path: '/feedback/reply/:id', component: ReplyFeedback, props: true },
      { path: '/user', component: User },
      { path: '/admin', component: Admin }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (!localStorage.token) return next('/login')
  next()
})

export default router
