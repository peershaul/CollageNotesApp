import React from 'react';
import Login from './login/Login';
import SignUp from './login/SignUp';
import '../stylesheets/login-container.css';

class MainLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
			signup: false
		};
	}

	render() {
		return (
			<section>
				<article>
					<Login trigger={this.login} />
					<a href="#" onClick={() => this.setSignUp(true)}>
						Create a new account
					</a>
				</article>
				<SignUp awake={false} />
			</section>
		);
	}

	login(username, password) {}

	setSignUp(active) {
		this.setState({ signup: active });
		alert('hello');
	}
}

export default MainLogin;
