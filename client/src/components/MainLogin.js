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
		this.prompt = React.createRef();
	}

	render() {
		return (
			<section>
				<article ref={this.article}>
					<Login
						trigger={this.login}
						deliverId={this.props.deliverId}
						url={this.props.url}
						prompt={this.prompt}
					/>
					<a href="#" onClick={() => this.setSignUp(true)}>
						Create a new account
					</a>
				</article>
				<SignUp
					awake={this.state.signup}
					unset={this.unsetSignUp}
					ref={this.signup}
					deliverId={this.props.deliverId}
					url={this.props.url}
					prompt={this.prompt}
				/>
				<div className="prompt" ref={this.prompt}>
					<span>You typed an incorrect password</span>
				</div>
			</section>
		);
	}

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
