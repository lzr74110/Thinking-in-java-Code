import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
		path: '/',
		name: 'login',
		component: () => import("./views/Login.vue")
	}, {
		path: '/home',
		name: 'home',
		meta: {
			requiresAuth: true
		},
		component: Home
	}, {
		path: '/license',
		name: 'license',
		component: () => import("./views/license.vue")
	}, {
		path: '/powerLine',
		name: 'powerLine',
		component: () => import("./components/monitor/powerLine.vue")
	}, {
		path: "/device",
		name: "device",
		component: Home,
		meta: {
			requiresAuth: true
		},
		children: [{
			path: "mainDevice",
			name: "mainDevice",
			meta: {
				requiresAuth: true
			},
			component: () => import("./components/device/mainDevice.vue")
		}, {
			path: "farDevice",
			name: "farDevice",
			meta: {
				requiresAuth: true
			},
			component: () => import("./components/device/farDevice.vue")
		}]
	}, {
		path: "/monitor",
		name: "monitor",
		component: Home,
		children: [{
			path: "deviceSelect",
			name: "deviceSelect",
			meta: {
				requiresAuth: true
			},
			component: () => import("./components/monitor/deviceSelect.vue")
		}, {
			path: "oneDevice",
			name: "oneDevice",
			meta: {
				requiresAuth: true
			},
			component: () => import("./components/monitor/oneDevice.vue")
		}, {
			path: 'topo',
			name: 'topo',
			meta: {
				requiresAuth: true
			},
			component: () => import("./components/monitor/topo.vue")
		}, {
			path: "alarm",
			name: "alarm",
			meta: {
				requiresAuth: true
			},
			component: () => import("./components/monitor/alarm.vue")
		}]
	}, {
		path: "/system",
		name: "system",
		component: Home,
		meta: {
			requiresAuth: true
		},
		children: [{
			path: "user",
			name: "user",
			meta: {
				requiresAuth: true
			},
			component: () => import("./views/system/user.vue")
		}, {
			path: "userInfo",
			name: "userInfo",
			meta: {
				requiresAuth: true
			},
			component: () => import("./views/system/userInfo.vue")
		}, {
			path: "menu",
			name: "menu",
			// meta: {
			// 	requiresAuth: true
			// },
			component: () => import("./views/system/menu.vue")
		}, {
			path: "company",
			name: "company",
			meta: {
				requiresAuth: true
			},
			component: () => import("./views/system/company.vue")
		}, {
			path: "role",
			name: "role",
			meta: {
				requiresAuth: true
			},
			component: () => import("./views/system/root.vue")
		}, {
			path: "mysqlBackup",
			name: "mysqlBackup",
			meta: {
				requiresAuth: true
			},
			component: () => import("./views/system/mysqlBackup.vue")
		}, {
			path: "log",
			name: "log",
			meta: {
				requiresAuth: true
			},
			component: () => import("./views/system/log.vue")
		}]
	}, {
		path: '*',
		name: '404',
		component: () => import("./views/404.vue")
	}]
})
