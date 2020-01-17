import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store/index"
import api from './api/install'
import aplist from "./api/apilist"
import './plugins/element.js'
import axios from 'axios'
Vue.prototype.axios = axios
Vue.use(api);
Vue.config.productionTip = false;
async function remoteMenu(path, next) {
	let user = store.state.user;
	let res = await aplist.getRequest(null, 'getSomeMenu');
	if (res.code) {
		next({
			path: '/',
			// query: {}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
		});
	} else {
		let data = res;
		store.commit("changeMenu", data);
		if (path == "/home") {
			let a
			let ss1 = res.find(item => {
				return item.id == 3;
			})
			if (ss1) {
				a = ss1.children[0].url || ss1.url;
			} else {
				a = data[0].children[0].url || data[0].url;
			}
			//console.log(router.resolve({name:"realTime"}).route.matched.length)
			//router.push({path:a});
			next({
				path: a
			});
		} else {
			next({
				path: path
			});
		}
	}
}

function exitRoot(matched) {
	let pathList = store.state.menu;
	let fa = matched[0].path;
	let title = "0";
	let res = pathList.find(item => {
		if (item.url == fa) {
			if (matched.length > 1 && item.children) {
				let usefulPath = matched[1].path;
				let ca = item.children.find(one => {
					return one.url == usefulPath;
				})
				let aa = ca != undefined
				if (aa) {
					title = ca.name;
				}
				return aa;
			} else {
				title = item.name;
				return true;
			}
		}
		return false;
	})

	return title;
}
//全局拦截，守卫导航
router.beforeEach((to, from, next) => {
	// console.log(to);
	if (to.meta.requiresAuth) { // 判断该路由是否需要登录权限  to.matched.some(record => record.meta.requiresAuth)
		// console.log("ddddd")
		// console.log(store.state);
		let sss = localStorage.getItem("user");
		let user = store.state.user;
		if (sss != null && user && user.username) { // global_.config.getCookie("token") 通过vuex state获取当前的token是否存在
			// console.log("next");
			// console.log("菜单");
			let menu = store.state.menu;
			//console.log(menu);
			if (menu == undefined || menu.length <= 0 || to.fullPath == '/home') {
				remoteMenu(to.path, next);
			} else {
				let match = to.matched;
				// if(to.path=="/historyDisplay"){
				// 	match=new Array();
				// 	match[0]={path:"/envHealth"};
				// 	match[1]={path:"/envHealth/realTime"};
				// }else if(to.path=="/realTimeDisplay"){
				// 	match=new Array();
				// 	match[0]={path:"/envHealth"};
				// 	match[1]={path:"/envHealth/history"};
				// }
				let title = exitRoot(match);
				if (title != '0') {
					// console.log(title);
					// console.log(document.title);
					document.title = title;
					// console.log(document.title);
					next();
				} else {
					next({
						path: '/'
					})
				}
			}
			next();
		} else {
			//	console.log("login");
			next({
				path: '/',
				// query: {}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
		//next();
	} else {
		next();
	}
})
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')