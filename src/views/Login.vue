<template>
  <div id="load">
    <el-row class="center">
      <div class="model">
        <div class="login-form">
          <div class="login-title">
            智能光纤管理系统
          </div>
          <el-form ref="load" :model="user" size="medium" :rules="userrule" :status-icon="true" action="shiroLogin">
            <el-row v-show="error!='' " class="error">
              <span class="el-icon-remove error-icon"></span>
              <div style="font-size: 12px;">{{error}}</div>
            </el-row>
            <el-form-item prop="username">
              <el-input v-model="user.username" class="login-input" placeholder="请输入用户名">
                <span slot="prefix" class="iconfont icon-yonghu2 icon"></span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="user.password" type="password" class="login-input" placeholder="请输入密码">
                <span slot="prefix" class="iconfont  icon-mima icon"></span>
              </el-input>
            </el-form-item>
            <el-form-item prop="vacode">
              <div class="yanzheng">
                <el-input v-model="user.vacode" class="login-input input-yanzheng" @keyup.enter.native="login()" placeholder="请输入验证码">
                  <span slot="prefix" class="iconfont icon-yanzhengma icon"></span>
                </el-input>
                <div class="verification">
                  <canvas ref="identcode" v-bind:width="canvas.width" v-bind:height="canvas.height" v-on:click="identityCode()"></canvas>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="yanzheng">
                <el-button @click="login()" size="medium" class="login-btn sureBtn">登录</el-button>
                <el-button native-type="reset" size="medium" class="login-btn cancelBtn">取消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="bottom">
          <!-- <span>东方计量测试研究所</span>
					<span>航天工程研究所</span> -->
        </div>
      </div>

    </el-row>
  </div>
</template>
<script>
// import { asyncRouterMap} from './ansyRouter.ts';
// import {asyncRouterMaps} from "@/router.ts";
// import {asyncRouterMap} from "@/ansyRouter.ts";
// import {asyncRouterMaps as routers} from "@/router.ts";
// console.log(routers);
// console.log("app")
// const routers=require("@/router.ts");
// console.log(asyncRouterMaps);
// console.log(asyncRouterMap);
// console.log(asyncRouter);
// console.log(routers);
export default {
  name: "alarm",
  data() {
    var eqcode = (rule, value, callback) => {
      let _this = this;
      // console.log(_this.code);
      // console.log(value);
      if (value.toLowerCase() != _this.code.toLowerCase()) {
        callback(new Error("验证码输入错误"));
      } else {
        callback();
      }
    };
    return {
      error: "",
      code: "",
      canvas: {
        width: 150,
        height: 55
      },
      user: {
        username: "",
        password: "",
        vacode: ""
      },
      userrule: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            pattern: /^(\w|-)+$/,
            message: "请输入字母数字或下划线",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        vacode: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          },
          {
            validator: eqcode,
            trigger: "blur"
          }
        ]
      },
      inter: ""
    };
  },
  created() {
    // console.log(router);
    // console.log(asyncRouterMap);
    //console.log("hohohoih")
  },
  beforeDestroy() {
    if (this.inter) {
      clearInterval(this.inter);
    }
  },
  mounted() {
    let _this = this;
    // console.log("login");
    this.identityCode();
    // console.log(this.$store.state.user);
  },
  methods: {
    login() {
      this.$refs.load.validate(valid => {
        if (valid) {
          this.dologin();
          // console.log("dddd");
          // let user = {
          // 	user: {
          // 		username: this.user.username,
          // 		token: "123131231"
          // 	}
          // }
          // this.$store.commit("changeUser", user);
          // this.$router.push({
          // 	path: '/envHealth/realTime'
          // })
        }
      });
    },
    async dologin() {
      let _this = this;
      let date = this.user;
      // console.log(date);
      // console.log(date);
      let res = await this.$api.doLogin(date);
      if (res.code) {
        this.error = res.msg;
        _this.identityCode();
      } else {
        let user = {
          user: {
            username: this.user.username,
            token: res
          }
        };
        this.$store.commit("changeUser", user);
        this.$router.push({
          path: "/home"
        });
      }
    },
    //获取用户菜单
    async getNavList() {
      let _this = this;
      let token = _this.$store.state.user.token;
      let parm = _this.user.username;
      let res = await _this.$https.getNavList(parm, token);
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        let menu = res.menu;
        let router = [];
        //let asyncRouterMap=routers.asyncRouterMap;
        // console.log(asyncRouterMap);
        menu.forEach(item => {
          let a = asyncRouterMap.find(one => {
            return one.path == item.url;
          });
          let aa = [];
          item.children.forEach(ittem => {
            let ss = a.children.find(oone => {
              let bbb = a.path + "/" + oone.path;
              return bbb == ittem.url;
            });
            aa.push(ss);
          });
          a.children = aa;
          router.push(a);
        });
        router.push(asyncRouterMap[asyncRouterMap.length - 1]);
        _this.$router.addRoutes(router);
        this.$store.commit("changeMenu", menu);
        this.$router.push({
          path: menu[0].children[0].url
        });
      }
    },
    //绘制验证码
    identityCode() {
      let _this = this;
      var letter = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "m",
        "n",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ];
      var s = "";
      var codelen = 4;
      var a;
      //随机生成验证码
      for (var i = 0; i < codelen; i++) {
        let a = Math.floor(Math.random() * 62);
        let b = letter[a];
        if (
          b === undefined ||
          b.toLowerCase() == "i" ||
          b.toLowerCase() == "l" ||
          b == "1"
        ) {
          i--;
        } else {
          s += b;
        }
      }
      // console.log(s);
      var width = this.canvas.width;
      var height = this.canvas.height;
      var draw = this.$refs.identcode.getContext("2d");
      draw.clearRect(0, 0, width, height); //清除画布
      //绘制地图
      draw.fillStyle = "#F5F5F5";
      draw.fillRect(0, 0, width, height);
      //绘制验证码
      draw.textAlign = "left";
      draw.textBaseline = "top";
      //绘制验证码
      var b = width / codelen;
      draw.font = "bold 30px Times,'Times News Roman',serif";
      var w = 0,
        h = 0;
      for (var j = 0; j < codelen; j++) {
        var colorText = "#";
        for (i = 0; i < 6; i++) {
          let a = Math.floor(Math.random() * 16);
          colorText += letter[a];
        }
        draw.fillStyle = colorText;
        w = Math.random() * 10 + b * j;
        h = (Math.random() * height) / 3;
        draw.fillText(s[j], w, h);
      }
      this.code = s;
      //绘制干扰点
      var gradient = draw.createLinearGradient(0, 0, width, height);
      var point = [];
      for (j = 0; j < 3; j++) {
        b = "#";
        for (i = 0; i < 6; i++) {
          let a = Math.floor(Math.random() * 16);
          b += letter[a];
        }
        point[j] = b;
      }
      gradient.addColorStop(0, point[0]);
      gradient.addColorStop(0.5, point[1]);
      gradient.addColorStop(1, point[2]);

      draw.fillStyle = gradient;
      for (i = 0; i < 50; i++) {
        draw.beginPath();
        w = Math.random() * width;
        h = Math.random() * height;
        draw.arc(w, h, 1, 0, Math.PI * 2);
        draw.fill();
        draw.closePath();
      }
      //绘制干扰线
      b = "#";
      for (i = 0; i < 6; i++) {
        let a = Math.floor(Math.random() * 16);
        b += letter[a];
      }
      draw.strokeStyle = b;
      draw.beginPath();
      w = (Math.random() * width) / 4;
      h = (Math.random() * height) / 3;
      draw.moveTo(w, h);
      a = Math.random() * 50;
      b = Math.random() * 100;
      w = (Math.random() * width) / 4 + (width / 4) * 3;
      h = (Math.random() * height) / 3 + (height / 3) * 2;
      draw.quadraticCurveTo(a, b, w, h);
      draw.lineWidth = 2;
      draw.stroke();
      setTimeout(() => {
        _this.inter = _this.identityCode();
      }, 200000);
    }
  }
};
</script>
<style lang="scss">
// @import "assets/css/login.scss";

.error-icon {
  color: $error-icon-color;
  padding-right: 5px;
  float: left;
}

.error {
  border: 1px solid $error-border-color;
  background-color: $error-back-color;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  margin-bottom: 20px;
}

.error > div {
  display: block;
  word-wrap: break-word;
  float: left;
  width: 255px;
  color: $error-font-color;
}

#load .login-form {
  width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid $login-form-border;
  border-radius: 6px;
  box-shadow: 0 0 10px $login-form-shadow;
}

#load .login-btn {
  width: 44% !important;
  height: 45px !important;
  // background-color: #63b9ff !important;
  font-size: 20px !important;
  letter-spacing: 5px;
  border: none !important;
}
.form-title {
  color: $login-form-title-font;
  padding-bottom: 10px;
  border-bottom: 1px solid $login-border;
  margin-bottom: 20px;
}

#load .center .model {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#load .center {
  position: absolute;
  top: 0;
  left: 0;
  background: #046562;
  //background-image: url("/img/bg3.png");
  padding-top: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  /*calc(100% - 160px);*/
  overflow: auto;
}

#load .center {
  -moz-transition: opacity 0.5s ease;
  -webkit-transition: opacity 0.5s ease;
  -ms-transition: opacity 0.5s ease;
  transition: opacity 0.5s ease;
  opacity: 1;
}

#load .model .bottom {
  display: flex;
  height: 80px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 4%;
  width: 100%;
  color: $login-form-title-font;
  font-size: 25px;
  letter-spacing: 21px;
}

#load .login-form .login-input {
  height: 55px !important;
}

#load .login-form .login-input .el-input__inner {
  height: 55px !important;
  font-size: 20px;
  line-height: 55px;
  background-color: $login-input-back;
  color: $login-font-color;
}

#load .login-form .login-input .el-input__inner:focus {
  border-color: $login-input-border-active;
}

#load .login-form .yanzheng {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  height: 55px;
}

#load .login-form .el-form {
  width: 400px;
  margin-top: 30px;
}

#load .login-form .login-title {
  width: 100%;
  height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $login-form-title-font;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 13px;
  border-bottom: 1px solid $login-border;
  background-size: contain;
}

#load .login-form .input-yanzheng {
  width: 200px;
}

#load .login-form .el-form-item {
  margin-bottom: 25px;
  height: 55px;
}

#load .login-form canvas {
  border-radius: 5px;
}

#load .login-form .icon {
  color: $login-font-color;
  font-size: 28px;
}

#load .login-form .el-input__prefix {
  padding: 0 10px;
  line-height: 55px;
}

#load .login-form .el-input--prefix .el-input__inner {
  padding-left: 50px;
}
</style>
