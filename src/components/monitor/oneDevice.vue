<template>
	<div id="one-device" class="content">
		<div class="one-part">
			<div class="title-part">
				<div>
					<div>
						{{device.name}}
					</div>
					<div>
						IP： {{device.ip}}
					</div>
					<div>
						端口：{{device.port}}
					</div>
					<div>
						<el-select class="short-select" size="mini" v-model="deviceFBB" @change="changeFBB">
							<el-option v-for="(item,index) in waveDividList" :key="index" :label="item.slaveName" :value="index"></el-option>
						</el-select>
					</div>
					<div>
						<el-button class="optBtn" size="mini" @click="optBtn()">设备联通测试</el-button>
					</div>
				</div>
			</div>
			<div class="content-part tableContent">
				<div class="two-table">
					<!-- 机框槽位信息 -->
					<div class="center-kuang">
						<div class="device-part">
							<div class="side-part">
							</div>
							<div class="content-part">
								<div class="power-part">
									<div class="one-slot" v-for="(item,index) in powerList" :key="index">
										<div><span v-show="item.sndsite">槽位{{item.sndsite}}:</span> </div>
										<div>{{item.sndname}}</div>
										<div>
											<div :class="{active:item.states==1,'alarm-high':item.states=='0','attr-manage':true}"></div>
										</div>
										<div>
											<el-tooltip placement="right" effect="light" popper-class="popo-cos" :disabled="item.newStatus==0">
												<div v-if="item.newStatus==1" class="circle-icon activeone" @click="updateNewstatus(item)"></div>
												<div v-else-if="item.newStatus==2" class="circle-icon activetwo" @click="updateNewstatus(item)"></div>
												<div v-else-if="item.newStatus==3" class="circle-icon activethree" @click="updateNewstatus(item)"></div>
												<div v-else-if="item.newStatus==4" class="circle-icon activefour" @click="updateNewstatus(item)"></div>
												<div v-else-if="item.newStatus==5" class="circle-icon activefive" @click="updateNewstatus(item)"></div>
												<div v-else></div>
												<div slot="content">
													<div class="icon-lengend">
														<span class="icon-font"><span class="circle-icon icon activeone"></span><span class="icon-f">&nbsp;master更换为slave</span></span>
														<span class="icon-font"><span class="circle-icon icon activetwo"></span><span class="icon-f">&nbsp;slave更换为master</span></span>
														<span class="icon-font"><span class="circle-icon icon activethree"></span><span class="icon-f">&nbsp;板子类型不变</span></span>
														<span class="icon-font"><span class="circle-icon icon activefour"></span><span class="icon-f">&nbsp;板子拔出</span></span>
														<span class="icon-font"><span class="circle-icon icon activefive"></span><span class="icon-f">&nbsp;新板插入</span></span>
													</div>
												</div>
											</el-tooltip>
										</div>
									</div>
								</div>
								<div class="right-part">
									<div v-for="(item,index) in rightList" :key="index" class="one-slot">
										<div>槽位{{item.sndsite}}:</div>
										<div v-if="item.channelNumber && item.snddef=='是'">{{item.sndname}}-{{item.channelNumber}}带保护</div>
										<div v-else-if="item.channelNumber && item.snddef=='否'">{{item.sndname}}-{{item.channelNumber}}不带保护</div>
										<div v-else>{{item.sndname}}</div>
										<div class="circle-part">
											<div :class="{active:item.states==1,'alarm-high':item.states==0,'attr-manage':true}"></div>
										</div>
										<div class="circle-part">
											<el-tooltip placement="right" effect="light" popper-class="popo-cos" :disabled="item.newStatus==0">
												<div v-if="item.newStatus==1" class="circle-icon activeone" @click="updateNewstatus(item)"></div>
												<div v-else-if="item.newStatus==2" class="circle-icon activetwo" @click="updateNewstatus(item)"></div>
												<div v-else-if="item.newStatus==3" class="circle-icon activethree" @click="updateNewstatus(item)"></div>
												<div v-else-if="item.newStatus==4" class="circle-icon activefour" @click="updateNewstatus(item)"></div>
												<div v-else-if="item.newStatus==5" class="circle-icon activefive" @click="updateNewstatus(item)"></div>
												<div v-else></div>
												<div slot="content">
													<div class="icon-lengend">
														<span class="icon-font"><span class="circle-icon icon activeone"></span><span class="icon-f">&nbsp;master更换为slave</span></span>
														<span class="icon-font"><span class="circle-icon icon activetwo"></span><span class="icon-f">&nbsp;slave更换为master</span></span>
														<span class="icon-font"><span class="circle-icon icon activethree"></span><span class="icon-f">&nbsp;板子类型不变</span></span>
														<span class="icon-font"><span class="circle-icon icon activefour"></span><span class="icon-f">&nbsp;板子拔出</span></span>
														<span class="icon-font"><span class="circle-icon icon activefive"></span><span class="icon-f">&nbsp;新板插入</span></span>
													</div>
												</div>
											</el-tooltip>
										</div>
									</div>
								</div>
							</div>
							<div class="side-part">
							</div>
						</div>
					</div>
					<!-- 电源信息 -->
					<el-table :data="pTableData" tooltip-effect="light" size="mini" class="table" border :span-method="objectSpanMethod">
						<el-table-column prop="num" label="通道" :min-width="80" align="center">
							<template slot-scope="scope">
								{{scope.row.num?'P'+scope.row.num:''}}
							</template>
						</el-table-column>
						<el-table-column prop="voltage" label="电压值" :min-width="80" align="center">
							<template slot-scope="scope">
								<div class="fan">
									<div class="book-page-box book-page-2 preserve-3d">
										<div class="book-page page-font ">
											<p>{{scope.row.voltage}}&nbsp;{{scope.row.voltage?'v':''}}</p>
										</div>
									</div>
									<div class="book-page-box book-page-1 preserve-3d" :class="{'flip-animation':scope.row.bookshow}">
										<div class="book-page page-font">
											<p>{{scope.row.oVoltage}}&nbsp;{{scope.row.oVoltage?'v':''}}</p>
										</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="电压告警" prop="alarm" :min-windth="80" align="center">
							<template slot-scope="scope">
								<div :class="{active:scope.row.alarm==1,'alarm-high':scope.row.alarm==0}"></div>
							</template>
						</el-table-column>
						<el-table-column label="电源状态" prop="status" :min-windth="80" align="center">
							<template slot-scope="scope">
								<span :class="{'active-font':scope.row.status=='1','alarm-font':scope.row.status=='0'}">{{scope.row.status==0?"离线":"在线"}}</span>
							</template>
						</el-table-column>
						<el-table-column label="告警列表" prop="alarmDetials" :min-windth="80" align="center">
							<template slot-scope="scope">
								<el-button type="text" size="mini" class="udpBtn" @click="lookAlarmDetails(scope,0)">查看详情</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!-- 主控板信息 -->
					<el-table :data="mTableData" tooltip-effect="light" size="mini" class="table" border :span-method="objectSpanMethod">
						<el-table-column prop="num" label="控制板" :min-width="80" align="center">
							<template slot-scope="scope">
								控制板{{scope.row.num}}【{{'M'+scope.row.num}}】
							</template>
						</el-table-column>
						<el-table-column label="主控权状态" prop="isMain" :min-windth="80" align="center">
							<template slot-scope="scope">
								<span :class="{'active-font':scope.row.isMain=='1','alarm-font':scope.row.isMain=='0'}">{{scope.row.isMain==0?"备用":"主用"}}</span>
								<el-button v-if="scope.$index==0" :disabled="scope.row.opt" class="optBtn4" size="mini" @click="roladChange(scope.row.id,2)">M1->M2</el-button>
								<el-button v-else class="optBtn4" :disabled="scope.row.opt" size="mini" @click="roladChange(scope.row.id,1)">M2->M1</el-button>
							</template>

						</el-table-column>
						<!-- <el-table-column prop="name" label="名称" :min-width="80" align="center"></el-table-column> -->
						<!-- <el-table-column prop="voltage" label="电压值" :min-width="80" align="center">
              <template slot-scope="scope">
                <div class="fan">
                  <div class="book-page-box book-page-2 preserve-3d">
                    <div class="book-page page-font ">
                      <p>{{scope.row.voltage}}&nbsp;{{scope.row.voltage?'v':''}}</p>
                    </div>
                  </div>
                  <div class="book-page-box book-page-1 preserve-3d" :class="{'flip-animation':scope.row.bookshow}">
                    <div class="book-page page-font">
                      <p>{{scope.row.oVoltage}}&nbsp;{{scope.row.oVoltage?'v':''}}</p>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column> -->
						<el-table-column label="通讯告警" prop="alarm" :min-windth="80" align="center">
							<template slot-scope="scope">
								<div class="default" v-if="scope.row.isMain=='0'"></div>
								<div v-else :class="{active:scope.row.alarm==1,'alarm-high':scope.row.alarm==0}"></div>
							</template>
						</el-table-column>
						<el-table-column label="控制板状态" prop="status" :min-windth="80" align="center">
							<template slot-scope="scope">
								<span :class="{'active-font':scope.row.status=='1','alarm-font':scope.row.status=='0'}">{{scope.row.status==0?"离线":"在线"}}</span>
							</template>
						</el-table-column>
						<el-table-column label="告警列表" :min-windth="80" align="center" prop="alarmDetials">
							<template slot-scope="scope">
								<el-button type="text" size="mini" class="udpBtn" @click="lookAlarmDetails(scope,1)">查看详情</el-button>
							</template>
						</el-table-column>
						<!-- <el-table-column label="人工切换" prop="opt" :min-windth="80" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.$index==0" :disabled="scope.row.opt" class="optBtn4" size="mini" @click="roladChange(scope.row.id,1)">M1->M2</el-button>
                <el-button v-else class="optBtn4" :disabled="scope.row.opt" size="mini" @click="roladChange(scope.row.id,2)">M2->M1</el-button>
              </template>
            </el-table-column> -->
					</el-table>
				</div>
				<!-- 波分板详情 -->
				<div class='detial-part' v-loading="loading">
					<el-table :data="otherPassTable" tooltip-effect="light" size="mini" class="table" border default-expand-all>
						<el-table-column type="expand" width="50" label="详情">
							<template slot-scope="props">
								<el-table :data="LTableData" tooltip-effect="light" size="mini" class="table" border :span-method="objectSpanMethod">
									<el-table-column prop="num" label="通道" :min-width="50" align="center"></el-table-column>
									<el-table-column prop="wvelength" label="波长" :min-width="80" align="center"></el-table-column>
									<!-- <el-table-column prop="name" label="名称" :min-width="80" align="center"></el-table-column> -->
									<el-table-column prop="power" label="光功率值" :min-width="80" align="center">
										<template slot-scope="scope">
											<div class="fan">
												<div class="book-page-box book-page-2 preserve-3d">
													<div class="book-page page-font ">
														<p>{{scope.row.power}}</p>
													</div>
												</div>
												<div class="book-page-box book-page-1 preserve-3d" :class="{'flip-animation':scope.row.bookshow}">
													<div class="book-page page-font">
														<p>{{scope.row.oPower}}</p>
													</div>
												</div>
											</div>
										</template>
									</el-table-column>
									<!-- <el-table-column prop="offset" label="修正值" :min-width="80" align="center"></el-table-column> -->
									<el-table-column label="历史详情" :min-windth="50" align="center">
										<template slot-scope="scope">
											<el-button type="text" size="mini" :class="{udpBtn:scope.row.type==1,udpBtn1:scope.row.type==0}" @click="lookDetails(scope,0)">查看详情</el-button>
										</template>
									</el-table-column>
									<el-table-column label="OPL门限(上)" prop="thresholdUp" :min-windth="50" align="center">
										<template slot-scope="scope">
											<span :class="{'alarm-font':scope.row.type==1,'alarm-font1':scope.row.type==0}">{{scope.row.thresholdUp}}</span>
										</template>
									</el-table-column>
									<el-table-column label="OPL门限(下)" prop="thresholdDown" :min-windth="50" align="center">
										<template slot-scope="scope">
											<span :class="{'alarm-font':scope.row.type==1,'alarm-font1':scope.row.type==0}">{{scope.row.thresholdDown}}</span>
										</template>
									</el-table-column>
									<el-table-column label="告警" prop="alarm" :min-windth="50" align="center">
										<template slot-scope="scope">
											<div :class="{default:scope.row.alarm==2,active:scope.row.alarm==1,'alarm-high':scope.row.alarm==0}"></div>
										</template>
									</el-table-column>
									<el-table-column label="告警列表" :min-windth="50" align="center">
										<template slot-scope="scope">
											<el-button type="text" size="mini" class="udpBtn" @click="lookAlarmDetails(scope,2)">查看详情</el-button>
										</template>
									</el-table-column>
									<el-table-column label="线路状态" prop="type" :min-windth="80" align="center">
										<template slot-scope="scope">
											<span :class="{'active-font':scope.row.type=='1','active-font1':scope.row.type=='0'}">{{scope.row.type==0?"禁用":"启用"}}</span>
										</template>
									</el-table-column>
									<el-table-column label="通道状态" prop="isMain" :min-windth="80" align="center">
										<template slot-scope="scope">
											<span :class="{'active-font':scope.row.isMain==1,'alarm-font':scope.row.isMain==0 }">{{scope.row.isMain==0?"备用":"主用"}}</span>
										</template>
									</el-table-column>
									<el-table-column label="定时恢复" prop="recoveryTime" :min-windth="80" align="center">
										<template slot-scope="scope">
											<el-button size="mini" type="text" v-show="!flag" :class="{'active-font':scope.row.recoveryTime}">{{scope.row.recoveryTime}}</el-button>
											<el-button class="forbidBtn" size="mini" @click="openTime(false)" v-show="scope.row.recoveryTime">禁止</el-button>
											<el-button class="forbidBtn1" size="mini" @click="openTime(true,scope.row)" v-show="!scope.row.recoveryTime"
											 type="success">启用</el-button>
										</template>
									</el-table-column>
									<el-table-column label="强制切换" prop="opt1" :min-windth="80" align="center">
										<template slot-scope="scope">
											<el-button v-if="scope.$index==0" class="optBtn4" size="mini" @click="foeceChange(2)">L1->L2</el-button>
											<el-button v-else class="optBtn4" size="mini" @click="foeceChange(1)">L2->L1</el-button>
										</template>
									</el-table-column>
									<el-table-column label="人工切换" prop="opt2" :min-windth="80" align="center">
										<template slot-scope="scope">
											<el-button v-if="scope.$index==0" :disabled="scope.row.opt2" class="optBtn4" size="mini" @click="manualChange(2)">L1->L2</el-button>
											<el-button v-else class="optBtn4" :disabled="scope.row.opt2" size="mini" @click="manualChange(1)">L2->L1</el-button>
										</template>
									</el-table-column>
									<el-table-column label="切换清除" prop="opt3" :min-windth="50" align="center">
										<template slot-scope="scope">
											<el-button class="optBtn3" size="mini" @click="clearLL()">清除</el-button>
										</template>
									</el-table-column>
								</el-table>
								<br />
								<el-table :data="numPTableData" tooltip-effect="light" size="mini" class="table" border :span-method="objectSpanMethod">
									<el-table-column prop="num" label="通道" :min-width="50" align="center"></el-table-column>
									<!-- <el-table-column prop="name" label="名称" :min-width="80" align="center"></el-table-column> -->
									<el-table-column prop="wvelength" label="波长" :min-width="80" align="center"></el-table-column>
									<el-table-column prop="power" label="光功率值" :min-width="80" align="center">
										<template slot-scope="scope">
											<div class="fan">
												<div class="book-page-box book-page-2 preserve-3d">
													<div class="book-page page-font ">
														<p>{{scope.row.power}}</p>
													</div>
												</div>
												<div class="book-page-box book-page-1 preserve-3d" :class="{'flip-animation':scope.row.bookshow}">
													<div class="book-page page-font">
														<p>{{scope.row.oPower}}</p>
													</div>
												</div>
											</div>
										</template>
									</el-table-column>
									<!-- <el-table-column prop="offset" label="修正值" :min-width="80" align="center"></el-table-column> -->
									<el-table-column label="历史详情" :min-windth="50" align="center">
										<template slot-scope="scope">
											<!-- :class="{udpBtn:scope.row.type==1,udpBtn1:scope.row.type==0}" -->
											<el-button type="text" size="mini" class="udpBtn" @click="lookDetails(scope,0)">查看详情</el-button>
										</template>
									</el-table-column>
									<el-table-column label="OPL门限(上)" prop="thresholdUp" :min-windth="50" align="center">
										<template slot-scope="scope">
											<span :class="{'alarm-font':scope.row.type==1,'alarm-font1':scope.row.type==0}">{{scope.row.thresholdUp}}</span>
										</template>
									</el-table-column>
									<el-table-column label="OPL门限(下)" prop="thresholdDown" :min-windth="50" align="center">
										<template slot-scope="scope">
											<span :class="{'alarm-font':scope.row.type==1,'alarm-font1':scope.row.type==0}">{{scope.row.thresholdDown}}</span>
										</template>
									</el-table-column>
									<el-table-column label="告警" prop="alarm" :min-windth="50" align="center">
										<template slot-scope="scope">
											<div :class="{default:scope.row.alarm==2,active:scope.row.alarm==1,'alarm-high':scope.row.alarm==0}"></div>
										</template>
									</el-table-column>
									<el-table-column label="告警列表" :min-windth="50" align="center">
										<template slot-scope="scope">
											<el-button type="text" size="mini" class="udpBtn" @click="lookAlarmDetails(scope,2)">查看详情</el-button>
										</template>
									</el-table-column>
									<el-table-column label="线路状态" prop="type" :min-windth="80" align="center">
										<template slot-scope="scope">
											<span :class="{'active-font':scope.row.type=='1','active-font1':scope.row.type=='0'}">{{scope.row.type==0?"禁用":"启用"}}</span>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</el-table-column>
						<el-table-column prop="pass" label="通道数" :min-width="200" align="center"></el-table-column>
						<el-table-column prop="status" label="状态" width="80">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="changeTaskStaus"
								 :active-value="1" :inactive-value="0"></el-switch>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="400">
							<template slot-scope="scope">
								<!-- <el-button v-on:click="testTaskStatus()" type="warning" :plain="true" size="mini">任务状态检测</el-button> -->
								<el-button v-on:click="editPassParam()" type="success" :plain="true" size="mini">参数修改</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<!-- 温度监控 -->
				<el-table :data="slotTableData" size="mini" class="table" border>
					<el-table-column prop="slotNum" label="槽位" width="50"></el-table-column>
					<el-table-column prop="sndname" label="名称" min-width="100"></el-table-column>
					<el-table-column prop="temp" label="温度" :min-width="80" align="center">
						<template slot-scope="scope">
							<div class="fan">
								<div class="book-page-box book-page-2 preserve-3d">
									<div class="book-page page-font ">
										<p>{{scope.row.temp}}&nbsp;{{scope.row.temp?'℃':''}}</p>
									</div>
								</div>
								<div class="book-page-box book-page-1 preserve-3d" :class="{'flip-animation':scope.row.bookshow}">
									<div class="book-page page-font">
										<p>{{scope.row.oTemp}}&nbsp;{{scope.row.oTemp?'℃':''}}</p>
									</div>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="历史详情" :min-windth="50" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini" class="udpBtn" @click="lookDetails(scope,0)">查看详情</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="tempUp" label="温度门限" :min-width="150">
						<template slot-scope="scope">
							<edtiable-cell v-if="scope.row.id" :text="scope.row.tempUp" v-on:update:text="updateSlotCell($event,scope,'tempUp')"></edtiable-cell>
						</template>
					</el-table-column>
					<el-table-column label="告警" prop="status" :min-windth="80" align="center">
						<template slot-scope="scope">
							<div :class="{default:scope.row.status==2,active:scope.row.status==1,'alarm-high':scope.row.status==0}"></div>
						</template>
					</el-table-column>
					<el-table-column label="告警列表" :min-windth="50" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini" class="udpBtn" @click="lookAlarmDetails(scope,2)">查看详情</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="sndnum" label="板卡SN" :min-width="100"></el-table-column>
				</el-table>
			</div>

		</div>

		<el-dialog :visible.sync="timeVisible" :close-on-click-modal="false" width="330px">
			<div slot="title">
				定时恢复
			</div>
			<div>
				<div class="form-item">
					<span class="title">当前定时时长：</span>
					<span class="value">{{recoveryTime.oldTime}}分钟</span>
				</div>
				<div class="form-item">
					<span class="title">定时时长设置：</span>
					<el-input-number size="mini" v-model="recoveryTime.newTime" :min="1" :max="30"></el-input-number>
				</div>
			</div>
			<div class="dialog-footer" slot="footer">
				<el-button type="primary" size="small" :disabled="timeAble" class="sureBtn" @click="sendTime()">启用定时</el-button>
				<el-button @click="timeVisible=false" class="cancelBtn" size="small">取消</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="editVisible" :close-on-click-modal="false" width="1200px" :before-close="closeUpdateDialog">
			<div slot="title">
				{{editTitle}}
			</div>
			<div>
				<div class="tools">
					<el-button class="optBtn" size="mini" @click="testPower()">光功率测试</el-button>
				</div>
				<div class="dialogTable">
					<el-table height="400" :data="editPassTableData" tooltip-effect="light" size="mini" class="table" border>
						<!-- @selection-change="handleSelectionChange" -->
						<!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
						<el-table-column prop="num" label="通道数" min-width="50" align="center"></el-table-column>
						<!-- <el-table-column prop="passName" label="名称" min-width="50" align="center"></el-table-column> -->
						<el-table-column prop="wvelength" label="波长" min-width="100" align="center">
							<template slot-scope="scope">
								<!-- {{scope.row.status}}  -->
								<edtiable-cell :text="scope.row.wvelength" v-on:update:text="updateCell($event,scope,'wvelength')"></edtiable-cell>
							</template>
						</el-table-column>
						<el-table-column prop="thresholdUp" label="光功率门限(上)" min-width="100" align="center">
							<template slot-scope="scope">
								<!-- {{scope.row.status}}  -->
								<el-input-number size="mini" v-model="scope.row.thresholdUp" :step="0.01" :precision="2" @change="updateSlaveOnePass(scope,'thresholdUp')"></el-input-number>
							</template>
						</el-table-column>
						<el-table-column prop="power" label="光功率" min-width="50" align="center"></el-table-column>
						<el-table-column prop="thresholdDown" label="光功率门限(下)" min-width="100" align="center">
							<template slot-scope="scope">
								<!-- {{scope.row.status}}  -->
								<el-input-number size="mini" v-model="scope.row.thresholdDown" :step="0.01" :precision="2" @change="updateSlaveOnePass(scope,'thresholdDown')"></el-input-number>
							</template>
						</el-table-column>
						<!-- <el-table-column prop="offset" label="偏移值" min-width="100" align="center">
              <template slot-scope="scope">
                <edtiable-cell :text="scope.row.offset" :editForever="true" v-on:update:text="updateCell($event,scope,'offset')"></edtiable-cell>
              </template>
            </el-table-column> -->
						<el-table-column prop="type" label="启用状态" min-width="50" align="center">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.type" active-color="#13ce66" inactive-color="#ff4949" @change="updateSlaveOnePass(scope,'type')"
								 :active-value="1" :inactive-value="0"></el-switch>
							</template>

						</el-table-column>
					</el-table>

				</div>
			</div>
			<div class="dialog-footer" slot="footer">
				<!-- <el-button type="primary" size="small" :disabled="editAble" class="sureBtn" @click="submitEdit()">提交</el-button>
				<el-button @click="editVisible=false" class="cancelBtn" size="small">取消</el-button> -->
			</div>
		</el-dialog>
		<!-- 告警列表 -->
		<el-dialog :visible.sync="alarmVisible" :close-on-click-modal="false" width="1200px">
			<div slot="title">
				{{alarmTitle}}
			</div>
			<div>
				<alarm-history class="alarm-dialog" :alarm-visible="alarmVisible" :params="alarmParams"></alarm-history>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import edtiableCell from "@c/utils/editableCell";
	import socketInit from "@/mixins/socketInit.js";
	import alarmHistory from "@c/monitor/alarm";
	export default {
		name: "oneDevice",
		components: {
			edtiableCell,
			alarmHistory
		},
		mixins: [socketInit],
		data() {
			return {
				device: "",
				lenoveid: "",
				// device: {
				// 	name: "西区机房5G-S03",
				// 	ip: "192.168.1.121",
				// 	port: "23"
				// },
				waveDividList: [],
				deviceFBB: "0",
				flag: false,
				mTableData: [],
				pTableData: [],
				otherPassTable: [],
				LTableData: [],
				numPTableData: [],
				timeVisible: false,
				timeAble: false,
				recoveryTime: {
					oldTime: "",
					newTime: ""
				},
				editVisible: false,
				editAble: false,
				passSelect: [],
				editPassTableData: [],
				editTitle: "",
				loading: false,
				powerList: [],
				rightList: [],
				slotTableData: [],
				alarmVisible: false,
				alarmTitle: "告警详情",
				alarmParams: {
					disvis: false
				}
			};
		},
		created() {
			let _this = this;
		},
		mounted() {
			let _this = this;
			let did = _this.$store.state.activeDid;
			console.log(did);
			if (did || did == "0") {
				_this.getDeviceInfo(did);
				// _this.getMasterCon(did);
			} else {
				_this.$router.push({
					path: "/monitor/deviceSelect"
				});
			}
		},
		methods: {
			updateNewstatus(row) { //async 
				// let _this = this;
				// _this.loading = true;
				// let param = [{
				// 	slot: row.sndsite,
				// 	type: row.newStatus
				// }];
				// let res = await _this.$api.putRequest(
				// 	param,
				// 	"updateNewstatues",
				// 	_this.updateStatusnumid
				// );
				// if (res.code) {
				// 	_this.$message({
				// 		message: res.msg,
				// 		type: "warning"
				// 	});
				// } else {
				// 	_this.$message({
				// 		message: "更新设备状态成功",
				// 		type: "success"
				// 	});
				// 	_this.loading = false;
				// 	let list = _this.updateList;
				// 	let index = list.findIndex(item => {
				// 		return item.slot == row.sndsite;
				// 	});
				// 	list.splice(index, 1);
				// 	_this.updateList = list;
				// 	_this.detailist({
				// 		id: _this.snDid
				// 	});
				// }
				return true;
			},
			async getDeviceInfo(did) {
				let _this = this;
				let res = await _this.$api.getRequest(null, "getDevice", did);
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.device = res;
					_this.lenoveid = res.id;
					_this.watchDevice();
				}
			},
			changePowerMaster() {
				let _this = this;
				let res = _this.device;
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
					sndsite: "P1",
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
					sndsite: "P2",
					newStatus: 0
				};
				power[typeNum * 2 - 1] = power2;
				const slotNum = typeNum * 4;
				let rightList = new Array();
				let slotTable = new Array();
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
					// let oneInfo=JSON.parse(JSON.stringify(one));
					// let oneInfo = {
					// 	sndname: "", //名称
					// 	sndsn: "", //sn
					// 	sndnum: "",
					// 	slotNum: i + 1,
					// 	status: 2, //告警状态
					// 	temp: "", //温度值
					// 	oTemp: "",
					// 	id: "",
					// 	num: "",
					// 	tempUp: "",
					// 	type: 0, //type:1主控板，2slave版
					// 	bookshow: false,
					// }
					// slotTable.push(oneInfo);
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
						channelNumber: item.channelNumber || ""
					};
					if (item.status == 1) {
						let index = slotNum - item.slot;
						if (index % 2 == 0) {
							index += 1;
						} else {
							index -= 1;
						}
						rightList[index] = ss;

						let oneSlot = {
							sndname: "主控板" + item.num, //名称
							sndsn: item.productNumber, //sn
							sndnum: item.serialNumber,
							slotNum: item.slot,
							status: 2, //告警状态
							temp: "", //温度值
							oTemp: "",
							id: item.id,
							num: item.num,
							tempUp: item.tempUp,
							type: 1, //type:1主控板，2slave版
							bookshow: false,
						}
						slotTable.push(oneSlot);
						//let slotIndex = item.slot - 1;
						// let oneSlot = slotTable[slotIndex];
						// oneSlot.sndname = "主控板" + item.num;
						// oneSlot.sndnum = item.serialNumber;
						// oneSlot.id = item.id;
						// oneSlot.type = 1;
						// oneSlot.num = item.num;
						// oneSlot.tempUp = item.tempUp;
						// oneSlot.sndsn = item.productNumber;
					}
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
						channelNumber: item.channelNumber || ""
					};
					if (item.status == 1) {
						let index = slotNum - item.slot;
						if (index % 2 == 0) {
							index += 1;
						} else {
							index -= 1;
						}
						rightList[index] = ss;
						let oneSlot = {
							sndname: "波分板" + item.num, //名称
							sndsn: item.sn, //sn
							num: item.num,
							slotNum: item.slot,
							status: 2, //告警状态
							temp: "", //温度值
							oTemp: "",
							id: item.sid,
							num: item.num,
							tempUp: item.tempUp,
							type: 2, //type:1主控板，2slave版
							bookshow: false,
						}
						slotTable.push(oneSlot);
						//let slotIndex = item.slot - 1;
						// let oneSlot = slotTable[slotIndex];
						// oneSlot.sndname = "波分板" + item.num;
						// oneSlot.num = item.num;
						// oneSlot.id = item.sid;
						// oneSlot.type = 2;
						// oneSlot.tempUp = item.tempUp;
						// oneSlot.sndsn = item.sn;
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
				_this.rightList = rightList;
				_this.slotTableData = slotTable;
				_this.powerList = power;
				console.log(rightList);
				console.log(power);
			},
			// 查询主控权并更新
			// async getMasterCon(did) {
			//   let _this = this;
			//   let res = await _this.$api.getRequest(null, "getMasterCon", did);
			//   if (res.code) {
			//     _this.$message({
			//       message: res.msg,
			//       type: "warning"
			//     });
			//   } else {
			//     // _this.$message({
			//     //   message: "",
			//     //   type: "success"
			//     // });
			//   }
			// },
			// 硬件联通测试
			async optBtn() {
				let _this = this;
				let res = await _this.$api.getRequest(null, "lenoveTest", _this.lenoveid);
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
			},
			watchDevice() {
				let _this = this;
				let wd = new Array();
				let mainList = new Array();
				let device = _this.device;
				if (device) {
					wd = device.slave.filter(item => {
						return item.status == 1;
					});
					let optIndex = -1;
					if (device.master) {
						device.master.forEach((one, index) => {
							let item = JSON.parse(JSON.stringify(one));
							// item.voltage = "";
							// item.oVoltage = "";
							// item.bookshow = false;
							item.name = "";
							item.alarm = 1;
							item.opt = true;
							if (item.isMain) {
								optIndex = index;
							}
							// item.lineStatus = 0;
							//let a = item.slot.replace(/([^\d]+)/, '');
							// let slot = parseInt(a);
							// if (slot % 2 == 1) {
							// 	item.passStatus = 1;
							// } else {
							// 	item.passStatus = 0;
							// }
							mainList.push(item);
						});
					}
					_this.waveDividList = wd;
					if (wd.length > 0) {
						_this.deviceFBB = 0;
						_this.changeFBB(0);
					} else {
						_this.deviceFBB = "";
					}
					if (
						mainList.length == 2 &&
						mainList[0].status == 1 &&
						mainList[1].status == 1
					) {
						//主用的可替换
						if (optIndex > -1) {
							mainList[optIndex].opt = false;
						}
					}
					console.log(mainList);
					let powerList = new Array();
					let one = {
						voltage: "",
						oVoltage: "",
						bookshow: false,
						name: "P1",
						num: 1,
						alarm: 1,
						status: device.p1
					}
					powerList.push(one);
					let two = {
						voltage: "",
						oVoltage: "",
						bookshow: false,
						name: "P2",
						num: 2,
						alarm: 1,
						status: device.p2
					}
					powerList.push(two);
					_this.mTableData = mainList;
					_this.pTableData = powerList;
				}
				_this.changePowerMaster();
				// _this.mTableData[0].name="ssssss"
				// setTimeout(() => {
				// 	_this.mTableData[0].voltage = "25.0";
				// 	_this.mTableData[0].bookshow = true;
				// 	setTimeout(() => {
				// 		_this.mTableData[0].voltage = "25.0";
				// 		_this.mTableData[0].oVoltage = "25.0";
				// 		_this.mTableData[0].bookshow = false;
				// 	}, 2001);
				// }, 100);
			},
			//修改分波板选择
			async changeFBB(val) {
				let _this = this;
				_this.loading = true;
				let sid = _this.waveDividList[val].sid;
				let res = await _this.$api.getRequest(null, "getSlaveInfo", sid);
				_this.loading = false;
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					let pass = new Array();
					let ltable = new Array();
					let npTable = new Array();
					let lpass = new Array();
					let slave = _this.waveDividList[_this.deviceFBB];
					let chainNum = slave.channelNumber;
					res.forEach((item, index) => {
						item.power = "";
						item.oPower = "";
						item.bookshow = false;
						item.voltageThreshold = "";
						item.alarm = 2;
						// item.lineStatus = 1;
						item.passStatus = 1;
						if (item.num <= chainNum) {
							pass.push(item.num);
							npTable.push(item);
						} else if (item.num > 18) {
							let num = item.num - 18;
							item.num = "L" + num;
							if (num == 1) {
								item.recoveryTime = _this.waveDividList[_this.deviceFBB].timing;
							}
							item.opt2 = true;
							item.isMain = 0;
							lpass.push(item.num);
							ltable.push(item);
						}
					});
					pass = lpass.concat(pass);
					if (slave.l1Main == 1) {
						ltable[0].isMain = 1;
						if (
							ltable.length == 2 &&
							ltable[0].type == 1 &&
							ltable[1].type == 1
						) {
							//主用的可替换
							ltable[0].opt2 = false;
						}
					} else if (slave.l2Main == 1) {
						ltable[1].isMain = 1;
						if (
							ltable.length == 2 &&
							ltable[0].type == 1 &&
							ltable[1].type == 1
						) {
							//主用的可替换
							ltable[1].opt2 = false;
						}
					}
					console.log("LLL");
					console.log(ltable);
					_this.LTableData = ltable;
					_this.numPTableData = npTable;
					let tid = _this.waveDividList[val].tid;
					let status = 0;
					if (tid) {
						status = 1;
					}
					_this.otherPassTable = [{
						pass: pass.join(","),
						status: status
					}];
					console.log("断开");
					_this.disconnect();
					_this.intSocket();
				}
			},
			//参数修改
			editPassParam() {
				let _this = this;
				//处理数据
				let ffb = _this.waveDividList[_this.deviceFBB];
				_this.editTitle = _this.device.name + ffb.slaveName + "设置";
				let ss = [].concat(_this.LTableData, _this.numPTableData);
				let aa = JSON.parse(JSON.stringify(ss));
				aa.forEach(item => {
					item.power = "";
				});
				_this.editPassTableData = aa;
				_this.editVisible = true;
			},
			//修改波分板
			changeTaskStaus(val) {
				let _this = this;
				let res;
				if (val == 1) {
					_this.startTask();
				} else {
					_this.deleteTask();
				}
			},
			async startTask() {
				let _this = this;
				let param = {
					did: _this.device.id,
					sid: _this.waveDividList[_this.deviceFBB].sid
				};
				_this.loading = true;
				let res = await _this.$api.postRequest(param, "startTask");
				_this.loading = false;
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
					_this.otherPassTable[0].status = 0;
				} else {
					_this.$message({
						message: "开启成功",
						type: "success"
					});
					_this.waveDividList[_this.deviceFBB].tid = res;
				}
			},
			async deleteTask() {
				let _this = this;
				_this.loading = true;
				let slave = _this.waveDividList[_this.deviceFBB];
				let param = [{
					id: slave.tid,
					sid: slave.sid
				}];
				let res = await _this.$api.deleteRequest(param, "deleteTask");
				_this.loading = false;
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
					_this.otherPassTable[0].status = 1;
				} else {
					_this.$message({
						message: "关闭成功",
						type: "success"
					});
					_this.waveDividList[_this.deviceFBB].tid = null;
				}
			},
			//任务状态监测
			async testTaskStatus(scope) {
				let _this = this;
				console.log("检测");
				let taskId = _this.waveDividList[_this.deviceFBB].tid;
				if (taskId) {
					let res = await _this.$api.getRequest(null, "testTaskStatus", taskId);
					if (res.code) {
						if (res.code == 6) {
							_this.restartOtdrTask(res.msg, scope.row.id);
						} else {
							_this.$message({
								message: res.msg,
								type: "warning"
							});
						}
					} else {
						_this.$message({
							message: "任务" + res,
							type: "success"
						});
					}
				} else {
					_this.$message({
						message: "任务已关闭",
						type: "success"
					});
				}
			},
			//查看详情
			/*
			type:0:历史详情
			type:1:告警列标
			*/
			lookDetails(scope, type) {
				let _this = this;
				let did = _this.device.id;
				let dname = _this.device.name;
				let slave = _this.waveDividList[_this.deviceFBB];
				let sname = slave.slaveName;
				let sid = slave.sid;
				let pname = scope.row.num;
				let pid = scope.row.id;
				if (type == 0) {
					window.open(
						"/powerLine?did=" +
						did +
						"&dname=" +
						dname +
						"&sname=" +
						sname +
						"&pname=" +
						pname +
						"&pid=" +
						pid
					); //"&sid=" + sid +
				} else {}
			},
			//查看告警详情
			lookAlarmDetails(scope, type) {
				let _this = this;

				let eqStr = new Object();
				let typeName;
				eqStr.did = _this.device.id;
				let slave = _this.waveDividList[_this.deviceFBB];
				switch (type) {
					case 0:
						//电压告警
						typeName = "电压告警";
						eqStr.type = 2;
						break;
					case 1:
						typeName = "通讯告警";
						eqStr.type = 4;
						break;
					case 2:
						typeName = "-" + slave.slaveName + "-" + scope.row.num + "温度告警";
						eqStr.sid = slave.sid;
						eqStr.spid = scope.row.id;
						eqStr.type = 3;
						break;
					default:
						typeName = "-" + slave.slaveName + "-" + scope.row.num + "光功率告警";
						eqStr.type = 1;
						eqStr.sid = slave.sid;
						eqStr.spid = scope.row.id;
				}
				_this.alarmTitle = _this.device.name + typeName;
				let params = {
					eqStr: eqStr
				}
				_this.alarmParams = params;
				_this.alarmVisible = true;
			},
			//跨行
			objectSpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				let columns = ["opt3", "alarmDetials", "recoveryTime"];
				let index = columns.find(item => {
					return item == column.property;
				})
				if (index) {
					if (rowIndex % 2 === 0) {
						return {
							rowspan: 2,
							colspan: 1
						};
					} else {
						return {
							rowspan: 0,
							colspan: 0
						};
					}
				}
			},
			//打开定时设置窗口
			openTime(type, row) {
				let _this = this;
				if (type) {
					_this.flag = !this.flag;
					let value = row.recoveryTime;
					_this.recoveryTime.oldTime = value;
					_this.recoveryTime.newTime = value;
					_this.timeVisible = true;
				} else {
					_this.closeTime();
				}
			},
			//关闭定时
			async closeTime() {
				let _this = this;
				let taskId = _this.waveDividList[_this.deviceFBB].sid;
				let res = await _this.$api.getRequest(null, "closeTaskTime", taskId);
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.flag = !this.flag;
					_this.$message({
						message: "关闭成功",
						type: "success"
					});
					_this.LTableData[0].recoveryTime = null;
					_this.waveDividList[_this.deviceFBB].timing = null;
				}
			},
			//发送定时时间
			async sendTime() {
				let _this = this;
				_this.timeAble = true;
				let sid = _this.waveDividList[_this.deviceFBB].sid;
				let time = _this.recoveryTime.newTime;
				let param = [sid, time];
				let res = await _this.$api.getRequest(null, "setTaskTime", param);
				_this.timeAble = false;
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.flag = !this.flag;
					_this.timeVisible = false;
					_this.$message({
						message: "定时设置成功",
						type: "success"
					});
					_this.waveDividList[_this.deviceFBB].timing = time;
					_this.LTableData[0].recoveryTime = time;
				}
			},
			//选择通道
			handleSelectionChange(val) {
				let _this = this;
				_this.passSelect = val;
			},
			// M1,M2按钮切换
			async roladChange(param, type) {
				let _this = this;
				_this.loading = true;
				let res = await _this.$api.getRequest(null, "roladChangeUrl", param);
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.$message({
						message: "操作成功",
						type: "success"
					});
					_this.loading = false;
					_this.changeMaster(type)
				}
			},
			//切换主控板主用备用
			//mainNum:主用数
			changeMaster(mainNum) {
				let _this = this;
				if (mainNum == 1) {
					_this.mTableData[0].isMain = 1;
					_this.mTableData[0].opt = false;
					_this.mTableData[1].isMain = 0;
					_this.mTableData[1].opt = true;
				} else {
					_this.mTableData[1].isMain = 1;
					_this.mTableData[1].opt = false;
					_this.mTableData[0].isMain = 0;
					_this.mTableData[0].opt = true;
				}
			},
			//强制切换L1=L2
			async foeceChange(type) {
				let _this = this;
				let url = type == 1 ? "force1" : "force2";
				let param = _this.waveDividList[_this.deviceFBB].sid;
				let res = await _this.$api.getRequest(null, url, param);
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.$message({
						message: "切换成功",
						type: "success"
					});
					_this.changeLLStatus(type);
				}
			},
			//手动切换L1=L2
			async manualChange(type) {
				let _this = this;
				let param = _this.waveDividList[_this.deviceFBB].sid;
				let url = type == 1 ? "manualChangeL1" : "manualChangeL2";
				let res = await _this.$api.getRequest(null, url, param);
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.$message({
						message: "切换成功",
						type: "success"
					});
					_this.changeLLStatus(type);
				}
			},
			//切换L1L2状态
			//type：主用权数字
			changeLLStatus(type) {
				let _this = this;
				if (type == 1) {
					_this.waveDividList[_this.deviceFBB].l1Main = 1;
					_this.waveDividList[_this.deviceFBB].l2Main = 0;
					_this.LTableData[0].isMain = 1;
					_this.LTableData[1].isMain = 0;
					//切换按钮可用状态
					if (_this.LTableData[0].type == 1 && _this.LTableData[1].type == 1) {
						_this.LTableData[0].opt2 = false;
						_this.LTableData[1].opt2 = true;
					} else {
						_this.LTableData[0].opt2 = true;
						_this.LTableData[1].opt2 = true;
					}
				} else {
					_this.waveDividList[_this.deviceFBB].l1Main = 0;
					_this.waveDividList[_this.deviceFBB].l2Main = 1;
					_this.LTableData[1].isMain = 1;
					_this.LTableData[0].isMain = 0;
					//切换按钮可用状态
					if (_this.LTableData[0].type == 1 && _this.LTableData[1].type == 1) {
						_this.LTableData[1].opt2 = false;
						_this.LTableData[0].opt2 = true;
					} else {
						_this.LTableData[0].opt2 = true;
						_this.LTableData[1].opt2 = true;
					}
				}
			},
			// 清除
			async clearLL() {
				let _this = this;
				let param = _this.waveDividList[_this.deviceFBB].sid;
				let res = await _this.$api.getRequest(null, "clearLL", param);
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					_this.$message({
						message: "清除成功",
						type: "success"
					});
				}
			},
			//修改参数
			updateCell(newValue, scope, prop) {
				let _this = this;
				let cindx = scope.$index;
				let row = scope.row;
				let oldValue = row[prop];
				row[prop] = newValue;
				//检测是否满足正则表达式
				var reg;
				if (prop == "offset") {
					reg = /^(-?(([1-9]\d{1,3})|(\d))(\.\d{1,3})?)$/;
				} else if (prop == "wvelength") {
					reg = /^((([1-9]\d{1,3})|(\d)))$/;
				}
				if (reg.test(newValue)) {
					_this.updateSlaveOnePass(scope, prop, oldValue);
				} else {
					_this.$message.warning("请输入正确的数字");
					setTimeout(() => {
						row[prop] = oldValue;
					}, 50);
				}
			},
			//修改通道参数
			async updateSlaveOnePass(scope, column, oldValue) {
				let _this = this;
				let row = scope.row;
				let param = new Object();
				param[column] = row[column];
				param.id = row.id;
				let res = await _this.$api.putRequest(param, "updateSlaveOnePass");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
					setTimeout(() => {
						row[column] = oldValue;
					}, 50);
				} else {
					_this.$message({
						message: "修改成功",
						type: "success"
					});
				}
			},
			//修改温度阈值
			updateSlotCell(newValue, scope, prop) {
				let _this = this;
				let cindx = scope.$index;
				let row = scope.row;
				let oldValue = row[prop];
				row[prop] = newValue;
				let reg = /^(-?(([1-9]\d{1,3})|(\d))(\.\d{1,3})?)$/;
				if (reg.test(newValue)) {
					_this.updatetempUp(scope, prop, oldValue)
				} else {
					_this.$message.warning("请输入正确的数字");
					setTimeout(() => {
						row[prop] = oldValue;
					}, 50);
				}
			},
			//修改温度阈值（发送数据）
			async updatetempUp(scope, prop, oldValue) {
				let _this = this;
				let row = scope.row;
				let param = new Object();
				param[prop] = row[prop];

				let url;
				if (row.type == 1) {
					url = "updateMaster";
					param.id = row.id;
				} else {
					url = "updateSlave";
					param.sid = row.id;
				}
				//let url=row.type==1?"updateMaster":"updateSlave";
				let res = await _this.$api.putRequest(param, url);
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
					setTimeout(() => {
						row[prop] = oldValue;
					}, 50);
				} else {
					_this.$message({
						message: "修改成功",
						type: "success"
					});
				}
			},
			//光功率测试
			testPower() {
				let _this = this;
				let param = new Array();
				let passList = _this.passSelect;
				if (passList.length < 0) {
					_this.$message({
						type: "warning",
						message: "请选择通道"
					});
				} else {
					passList.forEach(item => {
						param.push(item.id);
					});
					_this.doTestPower(param);
				}
			},
			async doTestPower() {
				let _this = this;
				let param = {
					did: _this.device.id,
					sid: _this.waveDividList[_this.deviceFBB].sid
				};
				let res = await _this.$api.postRequest(param, "testPassPower");
				if (res.code) {
					_this.$message({
						message: res.msg,
						type: "warning"
					});
				} else {
					res.forEach(item => {
						let index = item.id;
						let oneIndex;
						if (index < 18) {
							oneIndex = index + 2;
						} else {
							oneIndex = index - 18;
						}
						_this.editPassTableData[oneIndex].power = item.val;
					});
				}
			},
			closeUpdateDialog() {
				let _this = this;
				_this.editVisible = false;
				_this.changeFBB(_this.deviceFBB);
			},
			//监听设备告警状态
			stompConnected(fram) {
				console.log("home flicker Connected" + fram);
				let _this = this;
				let sid = _this.waveDividList[_this.deviceFBB].sid;
				//监听光功率事件
				_this.stomp.subscribe(
					_this.topic + "/power/" + sid,
					this.onPowerRealMessage
				);
				//监听电压事件
				_this.stomp.subscribe(
					_this.topic + "/voltage/" + _this.device.id,
					this.onVoltageRealMessage
				);
				//监听设备插槽变化
				_this.stomp.subscribe(
					_this.topic + "/SlotSn/" + _this.device.id,
					this.onSlotChangeMessage
				);
				//监听主备用
				_this.stomp.subscribe(
					_this.topic + "/control/" + _this.device.id,
					this.onMastStandbyMessage
				);
				//监听温度
				_this.stomp.subscribe(
					_this.topic + "/temperature/" + _this.device.id,
					this.onTemMessage
				);
				//监听设备联通
				_this.stomp.subscribe(
					_this.topic + "/ping/" + _this.device.id,
					this.onPingMessage
				);
			},
			//实时更新光功率值
			onPowerRealMessage(frame) {
				let _this = this;
				if (frame.body != null) {
					let alarm = eval("(" + frame.body + ")");
					alarm.forEach(item => {
						let num = item.id;
						item.val = item.val.toFixed(2);
						if (num < 18) {
							_this.numPTableData[num].power = item.val;
							_this.numPTableData[num].bookshow = true;
							if (_this.numPTableData[num].type == 1) {
								_this.numPTableData[num].alarm = item.type;
							}
							setTimeout(() => {
								_this.numPTableData[num].power = item.val;
								_this.numPTableData[num].oPower = item.val;
								_this.numPTableData[num].bookshow = false;
							}, 2000);
						} else {
							let index = num - 18;
							_this.LTableData[index].power = item.val;
							_this.LTableData[index].bookshow = true;
							if (_this.LTableData[index].type == 1) {
								_this.LTableData[index].alarm = item.type;
							}
							setTimeout(() => {
								_this.LTableData[index].power = item.val;
								_this.LTableData[index].oPower = item.val;
								_this.LTableData[index].bookshow = false;
							}, 2000);
						}
					});
				}
			},
			//实时更新电压值
			onVoltageRealMessage(frame) {
				let _this = this;
				if (frame.body != null) {
					let alarm = eval("(" + frame.body + ")");
					alarm.forEach(item => {
						let num = item.id;
						let index = _this.pTableData.findIndex(one => {
							return one.num == num;
						});
						if(item.val){
							item.val = item.val.toFixed(2);
						}else{
							item.val="";
						}
						_this.pTableData[index].voltage = item.val;
						_this.pTableData[index].alarm = item.type;
						_this.pTableData[index].bookshow = true;
						setTimeout(() => {
							_this.pTableData[index].voltage = item.val;
							_this.pTableData[index].oVoltage = item.val;
							_this.pTableData[index].bookshow = false;
						}, 2000);
					});
				}
			},
			//实时更新温度
			onTemMessage(frame) {
				let _this = this;
				if (frame.body != null) {
					let alarm = eval("(" + frame.body + ")");
					let indexlist = [];
					alarm.forEach(item => {
						let index = _this.slotTableData.findIndex(one => {
							return item.id == one.id;
						})
						if (index > -1) {
							if(item.val){
								item.val = item.val.toFixed(2);
							}else{
								item.val="";
							}
							_this.slotTableData[index].temp = item.val;
							_this.slotTableData[index].alarm = item.type;
							_this.slotTableData[index].bookshow = true;
							setTimeout(() => {
								_this.slotTableData[index].temp = item.val;
								_this.slotTableData[index].oTemp = item.val;
								_this.slotTableData[index].bookshow = false;
							}, 2000);
						}
					})
				}
			},
			//插槽变化
			onSlotChangeMessage(frame) {
				let _this = this;
				if (frame.body != null) {
					let alarm = eval("(" + frame.body + ")");
					let typeNum = parseInt(_this.device.type.replace(/(5G-)|(U)/g, ""));
					const slotNum = typeNum * 4;
					alarm.forEach(item => {
						if (item.slot == -1) {
							_this.powerList[typeNum - 1].newStatus = item.type;
						} else if (item.slot == -2) {
							_this.powerList[typeNum * 2 - 1].newStatus = item.type;
						} else {
							let index = slotNum - item.slot;
							if (index % 2 == 0) {
								index += 1;
							} else {
								index -= 1;
							}
							_this.rightList[index].newStatus = item.type;
						}
					})
				}
			},
			//m1-m2及l1-l2主备用监听
			onMastStandbyMessage(frame) {
				let _this = this;
				if (frame.body != null) {
					let alarm = eval("(" + frame.body + ")");
					//切换主控板主用权
					_this.changeMaster(alarm.masterMain);
					//切换分波板
					//所有分波板的主备切换
					_this.waveDividList.forEach(item => {
						let num = item.num;
						let typeNum = num < 10 ? '0' + num : num;
						let slaveName = 'slave' + typeNum + "main";
						let mainNum = alarm[slaveName];
						if (mainNum == 1) {
							item.l1Main = 1;
							item.l2Main = 0;
						} else {
							item.l1Main = 0;
							item.l2Main = 1;
						}
					})
					//当前分波板的主备切换
					let num = _this.waveDividList[_this.deviceFBB].num;
					let typeNum = num < 10 ? '0' + num : num;
					let slaveName = 'slave' + typeNum + "main";
					_this.changeLLStatus(alarm[slaveName]);
				}
			},
			onPingMessage(frame) {
				let _this = this;
				if (frame.body != null) {
					let alarm = eval("(" + frame.body + ")");
					_this.mTableData[1].alarm = alarm.type;
				}
			}
		}
	};
</script>

<style lang="scss">
	@import "assets/css/other.scss";
	@import "/css/circle.css";
	@import "assets/css/device.scss";

	.one-part>.title-part>div:first-child>div {
		margin-right: 20px;
	}

	.two-table {
		width: 100%;
		// display: flex;
		// flex-direction: column;
		// justify-content: space-around;
	}

	.detial-part {
		width: 100%;
		margin-top: 10px;
	}

	.two-table>div {
		margin-top: 15px;
	}

	/*翻书*/
	.fan {
		perspective: 150px;
		-moz-perspective: 150px;
		-ms-perspective: 150px;
		position: relative;
		width: 50px;
		height: 28px;
		margin: 0 auto;
	}

	.preserve-3d {
		/*使子元素保留3D位置*/
		-webkit-transform-style: preserve-3d;
		-moz-transform-style: preserve-3d;
		-ms-transform-style: preserve-3d;
		transform-style: preserve-3d;
	}

	.book-page .page-front {
		background-color: $book-page-f-back;
	}

	.flip-animation {
		animation: flipBook1 8s;
		-moz-animation: flipBook1 8s;
		/* Firefox */
		-webkit-animation: flipBook1 8s;
		/* Safari and Chrome */
		-o-animation: flipBook1 8s;
		/* Opera */
		animation-fill-mode: forwards;
	}

	.book-page p {
		margin-top: 2px;
		font-size: 12px;
		font-weight: bold;
		color: firebrick;
	}

	.book-page-box {
		-webkit-transform-origin: 50% 0%;
		-moz-transform-origin: 50% 0%;
		-ms-transform-origin: 50% 0%;
		-o-transform-origin: 50% 0%;
		transform-origin: 50% 0%;
		-webkit-transform: rotateX(0deg);
		-ms-transform: rotateX(0deg);
		-o-transform: rotateX(0deg);
		transform: rotateX(0deg);
	}

	.book-page {
		position: absolute;
		top: 0;
		left: 0;
		height: 25px;
		width: 50px;
		border: 1px solid $book-page-border;
		text-align: center;
		background-color: $book-page-back;
		/* border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px; */
		border-radius: 6px;
	}

	@keyframes flipBook1 {
		0% {
			-webkit-transform: rotateX(0deg);
			-ms-transform: rotateX(0deg);
			-o-transform: rotateX(0deg);
			transform: rotateX(0deg);
		}

		100% {
			-webkit-transform: rotateX(-270deg);
			-ms-transform: rotateX(-270deg);
			-o-transform: rotateX(-270deg);
			transform: rotateX(-270deg);
		}
	}

	@-moz-keyframes flipBook1 {
		0% {
			-webkit-transform: rotateX(0deg);
			-ms-transform: rotateX(0deg);
			-o-transform: rotateX(0deg);
			transform: rotateX(0deg);
		}

		100% {
			-webkit-transform: rotateX(-270deg);
			-ms-transform: rotateX(-270deg);
			-o-transform: rotateX(-270deg);
			transform: rotateX(-270deg);
		}
	}

	@-webkit-keyframes flipBook1 {
		0% {
			-webkit-transform: rotateX(0deg);
			-ms-transform: rotateX(0deg);
			-o-transform: rotateX(0deg);
			transform: rotateX(0deg);
		}

		100% {
			-webkit-transform: rotateX(-270deg);
			-ms-transform: rotateX(-270deg);
			-o-transform: rotateX(-270deg);
			transform: rotateX(-270deg);
		}
	}

	@-o-keyframes flipBook1 {
		0% {
			-webkit-transform: rotateX(0deg);
			-ms-transform: rotateX(0deg);
			-o-transform: rotateX(0deg);
			transform: rotateX(0deg);
		}

		100% {
			-webkit-transform: rotateX(-270deg);
			-ms-transform: rotateX(-270deg);
			-o-transform: rotateX(-270deg);
			transform: rotateX(-270deg);
		}
	}

	.forbidBtn1 {
		.forbidBtn {
			color: #fff !important;
			background: green !important;
			border-color: green !important;
		}
	}

	#one-device .book-page {
		width: 60px;
	}

	#one-device .device-part {
		width: 1300px;
	}

	.active-font {
		margin-right: 20px;
	}

	.alarm-font {
		margin-right: 20px;
	}

	.tableContent:nth-child(1) {
		margin-bottom: 20px;
	}

	#one-device .one-part>.table-part {
		margin-bottom: 20px;
		border: none;
	}

	.alarm-dialog {
		height: 600px;
	}
</style>
