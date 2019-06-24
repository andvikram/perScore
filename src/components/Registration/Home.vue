<template>
<div class="signup">
	<div class="notification" v-show="notify" v-bind:class="colorClass">{{ message() }}</div>
	<div class="page_title">Sign up for PerScore</div>
	<form class="signup_form">
		<div class="field">
			<label class="label">First Name</label>
			<div class="control has-icons-left">
				<input ref="first_name" v-bind:class="getClass()" v-model="user.first_name" type="text" placeholder="Enter First Name" required/>
			</div>
			<p class="help is-danger" v-show="checkStatus()">{{ validationMessage("first_name") }}</p>
		</div>
		<div class="field">
			<label class="label">Last Name</label>
			<div class="control has-icons-left">
				<input ref="last_name" v-bind:class="getClass()" v-model="user.last_name" type="text" placeholder="Enter Last Name" required/>
			</div>
			<p class="help is-danger" v-show="checkStatus()">{{ validationMessage("last_name") }}</p>
		</div>
		<div class="field">
			<label class="label">Email</label>
			<div class="control has-icons-left">
				<input ref="email" v-bind:class="getClass()" v-model="user.email" type="email" placeholder="Enter Email" required/>
				<span class="icon is-small is-left">
								<i class="fa fa-envelope"></i>
							</span>
			</div>
			<p class="help is-danger" v-show="checkStatus()">{{ validationMessage("email") }}</p>
		</div>
		<div class="field">
			<label class="label">Password</label>
			<div class="control has-icons-left">
				<input ref="password" v-bind:class="getClass()" v-model="user.password" type="password" placeholder="Enter Password" required/>
				<span class="icon is-small is-left">
								<i class="fa fa-lock"></i>
							</span>
			</div>
			<p class="help is-danger" v-show="checkStatus()">{{ validationMessage("password") }}</p>
		</div>
		<div class="field">
			<label class="label"> Confirm Password</label>
			<div class="control has-icons-left">
				<input ref="password" v-bind:class="getClass()" v-model="user.confirm_password" type="password" placeholder="Re-enter Password" required/>
				<span class="icon is-small is-left">
							<i class="fa fa-lock"></i>
						</span>
			</div>
		</div>
		<div class="field">
			<label class="label">Country</label>
			<div class="control has-icons-left">
				<input ref="country" v-bind:class="getClass()" v-model="user.location.country" type="text" placeholder="Enter Country" required/>
			</div>
			<p class="help is-danger" v-show="checkStatus()">{{ validationMessage("country") }}</p>
		</div>
		<div class="field">
			<label class="label">City</label>
			<div class="control has-icons-left">
				<input ref="city" v-bind:class="getClass()" v-model="user.location.city" type="text" placeholder="Enter City" required/>
			</div>
			<p class="help is-danger" v-show="checkStatus()">{{ validationMessage("city") }}</p>
		</div>
		<div class="field">
			<label class="label">Age</label>
			<div class="control has-icons-left">
				<input ref="age" v-bind:class="getClass()" v-model="user.age" type="number" placeholder="Enter your age" required/>
			</div>
			<p class="help is-danger" v-show="checkStatus()">{{ validationMessage("age") }}</p>
		</div>
		<div class="field">
			<label class="label">Signup as</label>
			<div class="control has-icons-left">
				<div class="select">
					<select v-model="user.role">
						<option disabled value="">Select Role</option>
		        <option>Administrator</option>
						<option>Questioner</option>
						<option>Respondent</option>
	      	</select>
				</div>
			</div>
		</div>
		<div class="field is-grouped sb_buttons">
			<div class="control has-icons-left">
				<button type="button" class="button is-link">Cancel</button>
			</div>
			<div class="control has-icons-left">
				<button class="button is-link" type="button" v-on:click="submitForm">Submit</button>
			</div>
		</div>
	</form>
	<router-link to="/login" class="form_nav">Go to Login</router-link>
</div>
</template>

<script>
export default {
	name: 'Registration',
	data() {
		return {
			user: {
				first_name: '',
				last_name: '',
				email: '',
				password: '',
				confirm_password: '',
				age: 0,
				role: '',
				location: {
					country: '',
					city: ''
				}
			},
			fields: [],
			notify: false,
			colorClass: ''
		}
	},
	methods: {
		submitForm: function(event) {
			event.preventDefault()
			var app = this
			this.$axios.post('/register', 
			JSON.stringify(this.user))
				.then(function(response) {
					console.log(response)
					if (response.data.status === 'SUCCESS') {
						app.$store.commit('update', {
							status: response.data.status,
							message: response.data.message
						})
						console.log('Status: ' + app.$store.state.status)
						app.$router.push({
							name: 'Login'
						})
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
		checkStatus: function() {
			if (this.$store.state.status === 'SUCCESS') {
				return false
			} else {
				return true
			}
		},
		getClass: function() {
			return {
				'input': true,
				'is-danger': (this.$store.state.status === 'FAILURE')
			}
		},
		validationMessage: function(fieldName) {
			var fields = this.fields
			var message = ''
			for (var i = 0; i < fields.length; i++) {
				if (fields[i].name === fieldName) {
					message = fields[i].validation
					break
				}
			}
			return message
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
		redirectLogin: function() {
			this.$router.push({
				name: 'Login'
			})
		}
	}
}
</script>

<style scoped>
div.signup {
	width: 95%;
	margin-left: auto;
	margin-right: auto;
}

form.signup_form {
	margin-top: 3em;
	width: 30%;
	margin-left: 5%;
	/*margin-left: auto;
		margin-right: auto;*/
	text-align: left;
}

div.page_title {
	margin-top: 0.5em;
	margin-bottom: 0.5em;
	font-size: 14pt;
	font-weight: bold;
	color: #7957d5;
}

div.signup form {
	margin-bottom: 1em;
}

div.notification {
	height: 2em;
	text-align: center;
	font-size: 14pt;
	padding: 0.5rem 1.5rem 0.5rem 1.5rem;
}

div.sb_buttons {
	margin-top: 2em;
}

.success {
	color: darkgreen;
}

.failure {
	color: red;
}
</style>
