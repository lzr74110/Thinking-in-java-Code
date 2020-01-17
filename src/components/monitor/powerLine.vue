<template>
	<div class="power-line" id="power-line">
		<div v-loading="loading">
			<div class="horn">
				<div class="lt"></div>
				<div class="rt"></div>
				<div class="rb"></div>
				<div class="lb"></div>
			</div>
			<div class="tools">
				<div>
					<el-date-picker size="mini" v-model="search.date" type="daterange" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
					 range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" popper-class="minPop">
					</el-date-picker>
				</div>
				<div>
					<el-button-group class="btnGroup">
						<el-button size="mini" :class="{'activeBtn':activeType}" @click="changeType(true)">15分钟</el-button>
						<el-button size="mini" :class="{'activeBtn':!activeType}" @click="changeType(false)">24小时</el-button>
					</el-button-group>
				</div>
			</div>
			<div id="paintLine"></div>
		</div>
	</div>
</template>

<script>
	import {
		formatter,
		getSomeData
	} from "@/utils/timeUtils.js";
	export default {
		name: "fileLine",
		data() {
			return {
				did: "",
				dname: "",
				sname: "",
				// sid: "",
				chart: "",
				pname: "",
				pid: "",
				search: {
					date: []
				},
				loading: false,
				activeType: true
			}
		},
		created() {
			let url = location.search;
			let param = url.split(/\&|\=|\?/g);
			let _this = this;
			for (let i = 1; i < param.length; i++) {
				_this[param[i]] = decodeURIComponent(param[++i]);
			}
			_this.getRecentLy();
		},
		mounted() {
			let _this = this;
			if (_this.pid) {
				_this.initHighChart();
				_this.getPowerData(_this.activeType)
			}
		},
		methods: {
			changeType(type) {
				let _this = this;
				if (type != _this.activeType) {
					_this.getPowerData(type);
				}
				_this.activeType = type;
			},
			getRecentLy() {
				let _this = this;
				let start = new Date();
				let end = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
				let a = formatter(start);
				let b = formatter(end);
				_this.search.date = [a, b];
			},
			initHighChart() {
				let _this = this;
				let series = [];
				let chart = _this.chart;
				if (chart) {
					chart.destroy();
				}
				let title = _this.dname + "-" + _this.sname + "-" + _this.pname;
				console.log(title);
				// Highcharts.dateFormat={
				// 	Y:function(time){
				// 		let data=new Date(time);
				// 		return date.getFullYear();
				// 	},
				// 	m:function(time){
				// 		let data=new Date(time);
				// 		let m=date.getMonth() + 1;
				// 		return m<10?"0"+m:m;
				// 	},
				// 	d:function(time){
				// 		let data=new Date(time);
				// 		let m=date.getDate();
				// 		return m<10?"0"+m:m;
				// 	},
				// 	H:function(time){
				// 		let data=new Date(time);
				// 		let m=date.getDate();
				// 		return m<10?"0"+m:m;
				// 	},
				// }
				let hchart = Highcharts.chart('paintLine', {
					chart: {
						zoomType: 'x',
						backgroundColor: ' rgba(255,255,255,0.18)',
					},
					credits: {
						enabled: false
					},
					boost: {
						useGPUTranslations: true
					},
					title: {
						text: title,
						style: {
							color: "#000"
						}
					},
					yAxis: {
						title: {
							text: "光功率"
						},
						labels: {
							style: {
								color: "#a2a2a2"
							}
						},
						gridLineColor: "#a2a2a2",
						gridLineDashStyle: "longdash"
					},
					xAxis: {
						// title: {
						// 	text: ""
						// },
						type: 'datetime',
						// dateTimeLabelFormats: {
						// 	millisecond: '%H:%M:%S.%L',
						// 	second: '%H:%M:%S',
						// 	minute: '%H:%M',
						// 	hour: '%H:%M',
						// 	day: '%m-%d',
						// 	week: '%m-%d',
						// 	month: '%Y-%m',
						// 	year: '%Y'
						// },
						labels: {
							// format: '{value: %Y-%m-%d}',
							style: {
								color: "#a2a2a2"
							}
						},
					},
					legend: {
						itemStyle: {
							color: '#919e9e'
						},
						itemHiddenStyle: {
							color: '#333e3e'
						},
						itemHoverStyle: {
							color: '#dcf5f5'
						}
					},
					// subtitle: {
					// 	text: 'Using the Boost module'
					// },
					tooltip: {
						pointFormat: '{series.name}: <b>{point.y}</b><br/>',
						valueDecimals: 2,
						dateTimeLabelFormats: {
							second: '%Y-%m-%d %H:%M:%S',
							minute: '%Y-%m-%d %H:%M',
							hour: '%Y-%m-%d %H:%M',
							day: '%Y-%m-%d',
							week: '%Y-%m-%d',
							month: '%Y-%m',
							year: '%Y'
						}
					},
					series: [{
							name: "平均值",
							lineWidth: 1
						},
						{
							name: "最小值",
							lineWidth: 1
						}, {
							name: "最大值",
							lineWidth: 1
						},
					],
					colors: ['#2f7ed8', '#e69fe1', '#8bbc21',  
						'#f28f43', '#77a1e5', '#c42525', '#a6c96a'
					]
				});
				_this.chart = hchart;
			},
			handleHchartsPaintData(res) {
				let _this = this;
				let endPoint = res.endPoint;
				let data = Array.from({
					length: 3
				}, (v) => {
					return new Array()
				})
				res.list.forEach((item) => {
					let avg = typeof item.avgVal == 'string' ? parseFloat(item.avgVal) : item.avgVal;
					// let time = getSomeData(item.creattime);
					let time = typeof item.createtime == 'string' ? parseInt(item.createtime) : item.createtime;
					let maxVal = typeof item.maxVal == 'string' ? parseFloat(item.maxVal) : item.maxVal;
					// let time = getSomeData(item.creattime);
					let maxTime = typeof item.maxTime == 'string' ? parseInt(item.maxTime) : item.maxTime;
					let minVal = typeof item.minVal == 'string' ? parseFloat(item.minVal) : item.minVal;
					// let time = getSomeData(item.creattime);
					let minTime = typeof item.minTime == 'string' ? parseInt(item.minTime) : item.minTime;
					data[0].push([time, avg]);
					data[1].push([maxTime, maxVal]);
					data[2].push([minTime, minVal]);
				})
				console.log(data);
				let chart = _this.chart;
				data.forEach((item, index) => {
					chart.series[index].setData(item);
				})
				//chart.series[0].setData(data[0]);
				_this.loading = false;
			},
			async getPowerData(type) {
				let _this = this;
				_this.loading = true;
				let date = ["", ""];
				let a = ["00:00:00", "23:59:59"]
				if (_this.search.date != null) {
					_this.search.date.forEach((item, index) => {
						if (item != "") {
							date[index] = item + " " + a[index];
						}
					})
				}
				let flag = type ? 1 : 2;
				let eqStr = {
					flag: flag,
					spid: _this.pid
				}
				let sort = "createtime ASC";
				let param = {
					eqStr: JSON.stringify(eqStr),
					starttime: date[0],
					endtime: date[1],
					pageSize: 10000000,
					currentPage: 1,
					sort: sort,
					entity: 'GIntervalsRecord'
				}
				let res = await _this.$api.postRequest(param, 'getPowerList');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					if (res) {
						_this.handleHchartsPaintData(res);
					}
				}
			},
		}
	}
</script>

<style>
	.power-line {
		width: 100%;
		height: 100%;
		background: url(/img/bg-main.png);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.power-line>div {
		width: 1000px;
		height: 600px;
		position: relative;
		background: aliceblue;
		box-shadow: 0 0 15px #c6d8dc;
	}

	.power-line #paintLine {
		width: 100%;
		height: calc(100% - 45px);
	}

	#power-line .tools {
		margin-top: 10px;
		width: calc(100% - 20px);
		padding: 0 10px;
	}
</style>
