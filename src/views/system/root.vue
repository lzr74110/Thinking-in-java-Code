<template>
	<div id="company" class="oneMain">
		<div class="oneMain">
			<div class="tools">
				<div>
					<el-form :inline="true" :model="search" size="small">
						<el-form-item>
							<el-input placeholder="输入角色名称" v-model="search.content" class="input-with-select" @keyup.enter.native="refreshTable()">
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
					<el-table-column type="index" label="序号" width="50" :resizable="false" key="indexOOO" v-if="firstType=='index'"></el-table-column>
					<el-table-column type="selection" label="序号" width="50" :resizable="false" key="select000" v-if="firstType=='selection'"></el-table-column>
					<el-table-column v-for="(item,key) in tableCloumn" :prop="item.prop" :key="key" :resizable="false" :label="item.label"
					 :min-width="item.width" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							{{getDisplay(scope)}}
						</template>
					</el-table-column>
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
		<el-dialog :visible.sync="editVisible" :close-on-click-modal="false" width="650px">
			<div slot="title">
				{{editTitle}}
			</div>
			<el-form ref="form" :model="form" :rules="formRule" label-width="80px" size="mini" class="form" label-position="left">
				<el-form-item label="角色名称" prop="roleName">
					<el-input class="short-input" v-model="form.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色类型" prop="type">
					<el-radio-group v-model="form.type" @change="changeType">
						<el-radio :label="0" border>普通角色</el-radio>
						<el-radio :label="1" border>管理员角色</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="公司权限" prop="company" v-show='form.type==1'>
					<el-select class="short-input" clearable v-model="form.company" placeholder="请选择">
						<el-option v-for="(item,index) in companyList" :key="index" :label="item.comName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="公司权限" prop="companys" v-show='form.type==0'>
					<el-select class="short-input" multiple filterable collapse-tags clearable v-model="form.companys" @change="$forceUpdate()"
					 placeholder="请选择">
						<el-option v-for="(item,index) in companyList" :key="index" :label="item.comName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="设备权限" prop="device" v-show='form.type==0'>
					<el-select class="short-input" multiple filterable collapse-tags clearable v-model="form.device" placeholder="请选择"
					 @change="$forceUpdate()">
						<el-option v-for="(item,index) in deviceList" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单权限" prop="menus">
					<el-tree :data="menuList" show-checkbox accordion node-key="id" ref="tree" check-strictly @check="checkChoice">
						<div class="custom-tree-node" slot-scope="{ node, data }">
							<div :class="{treeLevelOne:node.level==1,'treeLevelTwo':node.level>1}">
								<!-- <span class="tree-icon iconfont" :class="data.icon"></span> -->
								<span>&nbsp;&nbsp;{{data.name}}</span>
							</div>
						</div>
					</el-tree>
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
		name: "root",
		mixins: [tablePublic, systemEdit],
		data() {
			//验证角色名称
			var testName = (rule, value, callback) => {
				let _this = this;
				if (_this.editTitle == "添加角色") {
					let param = {
						roleName: value
					}
					let res = _this.$api.postRequest(param,  "testRoleName").then((res) => {
						if (res == "false") {
							callback();
						} else if (res == "true") {
							callback(new Error("该角色名称已存在"));
						}
					}).catch(() => {
						callback();
					});
				} else {
					callback();
				}
			};
			var testCompany = (rule, value, callback) => {
				let _this = this;
				if (_this.form.type == 0) {
					if (_this.form.companys.length <= 0) {
						callback(new Error("请选择公司"));
					}
					callback();
				} else {
					if (_this.form.company || _this.form.company == 0) {
						callback();
					} else {
						callback(new Error("请选择公司"));
					}
				}
			};
			return {
				entity: "Role",
				rootlist: {
					add: true,
					update: true,
					delete: true,
				},
				search: {
					content: "",
				},
				tableUrl: "getRoleList",
				titleName: "角色",
				deleteUrl: 'deleteRoles',
				addUrl: 'addRole',
				updateUrl: "updateRole",
				tableCloumn: [{
					prop: "roleName",
					label: "角色名称",
					width: "100",
				}, {
					prop: "type",
					label: "角色类型",
					width: "100",
				}, {
					prop: "createTime",
					label: "创建时间",
					width: "120",
				}, {
					prop: "createBy",
					label: "创建人",
					width: "100",
				}, {
					prop: "updateTime",
					label: "最后一次更新时间",
					width: "150",
				}, {
					prop: "updateBy",
					label: "最后一次更新人",
					width: "150",
				}, {
					prop: "description",
					label: "描述",
					width: "200",
				}],
				companyList: [],
				menuList: [],
				deviceList: [],
				form: {
					id: "",
					roleName: "",
					type: 0,
					company: "",
					companys: [],
					device: [],
					menus: [],
					description: ""
				},
				formRule: {
					"roleName": [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}, {
						validator: testName,
						trigger: 'blur'
					}],
					// company: [{
					// 	validator: testCompany,
					// }],
					// companys: [{
					// 	validator: testCompany,
					// }],
					"description": [],
				},
				roleType: 0,
			}
		},
		created() {
			let _this = this;
			_this.getUserRole();
		},
		mounted() {
			let _this = this;
			_this.getCompanyList();
			_this.getMenuList();
			_this.getCompanyDevice()
		},
		methods: {
			getDisplay(a) {
				let _this = this;
				let s = a.column.property;
				let res = a.row[s];
				let lowS = s.toLowerCase()
				if (lowS == "createtime") {
					res = getSomeData(res);
				} else if (lowS == "type") {
					res = res == 0 ? "普通角色" : "管理员角色"
				}
				return res;
			},
			//修改角色类型
			changeType(val) {
				let _this = this;
				let res = _this.roleType == 1;
				if (!res && val == 1) {
					_this.$message({
						message: "您无权限修改角色类型",
						type: "warning"
					})
					_this.form.type = 0;
				}
			},
			initForm(form) {
				let _this = this;
				let data = new Object();
				if (form) {
					//修改  从表格向表单提交数据
					for (let x in _this.form) {
						data[x] = form[x];
					}
				} else {
					//添加， 初始化表单数据
					let form=_this.form;
					for (let x in form) {
						if (typeof form[x] == "string") {
							data[x] = "";
						} else if (typeof form[x] == "number") {
							data[x] = 0;
						} else {
							data[x] = new Array();
						}
					}
					data.type == 0;
					_this.$refs.tree.setCheckedKeys([]);
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
			//获取当前用户的角色类型
			async getUserRole() {
				let _this = this;
				let res = await _this.$api.getRequest(null,  'getRight');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.roleType = res;
				}
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
			updateOne(row) {
				let _this = this;
				_this.backRole(row.id);
				_this.editTitle = "修改角色信息";
				// let index = _this.companyList.findIndex(item => {
				// 	return item.id == row.cid;
				// })
				let data = {
					id: row.id,
					roleName: row.roleName,
					type: row.type,
					description: row.description,
					company: "",
					companys: [],
					device: [],
					menus: []
				}
				_this.form = data;
			},
			//获取菜单权限
			async getMenuList() {
				let _this = this;
				let res = await _this.$api.getRequest(null,  'getSomeMenu');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					let data = res;
					data.forEach(item => {
						if (item.children) {
							item.children.forEach((one, index) => {
								if (one.children && one.children.length > 0) {
									one.children = [];
								}
								if (one.menuType == 2) {
									item.children.splice(index);
								}
							})
						}
					})
					_this.menuList = data;
					console.log(data)
				}
			},
			//修改公司
			changeCompany(val) {
				let _this = this;
				console.log(val);
				//_this.getCompanyDevice(val);
			},
			//修改公司
			changeDevice(val) {
				let _this = this;
				_this.form.device = val;
				//_this.getCompanyDevice(val);
			},
			//编辑提交修改参数
			handleEdit() {
				let _this = this;
				//表单参数
				let param = JSON.parse(JSON.stringify(_this.form));
				if (param.type == 1) {
					param.companys = [param.company]
				}
				delete param.company;
				param.menu = _this.$refs.tree.getCheckedKeys();
				return param;
			},
			async getCompanyDevice() {
				let _this = this;
				let param = {
					pageSize: 10000,
					currentPage: 1,
				}
				let res = await _this.$api.getRequest(param,  'getCompanyDevice');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					//_this.form.device = [];
					let data=new Array();
					res.forEach(item=>{
						delete item.master;
						delete item.slave;
						data.push(item);
					})
					_this.deviceList = data;
				}
			},
			//选择菜单权限
			checkChoice(currentObj, treeStatus) {
				// 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
				let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
				// 选中之后
				if (selected !== -1) {
					// 子节点只要被选中父节点就被选中
					this.selectedParent(currentObj)
					// 统一处理子节点为相同的勾选状态
					this.uniteChildSame(currentObj, true)
				} else {
					// 未选中 处理子节点全部未选中
					if (currentObj.children && currentObj.children.length !== 0) {
						this.uniteChildSame(currentObj, false)
					} else {
						/* 判断子节点全为选中 */
						let menus = this.form.menus ? this.form.menus : [];
						let result = menus.findIndex(ol => {
							return currentObj.id == ol
						});
						menus.splice(result, 1)
						this.form.menus = menus;
					}
				}
				this.form.menus = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
				console.log(this.form.menus)
			},
			// 统一处理子节点为相同的勾选状态
			uniteChildSame(treeList, isSelected) {
				this.$refs.tree.setChecked(treeList.id, isSelected)
				if (treeList.children && treeList.children.length > 0) {
					for (let i = 0; i < treeList.children.length; i++) {
						let currentObj = treeList.children[i];
						this.uniteChildSame(treeList.children[i], isSelected)
					}
				}
			},
			// 统一处理父节点为选中
			selectedParent(currentObj) {
				let currentNode = this.$refs.tree.getNode(currentObj)
				if (currentNode.parent.key !== undefined) {
					this.$refs.tree.setChecked(currentNode.parent, true)
					this.selectedParent(currentNode.parent)
				}
			},
			async backRole(id) {
				let _this = this;
				let res = await _this.$api.postRequest(id,  'getRoleInfo');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					let menu = new Array();
					let device = new Array();
					_this.editVisible = true;
					if (_this.form.type == 1) {
						if (res.com.length > 0) {
							_this.form.company = res.com[0].cid;
						}
						// _this.menuList.forEach(item => {
						// 	menu.push(item.id)
						// 	if (item.children) {
						// 		item.children.forEach(one => {
						// 			menu.push(one.id);
						// 			if (one.children) {
						// 				one.children.forEach(jone => {
						// 					menu.push(jone.id);
						// 				})
						// 			}
						// 		})
						// 	}
						// })
					} else {
						res.deivce.forEach(item => {
							let did = typeof item.did == 'string' ? parseInt(item.did) : item.did;
							device.push(did);
						})
						console.log(typeof device);
						console.log(device)
						let com = new Array();
						res.com.forEach(item => {
							com.push(item.cid);
						})
						_this.form.device = device;
						_this.form.companys = com;

					}
					res.menu.forEach(item => {
						menu.push(item.menuId);
					})

					setTimeout(() => {

						if (menu.length > 0) {
							console.log(menu);
							_this.$refs.tree.setCheckedKeys(menu);
						}
						_this.$refs.form.clearValidate();
					}, 50)
				}
			}
		}
	}
</script>

<style>
</style>
