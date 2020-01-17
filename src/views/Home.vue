<template>
	<div id="home">
		<div class="upperTop">
			<div class="logo-title">
			</div>
			<div class="loginOut">
				<span class="iconfont icon-yonghu4"></span><span class="name">{{username}}</span>
				<el-button type="text" class="quitBtn" @click="signOut()"><span class="iconfont icon-dianyuan1"></span></el-button>
			</div>
		</div>
		<div class="main-contents">
			<div class="left" :class="{'foldAble':menuCollapse}">
				<div>
					<div class="systitle">
						<i class="iconfont icon-tianchongxing-"></i>&nbsp;&nbsp;智能光纤管理系统
					</div>
					<el-menu :default-active="activeIndex" router class="menu" @select="handleSelect" unique-opened>
						<div v-for="(item,index) in menulist" :key="index">
							<el-submenu v-if="item.children&&item.children.length>0" :index="item.url" :disabled="item.disabled">
								<template slot="title">
									<i class='iconfont' :class="item.icon"></i>&nbsp;&nbsp;
									<span slot="title">{{item.name}}</span>
								</template>
								<el-menu-item v-for="(one,iindex) in item.children" :key="iindex" :index="one.url" :disabled="one.disabled"><i
									 class="iconfont" :class="one.icon"></i>&nbsp;&nbsp;{{one.name}}</el-menu-item>
							</el-submenu>
							<el-menu-item v-else :index="item.url" :disabled="item.disabled">
								<i class='iconfont' :class="item.icon"></i>&nbsp;&nbsp;
								<span slot="title">{{item.name}}</span>
							</el-menu-item>
						</div>
					</el-menu>
				</div>
				<div class="foldMenu" @click="clickFold"></div>
			</div>
			<div class="right" :class="{'foldAble':menuCollapse}">
				<div class="contant">
					<router-view ref="onePage" class="content"></router-view>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// @ is an alias to /src
	//import navList from "../assets/json/menu.json"
	export default {
		name: "home",
		data() {
			return {
				menuCollapse: false
			};
		},
		computed: {
			username() {
				return this.$store.state.user.username;
			},
			activeIndex() {
				let _this = this;
				var s = this.$route.path;
				let ss = s.split("/");
				// console.log(s);
				// if (s == "/") {
				// 	let child = _this.menulist[0].children;
				// 	s = child.length > 0 ? child[0].url : _this.menulist[0].url;
				// }
				// console.log(s);
				return s;
			},
			menulist() {
				let _this = this;
				return _this.$store.state.menu;
				//return navList;
			}
		},
		created() {},
		mounted() {
			let _this = this;
			// _this.menulist = _this.$store.state.menu;
			// let user = {
			// 	user: {
			// 		username: "fzy2018",
			// 		token: "123131231"
			// 	}
			// }
			// this.$store.commit("changeUser", user);
			// console.log("home")
			//_this.intSocket();
			// setTimeout(() => {
			// 	_this.onDeviceAlarmMessage({
			// 		body: "{did:20}"
			// 	});
			// }, 20000)
		},
		methods: {
			//退出
			async signOut() {
				let _this = this;
				let token = _this.$store.state.user.token;
				let user = {
					user: {
						username: "",
						token: ""
					}
				};
				this.$store.commit("changeUser", user);
				this.$store.commit("changeMenu", []);
				// window.location.reload();
				this.$router.push({
					path: '/'
				})
			},
			//切换导航
			handleSelect(key, keyPath) {
				let _this = this;
				let aaa1 = _this.menulist.find(item => {
					return item.url == keyPath[0];
				});
				let aaa = undefined;
				if (aaa1.children) {
					aaa = aaa1.children.find(item => {
						return item.url == keyPath[1];
					});
				}
				let route = {
					path: key
				};
				if (aaa != undefined && (aaa.children && aaa.children.length > 0)) {
					let param = new Object();
					let b = ["add", "delete", "update"];
					aaa.children.forEach(item => {
						param[b[item.url]] = true;
					});
					route.query = param;
				}
				this.$router.push(route);
				// console.log("切换导航")
				// console.log(route);
			},
			//点击折叠
			clickFold() {
				let _this = this;
				let a = !_this.menuCollapse;
				_this.menuCollapse = a;
				_this.$store.commit("changeMenuCollapse", a);
			}
		}
	};
</script>
<style lang="scss">
	// @import "assets/css/variable";
	@import "assets/css/home";
</style>
