<template>
	<div class="one-main">
		<div class="main-content">
			您的许可证已过期。
		</div>
	</div>
</template>

<script>
	export default {

	}
</script>

<style>
	.one-main {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.one-main>.main-content {
		width: 400px;
		height: 200px;
		/* border: 5px solid #5d460d; */
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		margin-top: 100px;
		border-radius: 8px;
		color: #170202;
		/* font-weight: bold; */
		font-size: 16px;
		/* background: radial-gradient(#f5ffc6, hsl(53, 35%, 53%)); */
		box-shadow: 0 0 10px #bfc3bc, 0 0 16px #efefcc inset
	}
</style>
