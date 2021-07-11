import React from 'react';
import UserBar from './UserBar';
import FileBrowser from './FileBrowser';
import AddPanel from '../Panel/addPanel/AddPanel';
import '../../stylesheets/FileSystem.css';

class FileSystem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: this.props.userData[1],
			userid: this.props.userData[0],
			current_location: '/'
		};

		this.file_browser = React.createRef();
		this.user_bar = React.createRef();
		this.add_panel = React.createRef();
	}

	render() {
		return (
			<section id="filesystem">
				<UserBar
					username={this.state.username}
					current_location={this.state.current_location}
					main_change_directory={this.main_change_directory}
					ref={this.user_bar}
					open_add_panel={this.open_add_panel}
				/>
				<FileBrowser
					username={this.state.username}
					userid={this.state.userid}
					url={this.props.url}
					current_location={this.current_location}
					main_change_directory={this.main_change_directory}
					ref={this.file_browser}
				/>
				<AddPanel
					get_current_directory={this.get_current_directory}
					main_change_directory={this.main_change_directory}
					url={this.props.url}
					ref={this.add_panel}
					userid={this.state.userid}
				/>
			</section>
		);
	}

	main_change_directory = (filepath, from_browser = false) => {
		this.setState({ current_location: filepath }, () => {
			if (!from_browser) this.file_browser.current.change_directory(filepath);
			this.user_bar.current.render();
		});
	};

	get_current_directory = () => this.state.current_location;

	open_add_panel = () => this.add_panel.current.open_panel();
}

export default FileSystem;
