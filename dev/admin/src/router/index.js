import Vue from 'vue'
import Router from 'vue-router'
import Major from '@/pages/Major'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

import Category from '@/pages/Category'
import CategoryEdit from '@/pages/Category_edit.vue'
// import ModifyCategory from '@/pages/category/Modify.vue'

// import Article from '@/pages/article'
// import AddArticle from '@/pages/article/Add.vue'
// import ModifyArticle from '@/pages/article/Modify.vue'

// import User from '@/pages/user'
// import Links from '@/pages/links'
// import AddLinks from '@/pages/links/Add.vue'
// import ModifyLinks from '@/pages/links/Modify.vue'
// import Config from '@/pages/config'
// import AddConfig from '@/pages/config/Add.vue'
// import ModifyConfig from '@/pages/config/Modify.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: Major,
      children: [
        {
          path: '',
          redirect: { name: 'index' }
        },
        {
          path: 'index',
          name: 'index',
          component: Home,
        },
        {
          path: 'category',
          name: 'category',
          component: Category,
          children: [
            {
              path: 'add',
              name: 'categoryEdit',
              component: CategoryEdit
            },
            // {
            //   path: 'modify/:id',
            //   component: ModifyCategory
            // }
          ]
        },
      ]
    },
    {
      path: '/admin/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin/register',
      name: 'register',
      component: Register
    },
  ]
});
// children: [
//   {
//     path: 'category',
//     name: 'category',
//     component: Category,
//     children: [
//       {
//         path: 'add',
//         component: AddCategory
//       },
//       {
//         path: 'modify/:id',
//         component: ModifyCategory
//       }
//     ]
//   },
//   {
//     path: 'article',
//     name: 'article',
//     component: Article,
//     children: [
//       {
//         path: 'add',
//         component: AddArticle
//       },
//       {
//         path: 'modify/:id',
//         component: ModifyArticle
//       }
//     ]
//   },
//   {
//     path: 'comment',
//     name: 'comment',
//     //component  : Comment
//   },
//   {
//     path: 'users',
//     name: 'users',
//     component: User
//   },
//   {
//     path: 'links',
//     name: 'links',
//     component: Links,
//     children: [
//       {
//         path: 'add',
//         component: AddLinks
//       },
//       {
//         path: 'modify/:id',
//         component: ModifyLinks
//       }
//     ]
//   },
//   {
//     path: 'config',
//     name: 'config',
//     component: Config,
//     children: [
//       {
//         path: 'add',
//         component: AddConfig
//       },
//       {
//         path: 'modify/:id',
//         component: ModifyConfig
//       }
//     ]
//   }
// ]

