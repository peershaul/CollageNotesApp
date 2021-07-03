import React from 'react';
import path from 'path';
import '../../stylesheets/FileBrowser.css';

class FileBrowser extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			current_location: this.props.current_location,
			files: null
		};

		this.location_check = '';
	}
	componentDidMount = () => this.change_directory('/');
	render() {
		const files = this.state.files;
		let fileboxes = [];

		for (let i = 0; files != null && i < files.length; i++) {
			const is_dir = files[i].is_dir;
			fileboxes.push(
				<div className={is_dir ? 'directory' : 'file'} key={i} onClick={this.fileclick}>
					<span>{files[i].name}</span>
				</div>
			);
		}

		return <div id="file-browser">{fileboxes}</div>;
	}

	change_directory(path) {
		fetch(`${this.props.url}/look_dir`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				filepath: path,
				userid: this.props.userid
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data['error']) {
					console.log(`ERROR: ${data['message']}`);
					return;
				}

				this.setState(
					{
						current_location: path,
						files: data['files']
					},
					() => (this.location_check = this.state.current_location)
				);

				this.props.main_change_directory(path, true);
			});
	}

	fileclick = (e) => {
		const elem = e.target.nodeName == 'DIV' ? e.target.querySelector('span') : e.target;
		const filepath = elem.innerHTML;

		if (elem.parentElement.classList.contains('directory'))
			this.change_directory(path.join(this.state.current_location, filepath));
	};
}

export default FileBrowser;
