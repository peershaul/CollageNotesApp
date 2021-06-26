import React from 'react';
import '../../stylesheets/login.css';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.form = React.createRef();
	}

	render() {
		return (
			<form ref={this.form} className="login">
				<div>
					<label htmlFor="username">Username</label>
					<input type="text" name="username" required />
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input type="password" name="password" required />
				</div>
				<input type="submit" value="Login" />
			</form>
		);
	}
}

export default Login;
