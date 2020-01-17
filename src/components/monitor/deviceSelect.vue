<template>
  <div class="content" id="deviceSelect">
    <transition name="el-zoom-in-top">
      <div class="one-part casecade-part">
        <!-- 省 -->
        <div class="title-part cascade-search">
          <div>
            <el-radio-group v-model="search.province" size="mini" class="cascade-check" @change="getCityList">
              <div class="cascade-display">
                <div class="cascade-top">
                  <div v-for="(item,index) in provinceTop" :key="index">
                    <el-radio-button class="noBackCheck" :label="item.provinceId">{{item.province}}</el-radio-button>
                  </div>
                </div>
                <transition name="el-zoom-in-top">
                  <div v-show="searchShow.province&&provinceOther.length>0" class="cascade-other">
                    <div>
                      <div v-for="(item,index) in provinceOther" :key="index">
                        <el-radio-button class="noBackCheck" :label="item.provinceId">{{item.province}}</el-radio-button>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </el-radio-group>
          </div>
          <div>
            <el-button v-show="provinceOther.length>0" class="optBtn" size="mini" @click.stop="searchShow.province=!searchShow.province">更多</el-button>
          </div>
        </div>
        <div class="content-part">
          <!-- 市 -->
          <div class="cascade-search">
            <div>
              <el-radio-group v-model="search.city" size="mini" class="cascade-check" @change="getCountryList">
                <div class="cascade-display">
                  <div class="cascade-top">
                    <div>
                      <div v-for="(item,index) in cityTop" :key="index">
                        <el-radio-button class="noBackCheck" :label="item.cityId">{{item.city}}</el-radio-button>
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
                          <el-radio-button class="noBackCheck" :label="item.cityId">{{item.city}}</el-radio-button>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </el-radio-group>

            </div>
            <div>

            </div>
          </div>
          <!--  乡-->
          <div class="cascade-search">
            <div>
              <el-radio-group v-model="search.county" size="mini" class="cascade-check" @change="getTownList">
                <div class="cascade-display">
                  <!-- @mouseover="searchShow.county=true" @mouseout="searchShow.county=false" -->
                  <div class="cascade-top">
                    <div>
                      <div v-for="(item,index) in countyTop" :key="index">
                        <el-radio-button class="noBackCheck" :label="item.countryId">{{item.country}}</el-radio-button>
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
                          <el-radio-button class="noBackCheck" :label="item.countryId">{{item.country}}</el-radio-button>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </el-radio-group>

            </div>
            <div>

            </div>
          </div>
          <!--  镇-->
          <div class="cascade-search">
            <div>
              <el-radio-group v-model="search.township" size="mini" class="cascade-check" @change="getVillageList">
                <div class="cascade-display">
                  <div class="cascade-top">
                    <div>
                      <div v-for="(item,index) in townshipTop" :key="index">
                        <el-radio-button class="noBackCheck" :label="item.townId">{{item.town}}</el-radio-button>
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
                          <el-radio-button class="noBackCheck" :label="item.townId">{{item.town}}</el-radio-button>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </el-radio-group>

            </div>
            <div>

            </div>
          </div>
          <!--  村-->
          <div class="cascade-search">
            <div>
              <el-radio-group v-model="search.village" size="mini" class="cascade-check" @change="getStationList">
                <div class="cascade-display">
                  <div class="cascade-top">
                    <div>
                      <div v-for="(item,index) in villageTop" :key="index">
                        <el-radio-button class="noBackCheck" :label="item.villageId">{{item.village}}</el-radio-button>
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
                          <el-radio-button class="noBackCheck" :label="item.villageId">{{item.village}}</el-radio-button>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </el-radio-group>

            </div>
          </div>
          <!-- 机房-->
          <div class="cascade-search">
            <div>
              <el-radio-group v-model="search.area" size="mini" class="cascade-check" @change="getDidList">
                <div class="cascade-display">
                  <div class="cascade-top">
                    <div>
                      <div v-for="(item,index) in areaTop" :key="index">
                        <el-radio-button class="noBackCheck" :label="item.stationId">{{item.station}}</el-radio-button>
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
                          <el-radio-button class="noBackCheck" :label="item.stationId">{{item.station}}</el-radio-button>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </el-radio-group>

            </div>
            <div>

            </div>
          </div>
          <!-- 设备 -->
          <div class="card-part">
            <el-card v-for="item in deviceList" shadow="hover" class="device-card" :class="{'active-card':item.did==activeDid}" @click.native="choseDevice(item.did)">
              <div class="img-part">
                <img :src="item.imgSrc" />
              </div>
              <div class="info-part">
                <div>{{item.deviceName}}</div>
                <!-- <div>IP:{{item.ip}}</div> -->
              </div>
            </el-card>
          </div>
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
      search: {
        province: "",
        city: "",
        area: "",
        county: "",
        township: "",
        village: ""
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
      activeDid: ""
    };
  },
  created() {
    let _this = this;
    _this.activeDid = _this.$store.state.activeDid;
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
      let param = [{}];
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
        if (_this.provinceTop.length > 0) {
          _this.search.province = _this.provinceTop[0].provinceId;
          _this.getCityList(_this.search.province);
        } else {
          _this.$message.warning("请添加设备");
        }
      }
    },
    //市
    async getCityList(province) {
      let _this = this;
      let param = new Array();
      param.push({
        provinceId: province
      });
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
        if (_this.cityTop.length > 0) {
          _this.search.city = _this.cityTop[0].cityId;
          _this.getCountryList(_this.search.city);
        }
      }
    },
    //乡
    async getCountryList(city) {
      let _this = this;
      let param = new Array();
      //	city.forEach(itme => {
      param.push({
        provinceId: "000",
        cityId: city
      });
      //	})
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
        if (_this.countyTop.length > 0) {
          _this.search.county = _this.countyTop[0].countryId;
          _this.getTownList(_this.search.county);
        }
      }
    },
    //镇
    async getTownList(country) {
      let _this = this;
      let param = new Array();
      //country.forEach(itme => {
      param.push({
        provinceId: "000",
        cityId: "000",
        countryId: country
      });
      //	})
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
        if (_this.townshipTop.length > 0) {
          _this.search.township = _this.townshipTop[0].townId;
          _this.getVillageList(_this.search.township);
        }
      }
    },
    //村
    async getVillageList(town) {
      let _this = this;
      let param = new Array();
      //	Town.forEach(itme => {
      param.push({
        provinceId: "000",
        cityId: "000",
        countryId: "000",
        townId: town
      });
      //})
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
        if (_this.villageTop.length > 0) {
          _this.search.village = _this.villageTop[0].villageId;
          _this.getStationList(_this.search.village);
        }
      }
    },
    //获取局站信息
    async getStationList(villag) {
      let _this = this;
      let param = new Array();
      //Town.forEach(itme => {
      param.push({
        provinceId: "000",
        cityId: "000",
        countryId: "000",
        townId: "000",
        villageId: villag
      });
      //})
      let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        console.log(res);
        if (res.length > _this.castTopLength) {
          _this.areaTop = res.slice(0, _this.castTopLength);
          _this.areaOther = res.slice(_this.castTopLength);
        } else {
          _this.areaTop = res;
        }
        if (_this.areaTop.length > 0) {
          _this.search.area = _this.areaTop[0].stationId;
          _this.getDidList(_this.search.area);
        }
      }
    },
    //获取设备DID信息
    async getDidList(val) {
      let _this = this;
      let param = new Array();
      //val.forEach(item => {
      param.push({
        provinceId: "000",
        cityId: "000",
        countryId: "000",
        townId: "000",
        villageId: "000",
        stationId: val
      });
      //})
      let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        res.forEach(item => {
          item.imgSrc = "/img/device/P004-C.jpg";
        });
        _this.deviceList = res;
        //_this.$emit("getDidList", didList);
      }
    },
    disappear() {
      let _this = this;
      if (_this.search.area.length > 0) _this.selectShow = false;
    },
    choseDevice(did) {
      let _this = this;
      _this.activeDid = did;
      _this.$store.commit("changeDid", did);
      _this.$router.push({
        path: "/monitor/oneDevice"
      });
    }
  }
};
</script>

<style lang="scss">
@import "assets/css/other.scss";

#deviceSelect {
  //position: relative;
}

#deviceSelect > .one-part {
  // position: absolute;
  // top: 0px;
  // z-index: 10;
  background: rgb(249, 252, 255);
}

#device-nav {
  height: 20px;
}

.casecade-part.one-part > .content-part {
  width: 100%;
  padding: 5px 0px;
  padding-bottom: 20px;
}

.casecade-part.one-part > .content-part .cascade-search {
  width: calc(100% - 30px);
  padding: 0 15px;
}

.content-part .cascade-top {
  height: 45px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1.5px solid $border-split-color;
}

.content-part .cascade-top > div {
  display: flex;

  align-items: center;
}

.content-part .cascade-top > div:first-child {
  width: calc(100% - 100px);
  justify-content: flex-start;
}

.content-part .cascade-top > div:last-child {
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

.cascade-other > div {
  width: calc(100% - 100px);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}

.cascade-display > div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.cascade-display .el-radio-button .el-radio-button__inner {
  border-radius: 4px;
}

.title-part > div:first-child {
  width: calc(100% - 100px);
}

.cascade-check {
  width: 100%;
}

#deviceSelect .card-part {
  width: calc(100% - 30px);
  padding: 10px 15px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 10px;
  flex-wrap: wrap;
  box-shadow: none;
  border: none;
}

.el-card__body {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
}

.card-part > .device-card {
  width: calc(20% - 10px);
  height: 180px;
  min-width: 180px;
  margin: 5px;
}

.card-part > .device-card .info-part {
  width: 100%;
  height: 50px;
}

.card-part > .device-card .info-part > div {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: $font-color;
}

.card-part > .device-card .img-part {
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-part > .device-card .img-part > img {
  height: auto;
  width: 100%;
}
.device-card.active-card {
  box-shadow: 0 0 5px #32aaee;
}
</style>
