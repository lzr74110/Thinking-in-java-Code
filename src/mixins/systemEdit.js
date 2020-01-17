export default {
	data() {
		return {
			toolsTitle: "编辑",
			firstType: "index",
			editTitle: "",
			editVisible: false,
			titleName: "",
			delectList: [],
			addUrl: '',
			updateUrl: "",
			deleteOneUrl: "",
			submitDis: false
		}
	},
	mounted() {
		console.log("工具");
	},
	methods: {
		//点击编辑/取消编辑
		changeEdit() {
			let _this = this;
			let a = _this.firstType == "index";
			if (a) {
				_this.toolsTitle = "取消编辑";
				_this.firstType = "selection";
			} else {
				_this.toolsTitle = "编辑";
				_this.firstType = "index";
			}
		},
		initForm(form) {
			let _this = this;
			let data = new Object();
			if (form) {
				for (let x in _this.form) {
					data[x] = form[x];
				}
			} else {
				for (let x in _this.form) {
					if (x == "status") {
						data[x] = 1;
					} else {
						if (typeof _this.form[x] == "string") {
							data[x] = "";
						} else if (typeof _this.form[x] == "number") {
							data[x] = 0;
						} else {
							data[x] = new Array();
						}
					}
				}
			}
			return data;
		},
		//添加
		addOne() {
			let _this = this;
			_this.editTitle = "添加" + _this.titleName;
			_this.editVisible = true;
			let data = _this.initForm();
			_this.form = data;
			setTimeout(() => {
				_this.$refs.form.clearValidate();
			}, 50)
		},
		//修改
		updateOne(row) {
			console.log(row)
			let _this = this;
			_this.editTitle = "修改" + _this.titleName + "信息";
			_this.editVisible = true;
			let data = _this.initForm(row);
			_this.form = data;
			setTimeout(() => {
				_this.$refs.form.clearValidate();
			}, 50)
		},
		initDeleteParam() {
			let _this = this;
			let ids = [];
			_this.delectList.forEach(item => {
				ids.push(item.id);
			})
			let param = {
				id: ids
			}
			return param;
		},
		//删除
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
					let b = _this.initDeleteParam();
					_this.delectData(b);
				}).catch(() => {
					_this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}
		},
		initDeleteOneParam(row) {
			let param = {
				id: row.id
			}
			return param;
		},
		beforeDelete() {

		},
		deleteOne(row) {
			let _this = this;
			_this.beforeDelete();
			_this.$confirm("确认删除？", '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let b = _this.initDeleteOneParam(row)
				_this.delectData(b, 1);
			}).catch(() => {
				_this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		async delectData(param, type) {
			let _this = this;
			_this.loading = true;
			console.log(param)
			console.log(type)
			let res;
			if (!type) {
				console.log(111111111111111)
				res = await _this.$api.postRequest(param, _this.deleteUrl);
			} else {
				console.log(22222222222)
				res = await _this.$api.deleteRequest(null, _this.deleteOneUrl, param.id);
			}

			_this.editVisible = false;
			if (res.code) {
				_this.loading = false;
				_this.$message({
					message: res.msg,
					type: "warning"
				})
			} else {
				if (res == "success" || res == "1") {
					_this.$message({
						message: "删除成功",
						type: "success"
					})
					_this.handleEditResult(2);
				} else {
					_this.loading = false;
					_this.$message({
						message: "删除失败",
						type: "warning"
					})
				}
			}
		},
		submitEdit() {
			console.log('$$$$$$$$$$$$$$')
			let _this = this;
			_this.$refs.form.validate((valid) => {
				if (valid) {
					_this.submitDis = true;
					_this.editInfo();
				}
			})
		},
		handleEdit() {
			let _this = this;
			return _this.form;

		},
		async editInfo() {
			let _this = this;
			let param = _this.handleEdit();
			console.log(param)
			const msssg = _this.editVisible;
			_this.editVisible = false;
			_this.loading = true;
			let res;
			let type;
			if (_this.editTitle == "添加" + _this.titleName) {
				res = await _this.$api.postRequest(param, _this.addUrl);
				type = 0;
			} else {
				res = await _this.$api.putRequest(param, _this.updateUrl);
				type = 1;
			}
			_this.submitDis = false;
			if (res.code) {
				_this.loading = false;
				_this.$message({
					message: res.msg,
					type: "warning"
				})
			} else {
				if (msssg) {
					let title = _this.editTitle;
					_this.$message({
						message: title + "成功",
						type: "success"
					})
				}
				_this.handleEditResult(type, res);
			}
		},

		handleEditResult(type) {
			let _this = this;
			_this.getTableData();
		},
		changeSelect(val) {
			this.delectList = val;
		}
	}
}