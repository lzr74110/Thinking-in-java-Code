<template>
	<div id="deviceTask">
		<device-select @getDidList="getDidList"></device-select>
		<one-device-task v-for="(item,index) in deviceList" :device="item" :key="index"></one-device-task>
	</div>
</template>

<script>
	import deviceSelect from "./deviceSelect";
	import oneDeviceTask from "./oneDevice"
	export default {
		components: {
			deviceSelect,
			oneDeviceTask
		},
		data() {
			return {
				activeDidList: [],
				deviceList: []
			}
		},
		mounted() {
			let _this = this;
			_this.getDeviceList();
		},
		methods: {
			getDidList(val) {
				let _this = this;
				_this.activeDidList = val;
				_this.getDeviceList();
			},
			async getDeviceList() {
				let _this = this;
				let param = {
					id: _this.activeDidList
				}
				let res = await _this.$api.postRequest(param, "getDeviceLiveSlave");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.deviceList = res;
				}
			},
		}
	}
</script>

<style>
	#deviceTask {
	}
</style>
