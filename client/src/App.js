import './stylesheets/App.css';
import React from 'react';
import MainLogin from './components/MainLogin';
import FileSystem from './components/FileSystem/FileSystem';
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
			url: 'http://192.168.1.13:3500',
			userData: [ null, null ]
		};
	}

	render() {
		const pages = [
			<MainLogin deliverId={this.deliverId} url={this.state.url} />,
			<FileSystem url={this.state.url} userData={this.state.userData} />
		];

		return pages[this.state.page];
	}

	changeScreen(scr_index, scr_props) {
		this.setState({
			page: scr_index,
			curr_props: scr_props
		});
	}

	deliverId = (userData) => {
		this.setState({ page: 1, userData: userData });
	};
}

export default App;
