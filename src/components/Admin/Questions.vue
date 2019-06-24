<template>
<div>
	<div class="notification" v-show="notify" v-bind:class="getColorClass()">{{ message() }}</div>
	<div class="page_title">WELCOME, Admin!</div>
	<div class="logout_top">
		<router-link to="/admin" class="is-link">Home</router-link>
		&nbsp;&nbsp;
		<a class="is-link" type="button" v-on:click="logout">Logout</a>
	</div>
	<div class="page_subtitles">Approve Questions</div>
	<table v-for="question in questions" class="question_show">
		<tr class="question">
			<td style="width: 90%; padding-right: 2em;">
				<table>
					<tr>
						<td><b>{{ question.title }}</b></td>
					</tr>
					<tr>
						<td>{{ question.body }}</td>
					</tr>
					<tr>
						<td>
							<table>
								<tr>
									<td style="padding-right: 2em; font-weight: bold;">Option 1:</td>
									<td>{{ question.answer.option1 }}</td>
								</tr>
								<tr>
									<td style="padding-right: 2em; font-weight: bold;">Option 2:</td>
									<td>{{ question.answer.option2 }}</td>
								</tr>
								<tr>
									<td style="padding-right: 2em; font-weight: bold;">Option 3:</td>
									<td>{{ question.answer.option3 }}</td>
								</tr>
								<tr>
									<td style="padding-right: 2em; font-weight: bold;">Option 4:</td>
									<td>{{ question.answer.option4 }}</td>
								</tr>
								<tr>
									<td style="padding-right: 2em; font-weight: bold;">Option 5:</td>
									<td>{{ question.answer.option5 }}</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
			<td>
				<a class="button is-success approve" v-model="question.id" :data-id="question.id" v-on:click="approve">
					Approve
				</a>
			</td>
		</tr>
	</table>
</div>
</template>

<script>
export default {
	name: 'AdminsQuestions',
	data() {
		return {
			questions: [],
			question: {
				questions: []
			},
			notify: false,
			colorClass: ''
		}
	},
	created() {
		console.log(this.$store.state.response)
		this.questions = this.$store.state.response.questions
	},
	methods: {
		approve: function(event) {
			this.question.questions.push({
				id: parseInt(event.target.getAttribute('data-id')),
				approved: true
			})
			this.question.auth_token = this.$cookies.get('token')
			var app = this
			this.$axios.post('/approve_entries', JSON.stringify(this.question))
				.then(function(response) {
					console.log(response.data)
					if (response.data.status === 'SUCCESS') {
						app.questions = response.data.questions
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
body {
	line-height: 2.5;
}

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

.question_show {
	display: flow-root;
	margin-top: 2em;
	margin-bottom: 2em;
	border-bottom: 1px solid black;
	width: 60%;
	margin-left: auto;
	margin-right: auto;
	padding: 10px;
}

.button {
	float: right;
	margin-right: 50px;
	transform: translate(-330%);
}

.logout_top {
	position: absolute;
	text-align: right;
	padding-right: 2em;
	width: 100%;
	font-size: large;
}

.approve {
	float: right;
}
</style>
