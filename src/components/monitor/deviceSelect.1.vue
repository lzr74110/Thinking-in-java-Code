<template>
	<div class="content" id="deviceSelect" @mouseleave="disappear()">
		<div id="device-nav" v-on:mouseover="selectShow=true"></div>
		<transition name="el-zoom-in-top">
			<div class="one-part casecade-part" v-show="selectShow">
				<!-- 省 -->
				<div class="title-part cascade-search">
					<div>
						<el-checkbox-group v-model="search.province" size="mini" class="cascade-check" @change="getCityList">
							<div class="cascade-display">
								<div class="cascade-top">
									<div v-for="(item,index) in provinceTop" :key="index">
										<el-checkbox-button class="noBackCheck" :label="item.provinceId">{{item.province}}</el-checkbox-button>
									</div>
								</div>
								<transition name="el-zoom-in-top">
									<div v-show="searchShow.province&&provinceOther.length>0" class="cascade-other">
										<div>
											<div v-for="(item,index) in provinceOther" :key="index">
												<el-checkbox-button class="noBackCheck" :label="item.provinceId">{{item.province}}</el-checkbox-button>
											</div>
										</div>
									</div>
								</transition>
							</div>
						</el-checkbox-group>
					</div>
					<div>
						<el-button v-show="provinceOther.length>0" class="optBtn" size="mini" @click.stop="searchShow.province=!searchShow.province">更多</el-button>
					</div>
				</div>
				<div class="content-part">
					<!-- 市 -->
					<div class="cascade-search">
						<div>
							<el-checkbox-group v-model="search.city" size="mini" class="cascade-check" @change="getCountryList">
								<div class="cascade-display">
									<div class="cascade-top">
										<div>
											<div v-for="(item,index) in cityTop" :key="index">
												<el-checkbox-button class="noBackCheck" :label="item.cityId">{{item.city}}</el-checkbox-button>
											</div>
										</div>
										<div>
											<el-button v-show="cityOther.length>0" class="optBtn" size="mini" @click="searchShow.city=!searchShow.city">更多</el-button>
										</div>
									</div>
									<transition name="el-zoom-in-top">
										<div v-show="searchShow.city&&cityOther.length>0" class="cascade-other">
											<div>
												<div v-for="(item,index) in cityOther" :key="index">
													<el-checkbox-button class="noBackCheck" :label="item.cityId">{{item.city}}</el-checkbox-button>
												</div>
											</div>
										</div>
									</transition>
								</div>
							</el-checkbox-group>

						</div>
						<div>

						</div>
					</div>
					<!--  乡-->
					<div class="cascade-search">
						<div>
							<el-checkbox-group v-model="search.county" size="mini" class="cascade-check" @change="getTownList">
								<div class="cascade-display">
									<!-- @mouseover="searchShow.county=true" @mouseout="searchShow.county=false" -->
									<div class="cascade-top">
										<div>
											<div v-for="(item,index) in countyTop" :key="index">
												<el-checkbox-button class="noBackCheck" :label="item.countryId">{{item.country}}</el-checkbox-button>
											</div>
										</div>
										<div>
											<el-button v-show="countyOther.length>0" class="optBtn" size="mini" @click="searchShow.county=!searchShow.county">更多</el-button>
										</div>
									</div>
									<transition name="el-zoom-in-top">
										<div v-show="searchShow.county&&countyOther.length>0" class="cascade-other">
											<div>
												<div v-for="(item,index) in countyOther" :key="index">
													<el-checkbox-button class="noBackCheck" :label="item.countryId">{{item.country}}</el-checkbox-button>
												</div>
											</div>
										</div>
									</transition>
								</div>
							</el-checkbox-group>

						</div>
						<div>

						</div>
					</div>
					<!--  镇-->
					<div class="cascade-search">
						<div>
							<el-checkbox-group v-model="search.township" size="mini" class="cascade-check" @change="getVillageList">
								<div class="cascade-display">
									<div class="cascade-top">
										<div>
											<div v-for="(item,index) in townshipTop" :key="index">
												<el-checkbox-button class="noBackCheck" :label="item.townId">{{item.town}}</el-checkbox-button>
											</div>
										</div>
										<div>
											<el-button v-show="townshipOther.length>0" class="optBtn" size="mini" @click="searchShow.township=!searchShow.township">更多</el-button>
										</div>
									</div>
									<transition name="el-zoom-in-top">
										<div v-show="searchShow.township&&townshipOther.length>0" class="cascade-other">
											<div>
												<div v-for="(item,index) in townshipOther" :key="index">
													<el-checkbox-button class="noBackCheck" :label="item.townId">{{item.town}}</el-checkbox-button>
												</div>
											</div>
										</div>
									</transition>
								</div>
							</el-checkbox-group>

						</div>
						<div>

						</div>
					</div>
					<!--  村-->
					<div class="cascade-search">
						<div>
							<el-checkbox-group v-model="search.village" size="mini" class="cascade-check" @change="getStationList">
								<div class="cascade-display">
									<div class="cascade-top">
										<div>
											<div v-for="(item,index) in villageTop" :key="index">
												<el-checkbox-button class="noBackCheck" :label="item.villageId">{{item.village}}</el-checkbox-button>
											</div>
										</div>
										<div>
											<el-button v-show="villageOther.length>0" class="optBtn" size="mini" @click="searchShow.village=!searchShow.village">更多</el-button>
										</div>
									</div>
									<transition name="el-zoom-in-top">
										<div v-show="searchShow.village&&villageOther.length>0" class="cascade-other">
											<div>
												<div v-for="(item,index) in villageOther" :key="index">
													<el-checkbox-button class="noBackCheck" :label="item.villageId">{{item.village}}</el-checkbox-button>
												</div>
											</div>
										</div>
									</transition>
								</div>
							</el-checkbox-group>

						</div>
					</div>
					<!-- 机房-->
					<div class="cascade-search">
						<div>
							<el-checkbox-group v-model="search.area" size="mini" class="cascade-check" @change="getDidList">
								<div class="cascade-display">
									<div class="cascade-top">
										<div>
											<div v-for="(item,index) in areaTop" :key="index">
												<el-checkbox-button class="noBackCheck" :label="item.stationId">{{item.station}}</el-checkbox-button>
											</div>
										</div>
										<div>
											<el-button v-show="areaOther.length>0" class="optBtn" size="mini" @click="searchShow.area=!searchShow.area">更多</el-button>
										</div>
									</div>
									<transition name="el-zoom-in-top">
										<div v-show="searchShow.area&&areaOther.length>0" class="cascade-other">
											<div>
												<div v-for="(item,index) in areaOther" :key="index">
													<el-checkbox-button class="noBackCheck" :label="item.stationId">{{item.station}}</el-checkbox-button>
												</div>
											</div>
										</div>
									</transition>
								</div>
							</el-checkbox-group>

						</div>
						<div>

						</div>
					</div>
					<!-- 设备 -->
					<!-- <div class="card-part">
						<el-card v-for="item in deviceList" shadow="hover" class="device-card">
							<div class="img-part">
								<img src="item.imgSrc" />
							</div>
							<div class="info-part">
								<div>{{item.name}}</div>
								<div>IP:{{item.ip}}</div>
							</div>
						</el-card>
					</div> -->
				</div>

			</div>

		</transition>
	</div>
</template>

<script>
	export default {
		name: "deviceSelect",
		data() {
			return {
				selectShow: true,
				search: {
					province: [],
					city: [],
					area: [],
					county: [],
					township: [],
					village: [],
				},
				searchShow: {
					province: false,
					city: false,
					area: false,
					county: false,
					township: false,
					village: false
				},
				provinceTop: [],
				provinceOther: [],
				cityTop: [],
				cityOther: [],
				areaTop: [],
				areaOther: [],
				countyTop: [],
				countyOther: [],
				townshipTop: [],
				townshipOther: [],
				villageTop: [],
				villageOther: [],
				deviceList: [],
				castTopLength: 8,
			}
		},
		created() {
			let _this = this;
		},
		mounted() {
			let _this = this;
			_this.getProvinceList();
			console.log("设备选择");
		},
		methods: {
			//获取地理位置信息
			async getProvinceList() {
				let _this = this;
				let param=[{}]
				let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					if (res.length > _this.castTopLength) {
						_this.provinceTop = res.slice(0, _this.castTopLength);
						_this.provinceOther = res.slice(_this.castTopLength);
					} else {
						_this.provinceTop = res;
					}
				}
			},
			//市
			async getCityList(province) {
				let _this = this;
				let param=new Array();
				province.forEach(itme=>{
					param.push({
						provinceId:itme
					})
				})
				let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					if (res.length > _this.castTopLength) {
						_this.cityTop = res.slice(0, _this.castTopLength);
						_this.cityOther = res.slice(_this.castTopLength);
					} else {
						_this.cityTop = res;
					}
					_this.countyTop = [];
					_this.countyOther = [];
					_this.townshipTop = [];
					_this.townshipOther = [];
					_this.villageTop = [];
					_this.villageOther = [];
					_this.areaTop = [];
					_this.areaOther = [];
					_this.deviceList = [];
				}
			},
			//乡
			async getCountryList(city) {
				let _this = this;
				let param=new Array();
				city.forEach(itme=>{
					param.push({
						provinceId:"000",
						cityId:itme
					})
				})
				let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					if (res.length > _this.castTopLength) {
						_this.countyTop = res.slice(0, _this.castTopLength);
						_this.countyOther = res.slice(_this.castTopLength);
					} else {
						_this.countyTop = res;
					}
					_this.townshipTop = [];
					_this.townshipOther = [];
					_this.villageTop = [];
					_this.villageOther = [];
					_this.areaTop = [];
					_this.areaOther = [];
					_this.deviceList = [];
				}
			},
			//镇
			async getTownList(country) {
				let _this = this;
				let param=new Array();
				country.forEach(itme=>{
					param.push({
						provinceId:"000",
						cityId:"000",
						countryId:itme
					})
				})
				let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					if (res.length > _this.castTopLength) {
						_this.townshipTop = res.slice(0, _this.castTopLength);
						_this.townshipOther = res.slice(_this.castTopLength);
					} else {
						_this.townshipTop = res;
					}
					_this.villageTop = [];
					_this.villageOther = [];
					_this.areaTop = [];
					_this.areaOther = [];
					_this.deviceList = [];
				}
			},
			//村
			async getVillageList(Town) {
				let _this = this;
				let param=new Array();
				Town.forEach(itme=>{
					param.push({
						provinceId:"000",
						cityId:"000",
						countryId:"000",
						townId:itme
					})
				})
				let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					if (res.length > _this.castTopLength) {
						_this.villageTop = res.slice(0, _this.castTopLength);
						_this.villageOther = res.slice(_this.castTopLength);
					} else {
						_this.villageTop = res;
					}
					_this.areaTop = [];
					_this.areaOther = [];
					_this.deviceList = [];
				}
			},
			//获取局站信息
			async getStationList(Town) {
				let _this = this;
				let param=new Array();
				Town.forEach(itme=>{
					param.push({
						provinceId:"000",
						cityId:"000",
						countryId:"000",
						townId:"000",
						villageId:itme
					})
				})
				let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					if (res.length > _this.castTopLength) {
						_this.areaTop = res.slice(0, _this.castTopLength);
						_this.areaOther = res.slice(_this.castTopLength);
					} else {
						_this.areaTop = res;
					}
				}
			},
			//获取设备DID信息
			async getDidList(val) {
				let _this = this;
				let param=new Array();
				val.forEach(item=>{
					param.push({
						provinceId:"000",
						cityId:"000",
						countryId:"000",
						townId:"000",
						villageId:"000",
						stationId:item
					})
				})
				let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.selectShow = false;
					let didList=new Array();
					res.forEach(item=>{
						didList.push(item.did);
					})
					_this.$emit("getDidList", didList);
				}
			},
			disappear() {
				let _this = this;
				if (_this.search.area.length > 0)
					_this.selectShow = false;
			}
		}
	}
</script>

<style lang="scss">
	@import "assets/css/other.scss";

	#deviceSelect {
		position: relative;
	}

	#deviceSelect>.one-part {
		position: absolute;
		top: 0px;
		z-index: 10;
		background: rgb(249, 252, 255);
	}

	#device-nav {
		height: 20px;
	}

	.casecade-part.one-part>.content-part {
		width: 100%;
		padding: 5px 0px;
		padding-bottom: 20px;
	}

	.casecade-part.one-part>.content-part .cascade-search {
		width: calc(100% - 30px);
		padding: 0 15px;
	}

	.content-part .cascade-top {
		height: 45px;
		display: flex;
		justify-content: space-between;
		border-bottom: 1.5px solid $border-split-color;
	}

	.content-part .cascade-top>div {
		display: flex;

		align-items: center;
	}

	.content-part .cascade-top>div:first-child {
		width: calc(100% - 100px);
		justify-content: flex-start;
	}

	.content-part .cascade-top>div:last-child {
		justify-content: flex-end;
		width: 100px;
	}

	.cascade-search {
		position: relative;
	}

	.cascade-display .cascade-other {
		position: absolute;
		top: 35px;
		left: 0;
		right: 0;
		padding: 0 15px;
		background-color: $baseWhilt;
		border: 1px solid $border-color;
		border-left: none;
		border-top: none;
		z-index: 100;
		box-shadow: 0 4px 4px $shadow-color;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
		overflow-y: auto;
		max-height: 80px;
	}

	.cascade-other>div {
		width: calc(100% - 100px);
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.cascade-display>div {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.cascade-display .el-checkbox-button .el-checkbox-button__inner {
		border-radius: 4px;
	}

	.title-part>div:first-child {
		width: calc(100% - 100px);
	}

	.cascade-check {
		width: 100%;
	}

	.card-part {
		width: calc(100% - 30px);
		padding: 10px 15px;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		padding-top: 10px;
		flex-wrap: wrap;
	}

	.el-card__body {
		width: calc(100% - 20px);
		height: calc(100% - 20px);
	}

	.card-part>.device-card {
		width: calc(20% - 10px);
		height: 180px;
		min-width: 180px;
		margin: 5px;
	}

	.card-part>.device-card .info-part {
		width: 100%;
		height: 50px;
	}

	.card-part>.device-card .info-part>div {
		width: 100%;
		height: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		color: $font-color;
	}

	.card-part>.device-card .img-part {
		width: 100%;
		height: calc(100% - 50px);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.card-part>.device-card .img-part>img {
		height: auto;
		width: 100%;
	}
</style>
