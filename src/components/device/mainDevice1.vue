<template>
  <div id="mainDevice">
    <div class="oneMain">
      <div class="tools">
        <div>
          <el-form :inline="true" :model="search" size="mini">
            <el-form-item label="公司名称">
              <el-select class="short-input" clearable v-model="search.cname" placeholder="请选择" @change="refreshTable()">
                <el-option v-for="(item,index) in companyList" :key="index" :label="item.comName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称">
              <el-input placeholder="" v-model="search.name" @change="refreshTable()" class="input-with-select" @keyup.enter.native="refreshTable()">
                <el-button slot="append" icon="el-icon-search" v-on:click="refreshTable()"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="addBtn" size="small" @click="addOne()" v-if="rootlist.add">添加设备</el-button>
              <el-button class="delBtn" size="small" @click="delectSome()" v-if="firstType=='selection'&&rootlist.delete">删除设备</el-button>
              <el-button class="cancleBtn" size="small" @click="changeEdit">{{toolsTitle}}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button icon="el-icon-refresh" size="small" class="btn refBtn btnRight" @click="refreshTable"></el-button>
        </div>
      </div>
      <div class="tableContent">
        <el-table height="679" :data="tableData" tooltip-effect="light" ref="table" size="small" v-loading="loading" class="table" @selection-change="changeSelect">
          <el-table-column type="index" label="序号" width="50" :resizable="false" key="indexOOO" v-if="firstType=='index'"></el-table-column>
          <el-table-column type="selection" label="序号" width="50" :resizable="false" key="select000" v-if="firstType=='selection'"></el-table-column>
          <el-table-column v-for="(item,key) in tableCloumn" :prop="item.prop" :key="item.prop" :resizable="false" :label="item.label" :min-width="item.width" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              {{getDisplay(scope)}}
            </template>
          </el-table-column>
          <el-table-column v-for="(item,key) in tableSwitchCloumn" :prop="item.prop" :key="item.prop" :resizable="false" :label="item.label" :min-width="item.width" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <div :class="{active:scope.row[item.prop]==1,'alarm-high':scope.row[item.prop]==0}"></div>
            </template>
          </el-table-column>
          <el-table-column prop="createtime" key="createtime" :resizable="false" label="创建时间" :min-width="180" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              {{getDisplay(scope)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="500" key="editUpdate" align="center">
            <template slot-scope="scope">
              <el-button v-on:click="lenoveTest(scope.row)" type="primary" :plain="true" size="mini">设备联通测试</el-button>
              <el-button v-on:click="updateStatus(scope.row)" type="warning" :plain="true" size="mini">更新设备状态</el-button>
              <el-button v-on:click="showUpdateIp(scope.row)" class="optBtn2" :plain="true" size="mini">修改IP</el-button>
              <el-button v-on:click="equipmentattribute(scope.row)" type="info" :plain="true" size="mini">设备属性</el-button>
              <el-button v-if="firstType=='selection'&&rootlist.update" @click="updateOne(scope.row)" type="success" :plain="true" size="mini">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="page">
          <el-pagination @current-change="changePage" :current-page.sync="currentPage" :page-size.sync="pageSize" layout="prev, pager, next,jumper,->,total" :total="total"></el-pagination>
        </el-row>
      </div>
    </div>
    <!--编辑设备 -->
    <el-dialog :visible.sync="editVisible" :close-on-click-modal="false" width="750px">
      <div slot="title">
        {{editTitle}}
      </div>
      <el-form ref="form" :model="form" :rules="formRule" label-width="120px" size="mini" class="form two-item-form" label-position="left">
        <el-form-item label="设备名称" prop="name" style="margin-top:20px">
          <el-input class="short-input" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type" style="margin-top:20px">
          <el-select class="short-input" v-model="form.type" placeholder="请选择">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.exCode" :value="item.inCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司" prop="cid">
          <el-select class="short-input" v-model="form.cid" placeholder="请选择">
            <el-option v-for="(item,index) in companyList" :key="index" :label="item.comName" :value="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form" :rules="formRule" label-width="120px" size="mini" class="form two-item-form" label-position="left">
        <el-form-item label="IP" prop="ip" v-if="editTitle.indexOf('添加')==0" style="margin-top:20px">
          <el-input class="short-input" v-model="form.ip"></el-input>
        </el-form-item>
        <el-form-item label="子网掩码" prop="mask" v-if="editTitle.indexOf('添加')==0" style="margin-top:20px">
          <el-input class="short-input" v-model="form.mask"></el-input>
        </el-form-item>
        <el-form-item label="网关" prop="gateway" v-if="editTitle.indexOf('添加')==0">
          <el-input class="short-input" v-model="form.gateway"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port" v-if="editTitle.indexOf('添加')==0">
          <el-input class="short-input" v-model="form.port"></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form" :rules="formRule" label-width="120px" size="mini" class="form two-item-form" label-position="left">
        <el-form-item label="经度" prop="lang" style="margin-top:20px">
          <el-input class="short-input" v-model="form.lang"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="lat" style="margin-top:20px">
          <el-input class="short-input" v-model="form.lat"></el-input>
        </el-form-item>
        <el-form-item label="省" prop="provinceId">
          <el-select class="short-input" v-model="form.provinceId" placeholder="请选择" @change="getCityList">
            <el-option v-for="(item,index) in provinceList" :key="index" :label="item.provinceName" :value="item.provinceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="cityId">
          <el-select class="short-input" v-model="form.cityId" placeholder="请选择" @change="getCountryList">
            <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityName" :value="item.cityId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="县/区" prop="countryId">
          <el-select class="short-input" v-model="form.countryId" placeholder="请选择" @change="getTownList">
            <el-option v-for="(item,index) in countryList" :key="index" :label="item.countryName" :value="item.countryId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="镇" prop="townId">
          <el-select class="short-input" v-model="form.townId" placeholder="请选择" @change="getVillageList">
            <el-option v-for="(item,index) in townList" :key="index" :label="item.townName" :value="item.townId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="村" prop="villageId">
          <el-select class="short-input" v-model="form.villageId" placeholder="请选择" @change="getStation1">
            <el-option v-for="(item,index) in villageList" :key="index" :label="item.villageName" :value="item.villageId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="局站" prop="station">
          <el-select v-model="form.stationId" placeholder="请选择" style="width:120px">
            <el-option v-for="item in stationList" :key="item.id" :value="item.stationId" :label="item.name">
            </el-option>
          </el-select>
          <el-button @click="stationment" :disabled="this.form.villageId=='' ?true:false">局站管理</el-button>
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input class="short-input" v-model="form.floor"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-input class="short-input" v-model="form.position"></el-input>
        </el-form-item>
      </el-form>

      <div class="dialog-footer" slot="footer">
        <el-button type="primary" :disabled="submitDis" size="small" class="sureBtn" @click="submitEdit1()">确定</el-button>
        <el-button @click="editVisible=false" class="cancelBtn" size="small">取消</el-button>
      </div>
    </el-dialog>
    <!-- IP搜索 -->
    <el-dialog :visible.sync="ipVisible" :close-on-click-modal="false" width="550px">
      <div slot="title">
        IP搜索
      </div>
      <el-form ref="ipform" :model="ipform" :rules="ipformRule" label-width="70px" size="mini" class="form" label-position="left">
        <el-form-item label="起始IP" prop="startIpAddressBatch">
          <el-input placeholder="" size="small" v-model="ipform.startIpAddressBatch" class="short-input"></el-input>
        </el-form-item>
        <el-form-item label="终止IP" prop="endIpAddressBatch">
          <el-input placeholder="" size="small" v-model="ipform.endIpAddressBatch" class="short-input"></el-input>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input placeholder="" size="small" v-model="ipform.port" class="short-input"></el-input>
          <el-button size="mini" class="optBtn3" v-on:click="searchip()" style="float: right;">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="dialogTable" v-loading="sloading">
        <el-table ref="table" height="300" :data="searchDeviceList" tooltip-effect="light" size="small" v-loading="loading" class="table" border>
          <el-table-column type="index" label="序号" width="50" :resizable="false" key="indexOOO" v-if="firstType=='index'"></el-table-column>
          <el-table-column v-for="(item,key) in searchDeviceCloumn" :prop="item.prop" :key="key" :resizable="false" :label="item.label" :min-width="item.width" :show-overflow-tooltip="true" align="center"></el-table-column>
          <el-table-column label="操作" width="120" key="editUpdate" align="center">
            <template slot-scope="scope">
              <el-button class="udpBtn" type="text" size="small" @click="addOne(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="dialog-footer" slot="footer">
        <!-- <el-button type="primary" size="small" class="sureBtn" @click="submitEdit()">确定</el-button>
				<el-button @click="editVisible=false" class="cancelBtn" size="small">取消</el-button> -->
      </div>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog :visible.sync="detailsVisible" :close-on-click-modal="false" width="600px">
      <div slot="title">{{deviceDetails.name}}详细信息</div>
      <div class="details-info">
        <div class="two-info" v-for="(item,index) in detailsInfo" :key="index">
          <span class="label">{{item.name}}</span>
          <span class="value" v-if="index===7">{{formatDateTime(deviceDetails[item.prop])}}</span>
          <span class="value" v-else>{{deviceDetails[item.prop]}}</span>
        </div>
        <div class="one-info">
          <span class="label">位置</span>
          <span class="value">{{deviceDetails.positionInfo}}</span>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="ipSetVisible" :close-on-click-modal="false" width="450px">
      <div slot="title">
        {{upIpform.name}}IP设置
      </div>
      <el-form ref="upIpform" :model="upIpform" :rules="ipRules" label-width="80px" size="mini" class="form" label-position="left">
        <el-form-item label="IP" prop="ip">
          <el-input class="short-input" v-model="upIpform.ip"></el-input>
        </el-form-item>
        <el-form-item label="子网掩码" prop="mask">
          <el-input class="short-input" v-model="upIpform.mask"></el-input>
        </el-form-item>
        <el-form-item label="网关" prop="gateway">
          <el-input class="short-input" v-model="upIpform.gateway"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input class="short-input" v-model="upIpform.port"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" :disabled="submitIpDis" size="small" class="sureBtn" @click="submitIpSet()">确定</el-button>
        <el-button @click="ipSetVisible=false" class="cancelBtn" size="small">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="ipSetVisible1" :close-on-click-modal="false" width="1500px" :before-close="closeDeviceDetails">
      <div slot="title">
        设备属性管理
      </div>
      <div class="far">
        <div class="fartype">设备型号:{{standby}}</div>
        <div class="farbox">
          <div class="leftcircle">
            <div></div>
            <div></div>
          </div>
          <div class="content">
            <div class="device-content">
              <div class="power-part">
                <div class="one-slot" v-for="(item,index) in powerList" :key="index">
                  <div>{{item.sndname}}</div>
                  <div>
                    <div :class="{active:item.states==1,'alarm-high':item.states=='0','attr-manage':true}"></div>
                  </div>
                  <div><span v-show="item.sndsite">槽位{{item.sndsite}}</span> </div>
                  <div v-show="item.newStatus">
                    <el-tooltip placement="right" effect="light" popper-class="popo-cos">
                      <div v-if="item.newStatus==1" :class="{activeone:true}" @click="updateNewstatus(item)"></div>
                      <div v-else-if="item.newStatus==2" :class="{activetwo:true}" @click="updateNewstatus(item)"></div>
                      <div v-else-if="item.newStatus==3" :class="{activethree:true}" @click="updateNewstatus(item)"></div>
                      <div v-else-if="item.newStatus==4" :class="{activefour:true}" @click="updateNewstatus(item)"></div>
                      <div v-else-if="item.newStatus==5" :class="{activefive:true}" @click="updateNewstatus(item)"></div>
                      <div slot="content">
                        <div class="icon-lengend">
                          <span class="icon-font"><span class="activeone"></span><span class="icon-f icon-fontone">&nbsp;master更换为slave</span></span>
                          <span class="icon-font"><span class="activetwo"></span><span class="icon-f icon-fonttwo">&nbsp;slave更换为master</span></span>
                          <span class="icon-font"><span class="activethree"></span><span class="icon-f icon-fontthree">&nbsp;板子类型不变</span></span>
                          <span class="icon-font"><span class="activefour"></span><span class="icon-f icon-fontfour">&nbsp;板子拔出</span></span>
                          <span class="icon-font"><span class="activefive"></span><span class="icon-f icon-fonttfive">&nbsp;新板插入</span></span>
                        </div>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div class="right-part">
                <div v-for="(item,index) in rightList" :key="index" class="one-slot">
                  <div v-if="item.channelNumber && item.snddef=='是'">{{item.sndname}}-{{item.channelNumber}}带保护</div>
                  <div v-else-if="item.channelNumber && item.snddef=='否'">{{item.sndname}}-{{item.channelNumber}}不带保护</div>
                  <div v-else>{{item.sndname}}</div>
                  <div>
                    <div :class="{active:item.states==1,'alarm-high':item.states==0,'attr-manage':true}"></div>
                  </div>
                  <div>槽位{{item.sndsite}}</div>
                  <div v-show="item.newStatus">
                    <el-tooltip placement="right" effect="light" popper-class="popo-cos">
                      <div v-if="item.newStatus==1" :class="{activeone:true}" @click="updateNewstatus(item)"></div>
                      <div v-else-if="item.newStatus==2" :class="{activetwo:true}" @click="updateNewstatus(item)"></div>
                      <div v-else-if="item.newStatus==3" :class="{activethree:true}" @click="updateNewstatus(item)"></div>
                      <div v-else-if="item.newStatus==4" :class="{activefour:true}" @click="updateNewstatus(item)"></div>
                      <div v-else-if="item.newStatus==5" :class="{activefive:true}" @click="updateNewstatus(item)"></div>
                      <div slot="content">
                        <div class="icon-lengend">
                          <span class="icon-font"><span class="on icon"></span><span class="icon-f icon-fontone">&nbsp;master更换为slave</span></span>
                          <span class="icon-font"><span class="shockf icon"></span><span class="icon-f icon-fonttwo">&nbsp;salve更换为master</span></span>
                          <span class="icon-font"><span class="iconfont icon-false-circle cha icon"></span><span class="icon-f icon-fontthree">&nbsp;板子类型不变</span></span>
                          <span class="icon-font"><span class="iconfont icon-false-circle cha icon"></span><span class="icon-f icon-fontfour">&nbsp;板子拔出</span></span>
                          <span class="icon-font"><span class="iconfont icon-false-circle cha icon"></span><span class="icon-f icon-fontfive">&nbsp;新板插入</span></span>
                        </div>
                      </div>
                    </el-tooltip>
                  </div>
                  <div v-show="item.newStatus">
                    <el-button size="small" type="mini" @click="updateNewstatus(item)" v-if="item.newStatus==1">确认更新</el-button>
                    <el-button size="small" type="mini" @click="updateNewstatus(item)" v-if="item.newStatus==2">确认更新</el-button>
                    <el-button size="small" type="mini" @click="updateNewstatus(item)" v-if="item.newStatus==3">确认更新</el-button>
                    <el-button size="small" type="mini" @click="updateNewstatus(item)" v-if="item.newStatus==4">确认更新</el-button>
                    <el-button size="small" type="mini" @click="updateNewstatus(item)" v-if="item.newStatus==5">确认更新</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="rightcircle">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div class=" dialogTable" style="margin-top:100px">
        <el-table ref="table" height="600" :data="SNData" tooltip-effect="light" size="small" class="table">
          <el-table-column prop='sndtable' label="用户自定义标签" :resizable="false" min-width="120" :render-header="renderHeader" align="center">
            <template slot-scope="pope">
              <editable-cell :text.sync="pope.row.sndtable" v-on:update:text="updateCellreg($event,pope,'sndtable')" maxlength='40'></editable-cell>
            </template>
          </el-table-column>
          <el-table-column prop='sndname' label="名称" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='states' label="在线状态" :resizable="false" min-width="60" align="center">
            <template slot-scope="pope">
              <div :class="{active:pope.row.states==1,'alarm-high':pope.row.states==0,'attr-manage':true}"></div>
            </template>
          </el-table-column>
          <el-table-column prop='sndsite' label="占用槽位" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='sndsn' label="SN序列号" :resizable="false" min-width="100" :render-header="renderHeader" align="center">
            <template slot-scope="pope">
              <editable-cell v-if="pope.$index<3" :text.sync="pope.row.sndsn" v-on:update:text="updateCell($event,pope,'sndsn')"></editable-cell>
              <span v-else>{{pope.row.sndsn}}</span>
            </template>
          </el-table-column>
          <el-table-column prop='sndpro' label="产品号" :resizable="false" min-width="100" align="center">
          </el-table-column>
          <el-table-column prop='sndnum' label="序列号" :resizable="false" min-width="100" align="center">
          </el-table-column>
          <el-table-column prop='sndhard' label="硬件版本" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='sndsoft' label="软件版本" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='sndcard' label="板卡类型" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='snddef' label="是否带保护" :resizable="false" min-width="60" align="center">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 弹出局站管理 -->
    <el-dialog title="局站管理" :visible.sync="stationdialogTableVisible" width="900px">
      <el-button size="mini" @click="stationadd">添加</el-button>
      <el-table :data="gridData">
        <el-table-column prop="name" label="名称" width="200px">
          <template slot-scope="pope">
            <editable-cell :text.sync="pope.row.name" v-on:update:text="updateStation($event,pope,'name')"></editable-cell>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="stationdel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import systemEdit from "@/mixins/systemEdit";
import tablePublic from "@/mixins/tablePublic.js";
import detailsInfo from "./utils/deviceDetails.js";
import editableCell from "@c/utils/editableCell.vue";
import { filter } from "minimatch";
export default {
  name: "mainDevice",
  mixins: [systemEdit, tablePublic],
  components: {
    editableCell
  },
  data() {
    var testPort = (rule, value, callback) => {
      if (value > 0 && value < 65535) {
        callback();
      } else {
        callback(new Error("端口号输入错误"));
      }
    };
    var testName = (rule, value, callback) => {
      let _this = this;
      if (_this.editTitle.indexOf("增加") > -1) {
        let param = {
          name: value
        };
        _this.$api
          .postRequest(param, _this.token, "testDeviceName")
          .then(res => {
            if (res.code) {
              callback();
            } else {
              if (res != "error") {
                callback(new Error("该设备名称已存在"));
              }
              callback();
            }
          })
          .catch(() => {
            callback();
          });
      } else {
        callback();
      }
    };
    var testIP = (rule, value, callback) => {
      let _this = this;
      let start = _this.ipform.startIpAddressBatch;
      let end = _this.ipform.endIpAddressBatch;
      if (start && end) {
        if (start == end) {
          callback(new Error("起始IP与终止IP不能相同"));
        } else {
          let startp = start.split(".");
          let endp = end.split(".");
          let index = startp.findIndex((item, ii) => {
            return item != endp[ii];
          });
          if (index < 3) {
            callback(new Error("起始IP与终止IP必须在同一网段内"));
          }
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      loading: false,
      updateStatusnum: [],
      updateStatusnumid: "",
      powerList: [],
      rightList: [],
      updateList: [],
      gridData: [],
      stationList: [],
      stationdialogTableVisible: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      demo: [],
      flag: false,
      dialoginput: "",
      titleName: "设备",
      entity: "Device",
      addUrl: "addDevice",
      updateUrl: "updateDevice",
      deleteUrl: "deleteDevices",
      newslot: [],
      newtype: [],
      lightFarData: [],
      rootlist: {
        add: true,
        delete: true,
        update: true
      },
      search: {
        cname: "",
        name: ""
      },
      tableCloumn: [
        {
          prop: "cname",
          label: "公司",
          width: "100"
        },
        {
          prop: "name",
          label: "设备名称",
          width: "100"
        },
        {
          prop: "ip",
          label: "IP",
          width: "100"
        },
        {
          prop: "port",
          label: "端口号",
          width: "100"
        },
        {
          prop: "type",
          label: "设备类型",
          width: "100"
        }
      ],
      tableSwitchCloumn: [
        {
          prop: "b1",
          label: "主控板1",
          width: "100"
        },
        {
          prop: "b2",
          label: "主控板2",
          width: "100"
        },
        {
          prop: "p1",
          label: "电源板1",
          width: "100"
        },
        {
          prop: "p2",
          label: "电源板2",
          width: "100"
        }
      ],
      devname: [
        {
          prop: "b1",
          label: "电源1"
        },
        {
          prop: "b2",
          label: "电源2"
        },
        {
          prop: "p1",
          label: "机框"
        },
        {
          prop: "p2",
          label: "主控板1"
        },
        {
          prop: "p2",
          label: "波分板1"
        }
      ],
      companyList: [],
      typeList: [],
      tableUrl: "getDeviceList",
      villagestationId: "",
      form: {
        id: "",
        name: "",
        cid: "",
        cname: "",
        type: "",
        ip: "",
        port: "",
        createtime: "",
        oldIp: "",
        oldPort: "",
        mask: "",
        gateway: "",
        lang: "",
        lat: "",
        provinceId: "",
        cityId: "",
        countryId: "",
        townId: "",
        villageId: "",
        stationId: "",
        floor: "",
        position: "",
        frameSN: "",
        power1SN: "",
        power1Label: "",
        power2SN: "",
        power2Label: ""
      },
      formInputList: [
        {
          label: "局站",
          prop: "station"
        },
        {
          label: "楼层",
          prop: "floor"
        },
        {
          label: "位置",
          prop: "position"
        }
      ],
      formRule: {
        name: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur"
          },
          {
            pattern: /^[^\u4e00-\u9fa5]*$/,
            message: "请勿输入汉字"
          },
          {
            validator: testName,
            trigger: "blur"
          }
        ],
        lang: [
          {
            required: true,
            message: "请输入经度",
            trigger: "blur"
          },
          {
            pattern: /^((([1-9]\d{1,2})|\d)(\.\d{1,6})?)$/,
            message: "整数位数为3位以下，小数位数为6位以下",
            trigger: "blur"
          }
        ],
        lat: [
          {
            required: true,
            message: "请输入纬度",
            trigger: "blur"
          },
          {
            pattern: /^((([1-9]\d{1,2})|\d)(\.\d{1,6})?)$/,
            message: "整数位数为3位以下，小数位数为6位以下",
            trigger: "blur"
          }
        ],
        cid: [
          {
            required: true,
            message: "请选择公司"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择设备类型"
          }
        ],
        ip: [
          {
            required: true,
            message: "请输入IP",
            trigger: "blur"
          },
          {
            pattern: /^(((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))(\.((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))){3})$/,
            message: "请输入正确的IP格式",
            trigger: "blur"
          }
        ],
        gateway: [
          {
            required: true,
            message: "请输入网关",
            trigger: "blur"
          },
          {
            pattern: /^(((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))(\.((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))){3})$/,
            message: "请输入正确的IP格式",
            trigger: "blur"
          }
        ],
        mask: [
          {
            required: true,
            message: "请输入子网掩码",
            trigger: "blur"
          },
          {
            pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/,
            message: "请输入正确的子网掩码格式",
            trigger: "blur"
          }
        ],
        port: [
          {
            required: true,
            message: "请输入端口号",
            trigger: "blur"
          },
          {
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          },
          {
            validator: testPort,
            trigger: "blur"
          }
        ],
        frameSN: [
          {
            pattern: /^[^\u4e00-\u9fa5]*$/,
            message: "请勿输入汉字"
          }
        ],
        power1SN: [
          {
            pattern: /^[^\u4e00-\u9fa5]*$/,
            message: "请勿输入汉字"
          }
        ],
        power2SN: [
          {
            pattern: /^[^\u4e00-\u9fa5]*$/,
            message: "请勿输入汉字"
          }
        ]
      },
      ipSetVisible: false,
      ipSetVisible1: false,
      upIpform: {
        id: "",
        ip: "",
        port: "",
        mask: "",
        gateway: "",
        name: ""
      },
      ipRules: {
        ip: [
          {
            required: true,
            message: "请输入IP",
            trigger: "blur"
          },
          {
            pattern: /^(((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))(\.((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))){3})$/,
            message: "请输入正确的IP格式",
            trigger: "blur"
          }
        ],
        gateway: [
          {
            required: true,
            message: "请输入IP",
            trigger: "blur"
          },
          {
            pattern: /^(((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))(\.((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))){3})$/,
            message: "请输入正确的IP格式",
            trigger: "blur"
          }
        ],
        mask: [
          {
            required: true,
            message: "请输入子网掩码",
            trigger: "blur"
          },
          {
            pattern: /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/,
            message: "请输入正确的IP格式",
            trigger: "blur"
          }
        ],
        port: [
          {
            required: true,
            message: "请输入端口号",
            trigger: "blur"
          },
          {
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          },
          {
            validator: testPort,
            trigger: "blur"
          }
        ]
      },
      ipVisible: false,
      ipform: {
        startIpAddressBatch: "",
        endIpAddressBatch: "",
        port: ""
      },
      ipformRule: {
        startIpAddressBatch: [
          {
            required: true,
            message: "请输入IP",
            trigger: "blur"
          },
          {
            pattern: /^(((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))(\.((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))){3})$/,
            message: "请输入正确的IP格式",
            trigger: "blur"
          },
          {
            validator: testIP,
            trigger: "blur"
          }
        ],
        endIpAddressBatch: [
          {
            required: true,
            message: "请输入IP",
            trigger: "blur"
          },
          {
            pattern: /^(((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))(\.((25[0-5])|(2[0-4]\d)|([0-1]?\d{1,2}))){3})$/,
            message: "请输入正确的IP格式",
            trigger: "blur"
          },
          {
            validator: testIP,
            trigger: "blur"
          }
        ],
        port: [
          {
            required: true,
            message: "请输入IP",
            trigger: "blur"
          },
          {
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          },
          {
            validator: testPort,
            trigger: "blur"
          }
        ]
      },
      sloading: false,
      searchDeviceList: [],
      searchDeviceCloumn: [
        {
          prop: "ip",
          label: "IP",
          width: "100"
        },
        {
          prop: "port",
          label: "端口号",
          width: "100"
        },
        {
          prop: "type",
          label: "设备类型",
          width: "100"
        }
      ],
      provinceList: [],
      cityList: [],
      countryList: [],
      townList: [],
      villageList: [],
      SNData: [],
      detailsVisible: false,
      deviceDetails: "",
      detailsInfo: detailsInfo,
      submitIpDis: false,
      snReg: /[\x00-\xff]{20}/,
      snLabel: "SN号为20个ASCII字符",
      snDid: "",
      standby: "",
      villagestationId: ""
    };
  },
  created() {
    let _this = this;
    _this.getCompanyList();
    _this.geteDeviceTypeList();
  },
  mounted() {
    let _this = this;
    _this.getProvinceList();
  },
  methods: {
    // 刷新局站删除
    refreshTablestation() {
      let _this = this;
      _this.currentPage = 1;
      _this.getStation(_this.villagestationId);
    },
    // 获取局站信息
    getStation1(villageId) {
      let _this = this;
      _this.villagestationId = villageId;
      _this.getStation(villageId);
    },
    async getStation(villageId) {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getStaion", villageId);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.stationList = res;
        _this.gridData = res;
      }
    },
    // 添加局站信息
    stationadd() {
      let _this = this;
      let stationarr = new Array();
      _this.gridData.push(stationarr);
    },
    // 添加或者修改局站信息
    async updateStation(event, pope, name) {
      console.log(event, pope, name);
      let param = {
        name: event,
        villageId: this.form.villageId
      };
      if (!pope.row.villageId) {
        let _this = this;
        let res = await _this.$api.postRequest(param, "getStaionadd");
        if (res.code) {
          // _this.$message.warining(res.msg);
          let colomn = pope.column.property; //colomn=sndsn
          let oldValue = pope.row[colomn];
          setTimeout(() => {
            pope.row[colomn] = oldValue;
          }, 50);
        } else {
          _this.$message.success("添加成功");
          pope.row.name = event;
          this.refreshTablestation();
        }
      } else {
        let _this = this;
        let param = {
          name: event,
          stationId: pope.row.stationId,
          villageId: _this.form.villageId
        };
        let res = await _this.$api.putRequest(param, "getStationupdate");
        if (res.code) {
          let colomn = pope.column.property; //colomn=sndsn
          let oldValue = pope.row[colomn];
          setTimeout(() => {
            pope.row[colomn] = oldValue;
          }, 50);
        } else {
          _this.$message.success("修改成功");
          pope.row.name = event;
          this.refreshTablestation();
        }
      }
    },
    // 删除局端
    stationdel(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$api.deleteRequest(null, "getStaiondel", row.stationId);
          this.refreshTablestation();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 弹出局站
    stationment() {
      let _this = this;
      _this.stationdialogTableVisible = true;
    },
    // 时间戳转换
    formatDateTime(inputTime) {
      let date = new Date(inputTime);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let minute = date.getMinutes();
      let second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return `${y}-${m}-${d}`;
    },
    renderHeader(h, { column }) {
      return h("div", [
        h("span", column.label),
        h("i", {
          class: "el-icon-edit",
          style: "display:inline-flex;margin-left:5px;"
        })
      ]);
    },

    //获取地理位置信息
    async getProvinceList() {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getProvince");
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.provinceList = res;
      }
    },
    //市
    //type:1修改调用
    async getCityList(province, type) {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getCity", province);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.cityList = res;
        if (type) {
          _this.getCountryList(_this.form.cityId, type);
        }
      }
    },
    //乡
    //type:1修改调用
    async getCountryList(city, type) {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getCountry", city);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.countryList = res;
        if (type) {
          _this.getTownList(_this.form.countryId, type);
        }
      }
    },
    //镇
    async getTownList(country, type) {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getTwon", country);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.townList = res;
        if (type) {
          _this.getVillageList(_this.form.townId, type);
        }
      }
    },
    //村
    async getVillageList(Town, type) {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getVillage", Town);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.villageList = res;
        if (type) {
          _this.getStation(_this.form.villageId, type);
        }
      }
    },
    //获取公司信息
    async getCompanyList() {
      let _this = this;
      let param = {
        pageSize: 10000,
        currentPage: 1,
        entity: _this.entity
      };
      let res = await _this.$api.postRequest(param, "getCompany");
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.companyList = res.list;
      }
    },
    //获取设备类型
    async geteDeviceTypeList() {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getDeviceType");
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.typeList = res;
      }
    },
    //跟新主控板及电源板状态
    async updateStatus(row) {
      let _this = this;
      _this.loading = true;
      _this.updateStatusnumid = row.id;
      let newslot = new Array();
      let newtype = new Array();
      let res = await _this.$api.getRequest(
        null,
        "updateDeviceBStatus",
        row.id
      );
      _this.updateStatusnum = res;
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.updateList = res;
        _this.equipmentattribute(row);
        _this.loading = false;
      }
    },
    async updateNewstatus(row) {
      let _this = this;
      _this.loading = true;
      let param = [
        {
          slot: row.sndsite,
          type: row.newStatus
        }
      ];
      let res = await _this.$api.putRequest(
        param,
        "updateNewstatues",
        _this.updateStatusnumid
      );
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.$message({
          message: "更新设备状态成功",
          type: "success"
        });
        _this.loading = false;
        let list = _this.updateList;
        let index = list.findIndex(item => {
          return item.slot == row.sndsite;
        });
        list.splice(index, 1);
        _this.updateList = list;
        _this.detailist({ id: _this.snDid });
      }
    },
    //添加修改初始化表单
    initForm(form) {
      console.log(form);
      let _this = this;
      let data = new Object();
      if (form) {
        // 公司名称
        let index = _this.companyList.findIndex(item => {
          return item.id == form.cid;
        });
        for (let x in _this.form) {
          data[x] = form[x] || "";
        }
        // ip地址
        data.oldIp = form.ip;
        // 端口号
        data.oldPort = form.port;
        // 公司下标
        data.cid = index;
        // 地址信息
        if (form.area && form.area.length > 0) {
          let area = form.area[0];
          data.provinceId = area.provinceId;
          data.cityId = area.cityId;
          data.countryId = area.countryId;
          data.townId = area.townId;
          data.villageId = area.villageId;
          data.stationId = area.stationId;
          data.floor = area.floor;
          data.position = area.position;
          if (data.provinceId) {
            _this.getCityList(data.provinceId, 1);
          }
        }
      } else {
        for (let x in _this.form) {
          //console.log(x);
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
      console.log(data);
      return data;
    },

    //添加修改提交前处理
    handleEdit() {
      let _this = this;
      let param = JSON.parse(JSON.stringify(_this.form));
      param.cname = _this.companyList[param.cid].comName;
      param.cid = _this.companyList[param.cid].id;
      delete param.oldIp;
      delete param.oldPort;
      if (_this.editTitle == "修改" + _this.titleName) {
        return param;
      } else {
        return param;
      }
    },
    showsearchIP() {
      let _this = this;
      _this.ipform = {
        startIpAddressBatch: "",
        endIpAddressBatch: "",
        port: ""
      };
      _this.ipVisible = true;
    },
    searchip() {
      let _this = this;
      _this.$refs.ipform.validate(valid => {
        if (valid) {
          _this.doSearchip();
        }
      });
    },
    async doSearchip() {
      let _this = this;
      _this.sloading = true;
      let param = JSON.parse(JSON.stringify(_this.ipform));
      let res = await _this.$api.postRequest(param, "searchIp");
      _this.sloading = false;
      if (res.code) {
        _this.loading = false;
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.searchDeviceList = res;
      }
    },
    // 查看设备属性
    equipmentattribute(row) {
      // console.log(row);
      let _this = this;
      _this.standby = row.type;
      _this.ipSetVisible1 = true;
      _this.snDid = row.id;
      _this.detailist(row);
    },

    async detailist(row, list) {
      let _this = this;
      let param = {
        pageSize: _this.pageSize,
        currentPage: _this.currentPage
      };

      let res = await _this.$api.getRequest(null, "getDevice", row.id);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        let masterList = res.master;
        let slaves = res.slave;
        let typeNum = parseInt(res.type.replace(/(5G-)|(U)/g, ""));
        let power = new Array();
        for (let i = 0; i < typeNum * 2; i++) {
          let one = {
            sndtable: "",
            sndname: "",
            sndsn: "",
            states: "",
            sndsite: "",
            newStatus: 0
          };
          power.push(one);
        }

        let jikuang = {
          sndtable: res.deviceLabel,
          sndname: "机框",
          sndsn: res.deviceSn,
          states: "无",
          sndsite: "",
          sndpro: "",
          sndnum: "",
          sndhard: "",
          sndsoft: "",
          sndcard: "",
          snddef: ""
        };
        let p1Slot = 0 - res.p1Slot;
        let power1 = {
          sndtable: res.p1Label,
          sndname: res.p1Name,
          sndsn: res.p1Sn,
          states: res.p1,
          sndsite: 1,
          newStatus: 0
        };
        let p2Slot = 0 - res.p2Slot;
        // 更新电源1,2
        power[typeNum - 1] = power1;
        let power2 = {
          sndtable: res.p2Label,
          sndname: res.p2Name,
          sndsn: res.p2Sn,
          states: res.p2,
          sndsite: 2,
          newStatus: 0
        };
        power[typeNum * 2 - 1] = power2;
        let bottomList = new Array();
        bottomList.push(jikuang);
        bottomList.push(power1);
        bottomList.push(power2);
        bottomList.push({
          sndtable: ""
        });
        const slotNum = typeNum * 4;
        let rightList = new Array();
        for (let i = 0; i < slotNum; i++) {
          let slot = slotNum - i;
          if (slot % 2 == 0) {
            slot -= 1;
          } else {
            slot += 1;
          }
          let one = {
            sndtable: "",
            sndname: "",
            sndsn: "",
            states: 0,
            sndsite: slot,
            sndpro: "",
            sndnum: "",
            sndhard: "",
            sndsoft: "",
            sndcard: "",
            snddef: "",
            newStatus: 0,
            mid: "",
            channelNumber: ""
          };
          rightList.push(one);
        }
        res.master.forEach(item => {
          let ss = {
            sndtable: item.userLabel,
            sndname: "主控板" + item.num,
            sndsn: item.productNumber,
            states: item.status,
            sndsite: item.slot,
            sndpro: item.productNumber,
            sndnum: item.serialNumber,
            sndhard: item.hardwareVersion,
            sndsoft: item.softwareVersion,
            sndcard: "",
            snddef: item.protect,
            newStatus: 0,
            mid: item.id,
            channelNumber: item.channelNumber
          };
          if (item.status == 1) {
            let index = slotNum - item.slot;
            if (index % 2 == 0) {
              index += 1;
            } else {
              index -= 1;
            }
            rightList[index] = ss;
          }
          if (item.slot != "0") {
            bottomList.push(ss);
          }
        });
        bottomList.push({
          sndtable: ""
        });
        res.slave.forEach(item => {
          let ss = {
            sndtable: item.userLabel,
            sndname: "波分板" + item.num,
            sndsn: item.sn,
            states: item.status,
            sndsite: item.slot,
            sndpro: item.pn,
            sndnum: item.sn,
            sndhard: item.hardwareVer,
            sndsoft: item.softwareVer,
            sndcard: "",
            snddef: item.protect,
            sid: item.sid,
            newStatus: 0,
            channelNumber: item.channelNumber
          };
          if (item.status == 1) {
            let index = slotNum - item.slot;
            if (index % 2 == 0) {
              index += 1;
            } else {
              index -= 1;
            }
            rightList[index] = ss;
          }
          if (item.slot != "0") {
            bottomList.push(ss);
          }
        });
        let list = _this.updateList;
        if (list) {
          list.forEach(item => {
            if (item.slot == -1) {
              power[typeNum - 1].newStatus = item.type;
            } else if (item.slot == -2) {
              power[typeNum * 2 - 1].newStatus = item.type;
            } else {
              let index = slotNum - item.slot;
              if (index % 2 == 0) {
                index += 1;
              } else {
                index -= 1;
              }
              rightList[index].newStatus = item.type;
            }
          });
        }
        // console.log(bottomList);
        // console.log(power);
        console.log(rightList);
        _this.SNData = bottomList;
        _this.rightList = rightList;
        _this.powerList = power;
      }
    },

    async updateCell(event, pope, name) {
      // console.log(pope);
      var reg = /^[a-zA-Z]{1,40}$/;
      if (!reg.test(event)) {
        this.$message.warning("只支持英文格式,长度不能超过20ASCII字符");
      } else {
        let _this = this;
        let res;
        if (pope.$index == 0) {
          let id = _this.snDid + "/" + event;

          res = await this.$api.putRequest(null, "editSn", id);
        } else if (pope.$index == 1) {
          let id = _this.snDid + "/" + event;
          res = await this.$api.putRequest(null, "editp1sn", id);
        } else if (pope.$index == 2) {
          let id = _this.snDid + "/" + event;
          res = await this.$api.putRequest(null, "editp2sn", id);
        }
        if (res.code) {
          let colomn = pope.column.property; //colomn=sndsn
          let oldValue = pope.row[colomn];
          _this.$message.warining(res.msg);
          setTimeout(() => {
            pope.row[colomn] = oldValue;
          }, 50);
        } else {
          _this.$message.success("修改成功");
          let colomn = pope.column.property;
          pope.row[colomn] = event;
        }
      }
    },
    // 验证输入的数字长度
    async updateCellreg(event, pope, name) {
      // console.log(pope);
      var reg = /^[a-zA-Z]{1,40}$/;
      if (!reg.test(event)) {
        this.$message.warning("只支持英文格式,长度不能超过40ASCII字符");
      } else {
        let _this = this;
        let res;
        if (pope.$index == 0) {
          let id = _this.snDid + "/" + event;
          res = await this.$api.putRequest(null, "updateDeviceLabel", id);
        } else if (pope.$index == 1) {
          let id = _this.snDid + "/" + event;
          res = await this.$api.putRequest(null, "updateP1Label", id);
        } else if (pope.$index == 2) {
          let id = _this.snDid + "/" + event;
          res = await this.$api.putRequest(null, "updateP2Label", id);
        } else if (pope.$index == 3) {
          let id = pope.row.mid + "/" + event;
          res = await this.$api.putRequest(null, "updateMasterLabel", id);
        } else if (pope.$index == 4) {
          let id = pope.row.mid + "/" + event;
          res = await this.$api.putRequest(null, "updateMasterLabel", id);
        } else if (pope.$index == 5) {
          let id = pope.row.sid + "/" + event;
          res = await this.$api.putRequest(null, "updateSlaveLabel", id);
        } else if (pope.$index == 6) {
          let id = pope.row.sid + "/" + event;
          res = await this.$api.putRequest(null, "updateSlaveLabel", id);
        } else if (pope.$index == 7) {
          let id = pope.row.sid + "/" + event;
          res = await this.$api.putRequest(null, "updateSlaveLabel", id);
        } else if (pope.$index == 8) {
          let id = pope.row.sid + "/" + event;
          res = await this.$api.putRequest(null, "updateSlaveLabel", id);
        } else if (pope.$index == 9) {
          let id = pope.row.sid + "/" + event;
          res = await this.$api.putRequest(null, "updateSlaveLabel", id);
        } else {
          let id = pope.row.sid + "/" + event;
          res = await this.$api.putRequest(null, "updateSlaveLabel", id);
        }
        if (res.code) {
          let colomn = pope.column.property;
          let oldValue = pope.row[colomn];
          _this.$message.warining(res.msg);
          setTimeout(() => {
            pope.row[colomn] = oldValue;
          }, 50);
        } else {
          _this.$message.success("修改成功");
          pope.row.sndtable = event;
        }
      }
    },

    //查看设备详情
    showDetails(row) {
      let _this = this;
      _this.deviceDetails = row;
      let provinceId = row.provinceId || "";
      let cityId = row.cityId || "";
      let countryId = row.countryId || "";
      let townId = row.townId || "";
      let villageId = row.villageId || "";
      let station = row.station || "";
      let floor = row.floor || "";
      let position = row.position || "";
      _this.deviceDetails.positionInfo =
        provinceId +
        cityId +
        countryId +
        townId +
        villageId +
        station +
        floor +
        position;

      _this.detailsVisible = true;
    },
    showUpdateIp(row) {
      let _this = this;
      _this.ipSetVisible = true;
      for (let x in _this.upIpform) {
        _this.upIpform[x] = row[x];
      }
    },
    submitIpSet() {
      let _this = this;
      _this.$refs.upIpform.validate(valid => {
        if (valid) {
          _this.submitIpDis = true;
          _this
            .$confirm(
              "该操作可能会导致此网络与设备失联，是否确认执行？",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
            .then(() => {
              _this.editIp(_this.upIpform);
              _this.ipSetVisible = false;
            })
            .catch(() => {
              _this.submitIpDis = false;
              _this.ipSetVisible = false;
              _this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        }
      });
    },
    async editIp(param) {
      let _this = this;
      // console.log(param);
      let id =
        param.id +
        "/" +
        param.ip +
        "/" +
        param.mask +
        "/" +
        param.gateway +
        "/" +
        param.port;
      let res = await _this.$api.putRequest(null, "updatelocal", id);
      // console.log(res);
      _this.submitIpDis = false;
      if (res.code) {
        _this.loading = false;
        _this.$message({
          message: res.msg,
          type: "warning"
        });
        _this.getTableData();
      } else {
        _this.$message({
          message: "IP修改成功",
          type: "success"
        });
        _this.getTableData();
      }
    },
    initDeleteParam() {
      let _this = this;
      let ids = [];
      _this.delectList.forEach(item => {
        ids.push(item.id);
      });
      let param = ids;
      return param;
    },

    submitEdit1() {
      let _this = this;
      _this.$refs.form.validate(valid => {
        if (valid) {
          _this.submitDis = true;
          _this.editInfo1();
        }
      });
    },
    async editInfo1() {
      let _this = this;
      let param = _this.handleEdit();
      const msssg = _this.editVisible;
      _this.editVisible = false;
      _this.loading = true;
      let res;
      let type;
      if (_this.editTitle == "添加" + _this.titleName) {
        res = await _this.$api.postRequest([param], _this.addUrl);
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
        });
      } else {
        if (msssg) {
          let title = _this.editTitle;
          _this.$message({
            message: title + "成功",
            type: "success"
          });
        }
        _this.handleEditResult(type, res);
      }
    },
    closeDeviceDetails() {
      let _this = this;
      _this.ipSetVisible1 = false;
      _this.updateList = [];
    },
    handleTableParam() {
      let _this = this;
      let inStr = [];
      if (_this.search.cname == null || _this.search.cname === "") {
        let cname = [];
        _this.companyList.forEach(item => {
          // console.log(item);
          cname.push(item.id);
        });
        inStr.did = cname;
      }
      let eqStr = new Object();
      let search = _this.search;
      for (let i in search) {
        if (typeof search[i] != "object") {
          eqStr[i] = search[i];
        }
      }
      let entity = "Alarm";
      let sort = "createtime DESC";
      let param = {
        pageSize: _this.pageSize,
        currentPage: _this.currentPage,
        entity: entity,
        eqStr: JSON.stringify(eqStr),
        sort: sort,
        startime: "",
        endtime: ""
      };
      return param;
    },
    // 硬件设备联通测试
    async lenoveTest(row) {
      let _this = this;
      let res = await _this.$api.getRequest(null, "lenoveTest", row.id);
      console.log(res.msg);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.$message({
          message: "设备联通",
          type: "success"
        });
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss">
@import "/css/circle.css";

#mainDevice .slave {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}

#mainDevice .slave > .slave-one {
  width: 50px;
  border: 1px solid $border-color;
  margin: 0px -1px -1px 0px;
}

#mainDevice .slave > .slave-one > div {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#mainDevice .slave > .slave-one > div:first-child {
  border-bottom: 1px solid $border-color;
  background: $table-header-back-color;
  color: $table-header-font-color;
}

#mainDevice .slave > .slave-one > div:last-child {
  background: $table-odd-back-color;
  color: $table-body-font-color;
}
#mainDevice .two-item-form {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
}
.el-form--label-left .el-form-item__label {
  margin-left: 20px;
}
#mainDevice /deep/.el-table tr:nth-child(odd) {
  background-color: #fff !important;
}
#mainDevice .fartype {
  margin-left: 150px;
  font-size: 18px;
  font-weight: 700;
}
#mainDevice .farbox {
  display: flex;
  width: 1200px;
  height: 100%;
  border: 2px solid #efeeee;
  justify-content: space-between;
  text-align: center;
  margin-left: 150px;
  margin-bottom: 20px;
  .leftcircle div,
  .rightcircle div {
    height: 25px;
    width: 25px;
    border-radius: 60%;
  }

  .leftcircle div:nth-child(1),
  .rightcircle div:nth-child(1) {
    background: #fff;
  }
  .leftcircle div:nth-child(2),
  .rightcircle div:nth-child(2) {
    background: #fff;
  }
  .leftcircle,
  .rightcircle {
    width: 50px;
    background-color: #efeeee;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    align-items: center;
  }

  .content1 div {
    text-align: center;
    float: left;
    width: 60px;
    height: 80px;
    line-height: 80px;
    background: #edf8fd;
    margin: 10px 0px;
    border: 1px solid #efeeee;
    border-radius: 4%;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    // box-shadow: 10px 10px 5px #888888;
  }
  .content1 div:nth-child(even) {
    margin-right: 12px;
  }
  .content1 div:nth-child(1) {
    margin-left: 12px;
  }
  #mainDevice .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  #mainDevice .el-col {
    border-radius: 4px;
  }
  #mainDevice .bg-purple-dark {
    background: #99a9bf;
  }
  #mainDevice .bg-purple {
    background: #d3dce6;
  }
  #mainDevice .bg-purple-light {
    background: #e5e9f2;
  }
  #mainDevice .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  #mainDevice .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .station {
    width: 120px !important;
  }
  .device-content {
    width: 1100px;
    display: flex;
    // justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .device-content > .power-part {
    width: 25%;
    display: flex;
    flex-direction: column;
  }

  .device-content > .right-part {
    width: 75%;
    display: flex;
    // justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .device-content .one-slot {
    width: 33%;
    height: 40px;
    border-right: 1px solid #dfdfdf;
    display: inline-flex;
    justify-content: flex-start;
    align-items: flex-start;
    border-bottom: 1px solid #f5f5f5;
  }
  .device-content > .power-part > .one-slot {
    width: calc(100% - 1px);
  }
  .device-content > .right-part > .one-slot {
    width: calc(50% - 1px);
  }
  .device-content .one-slot > div {
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  .device-content .one-slot > div:nth-child(1) {
    width: 34%;
  }
  .device-content .one-slot > div:nth-child(2) {
    width: 39px;
  }
  .device-content > .one-slot > div:nth-child(4) {
    width: 30px;
  }
  .device-content .one-slot > div:nth-child(3) {
    width: calc(60% - 115px);
  }
}
</style>
