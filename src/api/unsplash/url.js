const publicPath = process.env.BASE_URL;
const baseUrl = publicPath + 'api';
//const baseUrl ="";
export default {
	// 图片列表
	login: baseUrl + '/user/login', //登录

	//局端设备
	getCompany: baseUrl + '/user/login', //获取公司信息（权限内）
	getDeviceList: baseUrl + '/device/list', //获取当前页设备列表（权限内）
	updateDeviceBStatus: baseUrl + '/device/updateStatus', //更新slave状态
	addDevice: baseUrl + '/device/addDevice', //添加设备
	updateDevice: baseUrl + '/device/updateDevice', //修改设备
	deleteDevices: baseUrl + '/device/delete', //删除设备
	getDeviceType: baseUrl + "/deviceType/all", //获取deviceType
	searchIp: baseUrl + "/device/OTDR/autoFindMonitorUnit", //搜索设备IP
	getProvince: baseUrl + "/area/getProvince", //获取省信息
	getCity: baseUrl + "/area/getCity", //获取市信息
	getCountry: baseUrl + "/area/getCountry", //获取县信息
	getTwon: baseUrl + "/area/getTownId", //获取镇信息
	getVillage: baseUrl + "/area/getVillage", //获取村信息
	getAllDevice: baseUrl + '/device/getDeviceByRole', //更新slave状态
	getStation: baseUrl + "/area/getVillage", //获取局站信息
	getDidByVS: baseUrl + "/area/getDid", //根据村及局站信息获取did
	getDeviceLiveSlave: baseUrl + "/device/findSlaveOnline", //获取设备在线的slave信息
	getCaseCadePositionInfo: baseUrl + "/area/getAreaInfo", //获取设备位置信息
	getStaion: baseUrl + '/areaStation/getStationByVillageId', //获取局站信息
	getStaiondel: baseUrl + '/areaStation', //删除局站信息
	getStaionadd: baseUrl + '/areaStation/add', //添加局站信息
	getStationupdate: baseUrl + '/areaStation/update', //修改局站信息
	updateMasterLabel: baseUrl + '/master/updateMasterLabel',
	updateP1Label: baseUrl + '/device/updateP1Label',
	updateP2Label: baseUrl + '/device/updateP2Label',
	updateDeviceLabel: baseUrl + '/device/updateDeviceLabel',
	updateSlaveLabel: baseUrl + '/slave/updateP1Label',
	getfacility: baseUrl + '/device/getSn', //查找设备属性
	editp1sn: baseUrl + '/device/updateP1Sn', //修改电源1sn
	editp2sn: baseUrl + '/device/updateP2Sn', //修改电源2sn
	editSn: baseUrl + '/device/updateDeviceSn', //修改设备sn
	updatelocal: baseUrl + '/device/updateIp', //修改ip
	getmaster: baseUrl + '/master/selectMasterInfo',
	getslave: baseUrl + '/slave/selectDeviceInfo',
	getDevice: baseUrl + '/device/getDeviceByDid',
	getOneDeviceInfo: baseUrl + '/device',
	updateNewstatues: baseUrl + '/device/confirmUpdate', //确认更新设备状态
	lenoveTest: baseUrl + '/device/ping', //设备联通测试
	updateMaster: baseUrl + "/master/update", //修改master信息
	updateSlave: baseUrl + "/slave/update", //修改slave信息

	//远端设备
	addFarfDevice: baseUrl + '/farDevice/addFarDevice', //添加设备
	updatefDevice: baseUrl + '/farDevice/update', //修改设备
	deletefDevices: baseUrl + '/farDevice/deleteFarDevice', //删除设备
	deleteBatchDevice: baseUrl + '/farDevice/deleteFarDevice', //批量删除
	getFarfDeviceList: baseUrl + '/farDevice/list', //获取当前页设备列表（权限内）
	updatefFarDeviceBStatus: baseUrl + '/farDevice/updateStatus', //更新slave状态
	getAllfFarDevice: baseUrl + '/farDevice/selectAllFarDevice', //更新slave状态
	putWebMessage: baseUrl + '/farDevice/update', //修改远端信息
	roladChangeUrl: baseUrl + '/master/changeCon', //切换主控板的控制权
	userLabelQuery: baseUrl + '/userLabel/getAllUserLabel', //查询所有用户标签
	getfardevicetype: baseUrl + '/farDeviceType/all', //获取远端设备类型
	getFarfDevice: baseUrl + '/farDevice/getFarDeviceByAuthority', //根据权限查询farDevice
	newFarSN: baseUrl + '/snRelation/getInfoBySn', //根据sn号查询所有信息
	addFarSlave: baseUrl + '/farSlave/addFarSlave', //添加模组
	getFarSlave: baseUrl + '/farSlave/getFarSlaveByDid', //根据fardid獲取模組
	deleteone: baseUrl + '/farSlave', //根据id删除模组
	deletesome: baseUrl + '/farSlave/delete', //批量删除模组
	getUserSlot: baseUrl + '/farSlave/getUseSlot', //获取已用槽位
	putUserLable: baseUrl + '/farSlave/update', //修改用户标签
	getModelInterface: baseUrl + '/farModel/getModelInterface', //获取模组接口
	addFarModel: baseUrl + '/farModel/addFarModel', //添加光模块
	getFarModelById: baseUrl + '/farModel/getFarModelById', //根据模组id获取光模块
	deletemodelone: baseUrl + '/farModel', //删除光模组
	deletemodelsome: baseUrl + '/farModel/delete', //批量删除光模组
	putfarmodel: baseUrl + '/farModel/update', //修改光模快用户标签
	getFarDeviceByAddress: baseUrl + '/farDevice/getFarDeviceByAddress', //根据无源获取地址信息   
	getDeviceByAddress: baseUrl + '/device/getDeviceByAddress', //根据有源获取地址信息   
	/* slave */
	getSlaveInfo: baseUrl + '/slavePass/getSlavePassInfoBySid', //查询slave信息
	updateSlaveOnePass: baseUrl + '/slavePass/update', //查询slave信息

	/*
	 *任务
	 */
	startTask: baseUrl + "/task/appendTask", //开启任务
	deleteTask: baseUrl + "/task/deleteTask", //删除任务
	testTaskStatus: baseUrl + "/task/getTaskInfo", //任务状态监测
	closeTaskTime: baseUrl + "/slave/ban", //关闭定时
	setTaskTime: baseUrl + "/slave/timing", //设置定时时间
	force1: baseUrl + "/slave/force1", //强制切换L1-L2
	force2: baseUrl + "/slave/force2", //强制切换L2-L1
	manualChangeL1: baseUrl + "/slave/hand1", //人工切换L1-L2
	manualChangeL2: baseUrl + "/slave/hand1", //人工切换L2-L1
	clearLL: baseUrl + "/slave/remove", //清除
	/* 
	 *slevePass 
	 */
	testPassPower: baseUrl + "/slave/getSlavePassPower", //slave光功率测试
	getPowerList: baseUrl + "/gInter/list", //slave光功率曲线
	/*系统管理*/
	getUserList: baseUrl + "/user/findUserByrole", //根据搜索条件获取用户
	testUsername: baseUrl + "/user/findById", //验证用户名重复性
	deleteUsers: baseUrl + "/user/delete", //删除用户
	getCompany: baseUrl + '/company/getCompany', //获取公司信息（权限内所有列表）
	addUser: baseUrl + '/user/addUser', //添加员工
	updateUser: baseUrl + '/user/updateUser', //修改员工信息
	getUserInfo: baseUrl + "/user", //获取当前用户信息
	updateOneUserInfo: baseUrl + "/user/update", //修改当前用户信息
	updatePwd: baseUrl + "/user/updatePassowrd", //修改密码

	getDeptListAll: baseUrl + '/company/addUser', //获取部门信息

	getAllMenu: baseUrl + '/company/addUser', //获取菜单
	getSomeMenu: baseUrl + '/menu/getMenu', //获取用户菜单
	deleteMenu: baseUrl + '/company/addUser', //删除菜单
	addMenu: baseUrl + '/user/add', //添加菜单
	updateMenu: baseUrl + '/user/update', //修改菜单

	getComList: baseUrl + '/company/getCompany', //获取公司列表
	deleteCompanys: baseUrl + '/company/delete', //删除公司
	addCompany: baseUrl + '/company/add', //添加公司
	updateCompany: baseUrl + '/company/update', //修改公司
	testComname: baseUrl + '/company/update', //测试公司名称
	getCompanyAll: baseUrl + '/company/getCompanyAll', //获取该用户权限内的所有公司

	testRoleName: baseUrl + '/role/testRoleName', //验证角色名称
	getRight: baseUrl + '/role/getRight', //验证角色名称
	getRoleList: baseUrl + '/role/getRole', //获取角色列表
	deleteRoles: baseUrl + '/role/delete', //删除角色
	addRole: baseUrl + '/role/add', //添加角色
	updateRole: baseUrl + '/role/updateALL', //修改角色
	getCompanyDevice: baseUrl + '/device/getDeviceByRole', //获取公司设备
	getRoleInfo: baseUrl + "/role/backfillAll", //获取角色相关信息
	//日志
	getLoginLogList: baseUrl + '/SysLoginLog/list', //获取登录日志
	getOptLogList: baseUrl + '/SysOperationLog/list', //获取操作日志
	downloadLoginLog: baseUrl + '/SysLoginLog/export', //下载登录日志
	downloadOptLog: baseUrl + '/SysOperationLog/export', //下载操作日志


	//数据库备份
	uploadSql: baseUrl + '/SysMysqlBackup/recoverSQLByFile', //上传Sql文件
	backSql: baseUrl + "/SysMysqlBackup/backupsSQL", //备份数据库
	getSqlList: baseUrl + '/sysSqlRest/list', //过去数据库文件列表


	recorveSqlById: baseUrl + "/SysMysqlBackup/recoverSQLByID", //通关文件ID上传文件
	downloadSqlFile: baseUrl + "/SysMysqlBackup/down", //下载Sql文件
	getSysSeting: baseUrl + "/setting/all", //获取数据库系统设置
	setSysSeting: baseUrl + "/setting/update", //设置据库系统设置

	// 设备任务管理
	linkTest: baseUrl + '/device/ping',

	// 告警管理
	getDeviceList: baseUrl + '/device/getDeviceByAuthority', //根据权限获取device信息
	getAlarmList: baseUrl + '/alarm/NewList', //获取alarm列表
	getDeviceListInfo: baseUrl + '/slavePass/getSlavePassInfoBySid', //根据sid查询slavePass信息
	getMasterCon: baseUrl + '/device/refreshStatus', //查询主控权,slave并更新
	callPolice: baseUrl + '/alarm/export', //报警日志导出
	//拓扑
	getPositionTree: baseUrl + "/area/getAreaTreeInfo", //局端设备位置拓扑
}