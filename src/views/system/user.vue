<template>
	<div id="user" class="oneMain">
		<div class="oneMain">
			<div class="tools">
				<div>
					<el-form :inline="true" :model="search" size="small">
						<el-form-item>
							<el-input placeholder="输入用户名" v-model="search.username" class="input-with-select" @keyup.enter.native="refreshTable()">
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
					<!--@row-dblclick="updateOne"-->
					<!-- <el-table-column :type="firstType" label="序号" width="50" :resizable="false" column-key="indexOOO"></el-table-column> -->
					<el-table-column type="index" label="序号" width="50" :resizable="false" key="indexOOO" v-if="firstType=='index'"></el-table-column>
					<el-table-column type="selection" label="序号" width="50" :resizable="false" key="select000" v-if="firstType=='selection'"></el-table-column>
					<el-table-column v-for="(item,key) in tableCloumn" :prop="item.prop" :key="key" :resizable="false" :label="item.label"
					 :min-width="item.width" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							{{getDisplay(scope)}}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="160" v-if="firstType=='selection'&&rootlist.update" key="editUpdate">
						<!--v-if="firstType=='selection'" fixed="right"-->
						<template slot-scope="scope">
							<el-button class="udpBtn" type="text" size="small" @click="updateOne(scope.row)">修改</el-button>
							<el-button class="udpBtn" type="text" size="small" @click="openUpdatePwd(scope.row.username)">修改密码</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row class="page">
					<el-pagination @current-change="changePage" :current-page.sync="currentPage" :page-size.sync="pageSize" layout="prev, pager, next,jumper,->,total"
					 :total="total"></el-pagination>
				</el-row>
			</div>
			<!--编辑用户 -->
			<el-dialog :visible.sync="editVisible" :close-on-click-modal="false" width="650px">
				<div slot="title">
					{{editTitle}}
				</div>
				<el-form ref="form" :model="form" :rules="formRule" label-width="80px" size="mini" class="form  twoForm"
				 label-position="left">
					<!-- <el-form-item prop="avatar"> userForm
						<el-upload class="avatar-uploader" accept="image/*" action="uploadImg" :auto-upload="false" :show-file-list="false"
						 :on-change="beforeAvatarUpload">
							<img v-if="form.avatar!=''" :src="form.avatar" class="avatar">
							<i v-else class="el-icon-plus"></i>
						</el-upload>
					</el-form-item> -->
					<el-form-item label="用户名" prop="username">
						<el-input class="short-input" :disabled="editTitle.indexOf('修改')>-1" auto-complete="new-password" v-model="form.username"></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="realname">
						<el-input class="short-input" auto-complete="new-password" v-model="form.realname"></el-input>
					</el-form-item>
					<div v-if="editTitle=='添加用户'">
						<el-form-item label="密码" prop="password">
							<el-input type="password" auto-complete="new-password" class="short-input" v-model="form.password"></el-input>
						</el-form-item>
						<el-form-item label="重复密码" prop="pwd">
							<el-input type="password" class="short-input" v-model="form.pwd"></el-input>
						</el-form-item>
					</div>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="form.sex">
							<el-radio label="0">男</el-radio>
							<el-radio label="1">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<!-- 	<el-form-item label="年龄" prop="age">
						<el-input class="short-input" v-model="form.age"></el-input>
					</el-form-item> -->
					<el-form-item label="手机" prop="phone">
						<el-input class="short-input" v-model="form.phone"></el-input>
					</el-form-item>
					<el-form-item label="公司" prop="cindex">
						<el-select class="short-input" clearable v-model="form.cindex" placeholder="请选择">
							<!-- @change="changeDept"-->
							<el-option v-for="(item,index) in companyList" :key="index" :label="item.comName" :value="index"></el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="部门" prop="deptid">
						<el-select class="short-input" v-model="form.deptid" placeholder="请选择" @change="changeRole">
							<el-option v-for="item in companyList[form.cid].deptList" :key="item.deptId" :label="item.deptname" :value="item.deptId"></el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item label="角色" prop="roleid">
						<el-select class="short-input" v-model="form.roleid" placeholder="请选择">
							<el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input class="short-input" v-model="form.email"></el-input>
					</el-form-item>
				</el-form>
				<div class="dialog-footer" slot="footer">
					<el-button type="primary" size="small" class="sureBtn" @click="submitEdit()">确定</el-button>
					<el-button @click="editVisible=false" class="cancelBtn" size="small">取消</el-button>
				</div>
			</el-dialog>
			<el-dialog :visible.sync="pwdVisible" :close-on-click-modal="false" width="450px">
				<div slot="title">
					修改{{pwdForm.username}}密码
				</div>
				<el-form ref="pwdForm" :model="pwdForm" :rules="pwdFormRules" label-width="110px" size="mini" class="form  twoForm"
				 label-position="left">
					<el-form-item label="登录用户密码" prop="userPwd">
						<el-input type="password" auto-complete="new-password" class="short-input" v-model="pwdForm.userPwd"></el-input>
					</el-form-item>
					<el-form-item label="新密码" prop="password">
						<el-input type="password" auto-complete="new-password" class="short-input" v-model="pwdForm.password"></el-input>
					</el-form-item>
					<el-form-item label="重复新密码" prop="pwd">
						<el-input type="password" class="short-input" v-model="pwdForm.pwd"></el-input>
					</el-form-item>
				</el-form>
				<div class="dialog-footer" slot="footer">
					<el-button type="primary" :disable="pwdFoemdis" size="small" class="sureBtn" @click="submitPwd()">确定</el-button>
					<el-button @click="pwdVisible=false" class="cancelBtn" size="small">取消</el-button>
				</div>
			</el-dialog>
		</div>
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
		name: "user",
		mixins: [tablePublic, systemEdit],
		data() {
			// 密码一致
			var testPwd = (rule, value, callback) => {
				let _this = this;
				if (_this.editTitle == "添加用户") {
					if (value == "") {
						callback(new Error("请输入重复密码"));
					} else if (_this.form.password != value) {
						callback(new Error("两次输入密码不一致"));
					} else {
						callback();
					}
				} else {
					callback();
				}

			};
			// 更改密码验证重复密码
			var testCmd = (rule, value, callback) => {
				let _this = this;
				if (_this.editTitle == "添加用户") {
					if (value == "") {
						callback(new Error("请输入口令"));
					} else {
						var reg = /^\w{8,20}$/;
						var patt = new RegExp(reg);
						if (!patt.test(value)) {
							callback(new Error("请输入8~20个字母/数字"));
						} else {
							if (_this.form.pwd != "") {
								_this.$refs.form.validateField("pwd");
							}
							callback();
						}
					}
				} else {
					callback();
				}
			};
			// 验证用户名
			var testName = (rule, value, callback) => {
				let _this = this;
				if (_this.editTitle == "添加用户") {
					let param = {
						username: value
					}
					let res = _this.$api.postRequest(param, "testUsername")
						.then((res) => {
							if (res == "false") {
								callback(new Success("该用户名可用"));
							} else {
								if (res) {
									callback(new Error("该用户名已存在"));
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
			// 密码一致
			var testPwdPwd = (rule, value, callback) => {
				let _this = this;
				if (value == "") {
					callback(new Error("请输入重复密码"));
				} else if (_this.pwdForm.password != value) {
					callback(new Error("两次输入密码不一致"));
				} else {
					callback();
				}

			};
			// 更改密码验证重复密码
			var testPwdCmd = (rule, value, callback) => {
				let _this = this;
				var reg = /^\w{8,20}$/;
				var patt = new RegExp(reg);
				if (!patt.test(value)) {
					callback(new Error("请输入8~20个字母/数字"));
				} else {
					if (_this.pwdForm.pwd != "") {
						_this.$refs.pwdForm.validateField("pwd");
					}
					callback();
				}
			};
			return {
				entity: "SysUser",
				delectList: [],
				firstType: "index",
				search: {
					username: ''
				},
				rootlist: {
					add: true,
					update: true,
					delete: true
				},
				imageUrl: "",
				dptList: [], //部门列表
				roleList: [], //角色列表
				companyList: [], //公司列表
				tableCloumn: [{
						prop: "username",
						label: "用户名",
						width: "100",
					}, {
						prop: "realname",
						label: "姓名",
						width: "100",
					}, {
						prop: "cname",
						label: "公司",
						width: "100",
					}, {
						prop: "sex",
						label: "性别",
						width: "50",
					},
					// {
					// 	prop: "age",
					// 	label: "年龄",
					// 	width: "50",
					// },
					// {
					// 	prop: "birthday",
					// 	label: "出生日期",
					// 	width: "150",
					// },
					{
						prop: "phone",
						label: "手机号",
						width: "100",
					}, {
						prop: "email",
						label: "邮箱",
						width: "150",
					}, {
						prop: "roleid",
						label: "角色",
						width: "100",
					}, {
						prop: "createTime",
						label: "创建时间",
						width: "200",
					}
				],
				form: {
					avatar: "",
					username: "",
					realname: "",
					password: "",
					birthday: "",
					pwd: "",
					sex: "",
					//	age: "",
					phone: "",
					email: "",
					roleid: "",
					deptid: "",
					cid: "",
					cname: "",
					cindex: ""
				},
				formRule: {
					avatar: [{
						required: false,
						message: '请上传头像',
						trigger: 'blur'
					}],
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						}, {
							pattern: /^(\w|-)+$/,
							message: "用户名只能是字母数字加下划线",
							trigger: "blur"
						}, {
							min: 2,
							max: 20,
							message: '"用户名长度必须在2到20之间',
							trigger: 'blur'
						},
						// {
						// 	validator: testName,
						// 	trigger: 'blur'
						// },
					],
					realname: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, {
						validator: testCmd,
						trigger: 'blur'
					}],
					pwd: [{
						required: true,
						message: '请输入重复密码',
						trigger: 'blur'
					}, {
						validator: testPwd,
						trigger: 'blur'
					}],
					sex: [{
						required: false,
						message: '请选择性别',
						trigger: 'blur'
					}],
					// age: [{
					// 	required: true,
					// 	message: '请输入年龄',
					// 	trigger: 'blur'
					// }, {
					// 	pattern: /^((1\d\d)|[1-9]\d)$/,
					// 	message: "请输10-199之间的数字",
					// 	trigger: "blur"
					// }],
					phone: [{
						required: false,
						message: '请输入手机号',
						trigger: 'blur'
					}, {
						pattern: /^1[34578]\d{9}$/,
						message: "请输入正确的手机号",
						trigger: "blur"
					}],
					roleid: [{
						required: true,
						message: '请选择角色',
						trigger: 'blur'
					}],
					cindex: [{
						required: true,
						message: '请选择公司',
						trigger: 'blur'
					}],
					deptid: [{
						required: false,
						message: '请选择职位',
						trigger: 'blur'
					}],
					email: [{
						required: false,
						message: '请输入邮箱',
						trigger: 'blur'
					}, {
						pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
						message: "邮箱格式出错",
						trigger: "blur"
					}],
					address: [{
						required: false,
						message: '请输入地址',
						trigger: 'blur'
					}],
				},
				pwdFoemdis: false,
				pwdForm: {
					userPwd: "",
					password: "",
					pwd: "",
					username:""
				},
				pwdFormRules: {
					userPwd: [{
						required: true,
						message: '请输入登录用户密码',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, {
						validator: testPwdCmd,
						trigger: 'blur'
					}],
					pwd: [{
						required: true,
						message: '请输入重复密码',
						trigger: 'blur'
					}, {
						validator: testPwdPwd,
						trigger: 'blur'
					}],
				},
				tableUrl: "getUserList",
				titleName: "用户",
				deleteUrl: 'deleteUsers',
				addUrl: 'addUser',
				updateUrl: "updateUser",
				pwdVisible: false
			}
		},
		created() {
			let _this = this;
			let a = _this.$store.state.menu;
			console.log(a);
			//权限验证
			// let aa = a.find(item => {
			// 	return item.component == "5";
			// })
			// if (aa != undefined) {
			// 	let b = aa.children.find(item => {
			// 		return item.component == "5-4";
			// 	})
			// 	if (b != undefined) {
			// 		b.children.forEach(item => {
			// 			_this.rootlist[item.url] = true;
			// 		})
			// 	}
			// }
			console.log("用户管理")
			console.log(_this.rootlist);
		},
		mounted() {
			let _this = this;
			// _this.getDeptListAll();
			// _this.getAllRole();
			_this.getCompanyList();
			_this.getRoleList();
		},
		methods: {
			handleTableParam() {
				let _this = this;
				let param = {
					pageSize: 10000,
					currentPage: 1,
					entity: _this.entity
				}
				return param
			},
			//获取公司信息
			async getCompanyList() {
				let _this = this;
				let param = _this.handleTableParam();
				let res = await _this.$api.postRequest(param, 'getCompany');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.companyList = res.list;
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
							b.push(item.username);
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
			async getRoleList() {
				let _this = this;
				let param = _this.handleTableParam();
				let res = await _this.$api.postRequest(param, 'getRoleList');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.roleList = res.list;
				}
			},
			handleTableParam() {
				let _this = this;
				let a = _this.search.username;
				let map = new Object();
				if (a) {
					map.username = a;
				}
				let param = {
					pageSize: _this.pageSize,
					currentPage: _this.currentPage,
					mapStr: JSON.stringify(map),
					entity: _this.entity
				};
				return param;
			},
			getDisplay(a) {
				let _this = this;
				let s = a.column.property;
				let res = a.row[s];
				if (s == "sex") {
					res = res == '0' ? '男' : "女";
				} else if (s == 'marriage') {
					res = res == '0' ? '未婚' : "已婚";
				} else if (s == 'baby') {
					res = res == '0' ? '无育' : "已育";
				} else if (s == "createTime" || s == "birthday") {
					if (res) {
						res = getSomeData(res);
					}
				} else if (s == "roleid") {
					let ss = _this.roleList.find(item => {
						return res == item.rid;
					})
					if (ss) {
						res = ss.flag;
					} else {
						res = "";
					}
				}
				return res;
			},
			initForm(row) {
				let _this = this;
				let data = new Object();
				if (row) {
					for (let x in _this.form) {
						if (x == "cindex") {
							let index = _this.companyList.findIndex(item => {
								return row.cid == item.id;
							})
							if (index > -1) {
								data.cindex = index;
							} else {
								data.cindex = "";
							}

						} else if (x == "pwd") {
							data.pwd = row.password;
						} else {
							data[x] = row[x];
							//data.cindex="";
						}
					}
					data.oldPwd = row.password;
				} else {
					for (let x in _this.form) {
						data[x] = "";
					}
					data.oldPwd = "";
				}
				return data;
			},
			handleEdit() {
				let _this = this;
				let param = JSON.parse(JSON.stringify(_this.form));
				param.cid = _this.companyList[param.cindex].id;
				param.cname = _this.companyList[param.cindex].comName;
				if (param.oldPwd == param.password) {
					delete param.password;
				}
				delete param.oldPwd;
				delete param.pwd;
				return param;
			},
			//头像上传限制
			beforeAvatarUpload(file, fileList) {
				console.log("sss");
				console.log(file);
				let _this = this;
				let type = file.raw.type;
				const isJPG = type === 'image/jpeg' || type === 'image/png';
				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
				} else {
					let reader = new FileReader()
					reader.readAsDataURL(file.raw)
					reader.onload = function(event) {
						let img_base64 = this.result
						_this.form.avatar = img_base64;
					}
				}
				return isJPG;
			},
			//获取部门列表所有
			async getDeptListAll() {
				let _this = this;
				let res = await _this.$api.getRequest(null, 'getDeptListAll');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.dptList = res;
				}
			},
			//获取部门角色
			async getAllRole(val) {
				let _this = this;
				// let param = {
				// 	value: val
				// }
				let res = await _this.$api.getRequest(null, 'getRootListAll');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.roleList = res;
				}
			},
			//选择公司
			changeDept(val) {
				let _this = this;
				_this.form.deptid = _this.companyList[val];
			},

			//选择部门
			changeRole(val) {

			},
			//打开修改密码界面
			openUpdatePwd(id) {
				let _this = this;
				_this.pwdForm = {
					userPwd: "",
					password: "",
					pwd: "",
					username:id
				}
				_this.pwdVisible = true;
			},
			submitPwd() {
				let _this = this;
				_this.$refs.pwdForm.validate((value) => {
					if (value) {
						_this.updatePwd();
					}
				})
			},
			async updatePwd() {
				let _this = this;
				_this.pwdFoemdis = true;
				let res = await _this.$api.postRequest(_this.pwdForm, "updatePwd");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.$message({
						message: "修改密码成功",
						type: "success"
					})
					_this.pwdFoemdis = false;
					_this.pwdVisible = false;
				}
			},
		}
	}
</script>

<style lang="scss">
	// 	#user>.tools {
	// 		width: 100%;
	// 		height: 33px;
	// 		display: flex;
	// 		flex-direction: row;
	// 		justify-content: space-between;
	// 	}
	// 
	// 	#user>.tableContent {
	// 		margin-top: 10px;
	// 		width: 100%;
	// 		height: calc(100% - 43px);
	// 	}
	// 
	// 	#user>.tableContent>.table {
	// 		width: 100%;
	// 		height: calc(100% - 45px);
	// 	}
	// 
	// 	#user>.tableContent>.page {
	// 		width: 100%;
	// 		height: 35px;
	// 		margin-top: 10px;
	// 	}


	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		width: 80px;
		height: 80px;
		margin-bottom: 10px;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader .el-upload .el-icon-plus {
		font-size: 28px;
		color: #8c939d;
		line-height: 80px;
		text-align: center;
	}

	.avatar {
		width: 80px;
		height: 80px;
		display: block;
	}
</style>
