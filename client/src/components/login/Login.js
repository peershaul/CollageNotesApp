import React from 'react';
import '../../stylesheets/login.css';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.form = React.createRef();

		this.state = {
			username: '',
			password: ''
		};
	}

	render() {
		return (
			<form ref={this.form} className="login" onSubmit={this.submit}>
				<div>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						value={this.state.username}
						onChange={this.changeField}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={this.state.password}
						onChange={this.changeField}
						required
					/>
				</div>
				<input type="submit" value="Login" />
			</form>
		);
	}

	submit = (e) => {
		e.preventDefault();

		let userData = [ null, null ];

		fetch(`${this.props.url}/login`, {
			method: 'POST',
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => {
				if (data['error'] && !this.props.prompt.current.classList.contains('active')) {
					const errors = [ 'invalid-password', 'not-found' ];
					const messages = [ 'You typed an incorrect password', 'username not found' ];
					const prompt = this.props.prompt.current;

					for (let i = 0; i < errors.length; i++)
						if (errors[i] == data['message']) prompt.querySelector('span').innerHTML = messages[i];

					prompt.style.display = 'block';
					prompt.classList.add('active');
					setTimeout(() => {
						prompt.style.display = 'none';
						prompt.classList.remove('active');
					}, 5000);
				}
				userData[0] = data['id'];
				userData[1] = data['username'];
			})
			.then(() => {
				if (userData[0] != null && userData[1] != null) this.props.deliverId(userData);
			});
	};

	changeField = (e) => {
		const target = e.target;

		if (target.getAttribute('name') == 'password') this.setState({ password: target.value });
		else this.setState({ username: target.value });
	};
}

export default Login;
