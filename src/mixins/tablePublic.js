import {
	getSomeData
} from "@/utils/timeUtils.js";
export default {
	data() {
		return {
			total: 1,
			pageSize: 15,
			loading: false,
			tableData: [],
			currentPage: 1,
			tableUrl: "",
			entity: ""
		}
	},
	created() {},
	mounted() {
		let _this = this;
		// console.log(_this.total)
		if (!_this.mountedType) {
			_this.refreshTable();
		}
	},
	methods: {
		//刷新Table
		refreshTable() {
			let _this = this;
			_this.currentPage = 1;
			_this.getTableData();

		},
		handleTableParam() {
			let _this = this;
			let param = {
				pageSize: _this.pageSize,
				currentPage: _this.currentPage,
				entity: _this.entity
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
			}
			return res;
		},
		//获取当前页数据
		async getTableData() {
			let _this = this;
			let param = _this.handleTableParam();
			if(!param){
				return;
			}
			_this.loading = true;
			let res = await _this.$api.postRequest(param, _this.tableUrl);
			_this.loading = false;
			if (res.code) {
				_this.$message({
					message: res.msg,
					type: "warning"
				})
			} else {
				_this.total = res.total;
				_this.handleResultTableData(res);
			}
			let scrollTop = this.$refs.table.bodyWrapper;
			if (scrollTop) {
				scrollTop.scrollTop = 0;
			}

		},
		//处理tabledata
		handleResultTableData(res) {
			// console.log(res)
			let _this = this;
			_this.tableData = res.list;
			// console.log(res.list)
		},
		//更换页码
		changePage(val) {
			let _this = this;
			_this.getTableData();
		},
	}
}