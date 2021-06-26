import './stylesheets/App.css';
import React from 'react';
import MainLogin from './components/MainLogin';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0,
			curr_props: {}
		};
	}

	render() {
		const pages = [ <MainLogin props={this.state.curr_props} /> ];

		return pages[this.state.page];
	}

	changeScreen(scr_index, scr_props) {
		this.setState({
			page: scr_index,
			curr_props: scr_props
		});
	}
}

export default App;
