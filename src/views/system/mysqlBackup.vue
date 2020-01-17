<template>
	<div id="databaseBackup">
		<div class="one-part">
			<div class="title-part">
				<div>
					自动备份--{{cornInfo}}
				</div>
			</div>
			<div class="content-part" v-loading="cornAble">
				<el-form :model="time" :rules="timerules" ref="time" size="small">
					<el-tabs value="minute">
						<el-tab-pane name="minute">
							<span slot="label">&nbsp;&nbsp;&nbsp;&nbsp;分&nbsp;&nbsp;&nbsp;&nbsp;</span>
							<el-form-item prop="minute">
								<div class="onecheck">
									<!-- <el-checkbox-group v-model="time.minute" v-on:change="changetimestate('minute')" :max="2"
				                                    :min="1">
				                                    <el-checkbox :label="0" class="outcheck">
				                                        <div>每分钟&nbsp;&nbsp;</div>
				                                    </el-checkbox>
				                                    <div class="split"></div>
				                                    <el-checkbox :label="1" class="outcheck">&nbsp;
				                                    </el-checkbox>
				                                    <div class="split"></div>
				                                    <el-checkbox :label="2" class="outcheck">
				                                        <div style="height:300px;"> 指定某分</div>
				                                    </el-checkbox>
				                                </el-checkbox-group> -->
									<el-radio-group v-model="time.minute">
										<el-radio :label="0" class="outcheck">
											<div>每分钟&nbsp;&nbsp;</div>
										</el-radio>
										<div class="split"></div>
										<el-radio :label="1" class="outcheck">&nbsp;
										</el-radio>
										<div class="split"></div>
										<el-radio :label="2" class="outcheck">
											<div style="height:230px;"> 指定某分</div>
										</el-radio>
									</el-radio-group>
								</div>
							</el-form-item>
							<div style="height: 0px;">
								<div class="oneother" style="top:-285px;" v-on:click="changetimeselect('minute')">
									从&nbsp; <el-input-number v-model="minute[1].low" controls-position="right" :min="0" :max="58" class="iptnum"
									 size="mini" v-on:change="changetimeselect('minute')"></el-input-number>&nbsp;分&nbsp;—&nbsp;<el-input-number
									 v-model="minute[1].high" controls-position="right" :min="0" :max="59" class="iptnum" size="mini" v-on:change="changetimeselect('minute')"></el-input-number>&nbsp;分，每隔&nbsp;<el-input-number
									 v-model="minute[1].interval" controls-position="right" :min="0" :max="minute[1].high&lt;minute[1].low?13-minute[1].low+minute[1].high:minute[1].high-minute[1].low"
									 class="iptnum" size="mini" v-on:change="changetimeselect('minute')"></el-input-number>&nbsp;分钟
								</div>
								<div class="twoother" style="top:-250px;">
									<el-checkbox :indeterminate="minute[2].indeterminate" v-on:change="selectAll('minute',60)" v-model="minute[2].all">全选</el-checkbox>
									<div class="detil">
										<el-checkbox-group v-model="minute[2].value" v-on:change="checksome('minute',60)">
											<li v-for="out in 10" :key="out">
												<el-checkbox v-for="item in 6" :label="(out-1)*6+item-1" :key="item">{{(out-1)*6+item-1}}<span v-show="(out-1)*6+item-1&lt;10">&nbsp;&nbsp;</span></el-checkbox>
											</li>
										</el-checkbox-group>
									</div>
								</div>
							</div>
						</el-tab-pane>
						<el-tab-pane name="hour">
							<span slot="label">&nbsp;&nbsp;&nbsp;&nbsp;时&nbsp;&nbsp;&nbsp;&nbsp;</span>
							<el-form-item prop="hour">
								<div class="onecheck">
									<!-- <el-checkbox-group v-model="time.hour" v-on:change="changetimestate('hour')"
				                                            :max="2" :min="1">
				                                            <el-checkbox :label="0" class="outcheck">
				                                                <div>每小时&nbsp;&nbsp;</div>
				                                            </el-checkbox>
				                                            <div class="split"></div>
				                                            <el-checkbox :label="1" class="outcheck"> &nbsp;</el-checkbox>
				                                            <div class="split"></div>
				                                            <el-checkbox :label="2" class="outcheck">
				                                                <div style="height:150px;"> 指定某时</div>
				                                            </el-checkbox>
				                                        </el-checkbox-group> -->
									<el-radio-group v-model="time.hour">
										<el-radio :label="0" class="outcheck">
											<div>每小时&nbsp;&nbsp;</div>
										</el-radio>
										<div class="split"></div>
										<el-radio :label="1" class="outcheck"> &nbsp;</el-radio>
										<div class="split"></div>
										<el-radio :label="2" class="outcheck">
											<div style="height:110px;"> 指定某时</div>
										</el-radio>
									</el-radio-group>
								</div>
							</el-form-item>
							<div style="height: 0px;">
								<div class="oneother" style="top:-165px;" v-on:click="changetimeselect('hour')">
									从&nbsp;<el-input-number v-model="hour[1].low" controls-position="right" :min="0" :max="22" class="iptnum" size="mini"
									 v-on:change="changetimeselect('hour')"></el-input-number>&nbsp;时&nbsp;—&nbsp;<el-input-number v-model="hour[1].high"
									 controls-position="right" :min="0" :max="23" class="iptnum" size="mini" v-on:change="changetimeselect('hour')"></el-input-number>&nbsp;时，每隔&nbsp;<el-input-number
									 v-model="hour[1].interval" controls-position="right" :min="0" :max="hour[1].high&lt;hour[1].low?13-hour[1].low+hour[1].high:hour[1].high-hour[1].low"
									 class="iptnum" size="mini" v-on:change="changetimeselect('hour')"></el-input-number>&nbsp;小时
								</div>
								<div class="twoother" style="top:-140px;">
									<el-checkbox :indeterminate="hour[2].indeterminate" v-on:change="selectAll('hour',24)" v-model="hour[2].all">全选</el-checkbox>
									<div class="detil">
										<el-checkbox-group v-model="hour[2].value" v-on:change="checksome('hour',24)">
											<li v-for="out in 4" :key="out">
												<el-checkbox v-for="item in 6" :label="(out-1)*6+item-1" :key="item">{{(out-1)*6+item-1}}<span v-show="(out-1)*6+item-1&lt;10">&nbsp;&nbsp;</span></el-checkbox>
											</li>
										</el-checkbox-group>
									</div>
								</div>
							</div>
						</el-tab-pane>
						<el-tab-pane name="day">
							<span slot="label">&nbsp;&nbsp;&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;</span>
							<el-form-item prop="day">
								<div class="onecheck">
									<!-- <el-checkbox-group v-model="time.day" v-on:change="changetimestate('day')"
				                                            :max="2" :min="1">
				                                            <el-checkbox :label="0" class="outcheck">
				                                                <div>每天&nbsp;&nbsp;</div>
				                                            </el-checkbox>
				                                            <div class="split"></div>
				                                            <el-checkbox :label="1" class="outcheck"> &nbsp;</el-checkbox>
				                                            <div class="split"></div>
				                                            <el-checkbox :label="2" class="outcheck">
				                                                <div style="height:200px;"> 指定某天</div>
				                                            </el-checkbox>
				                                        </el-checkbox-group> -->
									<el-radio-group v-model="time.day">
										<el-radio :label="0" class="outcheck">
											<div>每天&nbsp;&nbsp;</div>
										</el-radio>
										<div class="split"></div>
										<el-radio :label="1" class="outcheck"> &nbsp;</el-radio>
										<div class="split"></div>
										<el-radio :label="2" class="outcheck">
											<div style="height:150px;"> 指定某天</div>
										</el-radio>
									</el-radio-group>
								</div>
							</el-form-item>
							<div style="height: 0px;">
								<div class="oneother" style="top:-205px;" v-on:click="changetimeselect('day')">
									从&nbsp;<el-input-number v-model="day[1].low" controls-position="right" :min="1" :max="30" class="iptnum" size="mini"
									 v-on:change="changetimeselect('day')"></el-input-number>&nbsp;天&nbsp;—&nbsp;<el-input-number v-model="day[1].high"
									 controls-position="right" :min="1" :max="31" class="iptnum" size="mini" v-on:change="changetimeselect('day')"></el-input-number>&nbsp;天，每隔&nbsp;<el-input-number
									 v-model="day[1].interval" controls-position="right" :min="0" :max="day[1].high&lt;day[1].low?13-day[1].low+day[1].high:day[1].high-day[1].low"
									 class="iptnum" size="mini" v-on:change="changetimeselect('day')"></el-input-number>&nbsp;天
								</div>
								<div class="twoother" style="top:-180px;">
									<el-checkbox :indeterminate="day[2].indeterminate" v-on:change="selectAll('day',31,)" v-model="day[2].all">全选</el-checkbox>
									<div class="detil">
										<el-checkbox-group v-model="day[2].value" v-on:change="checksome('day',31)">
											<li v-for="out in 5" :key="out">
												<el-checkbox v-for="item in 6" :label="(out-1)*6+item" :key="item">{{(out-1)*6+item}}<span v-show="(out-1)*6+item-1&lt;10">&nbsp;&nbsp;</span></el-checkbox>
											</li>
											<li>
												<el-checkbox v-for="item in 1" :label="30+item" :key="item">{{30+item}}</el-checkbox>
											</li>
										</el-checkbox-group>
									</div>
								</div>
							</div>
						</el-tab-pane>
						<el-tab-pane name="month">
							<span slot="label">&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;</span>
							<el-form-item prop="month">
								<div class="onecheck">
									<!-- <el-checkbox-group v-model="time.month" v-on:change="changetimestate('month')"
				                                            :max="2" :min="1">
				                                            <el-checkbox :label="0" class="outcheck">
				                                                <div>每月&nbsp;&nbsp;</div>
				                                            </el-checkbox>
				                                            <div class="split"></div>
				                                            <el-checkbox :label="1" class="outcheck">&nbsp;</el-checkbox>
				                                            <div class="split"></div>
				                                            <el-checkbox :label="2" class="outcheck">
				                                                <div style="height:100px;"> 指定某月</div>
				                                            </el-checkbox>
				                                        </el-checkbox-group> -->
									<el-radio-group v-model="time.month" v-on:change="changetimestate('month')" :max="2" :min="1">
										<el-radio :label="0" class="outcheck">
											<div>每月&nbsp;&nbsp;</div>
										</el-radio>
										<div class="split"></div>
										<el-radio :label="1" class="outcheck">&nbsp;</el-radio>
										<div class="split"></div>
										<el-radio :label="2" class="outcheck">
											<div style="height:80px;"> 指定某月</div>
										</el-radio>
									</el-radio-group>
								</div>
							</el-form-item>
							<div style="height: 0px;">
								<div class="oneother" style="top:-135px;" v-on:click="changetimeselect('month')">
									从&nbsp;<el-input-number v-model="month[1].low" controls-position="right" :min="1" :max="11" class="iptnum"
									 size="mini" v-on:change="changetimeselect('month')"></el-input-number>&nbsp;月&nbsp;—&nbsp;<el-input-number
									 v-model="month[1].high" controls-position="right" :min="1" :max="12" v-on:change="changetimeselect('month')"
									 class="iptnum" size="mini"></el-input-number>&nbsp;月，每隔&nbsp;<el-input-number v-model="month[1].interval"
									 controls-position="right" :min="1" :max="month[1].high&lt;month[1].low?13-month[1].low+month[1].high:month[1].high-month[1].low"
									 class="iptnum" size="mini" v-on:change="changetimeselect('month')"></el-input-number>&nbsp;月
								</div>
								<div class="twoother" style="top:-110px">
									<el-checkbox :indeterminate="month[2].indeterminate" v-on:change="selectAll('month',12)" v-model="month[2].all">全选</el-checkbox>
									<div class="detil">
										<el-checkbox-group v-model="month[2].value" v-on:change="checksome('month',12)" :min="1">
											<li v-for="out in 2" :key="out">
												<el-checkbox v-for="item in 6" :label="(out-1)*6+item" :key="item">{{(out-1)*6+item}}<span v-show="(out-1)*6+item&lt;10">&nbsp;&nbsp;</span></el-checkbox>
											</li>
										</el-checkbox-group>
									</div>
								</div>
							</div>
						</el-tab-pane>
					</el-tabs>
				</el-form>
				<el-button type="primary" size="small" class="sureBtn" :disabled="cornAble" style="margin-left: 420px;margin-bottom: 10px;"
				 @click="submitLocltime()">提交定时设置</el-button>
			</div>
		</div>
		<div class="one-part mask-fa">
			<div class="title-part">
				<div>
					手动备份
				</div>
			</div>
			<div class="content-part">
				<div class="tools">
					<div>
						<el-button class="optBtn" size="mini" @click="backSql()" :disabled="backAble">备份数据库</el-button>
						<el-button class="optBtn1" size="small" type="primary" @click="confirmSql()" :disabled="uploadAble">恢复数据库</el-button>
						<!-- :headers="headers" :action="uploadAction" -->
						<el-upload :multiple="false" action="" :show-file-list="true" class="upload-sql" :on-change="changeFile"
						 :auto-upload="false" :limit="1" :on-exceed="handleExceed" :file-list="filelist">
							<el-button slot="trigger" size="small" type="primary" ref="upload" style="display: none;">恢复数据库</el-button>
							<!-- <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div> -->
						</el-upload>
					</div>
					<div>
						<el-button icon="el-icon-refresh" size="small" class="btn refBtn btnRight" @click="refreshTable"></el-button>
					</div>
				</div>
				<div class="tableContent">
					<el-table ref="table" height="400" :data="tableData" tooltip-effect="light" size="small" v-loading="loading" class="table">
						<el-table-column type="index" label="序号" width="50" :resizable="false" key="select000"></el-table-column>
						<el-table-column v-for="(item,key) in tableCloumn" :prop="item.prop" :key="item.prop" :resizable="false" :label="item.label"
						 :min-width="item.width" :show-overflow-tooltip="true" align="center">
							<template slot-scope="scope">
								{{getDisplay(scope)}}
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120" key="editUpdate" align="center">
							<template slot-scope="scope">
								<el-button class="udpBtn" :disabled="recoveAble" type="text" size="small" @click="confirmSql(scope.row.id)">恢复</el-button>
								<el-button class="udpBtn" :disabled="downAble" type="text" size="small" @click="downloadSqlFile(scope.row)">下载</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="page">
						<el-pagination @current-change="changePage" :current-page.sync="currentPage" :page-size.sync="pageSize" layout="prev, pager, next,jumper,->,total"
						 :total="total"></el-pagination>
					</div>
				</div>
			</div>
			<div class="custom-mask" v-show="customMask">
				<div class="mask-title">{{maskTitle}}</div>
				<div class="mask-circle">
					<div class="first-circle"></div>
					<div class="second-circle"></div>
					<div class="thred-circle"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import tablePublic from "@/mixins/tablePublic.js";
	import {
		getSomeData
	} from "@/utils/timeUtils.js";
	export default {
		name: "mysqlBackup",
		mixins: [tablePublic],
		data() {
			return {
				tableUrl: "getSqlList",
				entity: "SysSqlFile",
				time: {
					minute: 0,
					hour: 0,
					day: 0,
					month: 0,
				},
				timerules: {
					minute: [{
						required: true,
						message: '请选择分钟数',
						trigger: 'change'
					}],
					hour: [{
						required: true,
						message: '请选择小时数',
						trigger: 'change'
					}],
					day: [{
						required: true,
						message: '请选择天数',
						trigger: 'change'
					}],
					month: [{
						required: true,
						message: '请选择月份',
						trigger: 'change'
					}],
				},
				minute: ["*", {
					low: 0,
					high: 59,
					interval: 0
				}, {
					all: false,
					indeterminate: false,
					value: []
				}],
				hour: ["*", {
					low: 0,
					high: 23,
					interval: 0
				}, {
					all: false,
					indeterminate: false,
					value: []
				}],
				day: ["*", {
					low: 1,
					high: 31,
					interval: 0
				}, {
					all: false,
					indeterminate: false,
					value: []
				}],
				month: ["*", {
					low: 1,
					high: 12,
					interval: 0
				}, {
					all: false,
					indeterminate: false,
					value: []
				}],
				cornInfo: "",
				tableCloumn: [{
					prop: "name",
					label: "文件名称",
					width: "100"
				}, {
					prop: "type",
					label: "类型",
					width: "80"
				}, {
					prop: "createtime",
					label: "下载时间",
					width: "150"
				}],
				filelist: [],
				headers: {
					'Authorization': ""
				},
				uploadAction: "https://jsonplaceholder.typicode.com/posts/",
				recoveAble: false,
				downAble: false,
				backAble: false,
				uploadAble: false,
				cornAble: false,
				id: "",
				maskTitle: "",
				customMask: false,
			}
		},
		mounted() {
			let _this = this;
			console.log("数据库恢复")
			let token = _this.$store.state.user.token;
			_this.headers = {
				'Authorization': token,
			};
			_this.getCorn();
		},
		methods: {
			//获取自动存储时间
			async getCorn() {
				let _this = this;
				let res = await _this.$api.getRequest(null, 'getSysSeting');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					let corn = res[0].sysBackupsCorn;
					_this.id = res[0].id;
					_this.corn = corn;
					_this.analysisCorn(corn);
					_this.formatterCorn(corn);
				}
			},
			// 选择某个时间点
			checksome(a, b) {
				//添加二
				// if (this.time[a].length < 1 || (this.time[a].length == 1 && this.time[a][0] ==
				//         0)) {
				//     this.time[a] = [2];
				// } else {
				//     if (this.time[a].length == 1 && this.time[a][0] == 1) {
				//         this.time[a].push(2);
				//     }
				// }
				this.time[a] = 2;
				var count = this[a][2].value.length;
				this[a][2].all = count === b;
				this[a][2].indeterminate = count > 0 && count < b;
			},
			// 提交锁定时间
			submitLocltime() {
				let _this = this;
				this.$refs.time.validate((valid) => {
					if (valid) {
						var a = this.time;
						let corn = _this.createCorn(a);
						this.corn = corn;
						_this.sendCorn(corn);
					}
				});
			},
			async sendCorn(cron) {
				let _this = this;
				let param = {
					id: _this.id,
					sysBackupsCorn: cron
				}
				_this.cornAble = true;
				let res = await _this.$api.putRequest(param, 'setSysSeting');
				_this.cornAble = false;
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.$message({
						message: "设置成功",
						type: "success"
					})
					_this.formatterCorn(cron);
				}
			},
			createCorn(a) {
				let cron = "0 ";
				let ccc = {
					minute: "分钟",
					hour: "小时",
					day: "天",
					month: "月"
				};
				for (var i in a) {
					var s = "";
					console.log(i);
					var b = this[i];
					var c = a[i];
					let d = b[c];
					switch (c) {
						case 0:
							s = "*";
							break;
						case 1:
							console.log(d.interval);
							if (d.interval != 0) {
								s = d.low + "-" + d.high + "/" + d.interval;
							} else {
								s = d.low + "-" + d.high;
							}
							break;
						default:
							var e = d.value;
							if (e.length == 0) {
								this.$message({
									type: "error",
									message: "请指定" + ccc[i] + "数",
									duration: 4000,
									showClose: true
								});
								return;
							} else {
								s = e.join(",")
							}
					}
					cron += s + " ";
				}
				cron += "?";
				return cron;
			},
			analysisCorn(corn) {
				let _this = this;
				var s = corn.split(" ");
				var aa = [{
					name: "minute",
					num: 60
				}, {
					name: "hour",
					num: 24
				}, {
					name: "day",
					num: 31
				}, {
					name: "month",
					num: 12
				}];
				_this.minute = ["*", {
					low: 0,
					high: 59,
					interval: 0
				}, {
					all: false,
					indeterminate: false,
					value: []
				}];
				_this.hour = ["*", {
					low: 0,
					high: 23,
					interval: 0
				}, {
					all: false,
					indeterminate: false,
					value: []
				}];
				_this.day = ["*", {
					low: 1,
					high: 31,
					interval: 0
				}, {
					all: false,
					indeterminate: false,
					value: []
				}];
				_this.month = ["*", {
					low: 1,
					high: 12,
					interval: 0
				}, {
					all: false,
					indeterminate: false,
					value: []
				}];
				for (let i = 1; i < 5; i++) {
					if (s[i] == "*") {
						_this.time[aa[i - 1].name] = 0;
					} else if (s[i].indexOf("-") > -1) {
						_this.time[aa[i - 1].name] = 1;
						var sss = s[i].split(/-|\//);
						_this[aa[i - 1].name][1].low = sss[0];
						_this[aa[i - 1].name][1].high = sss[1];
						_this[aa[i - 1].name][1].interval = sss[2] == null ? 0 : sss[2];
					} else {
						this.time[aa[i - 1].name] = 2;
						var s4 = s[i].split(",").map(Number);
						_this[aa[i - 1].name][2].value = s4;
						_this[aa[i - 1].name][2].all = s4.length === aa[i - 1].num;
						_this[aa[i - 1].name][2].indeterminate = s4.length < aa[i - 1].num;
					}
				}
			},
			// 格式化cron时间
			formatterCorn(a) {
				let _this = this;
				var b = a.split(" ");
				var c = ["", "分", "时", "日", "月"];
				var result = "";
				for (var i = 4; i > 0; i--) {
					var s = ""
					var d = b[i].split(",");
					if (d[0] == "*") {
						s = "每" + c[i];
					} else {
						for (var j = 0; j < d.length; j++) {
							var dd = d[j].split("/");
							if (dd.length < 2) {
								var ddd = dd[0].split("-");
								if (ddd.length < 2) {
									s += ddd[0] + c[i] + ",";
								} else {
									s += ddd[0] + c[i] + "到" + ddd[1] + c[i] + ",";
								}
							} else {
								var e = dd[0].split("-");
								s += e[0] + c[i] + "到" + e[1] + c[i] + "之间每隔" + dd[1] + c[i] + ",";
							}
						}
						s = s.substr(0, s.length - 1)
					}
					result += s;
				}
				result += "执行"
				_this.cornInfo = result;
			},
			getDisplay(a) {
				let _this = this;
				let s = a.column.property;
				let res = a.row[s];
				let lowS = s.toLowerCase()
				if (lowS == "createtime") {
					res = getSomeData(res);
				} else if (s == "type") {
					if (res == 0) {
						res = ""
					}
				}
				return res;
			},
			//备份数据库
			async backSql() {
				let _this = this;
				_this.backAble = true;
				_this.customMask=true;
				_this.maskTitle="数据库备份中";
				let res = await _this.$api.postRequest(null, "backSql");
				_this.customMask=false;
				_this.backAble = false;
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.$message({
						message: "备份成功",
						type: "success"
					})
					_this.refreshTable();
				}
			},
			async recoverSql(id) {
				let _this = this;
				let param = id;
				_this.recoveAble = true;
				_this.customMask=true;
				_this.maskTitle="数据库恢复中";
				let res = await _this.$api.postRequest(param, "recorveSqlById");
				_this.recoveAble = false;
				_this.customMask=false;
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.$message({
						message: "备份成功",
						type: "success"
					})
				}
			},
			//上传SQL文件
			async uploadSql(file) {
				let _this = this;
				let param=new FormData();
				param.append("file",file);
				_this.uploadAble = true;
				_this.customMask=true;
				_this.maskTitle="数据库恢复中";
				let res = await _this.$api.uploadPost(param, "uploadSql");
				_this.customMask=false;
				_this.uploadAble = false;
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.$message({
						message: "上传数据库成功",
						type: "success"
					})
				}
			},
			//判断excle格式
			changeFile(file, fileList) {
				//判断文件类型（文件名后缀）
				// console.log(file, fileList);
				let _this = this;

				let c = file.name;
				let fopf = c.substring(c.lastIndexOf('.') + 1);
				if (fopf != "sql") {
					this.$message({
						message: "请选择sql文件",
						type: "error"
					})
					return false;
				} else {
					_this.uploadSql(file.raw);
				}
			},
			confirmSql(id) {
				let _this = this;
				_this.$confirm("该操作会覆盖原有数据库，是否恢复", '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(id){
						_this.recoverSql(id);
					}else{
						_this.$refs.upload.$el.click();
					}
					
				}).catch(() => {
					_this.$message({
						type: 'info',
						message: '已取消恢复'
					});
					return false;
				});
			},
			//文件上传个数限制
			handleExceed(files, fileList) {
				//this.$refs.upload.clearFiles();
				this.$message.warning(`请删除已上传文件再上传`);
			},
			//文件上传成功
			fileSuccess(response, file, fileList) {
				let _this = this;
				this.$message.success(`文件上传成功`);
			},
			//文件上传失败
			fileError(err, file, fileList) {
				this.$message.warning(`文件上传失败`);
			},
			//下载Sql文件
			async downloadSqlFile(row) {
				let _this = this;
				_this.downAble = true;
				_this.customMask=true;
				_this.maskTitle="数据库文件传输中";
				let res = await _this.$api.downloadPost(null, "downloadSqlFile", row.id);
				_this.downAble = false;
				_this.customMask=false;
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					let url = window.URL.createObjectURL(new Blob([res.data]), {
						type: "application/octet-stream"
					});
					let name = res.fileName.split("=")[1];
					let link = document.createElement('a')
					link.style.display = 'none'
					link.href = url;
					link.setAttribute('download', name);
					document.body.appendChild(link)
					link.click();
					document.body.removeChild(link);
				}
			},
		}
	}
</script>

<style lang="scss">
	@import "assets/css/other.scss";

	#databaseBackup .el-radio__label>div {
		display: inline-block;
	}

	.twoother {
		position: relative;
		left: 24px;
		top: -320px;
	}

	.oneother {
		position: relative;
		top: -355px;
		left: 24px;
		font-size: 14px;
	}

	.onecheck .el-checkbox__inner {
		background-color: #F3F9F6;
		border: 1px solid #CBD6D1;
		border-radius: 5px
	}

	/* .onecheck .el-checkbox__input.is-checked .el-checkbox__inner {
		background-color: #4CAF50;
		border-color: #4CAF50;
	} */

	.split {
		margin: 15px;
	}

	#databaseBackup .optBtn,
	#databaseBackup .optBtn1 {
		margin-right: 15px;
	}

	#databaseBackup .tableContent {
		height: 400px;
	}

	#databaseBackup .upload-sql {
		display: flex;
		justify-content: flex-start;
	}

	#databaseBackup .upload-sql .el-upload-list__item {
		width: 350px;
		margin-top: 0;
	}

	#databaseBackup .upload-sql .el-upload-list {
		display: flex;
		align-items: center;
	}

	.mask-fa {
		position: relative;
	}

	.custom-mask {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #e9eff178;
	}

	.custom-mask>.mask-title {
		font-size: 13px;
		height: 30px;
		display: flex;
		justify-content: center;
		align-content: center;
		line-height: 30px;
		color: #1b4b67;
		letter-spacing: 2px;
	}

	.custom-mask>.mask-circle {
		display: inline-flex;
		justify-content: space-around;
		align-content: center;
		height: 10px;
		width: 60px;
	}

	.custom-mask>.mask-circle>div {
		width: 5px;
		height: 5px;
		border-radius: 10px;
		border: 1px solid #75aaca;
		background: #ccecff;
	}

	.custom-mask>.mask-circle>div:nth-child(1) {
		animation: circleLoad 1.5s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08);
	}

	.custom-mask>.mask-circle>div:nth-child(2) {
		animation: circleLoad 1.5s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08);
	}

	.custom-mask>.mask-circle>div:nth-child(3) {
		animation: circleLoad 1.5s 0.60s infinite cubic-bezier(.2, .68, .18, 1.08);
	}

	@keyframes circleLoad {
		0% {
			transform: scale(1);
			opacity: 1;
		}

		50% {
			transform: scale(0.1);
			opacity: 0.7;
		}

		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
