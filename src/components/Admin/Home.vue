<template>
<div class="adminHome">
	<div>
		<div class="notification" v-show="notify" v-bind:class="getColorClass()">{{ message() }}</div>
		<div class="logout_top">
			<a class="is-link" type="button" v-on:click="logout">Logout</a>
		</div>
		<div class="page_title">WELCOME, Admin!</div><br>
		<div class="page_subtitles">Click on Categories or Questions to begin</div><br>
		<router-link to="/admin/categories" class="button is-success">Categories</router-link><br><br>
		<router-link to="/admin/questions" class="button is-link">Questions</router-link>
	</div>
</div>
</template>

<script>
export default {
	name: 'Admin',
	data() {
		return {
			categories: [],
			questions: []
		}
	},
	created: function() {
		if (this.$store.state.status === 'SUCCESS') {
			this.notify = true
		} else {
			this.notify = false
		}
	},
	methods: {
		logout: function() {
			this.$store.state.status = ''
			this.$cookies.remove('token')
			this.$router.push({
				name: 'Login'
			})
		},
		message: function() {
			return this.$store.state.message
		},
		getColorClass: function() {
			return {
				'success': (this.$store.state.status === 'SUCCESS'),
				'failure': (this.$store.state.status === 'FAILURE')
			}
		}
	}
}
</script>

<style>
div.page_title {
	margin-top: 0.5em;
	margin-bottom: 0.5em;
	font-size: 14pt;
	font-weight: bold;
	color: #7957d5;
}

div.page_subtitles {
	margin-top: 0.5em;
	margin-bottom: 0.5em;
	font-size: 12pt;
	font-weight: normal;
	color: #7957d5;
}

.logout_top {
	position: absolute;
	text-align: right;
	padding-right: 2em;
	width: 100%;
	font-size: large;
}
</style>
