/*
 *el-date
 */
import {
		formatter,
		formatterDay
	} from "../assets/js/timeUtils.js";
export const dateOptions = {
	data(){
		return {
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
				shortcuts: [{
					text: "最近一周",
					onClick(picker) {
						let start = new Date();
						let end = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						console.log([start, end])
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: "最近一月",
					onClick(picker) {
						let start = new Date();
						let end = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: "最近三月",
					onClick(picker) {
						let start = new Date();
						let end = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}],
			}
		}
	},
	methods:{
		//获取最近一周的时间
		getRecentLyDay() {
			let _this = this;
			let start = new Date();
			let end = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
			let a = formatterDay(start);
			let b = formatterDay(end);
			return [a, b];
		},
		getRecentLyDate() {
			let _this = this;
			let start = new Date();
			let end = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
			let a = formatter(start);
			let b = formatter(end);
			return [a, b];
		},
		getFormatterTime(){
			
		}
	}
}
