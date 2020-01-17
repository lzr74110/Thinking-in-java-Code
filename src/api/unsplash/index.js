import api from '../index'
import urls from './url'
import store from '../../store/index'
// import { formatUrl } from '../../common/utils'
// 这个东西是unsplash要求加在header里的验证，有兴趣的同学可以去看他的api，此处不再赘述
// const header = {
//   'Authorization': 'Client-ID xxxxxxx'
// }
const state=store.state;
export default {
	doLogin(params) {
		return api.post(urls.login, params, {
			timeout: 3000
		})
	},
	getRequest(params, url, urlParam) {
		let header = {
			'Authorization': state.user.token,
		}
		let uurl = urls[url];
		if (urlParam) {
			if(typeof urlParam=='object'){
				urlParam.forEach(item=>{
					uurl = uurl + "/" + item;
				})
			}else{
				uurl = uurl + "/" + urlParam;
			}
			return api.get(uurl, params, header);
		} else {
			return api.get(uurl, params, header);
		}
	},
	postRequest(params, url, urlParam) {
		let header = {
			'Authorization': state.user.token,
		}
		let uurl = urls[url];
		if (urlParam) {
			if(typeof urlParam=='object'){
				urlParam.forEach(item=>{
					uurl = uurl + "/" + item;
				})
			}else{
				uurl = uurl + "/" + urlParam;
			}
			return api.post(uurl, params, header);
		} else {
			return api.post(uurl, params, header);
		}

	},
	deleteRequest(params, url, urlParam) {
		let header = {
			'Authorization': state.user.token,
		}
		let uurl = urls[url];
		if (urlParam) {
			if(typeof urlParam=='object'){
				urlParam.forEach(item=>{
					uurl = uurl + "/" + item;
				})
			}else{
				uurl = uurl + "/" + urlParam;
			}
			return api.delete(uurl, params, header);
		} else {
			return api.delete(uurl, params, header);
		}

	},
	putRequest(params, url, urlParam) {
		let header = {
			'Authorization': state.user.token,
		}
		// console.log("的沙发斯蒂芬")
		let uurl = urls[url];
		if (urlParam) {
			if(typeof urlParam=='object'){
				urlParam.forEach(item=>{
					uurl = uurl + "/" + item;
				})
			}else{
				uurl = uurl + "/" + urlParam;
			}
			return api.put(uurl, params, header);
		} else {
			return api.put(uurl, params, header);
		}

	},
	uploadPost(param,url, urlParam){
		let header = {
			'Authorization': state.user.token,
		}
		let uurl = urls[url];
		if (urlParam) {
			if(typeof urlParam=='object'){
				urlParam.forEach(item=>{
					uurl = uurl + "/" + item;
				})
			}else{
				uurl = uurl + "/" + urlParam;
			}
			return api.post(uurl, param, header, "blob");
		} else {
			return api.post(uurl, param, header, "blob");
		}
	},
	downloadGet(param, url, urlParam) {
		let header = {
			'Authorization': state.user.token,
			'Content-Type':"multipart/form-data"
		}
		let uurl = urls[url];
		if (urlParam) {
			if(typeof urlParam=='object'){
				urlParam.forEach(item=>{
					uurl = uurl + "/" + item;
				})
			}else{
				uurl = uurl + "/" + urlParam;
			}
			return api.get(uurl, param, header, "blob");
		} else {
			return api.get(uurl, param, header, "blob");
		}
	},
	downloadPost(param, url, urlParam) {
		let header = {
			'Authorization': state.user.token,
		}
		let uurl = urls[url];
		if (urlParam) {
			if(typeof urlParam=='object'){
				urlParam.forEach(item=>{
					uurl = uurl + "/" + item;
				})
			}else{
				uurl = uurl + "/" + urlParam;
			}
			return api.post(uurl, param, header, "blob");
		} else {
			return api.post(uurl, param, header, "blob");
		}
	},
}
