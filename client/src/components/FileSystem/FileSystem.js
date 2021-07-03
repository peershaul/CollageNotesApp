import React from 'react';
import UserBar from './UserBar';
import FileBrowser from './FileBrowser';
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
	}

	render() {
		return (
			<section id="filesystem">
				<UserBar
					username={this.state.username}
					current_location={this.state.current_location}
					main_change_directory={this.main_change_directory}
				/>
				<FileBrowser
					username={this.state.username}
					userid={this.state.userid}
					url={this.props.url}
					current_location={this.current_location}
					main_change_directory={this.main_change_directory}
					ref={this.file_browser}
				/>
			</section>
		);
	}

	main_change_directory = (filepath, from_browser = false) => {
		this.setState({ current_location: filepath }, () => {
			if (!from_browser) this.file_browser.current.change_directory(filepath);
		});
	};
}

export default FileSystem;
