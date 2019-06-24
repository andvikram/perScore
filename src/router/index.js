import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login/Home'
import Registration from '@/components/Registration/Home'
import Admin from '@/components/Admin/Home'
import Questioner from '@/components/Questioner/Home'
import Respondent from '@/components/Respondent/Home'
import AdminsCategories from '@/components/Admin/Categories'
import AdminsQuestions from '@/components/Admin/Questions'
import NewQuestion from '@/components/Questioner/NewQuestion'
import NextQuestion from '@/components/Respondent/NextQuestion'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Registration',
      component: Registration
    },
    {
      path: '/questioner',
      name: 'Questioner',
      component: Questioner
    },
    {
      path: '/respondent',
      name: 'Respondent',
      component: Respondent
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/admin/questions',
      name: 'AdminsQuestions',
      component: AdminsQuestions
    },
    {
      path: '/admin/categories',
      name: 'AdminsCategories',
      component: AdminsCategories
    },
    {
      path: '/questioner/question/new',
      name: 'NewQuestion',
      component: NewQuestion
    },
    {
      path: '/respondent/question/new',
      name: 'NextQuestion',
      component: NextQuestion
    }
  ]
})
