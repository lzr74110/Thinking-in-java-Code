<template>
  <div class="content" id="user-info">
    <div class="user-part">
      <div class="horn">
        <div class="lt"></div>
        <div class="rt"></div>
        <div class="rb"></div>
        <div class="lb"></div>
      </div>
      <div class="form-part">
        <el-form ref="form" :model="form" :rules="formRule" label-width="80px" size="mini" class="form  twoForm" label-position="left">
          <el-form-item label="用户名" prop="username">
            <el-input class="short-input" :disabled="true" auto-complete="new-password" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realname">
            <el-input class="short-input" auto-complete="new-password" v-model="form.realname"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" auto-complete="new-password" class="short-input" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="pwd">
            <el-input type="password" class="short-input" v-model="form.pwd"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 	<el-form-item label="年龄" prop="age">
						<el-input class="short-input" v-model="form.age"></el-input>
					</el-form-item> -->
          <el-form-item label="手机" prop="phone">
            <el-input class="short-input" v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input class="short-input" v-model="form.email"></el-input>
          </el-form-item>
        </el-form>
        <div class="foot-tools">
          <el-button type="primary" size="small" :disabled="submitDis" class="sureBtn" @click="submitEdit()">修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "userInfo",
  data() {
    // 密码一致
    var testPwd = (rule, value, callback) => {
      let _this = this;
      if (_this.editTitle == "添加用户") {
        if (value == "") {
          callback(new Error("请输入重复密码"));
        } else if (_this.form.password != value) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    // 更改密码验证重复密码
    var testCmd = (rule, value, callback) => {
      let _this = this;
      if (_this.editTitle == "添加用户") {
        if (value == "") {
          callback(new Error("请输入口令"));
        } else {
          var reg = /^\w{8,20}$/;
          var patt = new RegExp(reg);
          if (!patt.test(value)) {
            callback(new Error("请输入8~20个字母/数字"));
          } else {
            if (_this.form.pwd != "") {
              _this.$refs.form.validateField("pwd");
            }
            callback();
          }
        }
      } else {
        callback();
      }
    };
    return {
      loading: false,
      submitDis: false,
      form: {
        avatar: "",
        username: "ds",
        realname: "",
        password: "",
        birthday: "",
        pwd: "",
        sex: "",
        //	age: "",
        phone: "",
        email: "",
        roleid: "",
        deptid: "",
        cid: "",
        cname: "",
        cindex: ""
      },
      formRule: {
        realname: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            validator: testCmd,
            trigger: "blur"
          }
        ],
        pwd: [
          {
            required: true,
            message: "请输入重复密码",
            trigger: "blur"
          },
          {
            validator: testPwd,
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: false,
            message: "请选择性别",
            trigger: "blur"
          }
        ],
        // age: [{
        // 	required: true,
        // 	message: '请输入年龄',
        // 	trigger: 'blur'
        // }, {
        // 	pattern: /^((1\d\d)|[1-9]\d)$/,
        // 	message: "请输10-199之间的数字",
        // 	trigger: "blur"
        // }],
        phone: [
          {
            required: false,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: false,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
            message: "邮箱格式出错",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: false,
            message: "请输入地址",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    let _this = this;
    _this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      let _this = this;
      let id = _this.$store.state.user.username;
      _this.loading = true;
      let res = await this.$api.getRequest(null, "getUserInfo", id);
      _this.loading = false;
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        let data = new Object();
        for (let x in _this.form) {
          data[x] = res[x] || "";
        }
        data.password = "";
        data.pwd = "";
        _this.form = data;
      }
    },
    submitEdit() {
      let _this = this;
      _this.$refs.form.validate(valid => {
        if (valid) {
          _this.submitDis = true;
          _this.updateUserInfo();
        }
      });
    },
    async updateUserInfo() {
      let _this = this;
      let param = _this.form;
      _this.loading = true;
      let res = await _this.$api.putRequest(param, "updateOneUserInfo");
      _this.submitDis = false;
      _this.loading = false;
      if (res.code) {
        _this.$message({
          message: res.msg,
          type: "warning"
        });
      } else {
        _this.$message({
          message: "修改个人信息成功",
          type: "success"
        });
      }
    }
  }
};
</script>

<style>
#user-info {
  display: flex;
  /* justify-content: center;
		align-items: center; */
}
#user-info > .user-part {
  width: 80%;
  min-width: 800px;
  max-width: 1000px;
  /* height: 500px; */
  height: auto;
  margin: 20px;
  padding-bottom: 20px;
  position: relative;
}
#user-info .form-part {
  margin: 20px;
  position: relative;
}
#user-info .foot-tools {
  display: flex;
  /* justify-content: center;
  align-items: center; */
}
.sureBtn {
  margin-top: 50px;
  margin-left: 50px;
}
</style>
