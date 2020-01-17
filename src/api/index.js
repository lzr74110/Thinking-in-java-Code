import axios from './axios'

let instance = axios()
export default {
	get(url, params, headers, responseType) {
		let options = {}
		if (params) {
			options.params = params
		}
		if (headers) {
			options.headers = headers
		}
		if (responseType) {
			options.responseType = responseType;
		}
		// console.log("~~~~~~~~~~~~~~~~")
		// console.log(options);
		return instance.get(url, options)
	},
	post(url, params, headers, responseType, timeout) {
		let options = {}
		if (headers) {
			options.headers = headers
		}
		if (responseType) {
			options.responseType = responseType;
		}
		if (timeout) {
			options.timeout = timeout;
		}
		return instance.post(url, params, options)
	},
	put(url, params, headers) {
		let options = {}
		if (headers) {
			options.headers = headers
		}
		return instance.put(url, params, options)
	},
	delete(url, params, headers) {
		let options = {}
		if (params) {
			options.data = params
		}
		if (headers) {
			options.headers = headers
		}
		return instance.delete(url, options)
	}
}