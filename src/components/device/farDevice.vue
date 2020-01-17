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
        <el-table ref="table" height="679" :data="tableData" tooltip-effect="light" size="small" v-loading="loading" class="table" @selection-change="changeSelect">
          <el-table-column type="index" label="序号" width="50" :resizable="false" key="indexOOO" v-if="firstType=='index'"></el-table-column>
          <el-table-column type="selection" label="序号" width="50" :resizable="false" key="select000" v-if="firstType=='selection'"></el-table-column>
          <el-table-column v-for="(item,key) in tableCloumn" :prop="item.prop" :key="item.prop" :resizable="false" :label="item.label" :min-width="item.width" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              {{getDisplay(scope)}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" key="createtime" :resizable="false" label="创建时间" :min-width="180" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              {{getDisplay(scope)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="400" key="editUpdate" align="center">
            <template slot-scope="scope">
              <el-button v-on:click="equipmentattribute(scope.row)" type="info" :plain="true" size="mini">设备属性</el-button>
              <el-button v-if="firstType=='selection'&&rootlist.update" @click="updateOne(scope.row)" type="success" :plain="true" size="mini">修改</el-button>
              <el-button v-on:click="showDetails(scope.row)" type="info" :plain="true" size="mini">查看详情</el-button>
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
        <el-form-item label="设备名称" prop="name">
          <el-input class="short-input" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select class="short-input" v-model="form.type" placeholder="请选择">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.exCode" :value="item.inCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号(PN)" prop="pn">
          <el-input class="short-input" v-model="form.pn"></el-input>
        </el-form-item>
        <el-form-item label="机框SN号" prop="frameSN">
          <el-input class="short-input" v-model="form.frameSN"></el-input>
        </el-form-item>
        <!-- <el-form-item label="公司" prop="cid">
          <el-select class="short-input" v-model="form.cid" placeholder="请选择">
            <el-option v-for="(item,index) in companyList" :key="index" :label="item.comName" :value="index"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="局端设备" prop="localId" class="loctinsele">
          <el-select class="short-input" v-model="seek.provinceId" placeholder="请选择" @change="getCityList">
            <el-option v-for="(item,index) in provinceList" :key="index" :label="item.provinceName" :value="item.provinceId"></el-option>
          </el-select>
          <el-select class="short-input" v-model="seek.cityId" placeholder="请选择" @change="getCountryList">
            <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityName" :value="item.cityId"></el-option>
          </el-select>
          <el-select class="short-input" v-model="seek.countryId" placeholder="请选择" @change="getTownList">
            <el-option v-for="(item,index) in countryList" :key="index" :label="item.countryName" :value="item.countryId"></el-option>
          </el-select>
          <el-select class="short-input" v-model="seek.townId" placeholder="请选择" @change="getVillageList">
            <el-option v-for="(item,index) in townList" :key="index" :label="item.townName" :value="item.townId"></el-option>
          </el-select>
          <el-select class="short-input" v-model="seek.villageId" placeholder="请选择" @change="getStation2">
            <el-option v-for="(item,index) in villageList" :key="index" :label="item.villageName" :value="item.villageId"></el-option>
          </el-select>
          <el-select class="short-input" v-model="seek.stationId" placeholder="请选择" @change="getDidList">
            <el-option v-for="(item,index) in areaTop" :key="index" :value="item.stationId" :label="item.station"></el-option>
          </el-select> 
         <el-select class="short-input" v-model="form.localId" placeholder="请选择">
            <el-option v-for="(item,index) in deviceList" :key="index" :label="item.deviceName" :value="item.did"></el-option>
          </el-select> 
        <el-select class="short-input" v-model="form.localId" placeholder="请选择">
            <el-option v-for="(item,index) in mainDeviceList" :key="index" :label="item.name" :value="index"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="上级远端设备" prop="higherId">
          <el-select class="short-input" v-model="form.higherId" placeholder="请选择">
            <el-option v-for="(item,index) in farDeviceList" :key="index" :label="item.farName" :value="index"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="厂家名称" prop="factory">
          <el-input class="short-input" v-model="form.factory"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="lang">
          <el-input class="short-input" v-model="form.lang"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="lat">
          <el-input class="short-input" v-model="form.lat"></el-input>
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-select class="short-input" v-model="form.provinceId" placeholder="请选择" @change="getCityList">
            <el-option v-for="(item,index) in provinceList" :key="index" :label="item.provinceName" :value="item.provinceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-select class="short-input" v-model="form.cityId" placeholder="请选择" @change="getCountryList">
            <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityName" :value="item.cityId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="县/区" prop="country">
          <el-select class="short-input" v-model="form.countryId" placeholder="请选择" @change="getTownList">
            <el-option v-for="(item,index) in countryList" :key="index" :label="item.countryName" :value="item.countryId"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="镇" prop="town">
          <el-select class="short-input" v-model="form.townId" placeholder="请选择" @change="getVillageList">
            <el-option v-for="(item,index) in townList" :key="index" :label="item.townName" :value="item.townId"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="村" prop="village">
          <el-select class="short-input" v-model="form.villageId" placeholder="请选择" @change="getStation1">
            <el-option v-for="(item,index) in villageList" :key="index" :label="item.villageName" :value="item.villageId"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="局站" prop="station">
          <el-select v-model="form.stationId" placeholder="请选择" style="width:120px">
            <el-option v-for="item in stationList" :key="item.id" :value="item.stationId" :label="item.name">
            </el-option>
          </el-select>
          <el-button @click="stationment" :disabled="this.form.villageId=='' ?true:false">局站管理</el-button>
        </el-form-item> -->
        <!-- <el-form-item label="楼层" prop="floor">
          <el-input class="short-input" v-model="form.floor"></el-input>
        </el-form-item> -->
        <el-form-item label="地址" prop="position">
          <el-input class="short-input" v-model="form.position"></el-input>
        </el-form-item>

      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" size="small" class="sureBtn" @click="submitEdit1()">确定</el-button>
        <el-button @click="editVisible=false" class="cancelBtn" size="small">取消</el-button>
      </div>
    </el-dialog>
    <!-- 详细信息 -->
    <el-dialog :visible.sync="detailsVisible" :close-on-click-modal="false" width="600px">
      <div slot="title">{{deviceDetails.name}}详细信息</div>
      <div class="details-info">
        <div class="two-info" v-for="(item,index) in detailsInfo" :key="index">
          <span class="label">{{item.name}}</span>
          <span class="value" v-if="index===4">{{formatDateTime(deviceDetails[item.prop])}}</span>
          <span class="value">{{deviceDetails[item.prop]}}</span>
        </div>
        <div class="one-info">
          <span class="label">位置</span>
          <span class="value">{{deviceDetails.positionInfo}}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 设备属性 -->
    <el-dialog :visible.sync="ipSetVisible1" :close-on-click-modal="false" width="1600px">
      <div slot="title">
        设备属性管理
      </div>
      <div class="far" v-if="this.standby==='5G-1U'">
        <div class="fartype">设备型号:{{standby}}</div>
        <div class="farbox ">
          <div class="leftcircle">
            <div></div>
            <div></div>
          </div>
          <div class="content" v-if="this.standby==='5G-1U'">
            <div v-for="count in 3">{{count}}
            </div>
          </div>
          <div class="content1" v-if="this.standby==='5G-2U'">
            <div v-for="count in 8">{{count}}</div>
            <div v-for="count in 8">{{count+8}}</div>
          </div>
          <div class="rightcircle">
            <div></div>
            <div></div>
          </div>
        </div>
        <div v-for="item in useSlot" class="slotuse">槽位占用情况:已使用:{{item}}</div>
        <div class="slotres" v-for="items in newarr">槽位剩余情况:未使用:{{items}}</div>
      </div>
      <div class="far1" v-if="this.standby==='5G-3U'">
        <div class="fartype1">设备型号:{{standby}}</div>
        <div class="farbox1 ">
          <div class="leftcircle">
            <div></div>
            <div></div>
          </div>
          <div class="content1">
            <div v-for="count in 8">{{count}}</div>
            <div v-for="count in 8">{{count+8}}</div>
          </div>
          <div class="rightcircle">
            <div></div>
            <div></div>
          </div>
        </div>
        <div style="margin-left: 150px;color:red" v-for="item in useSlot">槽位占用情况:已使用:{{item}}</div>
      </div>
      <div class="slotbtn">
        <el-button type="warning" plain size="mini" @click="btnmodule">添加模组</el-button>
        <el-button type="danger" plain size="mini" @click="delectFarSome">删除模组</el-button>
      </div>

      <div class="dialogTable">
        <el-table ref="table" height="900" :data="farData" tooltip-effect="light" size="small" class="table" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="30">
          </el-table-column>
          <el-table-column prop='userLabel' label="用户标签" :resizable="false" min-width="120" :render-header="renderHeader" align="center">
            <template slot-scope="pope">
              <editable-cell :text.sync="pope.row.userLabel" v-on:update:text="updateCellreg($event,pope,'sndtable')"></editable-cell>
            </template>
          </el-table-column>
          <el-table-column prop='name' label="名称" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='useStatus' label="占用情况" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='channel' label="波道" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='port' label="接口" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='protect' label="线路保护" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='plateBox' label="盘盒" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='channel1625' label="1625通道" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='sn' label="SN号" :resizable="false" min-width="100" align="center" :render-header="renderHeader">
            <template slot-scope="pope">
              <editable-cell :text.sync="pope.row.sn" v-on:update:text="updateCellregsn($event,pope,'sndtable')"></editable-cell>
            </template>
          </el-table-column>
          <el-table-column prop='pn' label="PN号" :resizable="false" min-width="90" align="center">
          </el-table-column>
          <el-table-column prop='line1' label="线路口1" :resizable="false" min-width="80" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.line1}}</span>
              <el-button size="mini" class="concatbtn" type="success" @click="concatbtn">未连接</el-button>
            </template>
          </el-table-column>
          <el-table-column prop='line2' label="线路口2" :resizable="false" min-width="80" align="center">
          </el-table-column>
          <el-table-column prop='line3' label="线路口3" :resizable="false" min-width="80" align="center">
          </el-table-column>
          <el-table-column prop='branchWavelength' label="支路口波长" :resizable="false" min-width="90" align="center">
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="warning" plain size="mini" @click="btnlight(scope.row)">管理光模块</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 弹出模组添加 -->
    <el-dialog :visible.sync="ipSetVisible2" :close-on-click-modal="false" width="400px">
      <div slot="title">
        {{standby}}设备模组添加
      </div>
      <el-form ref="newform" :model="newform" label-width="80px" :rules="formRule">
        <el-form-item label="占用槽位" prop="CaoWei" v-if="standby==='5G-1U'">
          <el-select v-model="newform.CaoWei" placeholder="请选择">
            <el-option v-for="item in newslot" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SN号" prop="SName">
          <el-input v-model="newform.SName" class="userlable"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btnlabel" @click="btnNewsn">添加</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>

    <!-- 弹出光模块 -->
    <el-dialog :visible.sync="ipSetVisible3" :close-on-click-modal="false" width="1600px">
      <div slot="title">
        设备属性管理
      </div>
      <div class="far" v-if="this.standby==='5G-1U'">
        <div class="fartype">设备型号:{{standby}}</div>
        <div class="farbox ">
          <div class="leftcircle">
            <div></div>
            <div></div>
          </div>
          <div class="content" v-if="this.standby==='5G-1U'">
            <div v-for="count in 3">{{count}}
            </div>
          </div>
          <div class="content1" v-if="this.standby==='5G-2U'">
            <div v-for="count in 8">{{count}}</div>
            <div v-for="count in 8">{{count+8}}</div>
          </div>
          <div class="rightcircle">
            <div></div>
            <div></div>
          </div>
        </div>
        <!-- <div class="lightFar">
          <div>模组名称:11111111</div>
          <div>模组SN号:11111111</div>
        </div> -->

      </div>
      <div class="far1" v-if="this.standby==='5G-3U'">
        <div class="fartype1">设备型号:{{standby}}</div>
        <div class="farbox1 ">
          <div class="leftcircle">
            <div></div>
            <div></div>
          </div>
          <div class="content1">
            <div v-for="count in 8">{{count}}</div>
            <div v-for="count in 8">{{count+8}}</div>
          </div>
          <div class="rightcircle">
            <div></div>
            <div></div>
          </div>
        </div>
        <!-- <div class="lightFar">
          <div>模组名称:11111111</div>
          <div>模组SN号:11111111</div>
        </div> -->
      </div>
      <el-button type="warning" plain size="mini" @click="btnLightmodule">添加光模块</el-button>
      <el-button type="danger" plain size="mini" @click="delectFarmodelSome">删除光模块</el-button>
      <div class="dialogTable">
        <el-table ref="table" height="900" :data="lightFarData" tooltip-effect="light" size="small" class="table" @selection-change="handlemodelSelectionChange">
          <el-table-column type="selection" width="30">
          </el-table-column>
          <el-table-column prop='userLabel' label="用户标签" :resizable="false" min-width="120" :render-header="renderHeader" align="center">
            <template slot-scope="pope">
              <editable-cell :text.sync="pope.row.userLabel" v-on:update:text="updatemodelCellreg($event,pope,'sndtable')"></editable-cell>
            </template>
          </el-table-column>
          <el-table-column prop='modelInterface' label="模组接口" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='wavelength' label="光模块波长" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='sendPower' label="发送光功率" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='receivePower' label="接受功率" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='speed' label="传输速度" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='distance' label="距离" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='sn' label="SN号" :resizable="false" min-width="90" align="center" :render-header="renderHeader">
            <template slot-scope="pope">
              <editable-cell :text.sync="pope.row.sn" v-on:update:text="updatemodelCellregsn($event,pope,'sndtable')"></editable-cell>
            </template>
          </el-table-column>
          <el-table-column prop='factory' label="厂家名称" :resizable="false" min-width="90" align="center">
          </el-table-column>
          <el-table-column prop='type' label="专业类型" :resizable="false" min-width="60" align="center">
          </el-table-column>
          <el-table-column prop='name' label="型号名称" :resizable="false" min-width="60" align="center">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 弹出添加光模块 -->
    <el-dialog :visible.sync="ipSetVisible4" :close-on-click-modal="false" width="400px">
      <div slot="title">
        {{standby}}设备光模块添加
      </div>
      <el-form ref="lightform" :model="lightform" label-width="85px" :rules="formRule">
        <el-form-item label="模组接口" prop="lightport" label-width="85px">
          <el-select v-model="lightform.lightport" placeholder="请选择">
            <el-option v-for="item in getModelInterface" :key="item.lable" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="光模块SN" prop="SName" class="lightmodle" label-width="85px">
          <el-input v-model="lightform.lightSN" class="userlable"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btnlabel" @click="lightbtnNewsn">添加</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>

    <!-- 弹出局站管理 -->
    <el-dialog :visible.sync="stationdialogTableVisible" width="900px">
      <div slot="title">
        局站管理
      </div>
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

    <!-- 弹出有源无源设备 -->
    <el-dialog :visible.sync="ipSetVisible5" :close-on-click-modal="false" width="800px">
      <div slot="title">
        连接设备选择
      </div>
      <el-form ref="linkform" :model="linkform" :rules="formRule" label-width="120px" size="mini" class="form two-item-form" label-position="left">
        <el-form-item label="连接设备选择" class="firstdevice">
          <el-select class="short-input" v-model="linkform.device" placeholder="请选择">
            <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-select class="short-input" v-model="linkform.provinceId" placeholder="请选择" @change="getCityList">
            <el-option v-for="(item,index) in provinceList" :key="index" :label="item.provinceName" :value="item.provinceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-select class="short-input" v-model="linkform.cityId" placeholder="请选择" @change="getCountryList">
            <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityName" :value="item.cityId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="县/区" prop="country">
          <el-select class="short-input" v-model="linkform.countryId" placeholder="请选择" @change="getTownList">
            <el-option v-for="(item,index) in countryList" :key="index" :label="item.countryName" :value="item.countryId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="镇" prop="town" v-if="this.linkform.device==='有源'">
          <el-select class="short-input" v-model="linkform.townId" placeholder="请选择" @change="getVillageList">
            <el-option v-for="(item,index) in townList" :key="index" :label="item.townName" :value="item.townId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="村" prop="village" v-if="this.linkform.device==='有源'">
          <el-select class="short-input" v-model="linkform.villageId" placeholder="请选择" @change="getStation1">
            <el-option v-for="(item,index) in villageList" :key="index" :label="item.villageName" :value="item.villageId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="局站" prop="station" v-if="this.linkform.device==='有源'">
          <el-select v-model="linkform.stationId" placeholder="请选择" style="width:120px">
            <el-option v-for="item in stationList" :key="item.id" :value="item.stationId" :label="item.name">
            </el-option>
          </el-select>
          <el-button @click="stationment" :disabled="this.linkform.villageId=='' ?true:false">局站管理</el-button>
        </el-form-item>
        <el-form-item label="楼层" prop="floor" v-if="this.linkform.device==='有源'">
          <el-input class="short-input" v-model="linkform.floor"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="position" v-if="this.linkform.device==='有源'">
          <el-input class="short-input" v-model="linkform.position"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="frameSN" :class="{firstdevice:this.linkform.device=='有源',senddevice:this.linkform.device=='无源' }">
          <el-input class="short-input" v-model="linkform.address" @change="getaddress"></el-input>
        </el-form-item>
        <el-form-item label="设备" prop="frameSN">
          <el-select v-model="linkform.Pda" placeholder="请选择">
            <el-option v-for="item in stationList" :key="item.id" :value="item.stationId" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="波分板" prop="frameSN" v-if="this.linkform.device==='有源'">
          <el-select v-model="linkform.slave" placeholder="请选择">
            <el-option v-for="item in stationList" :key="item.id" :value="item.stationId" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模组" prop="frameSN" v-if="this.linkform.device==='无源'">
          <el-select v-model="linkform.model" placeholder="请选择">
            <el-option v-for="item in stationList" :key="item.id" :value="item.stationId" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道" prop="frameSN">
          <el-select v-model="linkform.pass" placeholder="请选择">
            <el-option v-for="item in stationList" :key="item.id" :value="item.stationId" :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" size="mini">保存</el-button>
      </span>
    </el-dialog>

  </div>
  </div>
</template>

<script>
import systemEdit from "@/mixins/systemEdit";
import tablePublic from "@/mixins/tablePublic.js";
import detailsInfo from "./utils/farDeviceDetails.js";
import editableCell from "@c/utils/editableCell.vue";
import deviceSelect from "../monitor/deviceSelect";

export default {
  name: "farDevice",
  mixins: [systemEdit, tablePublic, deviceSelect],
  components: {
    editableCell
  },
  data() {
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
    return {
      newform: {
        SName: "",
        CaoWei: ""
      },
      lightform: {
        lightport: "",
        lightSN: ""
      },
      linkform: {
        device: "",
        provinceId: "",
        cityId: "",
        countryId: "",
        townId: "",
        villageId: "",
        stationId: "",
        floor: "",
        position: "",
        address: "",
        Pda: "",
        slave: "",
        model: "",
        pass: ""
      },
      options: [
        {
          value: "有源",
          label: "有源"
        },
        {
          value: "无源",
          label: "无源"
        }
      ],
      ipSetVisible2: false,
      stationdialogTableVisible: false,
      ipSetVisible3: false,
      gridData: [],
      num: 16,
      standby: "",
      ipSetVisible1: false,
      farData: [],
      titleName: "设备",
      entity: "Device",
      addUrl: "addFarfDevice",
      updateUrl: "putWebMessage",
      deleteUrl: "deletefDevices",
      deleteOneUrl: "deleteBatchDevice",
      ipSetVisible4: false,
      ipSetVisible5: false,
      castTopLength: 8,
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
        // {
        //   prop: "cname",
        //   label: "公司",
        //   width: "100"
        // },
        // {
        //   prop: "localName",
        //   label: "局端设备",
        //   width: "100"
        // },
        // {
        //   prop: "higherName",
        //   label: "上级远端设备",
        //   width: "100"
        // },
        {
          prop: "name",
          label: "设备名称",
          width: "100"
        },
        {
          prop: "pn",
          label: "设备型号",
          width: "100"
        },
        {
          prop: "type",
          label: "设备类型",
          width: "100"
        },
        {
          prop: "ductNum",
          label: "波道编号",
          width: "100"
        },
        {
          prop: "useNuct",
          label: "已用波道",
          width: "100"
        }
      ],
      companyList: [],
      typeList: [],
      tableUrl: "getFarfDevice",
      form: {
        id: "",
        name: "",
        // localName: "",
        // localId: "",
        // higherName: "",
        // higherId: "",
        // cid: "",
        cname: "",
        type: "",
        createtime: "",
        // mask: "",
        // gateway: "",
        lang: "",
        lat: "",
        provinceId: "",
        cityId: "",
        countryId: "",
        // townId: "",
        // villageId: "",
        // stationId: "",
        // floor: "",
        position: "",
        framesn: "",
        factory: ""
      },
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
        localId: [
          {
            required: true,
            message: "请选择局端设备"
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
        ],
        SName: [
          {
            pattern: /^[^\u4e00-\u9fa5]*$/,
            message: "请勿输入汉字",
            required: true
          }
        ],
        CaoWei: [
          {
            required: true,
            message: "请选择槽位"
          }
        ],
        lightport: [
          {
            required: true,
            message: "请选择模组接口"
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
      seek: {
        provinceId: "",
        cityId: "",
        countryId: "",
        townId: "",
        villageId: "",
        stationId: ""
      },
      provinceList: [],
      cityList: [],
      countryList: [],
      townList: [],
      villageList: [],
      detailsVisible: false,
      deviceDetails: "",
      detailsInfo: detailsInfo,
      submitIpDis: false,
      mainDeviceList: [],
      farDeviceList: [],
      stationList: [],
      delectFarList: [],
      useSlot: [],
      newarr: [],
      newslot: [],
      lightFarData: [],
      getModelInterface: [],
      addFarModelid: "",
      delectmodelFarList: []
    };
  },
  created() {
    let _this = this;
    _this.getCompanyList();
    _this.getAllDeviceList();
    _this.geteDeviceTypeList();
  },
  mounted() {
    let _this = this;
    _this.getProvinceList();
  },
  methods: {
    // 连接有缘或者无源设备
    async getaddress(val) {
      let _this = this;
      let param = {
        city: "",
        cityId: _this.linkform.cityId,
        country: "",
        countryId: _this.linkform.countryId,
        farDeviceId: 0,
        position: val,
        province: "",
        provinceId: _this.linkform.provinceId
      };
      let params = {
        city: "",
        cityId: _this.linkform.cityId,
        country: "",
        countryId: _this.linkform.countryId,
        deviceName: "",
        did: 0,
        floor: _this.linkform.floor,
        position: _this.linkform.position,
        province: "",
        provinceId: _this.linkform.provinceId,
        station: "",
        stationId: _this.linkform.stationId,
        town: "",
        townId: _this.linkform.townId,
        village: "",
        villageId: _this.linkform.villageId,
        address: val
      };
      if (_this.linkform.device === "无源") {
        let res = await _this.$api.postRequest(param, "getFarDeviceByAddress");
        if (res.code) {
          _this.$message({
            message: res.msg,
            type: "warning"
          });
        } else {
          console.log(res);
        }
      } else {
        let res = await _this.$api.postRequest(params, "getDeviceByAddress");
        if (res.code) {
          _this.$message({
            message: res.msg,
            type: "warning"
          });
        } else {
          console.log(res);
        }
      }
    },
    // 弹出光模块
    async btnlight(row) {
      let _this = this;
      _this.ipSetVisible3 = true;
      _this.addFarModelid = row.id;
      // 获取模组接口
      let res = await _this.$api.getRequest(
        null,
        "getModelInterface",
        row.branchWavelength
      );
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        res.forEach(item => {
          let obj = new Object();
          _this.getModelInterface.push({
            label: item,
            value: item
          });
        });
      }
      _this.getFarModelById();
    },
    // 根据模组id获取光模块
    async getFarModelById() {
      let _this = this;
      let resone = await _this.$api.getRequest(
        null,
        "getFarModelById",
        _this.addFarModelid
      );
      if (resone.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.lightFarData = resone;
      }
    },
    // 弹出添加光模块
    btnLightmodule() {
      let _this = this;
      _this.ipSetVisible4 = true;
    },
    // 确定添加光模块
    async lightbtnNewsn() {
      let _this = this;
      let param = {
        distance: "",
        factory: "",
        farSlaveId: _this.addFarModelid,
        id: 0,
        modelInterface: _this.lightform.lightport,
        name: "",
        receivePower: "",
        sendPower: "",
        sn: _this.lightform.lightSN,
        speed: "",
        type: "",
        userLabel: "",
        wavelength: ""
      };
      let res = await _this.$api.postRequest(param, "addFarModel");
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.ipSetVisible4 = false;
        _this.getFarModelById();
      }
    },
    // 弹出有源无源设备
    concatbtn() {
      let _this = this;
      _this.ipSetVisible5 = true;
    },
    // 修改用户自定义标签
    async updateCellreg(event, pope, name) {
      console.log(event, pope);
      var reg = /^[a-zA-Z]{1,40}$/;
      if (!reg.test(event)) {
        this.$message.warning("只支持英文格式,长度不能超过40ASCII字符");
      } else {
        let _this = this;
        let param = {
          userLabel: event,
          id: pope.row.id
        };
        let res = await _this.$api.putRequest(param, "putUserLable");
        if (res.code) {
          let colomn = pope.column.property;
          let oldValue = pope.row[colomn];
          _this.$message.warining(res.msg);
          setTimeout(() => {
            pope.row[colomn] = oldValue;
          }, 50);
        } else {
          _this.$message.success("修改成功");
          pope.row.userLabel = event;
        }
      }
    },
    // 修改sn序列号
    async updateCellregsn(event, pope, name) {
      var reg = /^[A-Za-z0-9]{1,20}$/;
      if (!reg.test(event)) {
        this.$message.warning("只支持英文和数字格式,长度不能超过20ASCII字符");
      } else {
        let _this = this;
        let param = {
          sn: event,
          id: pope.row.id
        };
        let res = await _this.$api.putRequest(param, "putUserLable");
        if (res.code) {
          let colomn = pope.column.property;
          let oldValue = pope.row[colomn];
          _this.$message.warining(res.msg);
          setTimeout(() => {
            pope.row[colomn] = oldValue;
          }, 50);
        } else {
          _this.$message.success("修改成功");
          pope.row.sn = event;
        }
      }
    },
    // 修改光模块sn号
    async updatemodelCellregsn(event, pope, name) {
      var reg = /^[A-Za-z0-9]{1,20}$/;
      if (!reg.test(event)) {
        this.$message.warning("只支持英文和数字格式,长度不能超过20ASCII字符");
      } else {
        let _this = this;
        let param = {
          sn: event,
          id: pope.row.id
        };
        let res = await _this.$api.putRequest(param, "putfarmodel");
        if (res.code) {
          let colomn = pope.column.property;
          let oldValue = pope.row[colomn];
          _this.$message.warining(res.msg);
          setTimeout(() => {
            pope.row[colomn] = oldValue;
          }, 50);
        } else {
          _this.$message.success("修改成功");
          pope.row.sn = event;
        }
      }
    },
    // 修改光模块用户标签
    async updatemodelCellreg(event, pope, name) {
      var reg = /^[a-zA-Z]{1,40}$/;
      if (!reg.test(event)) {
        this.$message.warning("只支持英文格式,长度不能超过40ASCII字符");
      } else {
        let _this = this;
        let param = {
          userLabel: event,
          id: pope.row.id
        };
        let res = await _this.$api.putRequest(param, "putfarmodel");
        if (res.code) {
          let colomn = pope.column.property;
          let oldValue = pope.row[colomn];
          _this.$message.warining(res.msg);
          setTimeout(() => {
            pope.row[colomn] = oldValue;
          }, 50);
        } else {
          _this.$message.success("修改成功");
          pope.row.userLabel = event;
        }
      }
    },
    // 删除远端设备
    delectSome() {
      let _this = this;
      let a = _this.delectList;
      if (a.length <= 0) {
        this.$message({
          message: "请选择删除数据",
          type: "warning"
        });
      } else {
        _this
          .$confirm("确认删除？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            let b = _this.initDeleteParam();
            _this.delectdevData(b);
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    async delectdevData(param) {
      let _this = this;
      let res = await _this.$api.deleteRequest(param, "deletefDevices");
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        if (res == "success" || res == "1") {
          _this.$message({
            message: "删除成功",
            type: "success"
          });
          _this.handleEditResult();
        } else {
          _this.$message({
            message: "删除失败",
            type: "warning"
          });
        }
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

    //点击方框选中的值
    handleSelectionChange(val) {
      let _this = this;
      _this.delectFarList = val;
    },
    // 删除光模块
    handlemodelSelectionChange(val) {
      let _this = this;
      _this.delectmodelFarList = val;
    },
    async delectFarmodelSome() {
      let _this = this;
      let a = _this.delectmodelFarList;
      if (a.length <= 0) {
        this.$message({
          message: "请选择删除数据",
          type: "warning"
        });
      } else {
        _this
          .$confirm("确认删除？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            let b = _this.getmodelnum();
            _this.delectmodelData(b);
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    getmodelnum() {
      let _this = this;
      let ids = [];
      _this.delectmodelFarList.forEach(item => {
        ids.push(item.id);
      });
      let param = ids;
      return param;
    },
    async delectmodelData(param, type) {
      let _this = this;
      _this.loading = true;
      let res;
      if (!type) {
        res = await _this.$api.postRequest(param, "deletemodelsome");
      } else {
        res = await _this.$api.deleteRequest(null, "deletemodelone", param.id);
      }
      if (res.code) {
        _this.loading = false;
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        if (res == "success" || res == "1") {
          _this.$message({
            message: "删除成功",
            type: "success"
          });
          _this.getFarModelById();
        } else {
          _this.loading = false;
          _this.$message({
            message: "删除失败",
            type: "warning"
          });
        }
      }
    },
    // 删除模组
    async delectFarSome() {
      let _this = this;
      let a = _this.delectFarList;
      if (a.length <= 0) {
        this.$message({
          message: "请选择删除数据",
          type: "warning"
        });
      } else {
        _this
          .$confirm("确认删除？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            let b = _this.getnum();
            _this.delectData(b);
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    async delectData(param, type) {
      let _this = this;
      _this.loading = true;
      let res;
      if (!type) {
        res = await _this.$api.postRequest(param, "deletesome");
      } else {
        res = await _this.$api.deleteRequest(null, "deleteone", param.id);
      }
      if (res.code) {
        _this.loading = false;
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        if (res == "success" || res == "1") {
          _this.$message({
            message: "删除成功",
            type: "success"
          });
          _this.getFarSlave();
          _this.getUserSlot();
        } else {
          _this.loading = false;
          _this.$message({
            message: "删除失败",
            type: "warning"
          });
        }
      }
    },
    getnum() {
      let _this = this;
      let ids = [];
      _this.delectFarList.forEach(item => {
        ids.push(item.id);
      });
      let param = ids;
      return param;
    },

    // 添加模组信息
    async btnNewsn() {
      let _this = this;
      _this.$refs.newform.validate(valid => {
        if (valid) {
          _this.addFarSlave();
        }
      });
      _this.ipSetVisible2 = false;
    },
    async addFarSlave() {
      let _this = this;
      let param = {
        slot: _this.newform.CaoWei,
        sn: _this.newform.SName,
        farDid: _this.snDid
      };
      let res = await _this.$api.postRequest(param, "addFarSlave");
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.getFarSlave();
        _this.getUserSlot();
      }
    },
    async getFarSlave() {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getFarSlave", _this.snDid);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.farData = res;
      }
    },
    // 弹出模组模块
    btnmodule() {
      let _this = this;
      _this.ipSetVisible2 = true;
    },
    // 刷新局站删除
    refreshTablestation() {
      let _this = this;
      _this.currentPage = 1;
      _this.getStation(_this.villagestationId);
    },
    // 获取局站和设备局站信息
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
    // 获取设备局站信息
    async getStation2(village) {
      let _this = this;
      let param = new Array();
      param.push({
        provinceId: "000",
        cityId: "000",
        countryId: "000",
        townId: "000",
        villageId: village
      });
      let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.areaTop = res;
      }
    },
    //获取设备DID信息
    async getDidList(val) {
      console.log(val);
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
        _this.deviceList = res;
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
        villageId: this.form.villageId || this.linkform.villageId
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
          villageId: _this.form.villageId || _this.linkform.villageId
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
    // 添加设备
    submitEdit1() {
      let _this = this;
      _this.$refs.form.validate(valid => {
        if (valid) {
          _this.submitDis = true;
          let param = _this.handleEdit();
          _this.editInfo1(param);
        }
      });
    },

    async editInfo1(param) {
      let _this = this;
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
    // 批量删除

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
    async getCityList(province) {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getCity", province);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.cityList = res;
      }
    },
    //乡
    async getCountryList(city) {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getCountry", city);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.countryList = res;
      }
    },
    //镇
    async getTownList(country) {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getTwon", country);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.townList = res;
      }
    },
    //村
    async getVillageList(Town) {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getVillage", Town);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.villageList = res;
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
    // 获取局端设备
    async getAllDeviceList() {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getAllDevice");

      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.mainDeviceList = res;
      }
    },
    // 获取上级远端设备
    // async getAllFarDeviceList() {
    //   let _this = this;
    //   let res = await _this.$api.getRequest(null, "getAllFarDevice");
    //   if (res.code) {
    //     // _this.$message({
    //     //   message: res.msg,
    //     //   type: "warning"
    //     // });
    //   } else {
    //     _this.farDeviceList = res;
    //   }
    // },
    //获取设备类型
    async geteDeviceTypeList() {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getfardevicetype");
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
      let res = await _this.$api.getRequest(
        null,
        "updateFarDeviceBStatus",
        row.id
      );
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.refreshTable();
      }
    },
    //添加修改初始化表单
    initForm(form) {
      let _this = this;
      let data = new Object();
      if (form) {
        // // 公司
        let index = _this.companyList.findIndex(item => {
          return item.id == form.cid;
        });
        // 局端设备
        let dindex = _this.mainDeviceList.findIndex(item => {
          return item.id == form.localId;
        });
        // 上级远端设备
        let farIndex = _this.farDeviceList.findIndex(item => {
          return item.id == form.higherId;
        });
        for (let x in _this.form) {
          data[x] = form[x] || "";
        }
        data.oldIp = form.ip;
        data.oldPort = form.port;
        data.cid = index;
        data.localId = dindex;
        // if (farIndex > -1) {
        //   data.higherId = farIndex;
        // }
        if (form.farArea && form.farArea.length > 0) {
          let area = form.farArea[0];
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
      return data;
    },
    //添加修改提交前处理
    handleEdit() {
      let _this = this;
      let param = JSON.parse(JSON.stringify(_this.form));
      // param.cname = _this.companyList[param.cid].comName;
      // param.cid = _this.companyList[param.cid].id;
      // param.localName = _this.mainDeviceList[param.localId].name;
      // param.localId = _this.mainDeviceList[param.localId].id;
      // if (param.higherId || param.higherId == "0") {
      //   param.higherName = _this.farDeviceList[param.higherId].farName;
      //   param.higherId = _this.farDeviceList[param.higherId].id;
      // }
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
    //查看设备详情
    showDetails(row) {
      console.log(row);
      let _this = this;
      _this.deviceDetails = row;
      let provinceId = row.provinceId || "";
      let cityId = row.cityId || "";
      let cname = row.cname || "";
      let countryId = row.countryid || "";
      let townId = row.townId || "";
      let village = row.villageId || "";
      let station = row.stationId || "";
      let floor = row.floor || "";
      let sn = row.sn || "";
      let position = row.position || "";
      _this.deviceDetails.positionInfo =
        row.farArea[0].province + row.farArea[0].city + row.farArea[0].country;
      // row.farArea[0].town +
      // row.farArea[0].village +
      // row.farArea[0].station +
      // row.farArea[0].floor +
      // row.farArea[0].position;
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
            .$confirm("该操作可能导致设备连接失败，确认执行？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              _this.editIp(_this.upIpform);
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
    initDeleteParam() {
      let _this = this;
      let ids = [];
      _this.delectList.forEach(item => {
        ids.push(item.id);
      });
      let param = ids;
      return param;
    },
    async editIp(param) {
      let _this = this;
      let res = await _this.$api.putRequest(param, _this.updateUrl);
      _this.submitIpDis = false;
      if (res.code) {
        _this.loading = false;
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.$message({
          message: "IP修改成功",
          type: "success"
        });
      }
    },
    handleResultTableData(res) {
      console.log(res);
      let _this = this;
      let data = res.list;
      data.forEach(item => {
        if (item.type) {
          let type = item.type.replace(/(5G-)|U/g, "");
          let slaveNum = type * 4;
          let slave = new Array();
          for (let i = 0; i < slaveNum; i += 2) {
            // let oneSlave = {
            // 	num: i + 1,
            // 	status: "0",
            // 	SN: "sssssss",
            // 	label: ""
            // }
            let oneSlave = {
              num: i + 1,
              status: "0",
              SN: "sssss-sssss-sssss-sssss",
              label: "",
              num1: i + 1,
              status1: "0",
              SN1: "sssss-sssss-sssss-Tssss",
              label1: ""
            };
            slave.push(oneSlave);
          }
          item.slave = slave;
        }
      });
      _this.tableData = res.list;
    },
    // 查看设备属性
    equipmentattribute(row) {
      let _this = this;
      _this.standby = row.type;
      // console.log(_this.standby);
      _this.ipSetVisible1 = true;
      _this.snDid = row.id;
      _this.getFarSlave();
      _this.getUserSlot();
    },
    // 获取已占用槽位
    async getUserSlot() {
      let _this = this;
      let res = await _this.$api.getRequest(null, "getUserSlot", _this.snDid);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.newslot = [];
        _this.useSlot = res;
        let kongSlot = [1, 2, 3];
        _this.newarr = kongSlot.filter(item => {
          if (!res.includes(item)) return item;
        });
        _this.newarr.forEach((items, index) => {
          let newobj = {
            label: items,
            value: items
          };
          _this.newslot.push(newobj);
        });
      }
    }
  }
};
</script>

<style lang="scss" >
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
#mainDevice .fartype {
  margin-left: 150px;
  font-size: 18px;
  font-weight: 700;
}
#mainDevice .farbox {
  display: flex;
  width: 1200px;
  // height: 100px;
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
    margin: 15px;
    background: #fff;
  }
  .leftcircle div:nth-child(2),
  .rightcircle div:nth-child(2) {
    margin: 15px;
    background: #fff;
  }
  .leftcircle,
  .rightcircle {
    height: 112px;
    width: 50px;
    background-color: #efeeee;
  }
  .content div {
    text-align: center;
    float: left;
    width: 300px;
    height: 50px;
    line-height: 50px;
    background: #edf8fd;
    margin: 30px 30px;
    border: 1px solid #efeeee;
    border-radius: 4%;
    // box-shadow: 10px 10px 5px #888888;
  }
  .content1 div {
    text-align: center;
    float: left;
    width: 60px;
    height: 200px;
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
}
#mainDevice .far1 .fartype1 {
  margin-left: 150px;
  font-size: 18px;
  font-weight: 700;
}
#mainDevice .farbox1 {
  position: relative;
  display: flex;
  width: 1200px;
  // height: 100px;
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
    margin: 35px 15px;
    background: #fff;
  }
  .leftcircle div:nth-child(2),
  .rightcircle div:nth-child(2) {
    margin: 100px 15px;
    background: #fff;
  }
  .leftcircle,
  .rightcircle {
    height: 222px;
    width: 50px;
    background-color: #efeeee;
  }
  .content div {
    text-align: center;
    float: left;
    width: 300px;
    height: 50px;
    line-height: 50px;
    background: #edf8fd;
    margin: 30px 30px;
    border: 1px solid #efeeee;
    border-radius: 4%;
    // box-shadow: 10px 10px 5px #888888;
  }
  .content1 div {
    text-align: center;
    float: left;
    width: 60px;
    height: 200px;
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
}
.userlable {
  width: 217px;
}
.btnlabel {
  text-align: center;
  margin-left: 50px;
}
.slot {
  display: flex;
  justify-content: end;
  align-items: flex-end;
}
.lightFar {
  display: flex;
  margin-bottom: 20px;
  margin-left: 150px;
}
// .el-form-item__label {
//   width: 120px !important;
// }
.concatbtn {
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 5px;
}
.firstdevice {
  width: 100% !important;
}
.slotuse {
  color: red;
  margin-left: 150px;
}
.slotres {
  color: green;
  margin-left: 150px;
}
.slotbtn {
  margin-top: 20px;
}
</style>
