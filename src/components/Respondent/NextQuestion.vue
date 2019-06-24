<template>
<div class="respondent">
	<div class="notification" v-show="notify" v-bind:class="getColorClass()">{{ message() }}</div>
	<div class="logout_top">
		<router-link to="/respondent" class="is-link">Home</router-link>
		&nbsp;&nbsp;
		<a class="is-link" type="button" v-on:click="logout">Logout</a>
	</div>
	<div class="page_title">Here is your new challenge!</div>
	<div class="page_subtitles">Your perScore: <span style="color: green;">{{ score }}</span></div>

	<div v-show="present" class="challenge field">
		<div class="question">
			<label>{{ response.title }}</label>
			<p>{{ response.body }}</p>
		</div>

		<div class="answer">
			<div class="control">
				<span class="c-sl">1) </span>
				<label class="radio">
					  	<input class="choice" type="radio" name="option" v-on:click="selectThis" :data-option="1">
							{{ response.answer.option1 }}
					  </label>
			</div>

			<div class="control">
				<span class="c-sl">2) </span>
				<label class="radio">
					  	<input class="choice" type="radio" name="option" v-on:click="selectThis" :data-option="2">
							{{ response.answer.option2 }}
					  </label>
			</div>

			<div class="control">
				<span class="c-sl">3) </span>
				<label class="radio">
					  	<input class="choice" type="radio" name="option" v-on:click="selectThis" :data-option="3">
							{{ response.answer.option3 }}
					  </label>
			</div>

			<div class="control">
				<span class="c-sl">4) </span>
				<label class="radio">
					  	<input class="choice" type="radio" name="option" v-on:click="selectThis" :data-option="4">
							{{ response.answer.option4 }}
					  </label>
			</div>

			<div class="control">
				<span class="c-sl">5) </span>
				<label class="radio">
					  	<input class="choice" type="radio" name="option" v-on:click="selectThis" :data-option="5">
							{{ response.answer.option5 }}
					  </label>
			</div>
		</div>

		<div class="field is-grouped sb_buttons">
			<div class="control has-icons-left">
				<button v-on:click="reset" class="button is-link" type="button">Cancel</button>
			</div>
			<div class="control has-icons-left">
				<button v-on:click="submitAnswer" class="button is-link" type="button">Submit</button>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'NextQuestion',
	data() {
		return {
			score: 0.0,
			present: true,
			selected: '',
			qindex: 0,
			request: {
				auth_token: '',
				category_id: 0,
				question_id: 0,
				answer: {
					option1: false,
					option2: false,
					option3: false,
					option4: false,
					option5: false
				}
			},
			response: {
				id: 0,
				title: '',
				body: '',
				answer: {
					option1: '',
					option2: '',
					option3: '',
					option4: '',
					option5: ''
				}
			},
			questions: [],
			notify: false
		}
	},
	created() {
		var categoryId = this.$store.state.componentData.selectedCategory.id
		this.request.category_id = categoryId
		this.request.auth_token = this.$cookies.get('token')

		var app = this
		this.$axios.post('/get_question', JSON.stringify(this.request))
			.then(function(response) {
				console.log(response.data)
				var choices = document.getElementsByClassName('choice')
				for (var i = 0; i < choices.length; i++) {
					choices[i].checked = false
				}
				if (response.data.status === 'SUCCESS') {
					app.score = response.data.score
					app.response.id = response.data.id
					app.response.title = response.data.title
					app.response.body = response.data.body
					app.response.answer.option1 = response.data.answer.option1
					app.response.answer.option2 = response.data.answer.option2
					app.response.answer.option3 = response.data.answer.option3
					app.response.answer.option4 = response.data.answer.option4
					app.response.answer.option5 = response.data.answer.option5
				} else {
					app.present = false
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
	methods: {
		selectThis: function(event) {
			if (parseInt(event.target.getAttribute('data-option')) === 1) {
				this.request.answer.option1 = true
				this.request.answer.option2 = false
				this.request.answer.option3 = false
				this.request.answer.option4 = false
				this.request.answer.option5 = false
			} else if (parseInt(event.target.getAttribute('data-option')) === 2) {
				this.request.answer.option1 = false
				this.request.answer.option2 = true
				this.request.answer.option3 = false
				this.request.answer.option4 = false
				this.request.answer.option5 = false
			} else if (parseInt(event.target.getAttribute('data-option')) === 3) {
				this.request.answer.option1 = false
				this.request.answer.option2 = false
				this.request.answer.option3 = true
				this.request.answer.option4 = false
				this.request.answer.option5 = false
			} else if (parseInt(event.target.getAttribute('data-option')) === 4) {
				this.request.answer.option1 = false
				this.request.answer.option2 = false
				this.request.answer.option3 = false
				this.request.answer.option4 = true
				this.request.answer.option5 = false
			} else if (parseInt(event.target.getAttribute('data-option')) === 5) {
				this.request.answer.option1 = false
				this.request.answer.option2 = false
				this.request.answer.option3 = false
				this.request.answer.option4 = false
				this.request.answer.option5 = true
			}
		},
		submitAnswer: function() {
			this.request.question_id = this.response.id
			this.request.auth_token = this.$cookies.get('token')
			var app = this
			this.$axios.post('/get_question', JSON.stringify(this.request))
				.then(function(response) {
					console.log(response.data)
					var choices = document.getElementsByClassName('choice')
					for (var i = 0; i < choices.length; i++) {
						choices[i].checked = false
					}
					app.request.answer.option1 = false
					app.request.answer.option2 = false
					app.request.answer.option3 = false
					app.request.answer.option4 = false
					app.request.answer.option5 = false
					if (response.data.status === 'SUCCESS') {
						app.score = response.data.score
						app.response.id = response.data.id
						app.response.title = response.data.title
						app.response.body = response.data.body
						app.response.answer.option1 = response.data.answer.option1
						app.response.answer.option2 = response.data.answer.option2
						app.response.answer.option3 = response.data.answer.option3
						app.response.answer.option4 = response.data.answer.option4
						app.response.answer.option5 = response.data.answer.option5
					} else {
						app.present = false
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
		reset: function() {
			this.selected = false
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
		},
		prevClick: function() {
			// if (this.qindex > 0) {
			this.request.auth_token = this.$cookies.get('token')
			this.request.question_id = this.request.question_id - 1
			// }
			var app = this
			this.$axios.post('/get_question', JSON.stringify(this.request))
				.then(function(response) {
					console.log(response.data)
					if (response.data.status === 'SUCCESS') {
						app.response.title = response.data.title
						app.response.body = response.data.body
						app.response.answer.option1 = response.data.answer.option1
						app.response.answer.option2 = response.data.answer.option2
						app.response.answer.option3 = response.data.answer.option3
						app.response.answer.option4 = response.data.answer.option4
						app.response.answer.option5 = response.data.answer.option5
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
		}
	}
}
</script>

<style>
div.page_title {
	margin-top: 1.5em;
	margin-bottom: 0.5em;
	font-size: 14pt;
	font-weight: bold;
	color: #7957d5;
}

div.page_subtitles {
	margin-top: 1.5em;
	margin-bottom: 2.5em;
	font-size: 13pt;
	font-weight: normal;
	color: brown;
}

.challenge {
	position: relative;
	width: 60%;
	left: 30%;
	text-align: left;
	/*margin-left: auto;*/
	/*margin-right: auto;*/
}

.question label {
	font-weight: bold;
}

.question p {
	margin-top: 1em;
	margin-bottom: 1em;
}

.choice {
	margin: 10px;
}

.logout_top {
	position: absolute;
	text-align: right;
	padding-right: 2em;
	width: 100%;
	font-size: large;
}

div.sb_buttons {
	margin-top: 2em;
}

.c-sl {
	font-size: 13pt;
	font-weight: bold;
	margin-right: 10px;
}
</style>
