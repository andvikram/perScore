<template>
<div class="respondent">
	<div class="notification" v-show="notify" v-bind:class="getColorClass()">{{ message() }}</div>
	<div class="logout_top">
		<a class="is-link" type="button" v-on:click="logout">Logout</a>
	</div>
	<div class="page_title">Welcome Respondent!</div>

	<div class="respondent-functions columns">
		<div class="categories-section column is-one-third">
			<div class="c-label">
				Choose your interest:
			</div>
			<ul class="categories">
				<li v-for="category in categoriesToShow">
					<a href="javascript:void(0)" :data-level="currentLevel" v-on:click="nextlevel">{{ category.name }}</a>
				</li>
			</ul>
			<div class="control align-center">
				<a class="button is-text" v-show="hasPrevious" v-on:click="previousLevel">← Previous List</a>
			</div>
		</div>
		<div class="column">
			<div class="q-actions" v-show="isSelected">
				<div class="c-label">
					Interest selected: <span class="c-scn">{{ selectedCategoryName }}</span>
				</div>
				<div class="control">
					<a class="button is-success" type="button" v-on:click="start">Start The Challenge</a>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'Respondent',
	data() {
		return {
			notify: false,
			currentLevel: 1,
			categoriesToShow: [],
			isSelected: false,
			hasPrevious: false,
			selectedCategoryName: '',
			categoryLastSelcted: []
		}
	},
	created() {
		console.log('Respondent Home ...')
		if (this.$store.state.status === 'SUCCESS') {
			this.notify = true
			var categories = this.$store.state.response.categories
			console.log(categories)
			if (categories !== undefined) {
				for (var i = 0; i < categories.length; i++) {
					if (parseInt(categories[i].level) === 1) {
						this.categoriesToShow.push(categories[i])
					}
				}
			}
		} else {
			this.notify = false
		}
	},
	methods: {
		nextlevel: function(event) {
			console.log(event.target.innerText)
			var categories = this.$store.state.response.categories
			var categoriesToShow = this.categoriesToShow
			this.categoriesToShow = []
			var selectedCategory
			for (var i = 0; i < categories.length; i++) {
				if (categories[i].name === event.target.innerText) {
					selectedCategory = categories[i]
					break
				}
			}
			for (i = 0; i < categories.length; i++) {
				if (categories[i].parent === selectedCategory.id) {
					if (parseInt(categories[i].level) === (parseInt(event.target.getAttribute('data-level')) + 1)) {
						this.categoriesToShow.push(categories[i])
					}
				}
			}
			this.selectedCategoryName = event.target.innerText
			this.isSelected = true
			this.categoryLastSelcted.push(this.selectedCategoryName)
			if (this.categoriesToShow.length === 0) {
				this.categoriesToShow = categoriesToShow
			} else {
				this.hasPrevious = true
				this.currentLevel = (parseInt(event.target.getAttribute('data-level')) + 1)
			}
		},
		previousLevel: function() {
			var categories = this.$store.state.response.categories
			var categoriesToShow = this.categoriesToShow
			this.categoriesToShow = []
			var selectedCategory
			for (var i = 0; i < categories.length; i++) {
				if (categories[i].name === this.selectedCategoryName) {
					selectedCategory = categories[i]
					break
				}
			}
			if (selectedCategory.parent === 0) {
				for (i = 0; i < categories.length; i++) {
					if (parseInt(categories[i].level) === (this.currentLevel - 1)) {
						this.categoriesToShow.push(categories[i])
					}
				}
			} else {
				for (i = 0; i < categories.length; i++) {
					if (categories[i].parent === selectedCategory.parent) {
						if (parseInt(categories[i].level) === (this.currentLevel - 1)) {
							this.categoriesToShow.push(categories[i])
						}
					}
				}
			}
			if (this.categoriesToShow.length === 0) {
				this.categoriesToShow = categoriesToShow
				this.selectedCategoryName = this.categoryLastSelcted.pop()
			} else {
				this.isSelected = true
				this.selectedCategoryName = this.categoryLastSelcted.pop()
				this.currentLevel = (this.currentLevel - 1)
				if (this.currentLevel === 1) {
					this.isSelected = false
					this.hasPrevious = false
				}
			}
		},
		start: function(event) {
			event.preventDefault()
			var category
			var categories = this.$store.state.response.categories
			for (var i = 0; i < categories.length; i++) {
				if (this.selectedCategoryName === categories[i].name) {
					category = categories[i]
					category.categories = []
					break
				}
			}
			console.log(category)
			this.$store.commit('update', {
				componentData: {
					selectedCategoryName: this.selectedCategoryName,
					selectedCategory: category
				}
			})
			this.$router.push({
				name: 'NextQuestion'
			})
		},
		logout: function() {
			this.notify = false
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

<style scoped>
div.respondent {
	/*width: 30%;*/
}

div.page_title {
	margin-top: 0.5em;
	margin-bottom: 0.5em;
	font-size: 14pt;
	font-weight: bold;
	color: #7957d5;
}

div.respondent-functions {
	margin-left: 15%;
	margin-top: 2em;
}

div.notification {
	height: 2em;
	text-align: center;
	font-size: 14pt;
	padding: 0.5rem 1.5rem 0.5rem 1.5rem;
}

ul.categories {
	margin-top: 2em;
	max-height: 50vh;
	margin-bottom: 1em;
	font-size: 14pt;
}

div.q-actions div.control {
	position: absolute;
	top: 20em;
}

div.q-actions div.control button {
	margin-right: 4em;
}

div.q-actions div.control span.fr-1 {
	position: absolute;
	top: 0.5em;
	left: -4em;
}

div.q-actions div.control span.fr-2 {
	position: absolute;
	top: 0.5em;
	left: 9em;
}

div.q-actions div.control span.fr-3 {
	position: absolute;
	top: 6px;
	left: 10.5em;
	font-size: 14pt;
	font-weight: bold;
	text-decoration: underline;
	color: crimson;
}

.c-label {
	font-size: 14pt;
	font-weight: bold;
}

span.c-scn {
	text-decoration: underline;
	color: crimson;
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

.logout_top {
	position: absolute;
	text-align: right;
	padding-right: 2em;
	width: 100%;
	font-size: large;
}
</style>
