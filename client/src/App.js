import './stylesheets/App.css';
import React from 'react';
import MainLogin from './components/MainLogin';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
			url: 'http://192.168.1.13:3500'
		};
	}

	render() {
		const pages = [ <MainLogin deliverId={this.deliverId} url={this.state.url} />, <div /> ];

		return pages[this.state.page];
	}

	changeScreen(scr_index, scr_props) {
		this.setState({
			page: scr_index,
			curr_props: scr_props
		});
	}

	deliverId = (userData) => {
		console.log(`${userData[1]}, id delivered`);
		this.setState({ page: 1 });
	};
}

export default App;
