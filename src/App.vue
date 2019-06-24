
<template>
<div id="app">
	<router-view></router-view>
</div>
</template>

<script>
export default {
	name: 'app'
}
</script>

<style>
div#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	padding-bottom: 6em;
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	padding: 1rem;
}
</style>
