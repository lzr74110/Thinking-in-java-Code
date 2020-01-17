<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <el-input size="mini" v-model="value" @change="handleChange" @pressEnter="check"></el-input>
      <i class="icon-check el-icon-check" @click="check"></i>
      <i class="icon-close el-icon-close" @click="close"></i>
    </div>
    <div v-else="editable" class="editable-cell-text-wrapper">
      <span class="value-span">
        {{ value }}
      </span>
      <i class="icon-edit el-icon-edit" :class="{'edit-forever':editForever}" @click="edit"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "editCell",
  props: {
    text: {
      required: true
    },
    reg: {
      required: false
    },
    msg: {
      required: false
    },
	editForever:{
		 type:Boolean,
		 required: false,
		 default:false
	}
  },
  data() {
    return {
      value: this.text,
      editable: false
    };
  },
  watch: {
    text() {
      let _this = this;
      let a = _this.text;
      _this.value = _this.text;
      // console.log(_this.text);
    }
  },
  // mounted() {
  // 	console.log("修改Cell");
  // },
  methods: {
    handleChange(e) {
      const value = e;
      this.value = value;
    },
    check() {
      let _this = this;
      if (_this.value) {
        if (_this.reg) {
          let neg = new RegExp(_this.reg);
          if (neg.test(_this.value)) {
            _this.editable = false;
            _this.$emit("update:text", _this.value);
          } else {
            _this.$message({
              message: _this.msg,
              type: "warning"
            });
          }
        } else {
          _this.editable = false;
          _this.$emit("update:text", _this.value);
        }
      } else {
        _this.$message({
          message: "请输入",
          type: "warning"
        });
      }
    },
    edit() {
      this.editable = true;
    },
    close() {
      let _this = this;
      _this.value = _this.text;
      this.editable = false;
    }
  }
};
</script>

<style>
.editable-cell {
  position: relative;
}

.editable-cell-text-wrapper {
  padding: 0px 20px 0px 0px;
  /* display: flex;
		justify-content: space-between;
		align-items: center; */
}

.editable-cell-input-wrapper {
  padding: 0px 40px 0px 0px;
}

.editable-cell .icon-edit,
.editable-cell .icon-check,
.editable-cell .icon-close {
  right: 0;
  top: calc(50% - 10px);
  width: 20px;
  text-align: center;
  font-size: 15px;
  cursor: pointer;
  position: absolute;
  line-height: 20px;
}

.editable-cell .icon-edit {
  display: none;
}

.editable-cell .icon-close {
  right: 20px;
}

.editable-cell .icon-edit:hover,
.editable-cell .icon-check:hover {
  font-weight: 600;
  color: #0088ff;
}

.editable-cell .icon-close:hover {
  font-weight: 600;
  color: #fbb000;
}

.editable-cell:hover .icon-edit,.edit-forever.icon-edit {
  display: inline-block;
}

.editable-cell-input-wrapper > .el-input > .el-input__inner:hover,
.editable-cell-input-wrapper > .el-input > .el-input__inner:focus {
  border-color: #0088ff;
}

.editable-cell-text-wrapper .value-span {
  min-width: 30px;
  display: inline-block;
  min-height: 15px;
}
</style>
