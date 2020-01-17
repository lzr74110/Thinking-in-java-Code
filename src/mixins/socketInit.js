import SockJS from "sockjs-client";
import Stomp from "stompjs";
export default {
	data() {
		return {
			socket: "",
			stomp: "",
			topic:"/topic"
		}
	},
	beforeDestroy() {
		this.disconnect();
	},
	methods: {
		//socket链接
		intSocket() {
			let _this = this;
			let headers = {
				'Authorization': _this.token
			}
			this.socket = new SockJS("/my-websocket");
			this.stomp = Stomp.over(this.socket);
			this.stomp.connect(headers, this.stompConnected, this.onStompError)
		},
		//连接服务器
		stompConnected(fram) {
			console.log("flicker Connected" + fram)
			// this.stomp.subscribe("/topic/warningnum", this.onStompNumMessage);
		},
		//错误信息
		onStompError(frame) {
			console.log('Failed: ' + frame);
		},
		//断开连接
		disconnect() {
			let _this = this;
			if (_this.stomp) {
				_this.stomp.disconnect();
			}
		}
	}
}
