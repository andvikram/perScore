<template>
<div class="questioner">
	<div class="notification" v-show="notify" v-bind:class="getColorClass()">{{ message() }}</div>
	<div class="logout_top">
		<a class="is-link" type="button" v-on:click="logout">Logout</a>
	</div>
	<div class="questioner-functions columns">
		<div class="column">
			<label class="label is-horizontal">Submit New Question (For <span class="selected-category">{{ selectedCategoryName }}</span>)</label>
			<br>
			<div class="field">
				<div class="control">
					<input v-on:blur="updateCategory" ref="new_category" class="input cls" type="text" placeholder="New Category (Optional)"></input>
					<a class="button is-primary cls" v-on:click="appendCategory()">New Sub Category</a>
				</div>
			</div>

			<div class="field">
				<div class="control">
					<input v-model="question.title" class="input" type="text" placeholder="Add Title">
				</div>
			</div>

			<div class="field">
				<div class="control">
					<textarea v-model="question.body" class="textarea" type="text" placeholder="Add Body"></textarea>
				</div>
			</div>

			<div class="field">
				<span id="q-weight-range">{{ weight_range }}</span>
				<div class="control">
					<input v-model="question.weight.value" class="input" type="number" placeholder="Define Weight"></input>
				</div>
			</div>

			<div class="is-horizontal fill-width top-2em">
				<label class="label is-horizontal align-center">Answer</label>
				<div class="field columns">
					<span class="column is-two-thirds"><input v-model="question.answer.option1" class="input" type="text" placeholder="Option 1"></span>
					<span class="column is-one-third"><input v-model="question.answer.weights[0].value" class="input" type="number" placeholder="Weight"></span>
				</div>
				<div class="field columns">
					<span class="column is-two-thirds"><input v-model="question.answer.option2" class="input" type="text" placeholder="Option 2"></span>
					<span class="column is-one-third"><input v-model="question.answer.weights[1].value" class="input" type="number" placeholder="Weight"></span>
				</div>
				<div class="field columns">
					<span class="column is-two-thirds"><input v-model="question.answer.option3" class="input" type="text" placeholder="Option 3"></span>
					<span class="column is-one-third"><input v-model="question.answer.weights[2].value" class="input" type="number" placeholder="Weight"></span>
				</div>
				<div class="field columns">
					<span class="column is-two-thirds"><input v-model="question.answer.option4" class="input" type="text" placeholder="Option 4"></span>
					<span class="column is-one-third"><input v-model="question.answer.weights[3].value" class="input" type="number" placeholder="Weight"></span>
				</div>
				<div class="field columns">
					<span class="column is-two-thirds"><input v-model="question.answer.option5" class="input" type="text" placeholder="Option 5"></span>
					<span class="column is-one-third"><input v-model="question.answer.weights[4].value" class="input" type="number" placeholder="Weight"></span>
				</div>
			</div>

			<div class="field is-grouped top-2em">
				<div class="control">
					<button class="button is-link" type="button">Cancel</button>
				</div>
				<div class="control">
					<button class="button is-link" type="button" v-on:click="submitForm">Submit Question</button>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'NewQuestion',
	data() {
		return {
			notify: false,
			lastCategory: {},
			selectedCategory: {},
			selectedCategoryName: '',
			question: {
				auth_token: '',
				title: '',
				body: '',
				category: {},
				answer: {
					option1: '',
					option2: '',
					option3: '',
					option4: '',
					option5: '',
					categories: [],
					weights: [{
							option: 1,
							value: 0
						},
						{
							option: 2,
							value: 0
						},
						{
							option: 3,
							value: 0
						},
						{
							option: 4,
							value: 0
						},
						{
							option: 5,
							value: 0
						}
					]
				},
				weight: {
					value: 0
				},
				weight_range: '',
				status: '',
				message: ''
			}
		}
	},
	created: function() {
		this.lastCategory = this.$store.state.componentData.selectedCategory
		this.selectedCategoryName = this.$store.state.componentData.selectedCategoryName
		this.weight_range = this.$store.state.componentData.weightRange
		this.question.category = {
			id: parseInt(this.lastCategory.id),
			name: this.lastCategory.name,
			parent: 0,
			level: parseInt(this.lastCategory.level) + 1,
			categories: []
		}
	},
	filters: {
		typeNumber: function(value) {
			if (!value) return 0
			return parseFloat(value)
		}
	},
	methods: {
		submitForm: function(event) {
			event.preventDefault()
			console.log(this.question)
			var app = this
			this.question.weight.value = parseFloat(this.question.weight.value)
			for (var i = 0; i < 5; i++) {
				this.question.answer.weights[i].value = parseFloat(this.question.answer.weights[i].value)
			}
			this.question.auth_token = app.$cookies.get('token')
			if (Object.keys(this.selectedCategory).length !== 0) {
				this.appendToLastEmptyCategory(this.question.category)
			}
			this.$axios.post('create_question', JSON.stringify(this.question))
				.then(function(response) {
					console.log(response)
					app.status = response.data.status
					app.message = response.data.message
					if (response.data.status === 'SUCCESS') {
						console.log('Status: ' + response.data.status)
						app.$store.commit('update', {
							status: response.data.status,
							message: response.data.message,
							response: response.data,
							componentData: {
								selectedCategoryName: app.$store.state.componentData.selectedCategoryName
							}
						})
						app.$router.push({
							name: 'Questioner'
						})
					}
				})
				.catch(function(error) {
					console.log(error)
				})
		},
		logout: function() {
			this.$store.state.status = ''
			this.$cookies.remove('token')
			this.$router.push({
				name: 'Login'
			})
		},
		updateCategory: function(event) {
			if (this.$refs.new_category.value !== '') {
				this.selectedCategoryName = event.target.value
				this.selectedCategory = {
					id: 0,
					name: this.$refs.new_category.value,
					parent: parseInt(this.lastCategory.id),
					level: parseInt(this.lastCategory.level) + 1,
					categories: []
				}
			}
		},
		appendCategory: function() {
			this.appendToLastEmptyCategory(this.question.category)
			this.lastCategory = this.selectedCategory
			this.$refs.new_category.value = ''
			this.selectedCategory = {}
		},
		appendToLastEmptyCategory: function(category) {
			if (category.categories.length > 0) {
				this.appendToLastEmptyCategory(category.categories[0])
			} else {
				category.categories.push(this.selectedCategory)
			}
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

<style scoped>
div.page_title {
	margin-top: 0.5em;
	margin-bottom: 0.5em;
	font-size: 14pt;
	font-weight: bold;
	color: #7957d5;
}

div.questioner-functions {
	margin-top: 2em;
	width: 50%;
	margin-left: auto;
	margin-right: auto;
}

div.notification {
	height: 2em;
	text-align: center;
	font-size: 14pt;
	padding: 0.5rem 1.5rem 0.5rem 1.5rem;
}

.success {
	color: darkgreen;
}

.failure {
	color: red;
}

.align-center {
	text-align: center;
}

.align-right {
	text-align: right;
}

.field {
	position: relative;
}

.cls {
	width: 79.5%;
	display: inline;
}

a.cls {
	top: 6px;
}

.logout_top {
	position: absolute;
	text-align: right;
	padding-right: 2em;
	width: 100%;
	font-size: large;
}

span.cls {
	position: absolute;
}

.cls1 {
	width: 90%;
	display: inline;
}

a.cls1 {
	top: 8px;
}

.top-2em {
	margin-top: 2em;
}

.fill-width {
	width: 100%;
}

.selected-category {
	font-weight: bold;
	color: crimson;
}

#q-weight-range {
	position: absolute;
	top: 0.6em;
	left: -4em;
	font-weight: bold;
}
</style>
