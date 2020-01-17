<template>
	<div class="content" id="device-position">
		<div class="card-part">
			<div id="positionTopo" class="topo-part">
			</div>
			<!-- 拓扑详情 -->
			<el-dialog :visible.sync="detailsShow" :close-on-click-modal="false" width="1200px">
				<div slot="title">
					{{editTitle}}
				</div>
				<topo-details class="topo-details" :didList="didList"></topo-details>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import G6 from '@antv/g6';
	import topoDetails from "./deviceTopo.vue"
	export default {
		name: "positionTopo",
		data() {
			return {
				graph: "",
				didList: [],
				detailsShow: false,
				editTitle:""
			}
		},
		components: {
			topoDetails
		},
		mounted() {
			let _this = this;
			_this.initG6();
			_this.getPisitionList();
		},
		methods: {
			hideTopoTop() {
				let top = _this.graph.findById("0");
				let edges = top.getEdges();
				edges.forEach(item => {
					item.hide();
				})
				top.hide();
			},
			async getPisitionList() {
				let _this = this;
				let res = await _this.$api.getRequest(null, "getPositionTree");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					if (res.length > 0) {
						let data = {
							isRoot: true,
							id: "root",
							label: "中国",
							children: res
						}
						_this.graph.read(data);
					} else {
						_this.message.warning("请添加设备");
					}
				}
			},
			//自定义边
			registEdge() {
				G6.registerEdge('step-line', {
					getControlPoints: function getControlPoints(cfg) {
						var startPoint = cfg.startPoint;
						var endPoint = cfg.endPoint;
						let y = (startPoint.y + endPoint.y) / 2
						return [{
							x: startPoint.x,
							y: y
						}, {
							x: endPoint.x,
							y: y
						}];
					}
				}, 'polyline');
			},
			initG6() {
				let _this = this;
				let paint = document.getElementById('positionTopo');
				_this.registEdge();
				let width = paint.clientWidth;
				let height = paint.clientHeight;
				let graph = new G6.TreeGraph({
					container: 'positionTopo',
					width: width,
					height: height,
					fitView: true,
					// pixelRatio: 2,
					// linkCenter: true,
					modes: { // 支持的 behavior
						default: [{
							type: 'collapse-expand',
							onChange: function onChange(item, collapsed) {
								var data = item.get('model').data;
								data.collapsed = collapsed;
								return true;
							}
						}, 'drag-canvas', 'zoom-canvas', 'click-select'],
					},
					defaultNode: { //默认节点样式
						shape: 'rect',
						size: [60, 30],
						// anchorPoints: [
						// 	[0.5, 0],
						// 	[0.5, 1]
						// ],
						//anchorPoints:[[0.5,0],[1,0.5],[0.5,1]],
						labelCfg: {
							position: 'center',
							style: {
								fill: '#666',
								fontSize: 11
							}
						}
					},
					nodeStateStyles: {
						// 节点在默认状态下的样式
						default: {
							fill: '#cceafd',
							stroke: '#ced4d8',
							lineWidth: 1,
							fillOpacity: 1,
							shadowColor: "#bddaec",
							shadowBlur: 5,
							shadowOffsetX: 0,
							shadowOffsetY: 0,
							radius: 5,
						},
						// 当节点在 selected 状态下的样式
						selected: {
							lineWidth: 2,
							fillOpacity: 0.8
						}
					},
					// 默认边配置
					defaultEdge: {
						shape: 'step-line',
						//shape:"cubic-horizontal",
						size: 1,
						labelCfg: {
							refY: 10
						}
					},
					edgeStateStyles: {
						// 默认边的样式
						default: {
							stroke: '#afafaf',
							lineWidth: 2,
						}
					},
					layout: {
						type: 'compactBox',
						direction: 'TB',
						getId: function getId(d) {
							if (d) {
								return d.id;
							}
							return "iid";
						},
						getHeight: function getHeight(d) {
							// console.log(d);
							// if(d&&d.id=='0'){
							// 	return 0;
							// }
							return 40;
						},
						getWidth: function getWidth(d) {
							// if(d&&d.id=='0'){
							// 	return 0;
							// }
							return 30;
						},
						getVGap: function getVGap() {
							return 30;
						},
						getHGap: function getHGap() {
							return 60;
						}
					}
				});
				_this.graph = graph;
				_this.G6Event();
			},
			//G6事件处理
			G6Event() {
				let _this = this;
				_this.graph.on("node:click", ev => {
					let inter = _this.interval;
					let radius = _this.passRadius;
					let item = ev.item;
					let model = item.getModel();
					if (model.type == "station") {
						_this.editTitle=model.label;
						_this.getDidList(model.id);
					}
				})
			},
			//根据station获取设备DID信息
			async getDidList(val) {
				let _this = this;
				let param = new Array();
				//val.forEach(item=>{
				param.push({
					provinceId: "000",
					cityId: "000",
					countryId: "000",
					townId: "000",
					villageId: "000",
					stationId: val
				})
				//})
				let res = await _this.$api.postRequest(param, "getCaseCadePositionInfo");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.selectShow = false;
					let didList = new Array();
					res.forEach(item => {
						didList.push(item.did);
					})
					_this.openDetails();
					_this.didList = didList;
					
					//_this.getDeviceList(didList);
				}
			},
			openDetails(){
				 let _this=this;
				 _this.detailsShow=true;
			}
		}
	}
</script>

<style>
	#device-position .card-part{
		width: 100%;
		height: 100%;
	}
	.topo-details {
		height: 740px;
	}
</style>
