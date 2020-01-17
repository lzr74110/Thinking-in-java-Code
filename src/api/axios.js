import axios from 'axios'
import qs from 'qs'
//import browser from '../common/browser'
// 创建 axios 实例
let http = axios.create({
	//headers: {'withCredentials':true},
	timeout: 600000
})

// 设置 post、put 默认 Content-Type
http.defaults.headers.post['Content-Type'] = 'application/json'
http.defaults.headers.put['Content-Type'] = 'application/json'
http.defaults.headers.delete['Content-Type'] = 'application/json'
// 添加请求拦截器
http.interceptors.request.use(config => {
	if (config.method === 'post' || config.method === 'put') {
		// post、put 提交时，将对象转换为string, 为处理Java后台解析问题
		//config.data = JSON.stringify(config.data)
		//	config.data = qs.stringify(config.data)

		// if (config.headers['Content-Type'] != "multipart/form-data") {
		// 	config.data = qs.stringify(config.data)
		// }
	} else if (config.method === 'get') { //&& browser.isIE
		// 给GET 请求后追加时间戳， 解决IE GET 请求缓存问题
		// let symbol = config.url.indexOf('?') >= 0 ? '&' : '?'
		// config.url += symbol
		//+ '_=' + Date.now()
	} else if (config.method === 'delete') {
		config.headers['Content-Type'] = 'application/json';
		// console.log(config.headers['Content-Type'])
	}
	// 请求发送前进行处理
	// console.log(config);
	return config;
}, error => {
	// 请求错误处理
	return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use(response => {
	// console.log("^^^^^^^^^^^^^^");
	// console.log("response");
	// console.log(response);
	let {
		data
	} = response; //eval("("+response.bodyText+")");
	if (data && (data.code == 0 || data.code == 200)) {
		if (data.data || data.data == 0) {
			return data.data;
		} else {
			return "success"
		}
	}else if(data==null){
		data="success"
	}
	if (response.request.responseType == "blob") {
		return {
			data: data,
			fileName: response.headers['content-disposition']
		}
	}
	return data
}, error => {
	if (error && error.response) {
		var info = {}
		var {
			status,
			statusText,
			data
		} = error.response
		if (data.msg) {
			return data;
		}
		switch (error.response.status) {
			case 400:
				statusText = '错误请求'
				break;
			case 401:
				statusText = '用户名或密码错误'
				break;
			case 403:
				statusText = '拒绝访问'
				break;
			case 404:
				statusText = '请求错误,未找到该资源'
				break;
			case 405:
				statusText = '请求方法未允许'
				break;
			case 408:
				statusText = '请求超时'
				break;
			case 500:
				statusText = '服务器端出错'
				break;
			case 501:
				statusText = '网络未实现'
				break;
			case 502:
				statusText = '网络错误'
				break;
			case 503:
				statusText = '服务不可用'
				break;
			case 504:
				statusText = '网络超时'
				break;
			case 505:
				statusText = 'http版本不支持该请求'
				break;
			default:
				statusText = `连接错误${error.response.status}`
		}
		info = {
			code: status,
			data: data,
			msg: statusText
		}
	} else {
		info = {
			code: 5000,
			msg: '连接到服务器失败'
		}
	}
	// 	console.log("@@@@@@@@@@@");
	// console.log(info);
	//	return Promise.reject(info)
	return info;
})

/**
 * 创建统一封装过的 axios 实例
 * @return {AxiosInstance}
 */
export default function () {
	return http
}