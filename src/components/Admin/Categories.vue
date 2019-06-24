<template>
<div>
	<div class="notification" v-show="notify" v-bind:class="getColorClass()">{{ message() }}</div>
	<div class="logout_top">
		<router-link to="/admin" class="is-link">Home</router-link>
		&nbsp;&nbsp;
		<a class="is-link" type="button" v-on:click="logout">Logout</a>
	</div>
	<div class="page_title">WELCOME, Admin!</div>
	<div class="page_subtitles">Approve Categories</div>
	<div class="category_title">
		<ul class="categoryShow" style="list-style-type:circle">
			<li v-for="category in categories">
				<a class="button is-success" v-model="category.id" :data-id="category.id" v-on:click="approve">Approve</a> {{ category.name }}
			</li><br>
		</ul>
	</div>
</div>
</template>

<script>
export default {
	name: 'AdminsCategories',
	data() {
		return {
			categories: [],
			category: {
				categories: [],
				auth_token: ''
			},
			notify: false,
			colorClass: ''
		}
	},
	created() {
		this.categories = this.$store.state.response.categories
		console.log(this.categories)
	},
	methods: {
		approve: function(event) {
			this.category.categories.push({
				id: parseInt(event.target.getAttribute('data-id')),
				approved: true
			})
			this.category.auth_token = this.$cookies.get('token')
			var app = this
			this.$axios.post('/approve_entries', JSON.stringify(this.category))
				.then(function(response) {
					console.log(response)
					if (response.data.status === 'SUCCESS') {
						app.categories = response.data.categories
						console.log(app.categories)
					} else {
						app.notify = true
						app.colorClass = 'failure'
						app.$store.commit('update', {
							status: response.data.status,
							message: response.data.message
						})
						app.fields = response.data.fields
					}
				})
				.catch(function(error) {
					console.log(error)
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
		},
		logout: function() {
			this.$store.state.status = ''
			this.$cookies.remove('token')
			this.$router.push({
				name: 'Login'
			})
		}
	}
}
</script>

<style>
ul.categoryShow {
	position: relative;
	top: 2em;
	width: 70%;
	margin-left: auto;
	margin-right: auto;
}

ul.categoryShow li {
	list-style: none;
}

div.page_title {
	margin-top: 0.5em;
	margin-bottom: 0.5em;
	font-size: 14pt;
	font-weight: bold;
	color: #7957d5;
}

div.page_subtitles {
	margin-top: 2em;
	margin-bottom: 1em;
	font-size: 12pt;
	font-weight: normal;
	color: #7957d5;
}

div.control button {
	margin-right: 4em;
	margin-left: 40em;
}

.category_title {
	float: auto;
	margin-bottom: 10px;
	padding-right: 12.5m;
}

.button {
	float: right;
	margin-right: 350px;
}

.logout_top {
	position: absolute;
	text-align: right;
	padding-right: 2em;
	width: 100%;
	font-size: large;
}
</style>
