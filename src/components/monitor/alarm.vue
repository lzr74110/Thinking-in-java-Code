<template>
	<div id="alarm" class="oneMain">
		<div class="tools">
			<div class="searchAuto">
				<el-form class="autoOverForm" :inline="true" :model="search" size="mini" label-width="80px" label-position="left">
					<el-form-item label="日期">
						<el-date-picker size="mini" v-model="search.date" type="daterange" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
						 range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" popper-class="minPop" @change="refreshTable"
						 :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<div v-if="params.disvis" class="alarm-some">
						<el-form-item label="设备名称">
							<el-select class="short-select" v-model="search.did" clearable @change="getpassList">
								<el-option v-for="(item,index) in deviceList" :key="index" :label="item.name" :value="index"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="合分波板">
							<el-select class="short-select" v-model="search.sid" clearable @change="getaisleList">
								<el-option v-for="(item,index) in passList" :key="index" :label="item.slaveName" :value="item.sid"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="通道">
							<el-select class="short-select" v-model="search.spid" clearable>
								<el-option v-for="(item,index) in aisleList" :key="index" :label="item.pname" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="类别">
							<el-select class="short-select" v-model="search.type" clearable>
								<el-option v-for="item in typeList" :key="item.value" :value="item.value" :label="item.name"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<el-form-item>
						<el-button size="mini" icon="el-icon-search" class="searchBtn" v-on:click="refreshTable()"></el-button>
					</el-form-item>
					<el-form-item>
						<el-button size="mini" class="optBtn" @click="download">下载</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div>
				<el-button icon="el-icon-refresh" size="small" class="btn refBtn btnRight" @click="refreshTable"></el-button>
			</div>
		</div>
		<div class="tableContent">
			<el-table ref="table" height="679" :data="tableData" tooltip-effect="light" size="small" class="table" v-loading="loading"
			 :row-key="getRowKey">
				<el-table-column type="selection" width="50" :resizable="false" key="select000" :reserve-selection="true"></el-table-column>
				<el-table-column v-for="(item,key) in tableCloumn" :prop="item.prop" :key="key" :resizable="false" :label="item.label"
				 :min-width="item.width" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						{{getDisplay(scope)}}
					</template>
				</el-table-column>
			</el-table>
			<el-row class="page">
				<el-pagination @current-change="changePage" :current-page.sync="currentPage" :page-size.sync="pageSize" layout="prev, pager, next,jumper,->,total"
				 :total="total"></el-pagination>
			</el-row>
		</div>
	</div>
</template>

<script>
	import tablePublic from "@/mixins/tablePublic";
	import {
		getSomeData,
		getSomeDay
	} from "@/utils/timeUtils.js";
	/*
	 * 日志
	 * */
	export default {
		name: "log",
		mixins: [tablePublic],
		props: {
			params: {
				type: Object,
				default: () => {
					return {
						disvis: true
					}
				}
			},
			alarmVisible: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				activeBtn: "",
				tableUrl: "getAlarmList",
				entity: "Alarm",
				deviceList: [],
				aisleList: [],
				passList: [],
				sid: "",
				search: {
					did: "",
					sid: "",
					spid: "",
					date: [],
					type: ""
				},
				tableCloumn: [{
						prop: "dname",
						label: "设备名称",
						width: "100"
					},
					{
						prop: "sname",
						label: "合分拨板",
						width: "100"
					},
					{
						prop: "spname",
						label: "通道",
						width: "100"
					}, {
						prop: "type",
						label: "类型",
						width: "100"
					}, {
						prop: "msg",
						label: "详情",
						width: "200"
					},
					{
						prop: "createtime",
						label: "事件发生时间",
						width: "200"
					}
				],
				typeList: [{
					name: "光功率异常",
					value: "1"
				}, {
					name: "电压异常",
					value: "2"
				}, {
					name: "设备状态变化",
					value: "3"
				},{
					name: "联通告警",
					value: "4"
				}],
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				}
			};
		},
		watch: {
			alarmVisible() {
				let _this = this;
				if (!_this.params.disvis) {
					console.log(_this.params);
					if (_this.alarmVisible) {
						_this.refreshTable();
					}
				}
			}
		},
		created() {
			let _this = this;
			console.log("报警历史");
			// _this.getDeviceInfo();
			if (_this.params.disvis) {
				_this.getDevicelist();
			}
			// _this.getAlarmlist();
		},
		mounted() {
			let _this = this;
		},
		methods: {
			// 下载导出
			async download() {
				let _this = this;
				let param = _this.handleTableParam();
				let res = await _this.$api.downloadPost(param, "callPolice");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					let url = window.URL.createObjectURL(new Blob([res.data]), {
						type: "application/octet-stream"
					});
					let name;
					if (res.fileName) {
						name = res.fileName;
					} else {
						name = "报表日志.xls"
					}
					let link = document.createElement("a");
					link.style.display = "none";
					link.href = url;
					link.setAttribute("download", name);
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}

			},
			//   根据权限获取device信息
			async getDevicelist() {
				let _this = this;
				let param = {
					currentPage: _this.currentPage,
					endtime: "",
					entity: "",
					eqStr: "",
					inStr: "",
					mapStr: "",
					orStr: "",
					pageSize: this.pageSize,
					sort: "",
					startime: ""
				};
				let res = await _this.$api.postRequest(param, "getDeviceList");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.deviceList = res.list;
					console.log(_this.deviceList);
					// _this.refreshTable();
				}
			},
			// 获取通道信息
			async getaisleList(sid) {
				let _this = this;
				let res = await _this.$api.getRequest(null, "getDeviceListInfo", sid);
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					let data = res;
					data.forEach(item => {
						let num = item.num;
						if (num > 18) {
							num = num - 18;
							item.pname = "L" + num;
						} else {
							item.pname = num;
						}
					});
					_this.aisleList = data;
				}
			},
			// 获取合分波板
			getpassList(val) {
				let _this = this;
				if (typeof exp != undefined) {
					let newlist = new Array();
					_this.deviceList[val].slave.forEach(item => {
						if (item.status == 1) {
							newlist.push(item);
						}
					});
					_this.passList = newlist;
				} else {
					_this.search.sid = "";
					_this.passList = [];
				}
			},
			getDisplay(scope) {
				let _this = this;
				let s = scope.column.property;
				let res = scope.row[s];
				s = s.toLowerCase();
				if (s == "createtime") {
					res = getSomeData(res);
				} else if (s == "did") {
					// res = _this.nameMap[res];
				} else if (s == "pid") {
					// res = _this.nameMap[scope.row.did + "-" + res];
				} else if (s == "type") {
					if (res) {
						let typeIndex = _this.typeList.find(item => {
							return item.value == res;
						});
						res = typeIndex.name;
					}
				} else if (s == "level") {
					if (res) {
						// let ss = 0;
						// if (res == 4 || res == 1) {
						// 	ss = 0;
						// } else {
						// 	ss = 1;
						// }
						// res = _this.levelList[ss].name;
						res = _this.levelList[res - 1].name;
					}
				}else if(s=="spname"){
					if(res==19){
						res="L1";
					}else if(res==20){
						res="L2";
					}
				}
				return res;
			},
			handleTableParam() {
				let _this = this;
				let date = ["", ""];
				let a = ["00:00:00", "23:59:59"];
				let inStr = new Object();
				if (_this.search.date != null) {
					_this.search.date.forEach((item, index) => {
						if (item != "") {
							date[index] = item + " " + a[index];
						}
					});
				}
				let eqStr = new Object();
				if (_this.params.disvis) {
					if (_this.search.did == null || _this.search.did === "") {
						let device = [];
						_this.deviceList.forEach(item => {
							device.push(item.id);
						});
						inStr.did = device;
					}
					let search = _this.search;
					if (search.did) {
						eqStr.did = _this.deviceList[search.did].id;
					}
					if (search.sid) {
						eqStr.sid = search.sid;
					}
					if (search.spid) {
						eqStr.spid = search.spid;
					}
					if (search.type) {
						eqStr.type = search.type;
					}
				} else {
					eqStr = _this.params.eqStr;
				}
				let entity = "Alarm";
				let sort = "createtime DESC";
				let param = {
					pageSize: _this.pageSize,
					currentPage: _this.currentPage,
					// inStr: JSON.stringify(inStr),
					entity: entity,
					eqStr: JSON.stringify(eqStr),
					sort: sort,
					// orStr: JSON.stringify(orStr),
					startime: date[0],
					endtime: date[1]
				};

				return param;
			},
			//待确认告警处理
			sureAlarm(row) {
				let _this = this;
				let param = {
					id: row.id,
					sure: 1
				};
				_this.updateStatus(param, row, 0);
			},
			// //待消除告警处理
			clearAlarm(row) {
				let _this = this;
				_this
					.$confirm("确认该事件是否已处理?", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let param = {
							id: row.id,
							clear: 1,
							endtime: new Date()
						};
						_this.updateStatus(param, row, 1);
					})
					.catch(() => {
						// _this.$message({
						// 	type: 'info',
						// 	message: '已取消消除告警'
						// });
					});
			},
			async updateStatus(param, row, type) {
				let _this = this;
				let url = "updateAlarm";
				let res = await _this.$api.putRequest(param, url);
				if (res == null || res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					let title = type == 0 ? "告警已确认" : "告警已消除";
					if (type == 1 && (row.type == 4 || row.type == 5)) {
						let param = {
							deviceAlarmList: row.did
						};
						_this.$store.commit("deleteAlarmList", param);
					}
					if (type == 0) {
						row.sure = 1;
					} else {
						row.clear = 1;
					}
					_this.refreshTable();
				}
			},
			getRowKey(row) {
				return row.id;
			},
			lookFignerLine(row) {
				let _this = this;
				window.open(
					"/detailsLine?fid=" + row.fid + "&pid=" + row.pid + "&did=" + row.did
				);
			}
		}
	};
</script>

<style lang="scss">
	.alarm-some {
		display: inline-flex;
	}
</style>
