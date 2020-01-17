<template>
	<div id="menu" class="oneMain">
		<div class="oneMain">
			<div class="tools">
				<div>
					<el-button class="addBtn" size="small" @click="addOne" v-if="rootlist.add">添加一级菜单</el-button>
				</div>
			</div>
			<div class="tableContent">
				<el-tree :data="menuList" accordion node-key="url" :expand-on-click-node="false">
					<div class="custom-tree-node" slot-scope="{ node, data }">
						<div :class="{treeLevelOne:node.level==1,'treeLevelTwo':node.level==2}">
							<span class="tree-icon iconfont" :class="data.icon"></span>
							<!-- <el-input v-show="data.edit" class="short-input" v-model="data.label" @blur="changeMenuEdit(data)" size="mini"></el-input> -->
							<span>&nbsp;&nbsp;{{data.name}}</span>
						</div>
						<div >
							<span class="el-icon-plus tree-edit" v-if="node.level==1"  @click="addOne(data.id,data.children.length)"></span>
							<span class="el-icon-edit tree-edit" @click="updateOne(data)"></span>
							<span class="el-icon-delete tree-edit" @click="delectSome(data.id)"></span>
						</div>
					</div>
				</el-tree>
			</div>
		</div>
		<el-dialog :visible.sync="editVisible" :close-on-click-modal="false" width="450px">
			<div slot="title">
				{{editTitle}}
			</div>
			<el-form ref="form" :model="form" :rules="formRule" label-width="80px" size="mini" class="form" label-position="left">
				<el-form-item label="名称" prop="title">
					<el-input class="short-input" v-model="form.label"></el-input>
				</el-form-item>
				<el-form-item label="图标" prop="icon">
					<el-input class="short-input" v-model="form.icon"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="url">
					<el-input class="short-input" v-model="form.url"></el-input>
				</el-form-item>
			</el-form>
			<div class="dialog-footer" slot="footer">
				<el-button @click="editVisible=false" size="small">取消</el-button>
				<el-button type="primary" size="small" @click="submitEdit()">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	// const navList = require("assets/json/menu.json");
	export default {
		name: "cumulants",
		data() {
			var testName = (rule, value, callback) => {
				let _this = this;
				let one = _this.menuList.find((item) => {
					let res = item.label == value && item.id != _this.form.id;
					let oneM;
					if (!res) {
						oneM = item.children.find((info) => {
							return item.label == value && item.id != _this.form.id;
						})
					}
					return res || oneM == undefined;
				});
				if (one) {
					callback(new Error("该菜单名称已存在"));
				} else {
					callback();
				}
			};
			return {
				rootlist: {
					add: true,
					update: true,
					delete: true,
				},
				menuList: [],
				token: "",
				editVisible: false,
				form: {
					label: "",
					icon: "",
					url: "",
					id: "",
					pid: "",
					position: ""
				},
				formRule: {
					label: [{
						required: true,
						message: '请输入菜单名称',
						trigger: 'blur'
					}, {
						validator: testName,
						trigger: 'blur'
					}],
					icon: [{
						required: false,
						message: '请输入图标',
						trigger: 'blur'
					}],
					url: [{
						required: true,
						message: '请输入菜单名称',
						trigger: 'blur'
					}]
				}
			}
		},
		mounted() {
			let _this = this;
			_this.getNavList();
		},
		methods: {
			//获取权限列表
			async getNavList() {
				let _this = this;
				console.log("1111")
				console.log(_this)
				console.log(_this)
				let res = await _this.$api.getRequest(null,  'getSomeMenu');
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					let data = res;
					data.forEach(item=>{
						item.children.forEach((one,index)=>{
							if(one.children&&one.children.length>0){
								one.children=[];
							}
							if(one.menuType==2){
								item.children.splice(index);
							}
						})
					})
					_this.menuList = data;
				}
			},
			//添加
			addOne(pid,position) {
				let _this = this;
				_this.editTitle = "添加菜单";
				_this.editVisible = true;
				let data = {
					label: "",
					icon: "",
					url: "",
					id: "",
					pid: pid,
					position: ""
				}
				_this.form = data;
				setTimeout(() => {
					_this.$refs.form.clearValidate();
				}, 50)
			},
			//修改
			updateOne(row) {
				let _this = this;
				_this.editTitle = "修改菜单信息";
				_this.editVisible = true;
				let data = {
					label: row.label,
					icon: row.icon,
					url: row.url,
					id: row.id,
					pid: row.pid,
					position: row.position,
				}
				_this.form = data;
				setTimeout(() => {
					_this.$refs.form.clearValidate();
				}, 50)
			},
			//删除
			delectSome(id) {
				let _this = this;
				_this.$confirm("确认删除？", '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.delectData(id);
				}).catch(() => {
					_this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			async delectData(id) {
				let res = await _this.$api.postRequest(param,  'deleteMenu');
				_this.editVisible = false;
				if (res.code) {
					_this.loading = false;
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					_this.$message({
						message: "删除成功",
						type: "success"
					})
					_this.getNavList();
				}
			},
			submitEdit() {
				let _this = this;
				_this.$refs.form.validate((valid) => {
					if (valid) {
						_this.editInfo();
					}
				})
			},
			async editInfo() {
				let _this = this;
				let param = _this.form;
				_this.loading = true;
				let aa = _this.editTitle == "添加菜单" ? "addMenu" : "updateMenu";
				let res = await _this.$api.putRequest(param,  aa);
				if (res.code) {
					_this.loading = false;
					_this.$message({
						message: res.msg,
						type: "warning"
					})
				} else {
					let title = _this.editTitle;
					_this.$message({
						message: title + "成功",
						type: "success"
					})
					_this.editVisible = false;
					_this.getTableData();
				}
			},
		}
	}
</script>

<style lang="scss">
	#menu .el-tree {
		width: 600px;
		margin-left: 40px;
	}

	#menu .tableContent {
		border: none !important;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.custom-tree-node .tree-edit {
		color: #c1a511;
		width: 20px;
		height: 20px;
		font-size: 14px;
		line-height: 20px;
	}

	.custom-tree-node .tree-edit:hover,
	.custom-tree-node .tree-edit:focus {
		color: #9a8411;
	}

	.treeLevelTwo .tree-icon {
		color: #b0c4d2;
	}

	.treeLevelOne .tree-icon {
		color: #99b2c3;
	}

	.menuEdit .el-tree-node__content {
		height: auto;
	}

	.treeLevelOne {
		color: #515d67;
		font-weight: bold;
		height: auto;
	}

	.treeLevelTwo {
		color: #69757d;
		font-size: 12px;
		height: auto;
	}

	.message .el-message-box__content {
		font-size: 12px;
	}

	.message .el-message-box__message p {
		color: #6287a0;
	}

	.message .el-message-box__header .el-message-box__title {
		color: $table-tips-color;
		font-size: 13px;
		font-weight: bold;
	}
</style>
