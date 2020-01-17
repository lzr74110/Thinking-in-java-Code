export default {
	props:{
		info:{
			type:Object,
		},
		index: {
			type: Number,
			default: 0
		},
		changeActive: {
			type: Function
		},
		changeZindex: {
			type: Function
		}
	}
}