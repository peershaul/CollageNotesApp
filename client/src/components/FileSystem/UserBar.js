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
					{/*<div className="item">items</div>
					<slash />
		<div className="item">hello</div>*/}
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
}

export default UserBar;
