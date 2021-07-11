import React from 'react';
import '../../stylesheets/panel.css';

class Panel extends React.Component {
	constructor(props) {
		super(props);

		this.close_button = <div className="close" onClick={this.close_panel} />;
		this.id = '';
		this.state = {
			active: false
		};
	}

	open_panel = () => {
		const panel = document.getElementById(this.id);
		if (panel.style.display == 'flex') return;
		panel.style.display = 'flex';
	};

	close_panel = () => {
		const panel = document.getElementById(this.id);
		if (panel.style.display == 'none' || panel.classList.contains('closing')) return;
		panel.classList.add('closing');
		setTimeout(() => {
			panel.classList.remove('closing');
			panel.style.display = 'none';
		}, 1000);
	};
}

export default Panel;
