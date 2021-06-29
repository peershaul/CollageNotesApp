import React from 'react';
import '../../stylesheets/sign-up.css';

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.form = React.createRef();
		this.container = React.createRef();

		this.state = {
			password: '',
			password_confirm: '',
			username: ''
		};
	}

	render = () => {
		return (
			<div className={this.props.awake ? 'sign-up-container' : 'sign-up-container closed'} ref={this.container}>
				<form ref={this.form} className="sign-up" onSubmit={this.submitForm}>
					<div className="close" onClick={this.closeForm} />
					<div>
						<label htmlFor="username">
							<span>Username</span>
						</label>
						<input
							tabIndex="0"
							type="text"
							name="username"
							onChange={this.changeField}
							value={this.state.username}
							required
						/>
					</div>
					<div>
						<label htmlFor="password">
							<span>Password</span>
						</label>
						<input
							tabIndex="1"
							type="password"
							name="password"
							onChange={this.changeField}
							value={this.state.password}
							required
						/>
					</div>
					<div className="password-confirm">
						<label htmlFor="confirmPassword">
							<span>Confirm password</span>
						</label>
						<input
							tabIndex="2"
							type="password"
							name="confirmPassword"
							onChange={this.changeField}
							value={this.state.password_confirm}
							required
						/>
					</div>
					<input tabIndex="3" type="submit" value="Sign up" />
				</form>
			</div>
		);
	};

	closeForm = () => {
		const container = this.container.current;
		if (!container.classList.contains('closed')) {
			container.classList.add('closing');
			this.props.unset();
			setTimeout(() => {
				container.classList.remove('closing');
				container.classList.add('closed');
			}, 1050);
		}
	};

	changeField = (e) => {
		const target = e.target;
		const name = target.getAttribute('name');
		switch (name) {
			case 'username':
				this.setState({ username: target.value });
				break;
			case 'password':
				this.setState({ password: target.value });
				break;
			case 'confirmPassword':
				this.setState({ password_confirm: target.value });
		}
	};

	submitForm = (e) => {
		e.preventDefault();
		if (this.state.password != this.state.password_confirm) {
			this.use_prompt('The passwords in the to fields are not equal');
			return;
		}

		fetch(`${this.props.url}/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data['error']) {
					if (data['message'] == 'exists') this.use_prompt('This username already exists');
					else this.use_prompt('ERROR');
					return;
				}

				const userData = [ data['id'], data['username'] ];
				this.props.deliverId(userData);
			});
	};

	use_prompt = (message) => {
		const prompt = this.props.prompt.current;
		if (prompt.classList.contains('active')) return;
		prompt.innerHTML = message;

		prompt.style.display = 'block';
		prompt.classList.add('active');

		setTimeout(() => {
			prompt.style.display = 'none';
			prompt.classList.remove('active');
		}, 5000);
	};
}

export default SignUp;
