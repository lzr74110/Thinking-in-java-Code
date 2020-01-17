<template>
	<div class="topo-part" id="topoPaint">
	</div>
</template>

<script>
	import G6 from '@antv/g6';
	export default {
		name: "topo",
		props: {
			didList: {
				required: true,
				type: Array
			},
		},
		data() {
			return {
				graph: "",
			}
		},
		watch: {
			didList() {
				let _this = this;
				if (_this.graph == "") {
					_this.initG6();
				}
				_this.getDeviceList();
			}
		},
		created() {
			let _this = this;

		},
		mounted() {
			let _this = this;
			let one = document.getElementById("topoPaint");
			if (one) {
				_this.initG6();
				_this.getDeviceList();
			}
			// let data = {
			// 	nodes: [{
			// 		id: 'node1',
			// 		type: "5G-5U",
			// 		deviceType: 1,
			// 		x: 250,
			// 		y: 350,
			// 		label: '试试'
			// 	}, {
			// 		id: 'node2',
			// 		type: "5G-3U",
			// 		deviceType: 0,
			// 		x: 850,
			// 		y: 350,
			// 		label: '试试'
			// 	}],
			// 	edges: [{
			// 		source: "node1",
			// 		target: "node2",
			// 		id: "ss"
			// 	}]
			// }
			// _this.graph.read(data);
			// const edgeGroup = _this.graph.get('edgeGroup'); // 得到默认的边图形分组
			// edgeGroup.toFront(); // 将边图形分组前置
			// _this.graph.paint(); // 必须调用以重绘
		},
		methods: {
			async getDeviceList() {
				let _this = this;
				let didList = _this.didList;
				if (didList) {
					let param = {
						id: didList
					}
					let res = await _this.$api.postRequest(param, "getDeviceLiveSlave");
					if (res.code) {
						_this.$message({
							message: res.msg,
							type: "warning"
						});
					} else {
						//_this.deviceList = res;
						let nodes = [{
							id: '94',
							name: "111",
							type: "5G-2U",
							deviceType: 1,
							slaves: [{
								num: 2,
								slaveName: "波分板02",
								protect: "是",
							}, {
								num: 1,
								slaveName: "波分板01",
								protect: "否",
							}]
						},{
							id: '95',
							name: "222",
							type: "5G-1U",
							deviceType: 1,
							slaves: [{
								num: 2,
								slaveName: "波分板02",
								protect: "是",
							}, {
								num: 1,
								slaveName: "波分板01",
								protect: "否",
							}]
						},{
							id: '96',
							name: "333",
							type: "5G-1U",
							deviceType: 2,
							slaves: [{
								num: 2,
								slaveName: "波分板02",
								protect: "是",
							}, {
								num: 1,
								slaveName: "波分板01",
								protect: "否",
							}]
						}];
						let edges = [{
							source:"94",
							target:"96",
							dNum:2,
							fNum:2,
							dL:1,
							fL:2
						},{
							source:"94",
							target:"96",
							dNum:2,
							fNum:2,
							dL:2,
							fL:1
						}];
						let data = {
							nodes: nodes,
							edges: edges
						}
						_this.graph.read(data);
						const edgeGroup = _this.graph.get('edgeGroup'); // 得到默认的边图形分组
						edgeGroup.toFront(); // 将边图形分组前置
						_this.graph.paint(); // 必须调用以重绘
					}
				}
			},
			//自定义边
			registEdge() {
				G6.registerEdge('step-line', {
					options: {
						style: {
							stroke: '#ada400'
						}
					},
					draw(cfg, group) {
						let source = cfg.sourceNode;
						let target = cfg.targetNode;
						let dl=cfg.dNum+"L"+cfg.dL;
						let sl1 = source.getContainer().findByClassName(dl);
						// console.log(sl1);
						let attr1 = sl1._attrs;
						let fl=cfg.fNum+"L"+cfg.fL;
						let tl1 = target.getContainer().findByClassName(fl);
						let attr2 = tl1._attrs;
						const startPoint = cfg.startPoint;
						const endPoint = cfg.endPoint;
						const stroke = cfg.style && cfg.style.stroke || this.options.style.stroke;
						const keyShape = group.addShape('path', {

							attrs: {
								path: [
									['M', startPoint.x + attr1.x, startPoint.y + attr1.y],
									['L', endPoint.x + attr2.x, endPoint.y + attr2.y]
								],
								stroke,
								lineWidth: 2,
								className: 'edge-shape'
							}
						});
						return keyShape;
					}
				});
			},
			//自定义节点
			registNode() {
				let _this = this;
				G6.registerNode("costum-device", {
					draw(cfg, group) {
						var {
							style,
							label,
							type,
							deviceType,
							slaves,
							name
						} = cfg;
						console.log(cfg);
						//绘制中心圆（keyShape）
						const keyShape = group.addShape("circle", {
							attrs: {
								x: 0,
								y: 0,
								r: 1,
								stroke: "#FFD591",
								opacity:0
							}
						});
						let passNum = parseInt(type.replace(/(5G-)|(U)/g, ""));
						var oneW;
						var oneH = 30;
						var Wpath = 20;
						var Hpath = 10;
						var Wsize;
						var Hsize;
						var Wge = 30;
						var Hge = 15;
						let jintype = true;
						if (deviceType == 1) {
							oneW = 150;
							Wsize = 2;
							const basic = 4;
							Hsize = passNum * basic / Wsize;
						} else {
							if (passNum == 1) {
								oneW = 100;
								Wsize = 3;
								Hsize = 1;
							} else if (passNum == 3) {
								oneW = 30;
								oneH = 100;
								Wpath = 0;
								Wsize = 16;
								Hsize = 1;
								Hge = 20;
								jintype = false;
							}
						}
						//绘制机框
						const width = oneW * Wsize + Wpath * (Wsize - 1) + Wge * 2;
						const height = oneH * Hsize + Hpath * (Hsize - 1) + Hge * 2;
						const startX = 0 - (width) / 2;
						const startY = 0 - (height) / 2;
						group.addShape("rect", {
							attrs: {
								x: startX,
								y: startY,
								width: width,
								height: height,
								stroke: "#717171",
								lineWidth:3,
								// shadowBlur: 5,
								// shadowColor: "#000"
							},
							className: "kuang"
						});
						//绘制设备名称
						if(name){
							group.addShape("text", {
								attrs: {
									text: name,
									x: 0,
									y: startY+height+5,
									fontSize: 12,
									textAlign: "center",
									textBaseline: 'top',
									fill: "#707071",
								}
							})
						}
						//绘制板框
						const Lr = 6;
						for (let i = 0; i < Hsize; i++) {
							let row_Y = startY + i * oneH + i * Hpath + Hge;
							for (let j = 0; j < Wsize; j++) {
								let Pnum = i * Wsize + j + 1;
								let row_X = startX + Wge + j * oneW + j * Wpath;
								let oneSlave = slaves.find(item => {
									return item.num == Pnum;
								})
								let rectColor = "#e2e2e4";
								if (oneSlave) {
									rectColor = "#e2f1ff";
								}
								group.addShape("rect", {
									attrs: {
										x: row_X,
										y: row_Y,
										width: oneW,
										height: oneH,
										stroke: "9a9685",
										fill: rectColor
									},
									className: "ban-kuang"
								});
								//L1，L2
								let l1_x;
								let l1_y;
								let l1font_x;
								let l1font_y;
								let l1font_as;
								let l2_x;
								let l2_y;
								let l2font_x;
								let l2font_y;
								let l2font_as;
								let num_x;
								let num_y;
								let numfont_as;
								if (jintype) {
									l1_x = row_X + Lr * 2;
									l1_y = row_Y + oneH / 2;
									l1font_x = row_X + Lr * 3 + 3;
									l1font_y = l1_y;
									l2_x = row_X + oneW - Lr * 2;
									l2_y = row_Y + oneH / 2;
									l2font_x = row_X + oneW - Lr * 3 - 3;
									l2font_y = l2_y;
									num_x = row_X - 5;
									num_y = l2_y;
									l1font_as = "left";
									l2font_as = "right";
									numfont_as = "right";
								} else {
									l1_x = row_X + oneW / 2;
									l1_y = row_Y + Lr + 3;
									l1font_x = l1_x;
									l1font_y = l1_y + Lr + 8;
									l2_x = l1_x;
									l2_y = row_Y + oneH - 3 - Lr;
									l2font_x = l2_x;
									l2font_y = l2_y - Lr - 5;
									num_x = l1_x;
									num_y = row_Y - 5;
									l1font_as = "center";
									l2font_as = "center";
									numfont_as = "center";
								}
								//如果插槽插入slave板则绘制L1L2
								if (oneSlave) {
									group.addShape("circle", {
										attrs: {
											x: l1_x,
											y: l1_y,
											r: Lr,
											stroke: "#3d6d45",
											fill: "#91ce9c"
										},
										className: Pnum + "L1"
									});
									group.addShape("text", {
										attrs: {
											text: "L1",
											x: l1font_x,
											y: l1font_y,
											fontSize: 12,
											textAlign: l1font_as,
											textBaseline: 'middle',
											fill: "#707071",
										}
									})
									if (oneSlave.protect == '是') {

										//绘制L2
										group.addShape("circle", {
											attrs: {
												x: l2_x,
												y: l2_y,
												r: Lr,
												stroke: "#3d6d45",
												fill: "#9bcab4"
											},
											className: Pnum + "L2"
										});
										group.addShape("text", {
											attrs: {
												text: "L2",
												x: l2font_x,
												y: l2font_y,
												fontSize: 12,
												textAlign: l2font_as,
												textBaseline: 'middle',
												fill: "#707071",
											}
										})
									}
								}
								if (j == 0 || j == Wsize - 1) {
									let num = i * Wsize + j + 1;
									group.addShape("text", {
										attrs: {
											text: num,
											x: num_x,
											y: num_y,
											fontSize: 12,
											textAlign: numfont_as,
											textBaseline: 'middle',
											fill: "#707071",
										}
									})
								}

							}
						}
						return keyShape
					},
					setState(name, value, node) {
						const group = node.getContainer();
						let passNum = name.replace(/^\w*-/, "")
						let onePass = group.findByClassName("pass" + passNum);
						console.log(onePass);
						//激活状态
						if (name.indexOf("active") == 0) {
							if (value) {
								onePass.attr({
									fill: "r(0.5, 0.5, 0.01) 0:#ffffff 0.5:#20b92c 1:#098813",
									stroke: "#098813"
									//fill:"#098813"
								})
								onePass.animate({
									fill: "r(0.5, 0.5, 0.01) 0:#ffffff 0.5:#20b92c 1:#098813",
									stroke: "#098813",
									repeat: false
								}, 1000);
							} else {
								//onePass.stopAnimate();
								// onePass.attr({
								// 	fill: "#ecf9f8",
								// 	stroke: "#acb9b8"
								// 	//fill:"#098813"
								// })
								onePass.animate({
									fill: "#ecf9f8",
									stroke: "#acb9b8",
									repeat: false
								}, 1000);
							}
						} else if (name.indexOf("alarm-") == 0) {
							//告警状态
							if (value) {
								onePass.attr({
									fill: "r(0.5, 0.5, 0.01) 0:#fffc99 0.5:#cc6a05 1:#ca0000",
									stroke: "#ca0000"
									//fill:"#098813"
								})
								onePass.stopAnimate();
								onePass.animate({
									fill: "r(0.5, 0.5, 0.01) 0:#fffc99 0.5:#cc6a05 1:#ca0000",
									stroke: "#ca0000",
									repeat: false
								}, 1000);
							} else {
								onePass.stopAnimate();
								// onePass.attr({
								// 	fill: "#ecf9f8",
								// 	stroke: "#acb9b8"
								// 	//fill:"#098813"
								// })
								onePass.animate({
									fill: "#ecf9f8",
									stroke: "#acb9b8",
									repeat: false
								}, 1000);
							}
						} else if (name.indexOf("inactive") == 0) {
							//失活状态
							onePass.stopAnimate();
							onePass.attr({
								fill: "#ecf9f8",
								stroke: "#acb9b8"
								//fill:"#098813"
							})
							// onePass.animate({
							// 	stroke: "#098813",
							// 	repeat: false
							// }, 1000);
						}

					}
				});
			},
			initG6() {
				let _this = this;
				let paint = document.getElementById('topoPaint');
				_this.registNode();
				_this.registEdge();
				let width = paint.clientWidth;
				let height = paint.clientHeight;
				let graph = new G6.Graph({
					container: 'topoPaint',
					width: width,
					height: height,
					fitView: true,
					layout: {
						type: 'dagre',
						rankdir: 'TB',
						//节点间距
						nodesepFunc:function(d){
							let type=d.type;
							let deviceType=d.deviceType;
							let passNum = parseInt(type.replace(/(5G-)|(U)/g, ""));
							var oneW;
							var Wsize;
							var Wpath = 20;
							var Wge = 30;
							if (deviceType == 1) {
								oneW = 150;
								Wsize = 2;
							} else {
								if (passNum == 1) {
									oneW = 100;
									Wsize = 3;
								} else if (passNum == 3) {
									oneW = 30;
									Wsize = 16;
									Wpath = 0;
								}
							}
							//绘制机框
							const width = oneW * Wsize + Wpath * (Wsize - 1) + Wge * 2;
							return width/2+50;
						},
						//层间距
						ranksepFunc:function(d){
							let type=d.type;
							let deviceType=d.deviceType;
							let passNum = parseInt(type.replace(/(5G-)|(U)/g, ""));
							var oneH = 30;
							var Hpath = 10;
							var Hsize;
							var Hge = 15;
							if (deviceType == 1) {
								const basic = 2;
								Hsize = passNum;
							} else {
								if (passNum == 1) {
									Hsize = 1;
								} else if (passNum == 3) {
									oneH = 100;
									Hsize = 1;
									Hge = 20;
								}
							}
							//绘制机框
							const height = oneH * Hsize + Hpath * (Hsize - 1) + Hge * 2;
							return height;
						}
					},
					modes: { // 支持的 behavior
						default: ['drag-canvas', 'zoom-canvas', 'click-select', 'drag-node'],
					},
					defaultNode: { //默认节点样式
						shape: 'costum-device',
						//size: [60, 30],
						anchorPoints: [
							[0.5, 0],
							[0.5, 1]
						],
						//anchorPoints:[[0.5,0],[1,0.5],[0.5,1]],
						labelCfg: {
							position: 'bottom'
						}
					},
					nodeStyle: {
						// 节点在默认状态下的样式
						default: {
							fill: '#bae0ff',
							stroke: '#096dd9',
							lineWidth: 1,
							fillOpacity: 1
						},
						// 当节点在 selected 状态下的样式
						selected: {
							lineWidth: 2,
							fillOpacity: 0.8
						}
					},
					nodeLabel: {
						position: 'bottom',
						style: {
							fill: '#666'
						}
					},
					// 默认边配置
					defaultEdge: {
						shape: 'step-line',
						size: 1,
						labelCfg: {
							refY: 10
						}
					},
					edgeStyle: {
						// 默认边的样式
						default: {
							stroke: 'red',
							lineWidth: 2,
						}
					},
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
					console.log("点击" + model.label);
					console.log(model);
					console.log(model.x);
					console.log(item.getKeyShape());
					let type = new Number(model.type);

				})
			},
		}
	}
</script>

<style>
</style>
