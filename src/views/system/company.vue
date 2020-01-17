<template>
	<div id="company" class="oneMain">
		<div class="oneMain">
			<div class="tools">
				<div>
					<el-form :inline="true" :model="search" size="small">
						<el-form-item>
							<el-input placeholder="输入公司名称" v-model="search.content" class="input-with-select" @keyup.enter.native="refreshTable()">
								<el-button slot="append" icon="el-icon-search" v-on:click="refreshTable()"></el-button>
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-button class="addBtn" size="small" @click="addOne" v-if="rootlist.add">添加</el-button>
							<el-button class="delBtn" size="small" @click="delectSome" v-if="firstType=='selection'&&rootlist.delete">删除</el-button>
							<el-button class="cancleBtn" size="small" @click="changeEdit">{{toolsTitle}}</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div>
					<el-button icon="el-icon-refresh" size="small" class="btn refBtn btnRight" @click="refreshTable"></el-button>
				</div>
			</div>
			<div class="tableContent">
				<el-table ref="table" height="679" :data="tableData" tooltip-effect="light" size="small" v-loading="loading" class="table"
				 @selection-change="changeSelect">
					<!-- <el-table-column :type="firstType" label="序号" width="50" :resizable="false" column-key="indexOOO"></el-table-column> -->
					<el-table-column type="index" label="序号" width="50" :resizable="false" key="indexOOO" v-if="firstType=='index'"></el-table-column>
					<el-table-column type="selection" label="序号" width="50" :resizable="false" key="select000" v-if="firstType=='selection'"></el-table-column>
					<el-table-column v-for="(item,key) in tableCloumn" :prop="item.prop" :key="key" :resizable="false" :label="item.label"
					 :min-width="item.width" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							{{getDisplay(scope)}}
						</template>
					</el-table-column>
					<!-- <el-table-column  label="启用状态" width="80" key="status">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="changeStaus(scope)"
							 :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column> -->
					<el-table-column label="操作" width="80" v-if="firstType=='selection'&&rootlist.update" key="editUpdate">
						<!--v-if="firstType=='selection'" fixed="right"-->
						<template slot-scope="scope">
							<el-button class="udpBtn" type="text" size="small" @click="updateOne(scope.row)">修改</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row class="page">
					<el-pagination @current-change="changePage" :current-page.sync="currentPage" :page-size.sync="pageSize" layout="prev, pager, next,jumper,->,total"
					 :total="total"></el-pagination>
				</el-row>
			</div>
		</div>
		<!--编辑用户 -->
		<el-dialog :visible.sync="editVisible" :close-on-click-modal="false" width="650px">
			<div slot="title">
				{{editTitle}}
			</div>
			<el-form ref="form" :model="form" :rules="formRule" label-width="80px" size="mini" class="form twoForm"
			 label-position="left">
				<el-form-item label="公司名称" prop="comName">
					<el-input class="short-input" v-model="form.comName"></el-input>
				</el-form-item>
				<el-form-item label="上级公司" prop="parentId">
					<el-select class="short-input" clearable v-model="form.parentId" placeholder="请选择">
						<el-option v-for="(item,index) in companyList" :key="index" :label="item.comName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-for="(item,index) in formInput" :key="index" :label="item.label" :prop="item.prop">
					<el-input class="short-input" v-model="form[item.prop]"></el-input>
				</el-form-item>
				<el-form-item label="介绍" prop="description">
					<el-input class="short-input" v-model="form.description" type="textarea"></el-input>
				</el-form-item>
			</el-form>
			<div class="dialog-footer" slot="footer">
				<el-button type="primary" size="small" class="sureBtn" @click="submitEdit()">确定</el-button>
				<el-button @click="editVisible=false" class="cancelBtn" size="small">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getSomeData,
		getSomeDay
	} from "../../utils/timeUtils.js";
	import tablePublic from "@/mixins/tablePublic";
	import systemEdit from "@/mixins/systemEdit";
	export default {
		name: "company",
		mixins: [tablePublic, systemEdit],
		data() {
			// 验证公司名
			var testName = (rule, value, callback) => {
				let _this = this;
				if (_this.editTitle == "添加公司") {
					let param = {
						comName: value
					}
					let res = _this.$api.postRequest(param,  "testComname").then((res) => {
						if (res.code) {
							callback();
						} else {
							if (res != "error") {
								callback(new Error("该公司名称已存在"));
							}
							callback();
						}
					}).catch(() => {
						callback();
					});
				} else {
					callback();
				}
			};
			return {
				entity: "SysCompany",
				rootlist: {
					add: true,
					update: true,
					delete: true
				},
				search: {
					content: "",
				},
				tableCloumn: [{
					prop: "comName",
					label: "公司名称",
					width: "100",
				}, {
					prop: "parentName",
					label: "上级公司",
					width: "100",
				}, {
					prop: "mobile",
					label: "联系方式",
					width: "100",
				}, {
					prop: "fax",
					label: "传真",
					width: "100",
				}, {
					prop: "address",
					label: "地址",
					width: "130",
				}, {
					prop: "memo",
					label: "备注",
					width: "100",
				}, {
					prop: "createTime",
					label: "创建时间",
					width: "120",
				}, {
					prop: "description",
					label: "介绍",
					width: "200",
				}],
				tableUrl: "getComList",
				titleName: "公司",
				deleteUrl: 'deleteCompanys',
				addUrl: 'addCompany',
				updateUrl: "updateCompany",
				form: {
					"address": "",
					"comName": "",
					"createBy": "",
					"createTime": "",
					"delFlag": "",
					"description": "",
					"fax": "",
					"id": "",
					"memo": "",
					"mobile": "",
					"orgCode": "",
					"parentId": "",
					"status": "",
					"type": "",
				},
				formRule: {
					"comName": [{
						required: true,
						message: '请输入公司名称',
						trigger: 'blur'
					},
					// {
					// 	validator: testName,
					// 	trigger: 'blur'
					// },
					],
					"description": [],
					"fax": [{
						required: false,
						message: '请输入传真号码',
						trigger: 'blur'
					}, {
						pattern: /^(\d{3,4}-)?\d{7,8}$/,
						message: "传真号码格式出错",
						trigger: "blur"
					}]
				},
				formInput: [{
					prop: "mobile",
					label: "联系方式",
				}, {
					prop: "fax",
					label: "传真",
				}, {
					prop: "address",
					label: "地址",
				}, {
					prop: "memo",
					label: "备注",
				}],
				companyList: [],
			}
		},
		mounted() {
			let _this = this;
			console.log("公司");
			_this.getCompanyList();
		},
		methods: {
			//获取公司信息
			async getCompanyList() {
				let _this = this;
				let param = {
					pageSize: 10000,
					currentPage: 1,
					entity: _this.entity
				}
				let res = await _this.$api.postRequest(param,  'getComList');			
					_this.companyList = res.list;
				
			},
			initForm(form){
				let _this=this;
				let data=new Object();
				if(form){
					for(let x in _this.form){
						data[x]=form[x];
					}
				}else{
					for(let x in _this.form){
						if(x=="status"){
							data[x]=1;
						}else{
							data[x]="";
						}
					}
				}
				return data;
			},
			handleTableParam() {
				let _this = this;
				let param = {
					pageSize: _this.pageSize,
					currentPage: _this.currentPage,
					entity: _this.entity
				}
				let c = _this.search.content
				if (c) {
					param.mapStr = JSON.stringify({
						comName: c
					});
				}
				return param
			},
			getDisplay(a) {
				let _this = this;
				let s = a.column.property;
				let res = a.row[s];
				let lowS = s.toLowerCase()
				if (lowS == "createtime") {
					res = getSomeData(res);
				}else if(s=="parentId"){
					//let name==_this.
				}
				return res;
			},
			//编辑提交修改参数
			handleEdit(){
				let _this=this;
				let param=JSON.stringify(_this.form);
				//JSON.stringify(map),
				return param;
			},
			delectSome() {
				let _this = this;
				let a = _this.delectList;
				if (a.length <= 0) {
					this.$message({
						message: "请选择删除数据",
						type: "warning"
					})
				} else {
					_this.$confirm("确认删除？", '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let b = [];
						a.forEach(item => {
							b.push(item.id); 
						})
						_this.delectData(b);
					}).catch(() => {
						_this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				}
			},
			updateOne(row) {
				let _this = this;
				_this.editTitle = "修改公司信息";
				_this.editVisible = true;
				// let index = _this.companyList.findIndex(item => {
				// 	return item.id == row.cid;
				// })
			
				let data = {
					address: row.address,
					comName: row.comName,
					createBy: row.createBy,
					createTime: row.createTime,
					delFlag: row.delFlag,
					fax: row.fax,
					id: row.id,
					memo: row.memo,
					mobile: row.mobile,
					orgCode: row.orgCode,
					mobile: row.mobile,
					parentId: row.parentId,
					status: row.status,
					type: row.type,
					
		
				
				}
				_this.form = data;
				setTimeout(() => {
					_this.$refs.form.clearValidate();
			
				}, 50)
			},
			//修改激活状态
			changeStaus(scope) {
				let _this = this;
				var a = scope.row.status;
				var c = scope.$index;
				var s = a == "1" ? "开启" : "关闭";
				this.$confirm("确定要" + s + "吗？", {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.updateActiveStatus(s, scope, _this.updateUrl);
				}).catch(() => {
					scope.row.status = a == 0 ? 1 : 0;
					this.$message({
						type: 'info',
						message: '已取消' + s
					});
				});
			},
			//更改开关状态
			async updateActiveStatus(s, scope, url) {
				let _this = this;
				let param = {
					id: scope.row.id,
					status: scope.row.status
				}
				let a = scope.row.status;
				let res = await _this.$api.postRequest(param,  url);
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
					scope.row.status = a == "0" ? 1 : 0;
				} else {
					this.$message({
						type: 'success',
						message: s + '成功'
					});
				}
			},
		}
	}
</script>

<style>
</style>
