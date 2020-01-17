<template>
	<vue-drag-resize class="drag_resize" :w="width" :h="height" :x="100" :y="200" :active="info.active" @activated="handleActive"
	 @deactivated="handleDeActivated" v-show="visible" :z="info.zindex">
		<div class="drag_resize_header">
			<slot name="title"></slot>
			<div class="close el-icon-close" @click.prevent="closeDrag()"></div>
		</div>
		<div class="drag_resize_body">
			<slot></slot>
		</div>
	</vue-drag-resize>

</template>

<script>
	import VueDragResize from 'vue-draggable-resizable' //可拖拽及更改大小
	import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
	export default {
		name: "dragResize",
		components: {
			VueDragResize
		},
		props: {
			info: {
				type: Object
			},
			visible: {
				type: Boolean,
				required: false,
				default: true
			},
			width: {
				type: [Number, String],
				required: false,
				default: 600
			},
			height: {
				type: [Number, String],
				required: false,
				default: 400
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
		},
		data() {
			return {
				w: 0,
				h: 0,
			};
		},
		mounted() {
			this.w = window.innerWidth;
			this.h = window.innerHeight;
			// console.log(this.visible);
			// console.log("可拖拽可调整大小");
			window.addEventListener('resize', () => {
				this.w = window.innerWidth;
				this.h = window.innerHeight;
			})
		},
		methods: {
			handleActive() {
				//this.active = true;
				//this.$emit('change-zindex');
				this.changeZindex(this.index);
			},
			handleDeActivated() {
				//this.$emit('change-active')
				this.changeActive(this.index);
			},
			closeDrag() {
				let _this = this;
				console.log("close");
				this.$emit('update:visible', false);
				//_this.visible=false;
			}
		}
	}
</script>

<style>
	.drag_resize_wrap {
		position: fixed;
		top: 0;
		left: 0;

	}

	.drag_resize {
		border-radius: 8px;
		/* border: 1px solid #7d7c7c; */
		-webkit-box-shadow: 0 0 5px #000000;
		box-shadow: 0 0 10px #aba8a8;
	}

	.drag_resize_header {
		height: 44px;
		font-weight: bold;
		width: calc(100% - 30px);
		background: linear-gradient(to right, #13afab, #096f4e);
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		color: #fff;
		display: flex;
		padding: 0 15px;
		justify-content: space-between;
		align-items: center;
		font-size: 16px;
	}

	.drag_resize_header>div {
		display: flex;
		justify-content: flex-start;
	}

	.drag_resize_body {
		background-color: #F5F5F5;
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		height: calc(100% - 65px);
		width: calc(100% - 40px);
		padding: 20px 20px 0 20px;
	}
</style>
