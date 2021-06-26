import React from 'react';
import '../../stylesheets/sign-up.css';

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.form = React.createRef();
	}

	render() {
		return (
			<div className="sign-up-container">
				<form ref={this.form} className="sign-up">
					<div className="close" />
					<div>
						<label htmlFor="username">
							<span>Username</span>
						</label>
						<input tabIndex="0" type="text" name="username" required />
					</div>
					<div>
						<label htmlFor="password">
							<span>Password</span>
						</label>
						<input tabIndex="1" type="password" name="password" required />
					</div>
					<div className="password-confirm">
						<label htmlFor="confirmPassword">
							<span>Confirm password</span>
						</label>
						<input tabIndex="2" type="password" name="password" required />
					</div>
					<input tabIndex="3" type="submit" value="Sign up" />
				</form>
			</div>
		);
	}
}

export default SignUp;
