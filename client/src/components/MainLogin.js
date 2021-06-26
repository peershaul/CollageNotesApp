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

		this.signup = React.createRef();
		this.article = React.createRef();
	}

	render() {
		return (
			<section>
				<article ref={this.article}>
					<Login trigger={this.login} />
					<a href="#" onClick={() => this.setSignUp(true)}>
						Create a new account
					</a>
				</article>
				<SignUp awake={this.state.signup} unset={this.unsetSignUp} ref={this.signup} />
			</section>
		);
	}

	login(username, password) {}

	setSignUp = () => {
		this.signup.current.container.current.classList.remove('closed');
		this.article.current.classList.add('signup');
		this.setState({ signup: true });
	};

	unsetSignUp = () => {
		if (!this.signup.current.container.current.classList.contains('closed')) {
			this.article.current.classList.remove('signup');
			setTimeout(() => this.setState({ signup: false }), 1050);
		}
	};
}

export default MainLogin;
