<template>
  <div id="log" class="oneMain">
    <div class="oneMain">
      <div class="tools">
        <div>
          <el-form :inline="true" :model="search" size="small">
            <el-form-item>
              <el-button-group class="disBtn">
                <el-button size="mini" :class="{'activeDis':activeBtn==0}" @click="changeBtnType(0)">登录日志</el-button>
                <el-button size="mini" :class="{'activeDis':activeBtn==1}" @click="changeBtnType(1)">操作日志</el-button>
              </el-button-group>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker size="mini" v-model="search.date" type="daterange" format="yyyy.MM.dd " value-format="yyyy-MM-dd" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" @change="refreshTable" popper-class="minPop" class="transparentDate">
              </el-date-picker>
            </el-form-item>
            <!-- <el-form-item>
							<el-input placeholder="输入角色名称" v-model="search.content" class="input-with-select" @keyup.enter.native="refreshTable()">
								<el-button slot="append" icon="el-icon-search" v-on:click="refreshTable()"></el-button>
							</el-input>
						</el-form-item> -->
          </el-form>
        </div>
        <div>
          <el-button icon="el-icon-download" size="small" class="btn refBtn btnRight" @click="download"></el-button>
          <el-button icon="el-icon-refresh" size="small" class="btn refBtn btnRight" @click="refreshTable"></el-button>
        </div>
      </div>
      <div class="tableContent">
        <div class="tableContent">
          <el-table ref="table" height="679" :data="tableData" tooltip-effect="light" size="small" v-loading="loading" class="table">
            <el-table-column type="index" label="序号" width="50" :resizable="false" key="indexOOO"></el-table-column>
            <el-table-column v-for="(item,key) in tableCloumn" :prop="item.prop" :key="key" :resizable="false" :label="item.label" :min-width="item.width" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{getDisplay(scope)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row class="page">
          <el-pagination @current-change="changePage" :current-page.sync="currentPage" :page-size.sync="pageSize" layout="prev, pager, next,jumper,->,total" :total="total"></el-pagination>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import tablePublic from "@/mixins/tablePublic";
import { getSomeData, getSomeDay } from "../../utils/timeUtils.js";
/*
 * 日志
 * */
export default {
  name: "log",
  mixins: [tablePublic],
  data() {
    return {
      activeBtn: "",
      loginUrl: "getLoginLogList",
      optUrl: "getOptLogList",
      search: {
        date: [],
        type: ""
      },
      tableCloumn: [
        {
          prop: "logName",
          label: "操作",
          width: "100"
        },
        {
          prop: "userId",
          label: "用户",
          width: "100"
        },
        {
          prop: "succeed",
          label: "结果",
          width: "100"
        },
        {
          prop: "createTime",
          label: "日期",
          width: "150"
        },
        {
          prop: "message",
          label: "详细参数",
          width: "100"
        }
      ],
      userList: [],
      mountedType: true
    };
  },
  created() {
    let _this = this;
    console.log("日志");
    _this.tableUrl = _this.loginUrl;
    _this.entity = "SysLoginLog";
    let user = _this.$store.state.user.username;
    if (user != "vadmin") {
      _this.getUserList();
    } else {
      _this.refreshTable();
    }
  },
  mounted() {
    let _this = this;
  },
  methods: {
    async getUserList() {
      let _this = this;
      let param = {
        entity: "SysUser",
        pageSize: 100000,
        currentPage: 1
      };
      let res = await _this.$api.postRequest(param, "getUserList");
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        let data = [];
        res.list.forEach(item => {
          data.push(item.username);
        });
        data.push(_this.$store.state.user.username);
        _this.userList = data;
        _this.refreshTable();
      }
    },
    changeBtnType(a) {
      let _this = this;
      if (_this.activeBtn != a) {
        _this.activeBtn = a;
        if (a == 0) {
          if (_this.tableCloumn[1].prop == "logType") {
            _this.tableCloumn.splice(1, 1);
          }
          _this.tableUrl = _this.loginUrl;
          _this.entity = "SysLoginLog";
        } else {
          let one = {
            prop: "logType",
            label: "类型",
            width: "100"
          };
          _this.tableCloumn.splice(1, 0, one);
          _this.tableUrl = _this.optUrl;
          _this.entity = "SysOperationLog";
        }
        _this.refreshTable();
      }
    },
    handleTableParam() {
      let _this = this;
      let date = ["", ""];
      let a = ["00:00:00", "23:59:59"];
      if (_this.search.date != null) {
        _this.search.date.forEach((item, index) => {
          if (item != "") {
            date[index] = item + " " + a[index];
          }
        });
      }
      let inStr = new Object();
      if (_this.userList.length > 0) {
        inStr.userId = _this.userList;
      }
      let param = {
        pageSize: _this.pageSize,
        startime: date[0],
        endtime: date[1],
        currentPage: _this.currentPage,
        inStr: JSON.stringify(inStr),
        entity: _this.entity,
        sort: "create_time DESC"
      };
      let c = _this.search.content;
      if (c) {
        param.mapStr = JSON.stringify({
          comName: c
        });
      }
      return param;
    },
    //下载
    async download() {
      let _this = this;
      let date = ["", ""];
      let a = ["00:00:00", "23:59:59"];
      if (_this.search.date != null) {
        _this.search.date.forEach((item, index) => {
          if (item != "") {
            date[index] = item + " " + a[index];
          }
        });
      }
      let loadUrl =
        _this.activeBtn == 0 ? "downloadLoginLog" : "downloadOptLog";
      let param = {
        pageSize: _this.pageSize,
        currentPage: _this.currentPage,
        startime: date[0],
        endtime: date[1],
        entity: _this.entity
      };
      let res = await _this.$api.downloadPost(param, loadUrl);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        let url = window.URL.createObjectURL(
          new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          })
        );
        let name;
        if (res.fileName) {
          name = res.fileName.split("=")[1];
        } else {
          name = new Date();
        }
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
};
</script>

<style>
.el-table .warning-row {
  background: #ffced1;
}

#healthState {
  width: 100%;
  height: 100%;
}

#healthState .title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

#healthState .onePart {
  height: calc(100% - 60px) !important;
}

.warning-column {
  color: red;
  font-weight: bold;
}
</style>
