//格式化时间 
function formatter(date) {
	//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1) + "-") : ((date.getMonth() + 1) + '-');
	var D = date.getDate() < 10 ? '0' + date.getDate() + " " : date.getDate() + " ";
	var h = date.getHours() < 10 ? '0' + date.getHours() + ":" : date.getHours() + ':';
	var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
	var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	return Y + M + D + h + m + s;
}
function formatterDay(date){
	//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = date.getMonth() + 1 < 10 ? ('0' + (date.getMonth() + 1) + "-") : ((date.getMonth() + 1) + '-');
	var D = date.getDate() < 10 ? '0' + date.getDate() + " " : date.getDate() + " ";
	return Y + M + D;
}
function getNowData() {
	return formatter(new Date());
}
function getSomeData(time) {
	if(time){
		return formatter(new Date(time)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	}
	return "";
}
function getSomeDay(time) {
	if(time!=""){
		return formatterDay(new Date(time)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	}
	return "";
}
function stringToDate(str){
	var temstrs=str.split(" ");
	console.log(temstrs);
	var datestrs=temstrs[0].split("-");
	console.log(datestrs);
	var year=parseInt(datestrs[0],10);
	var month=parseInt(datestrs[1],10);
	var day=parseInt(datestrs[2],10);
	var date=new Date(year,month,day);
	return date;
}
export {getNowData,getSomeData,formatterDay,getSomeDay,stringToDate,formatter};
