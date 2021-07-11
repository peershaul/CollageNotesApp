import React from 'react';
import '../../stylesheets/UserBar.css';

class UserBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: this.props.username
		};
	}

	render() {
		const folders = this.props.current_location.split('/');
		let links = [
			<div className="item root" key="0" onClick={this.folderClick}>
				/
			</div>
		];

		for (let i = 1; i < folders.length; i++) {
			if (folders[i] == null || folders[i] == '') continue;
			const last = i == folders.length - 1;

			links.push(
				<div className="item" key={`${i}`} onClick={this.folderClick}>
					{folders[i]}
				</div>
			);

			if (!last) links.push(<slash />);
		}

		return (
			<div id="user-bar">
				<div className="greeter">
					<span>Hello, {this.state.username}</span>
				</div>
				<div className="location">
					<span>Your current location: </span>
					{links}
				</div>
				<div className="buttons">
					<div className="create" onClick={this.props.open_add_panel}>
						<div />
					</div>
					<div
						className="back"
						onClick={this.back_folder}
						style={{ display: this.props.current_location == '/' ? 'none' : 'inline-block' }}
					>
						<div />
					</div>
				</div>
			</div>
		);
	}

	folderClick = (e) => {
		const trgt = e.target;
		const links = document.querySelectorAll('#user-bar .location div');

		let index = -1;
		for (let i = 0; i < links.length; i++)
			if (trgt == links[i]) {
				index = i;
				break;
			}

		let filepath;

		if (index != 0) {
			const splitter = this.props.current_location.split('/');
			let cunstructed_path = [];
			for (let i = 0; i <= index; i++) cunstructed_path.push(splitter[i]);

			filepath = cunstructed_path.join('/');
		} else filepath = '/';

		this.props.main_change_directory(filepath);
	};

	back_folder = () => {
		const splitted = this.props.current_location.split('/');
		if (splitted[1] == '') return;
		let new_arr = [];
		for (let i = 0; i < splitted.length - 1; i++) new_arr.push(splitted[i]);
		let filepath = new_arr.join('/');
		if (filepath.charAt(0) != '/') filepath = '/' + filepath;
		this.props.main_change_directory(filepath);
	};
}

export default UserBar;
