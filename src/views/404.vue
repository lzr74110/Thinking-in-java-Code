<template>
	<div id="error">
		<div class="contant animate-box fadeIn animated-fast">
			<video class="video" loop autoplay muted>
				<source src="/img/Crocodile.mp4" type="video/mp4">
				<source src="/img/Crocodile.webrm" type="video/webm">
				<source src="/img/Crocodile.ogv" type="video/ogg">
			</video>
			<div class="chart"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "404",
	}
</script>

<style>
	@import url("/css/animate.css");
	#error {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
	}

	#error>.contant {
		margin-top: 100px;
		width: 80%;
		max-width: 1142px;
		height: 60%;
		max-height: 800px;
		position: relative;
	}

	#error>.contant>.video {
		/* position: absolute; */
		z-index: -1;
		top: 0;
		left: 0px;
		/* transform: translate(0px, -50%); */
		visibility: visible;
		opacity: 1;
		width: 100%;
		height: 100%;
	}

	#error>.contant>.chart {
		position: absolute;
		background: url(/img/404.svg) no-repeat center center;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0px;
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
