import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
//要设置的全局访问的state对象
const initPageState = () => {
	let s = {
		user: {
			username: "",
			token: "",
			remind: ""
		},
	}
	return s;
};
const store = new Vuex.Store({
	//严格模式
	strict: process.env.NODE_ENV !== "production",
	//   modules: {
	//     user
	//   },
	//状态
	state: {
		user: JSON.parse(localStorage.getItem("user")) || {},
		menu: undefined,
		menuCollapse: false,
		status: 0,
		activeDid: sessionStorage.getItem("activeDid")||"",
		deviceAlarmList: JSON.parse(localStorage.getItem("deviceAlarmList")) || [],
	},
	//更改 Vuex 的 store 中的状态
	mutations: {
		changeUser(state, pageState) {
			if (pageState.user.username == "") {
				localStorage.removeItem('user');
				// localStorage.removeItem('remindList');
				// localStorage.removeItem('resolveNum');
				state.remindList = [];
				state.resolveNum = 0;
			} else {
				localStorage.setItem('user', JSON.stringify(pageState.user));
			}
			for (const prop in pageState) {
				state[prop] = pageState[prop];
			}
		},
		changeMenu(state, menu) {
			state.menu = menu;
		},
		changeMenuCollapse(state, menuCollapse) {
			state.menuCollapse = menuCollapse;
		},
		changeAlarmList(state, pageState) {
			// localStorage.setItem('remindList', JSON.stringify(remindList));
			for (let prop in pageState) {
				state[prop] = pageState[prop];
				localStorage.setItem(prop, JSON.stringify(pageState[prop]));
			}
		},
		addAlarmList(state, newState) {
			for (let prop in newState) {
				state[prop].push(newState[prop]);
				localStorage.setItem(prop, JSON.stringify(state[prop]));
			}
		},
		deleteOneAlarmList(state, newState) {
			for (let prop in newState) {
				state[prop].splice(newState[prop], 1);
				localStorage.setItem(prop, JSON.stringify(state[prop]));
			}
		},
		deleteAlarmList(state, newState) {
			console.log("删除")
			for (let prop in newState) {
				let one = state[prop];
				let did = newState[prop];
				for (let i = 0; i < one.length; i++) {
					if (one[i].did == did.did && (one[i].type != 5 || (one[i].type == 5 && one[i].status == did.status))) {
						one.splice(i, 1);
						i--;
					}
				}
				localStorage.setItem(prop, JSON.stringify(one));
			}
		},
		deleteOneDeviceAlarm(state, did) {
			console.log("删除")
			let alarm = state.deviceAlarmList;
			for (let i = 0; i < alarm.length; i++) {
				if (alarm[i].did == did) {
					alarm.splice(i, 1);
					i--;
				}
			}
			localStorage.setItem("deviceAlarmList", JSON.stringify(alarm));
		},
		changeDid(state, did) {
			state.activeDid = did;
			if(did){
				sessionStorage.setItem("activeDid",did)
			}else{
				sessionStorage.removeItem("activeDid");
			}
			
		}
	},
	actions: {}
});

export default store;
