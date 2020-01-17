export default {
	data(){
		return {
			maxZindex:1700
		}
	},
	methods: {
		changeZindex(index) {
			//console.log("改变zindex");
			let _this = this;
			let data = _this.indexList;
			// let ss = data.find(item => {
			// 	return item.zindex >= data[index].zindex;
			// })
			if(data[index].zindex!=_this.maxZindex){
				data.forEach((item, i) => {
					if (index == i) {
						item.zindex = _this.maxZindex;
					} else {
						item.active = false;
						item.zindex = item.zindex - 50;
					}
				})
			}
			data[index].active = true;
			_this.indexList = data;
		},
		changeActive(index) {
			let _this = this;
			_this.indexList[index].active = false;
		}
	}
}
