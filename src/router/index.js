import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
const Home = () => import('@/components/Home')
const Welcome = () => import('@/components/Welcome')
const Users = () => import('@/components/user/Users')
const Roles = () => import('@/components/power/Roles')
const Rights = () => import('@/components/power/Rights')
const Cate = () => import('@/components/goods/Cate')
const Params = () => import('@/components/goods/Params')
const GoodsList = () =>import('@/components/goods/List')
const Add = () =>import('@/components/goods/Add')
const Order = () =>import('@/components/order/Order')
const Report = () =>import('@/components/report/Report')

Vue.use(VueRouter)

const routes = [
	{
		path:'/',
		redirect:'/login'
	},
	{
		path:'/login',component: Login
	},
	{
		path:'/home',component: Home, redirect:'/welcome',
		children:[
			{path:'/welcome',component:Welcome},
			{path:'/users',component:Users},
			{path:'/roles',component:Roles},
			{path:'/rights',component:Rights},
			{path:'/categories',component:Cate},
			{path:'/params',component:Params},
			{path:'/goods',component:GoodsList},
			{path:'/goods/add',component:Add},
			{path:'/orders',component:Order},
			{path:'/reports',component:Report}
		]
	}
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
	if(to.path === '/login') return next()
	const tokenStr = window.sessionStorage.getItem('token')
	if(!tokenStr) return next('/login')
	next()
})

export default router
