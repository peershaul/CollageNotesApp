import React from 'react';
import Panel from '../Panel';
import '../../../stylesheets/add-panel.css';

/** The main panel that controls the communication with the server and the menu flow and screen movement */
class AddPanel extends Panel {
	constructor(props) {
		super(props);

		this.id = 'add-panel';
		this.file_selector = React.createRef()
		this.screens = [
			<FileDirSelector set_is_dir={this.set_is_dir} />,
			<FileUploadOrCreate set_is_uploaded={this.set_is_uploaded} />,
			<NameSelector set_name={this.set_name} />,
			<FileDropSelector set_upload_data = {this.set_upload_data} />	
		];

		this.defaultState = {};

		this.state = {
			screen: 0,
			is_dir: false,
			name: '',
			upload_data: undefined,
			is_uploaded: false
		};

		this.resetState = () => {
			this.setState({
				screen: 0,
				is_dir: false,
				name: '',
				upload_data: undefined,
				is_uploaded: false
			});
		};
	}

	render() {
		return (
			<div className="panel" id={this.id}>
				{this.close_button}
				{this.screens[this.state.screen]}
			</div>
		);
	}

	set_is_dir = (is_dir) => {
		this.setState({
			is_dir: is_dir,
			screen: is_dir ? 2 : 1
		});
	};
	set_name = (name) => {
		if (name != null || name != '') this.setState({ name: name }, this.send_to_server);
	};

	set_is_uploaded = (is_uploaded) => {
		this.setState({
			is_uploaded: is_uploaded,
			screen: is_uploaded ? 3 : 2
		});
	};

	open_panel = () => {
		const panel = document.getElementById(this.id);
		if (panel.style.display == 'flex') return;
		panel.style.display = 'flex';

		this.resetState();
	};

	set_upload_data = data => {
		this.setState({upload_data: data}, this.send_to_server)
	}

	send_to_server = () => {
		if (this.state.is_dir) {
			fetch(`${this.props.url}/create_dir`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: this.state.name,
					location: this.props.get_current_directory(),
					userid: this.props.userid
				})
			}).then(response => response.json()).then(data => {
				if(!data.error) {
					this.props.main_change_directory(this.props.get_current_directory())
					this.close_panel()
				}
				else console.log(`ERROR: ${data.message}`)
			});
		}


		else {
			if(!this.state.is_uploaded){
				fetch(`${this.props.url}/create_file`, {
					method: 'POST',
					headers: {
						'Content-Type' : 'application/json'
					},
					body: JSON.stringify({
						name: this.state.name,
						location: this.props.get_current_directory(),
						userid: this.props.userid
					})
				}).then(response => response.json()).then(data => {
					if(!data.error){
						this.props.main_change_directory(this.props.get_current_directory())
						this.close_panel()
					}
					else console.log(`ERROR: ${data.message}`)
				})
			}
			else {
				let file_id;
				fetch(`${this.props.url}/upload_file_s1`, {
					method: 'POST',
					body: this.state.upload_data
				})
				.then(response => response.json())
				.then(data => {
					file_id = data.file_id
					console.log(data)
					fetch(`${this.props.url}/upload_file_s2`, {
						method: 'POST',
						headers: {
							'Content-Type' : 'application/json'
						},
						body: JSON.stringify({
							file_id: file_id,
							filepath: this.props.get_current_directory(),
							userid: this.props.userid,
							force: false
						})
					})
					.then(response => response.json())
					.then(data => console.log(data))
				})
			}
		}
	};
}

/** Is the new item is file or directory */
class FileDirSelector extends React.Component {
	render() {
		return (
			<div className="selector file-dir button-selector">
				<button className="file" onClick={this.click}>
					File
				</button>
				<button className="dir" onClick={this.click}>
					Folder
				</button>
			</div>
		);
	}

	click = (e) => {
		const target = e.target;
		this.props.set_is_dir(target.classList.contains('dir'));
	};
}

/** On a file if you want to create new one or to upload one */
class FileUploadOrCreate extends React.Component {
	render() {
		return (
			<div className="selector upload-create button-selector">
				<button className="upload" onClick={this.click}>
					Upload
				</button>
				<button className="create" onClick={this.click}>
					Create
				</button>
			</div>
		);
	}

	click = (e) => {
		const target = e.target;
		this.props.set_is_uploaded(target.classList.contains('upload'));
	};
}

/** Set the name of the new document */
class NameSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			entered: false
		};
	}

	render() {
		return (
			<div className="selector text-selector name">
				<form onSubmit={this.submit}>
					<div>
						<label htmlFor="name">Name</label>
						<input type="text" name="name" value={this.state.name} onChange={this.name_change} required />
					</div>
					<input type="submit" value="Create" />
				</form>
			</div>
		);
	}

	submit = (e) => {
		e.preventDefault();
		if (this.state.entered) this.props.set_name(this.state.name);
	};
	name_change = (e) => {
		this.setState({ name: e.target.value, entered: e.target.value != '' });
	};
}

/** Upload a single file you want to send to the server */
class FileDropSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {form_data: null}		
		console.log(this.props.parent)
	}

	render() {
		return (
			<div className="selector file-drop-selector">
				<form ref = {this.form} onSubmit = {this.submit}>
					<div
						className="file-drop-area"
						onDragOver={this.drag_enter}
						onDrop={this.file_drop}
						onDragLeave={this.drag_exit}
					>
						<span>Drop files here</span>
					</div>
					<input type="file" name="file" />
					{/*<input 
						type='text' 
						name='filepath' 
						style ={{display: 'none'}} 
						value = {this.props.get_current_directory()} />
					<input 
						type = 'text'
						name = 'userid'
						value = {this.props.userid}
						style = {{display: 'none'}}
					/>*/}
					<input type="submit" value="Upload" />
				</form>
			</div>
		);
	}

	file_drop = (e) => {
		e.preventDefault();

		const target = e.target;
		const dropDiv = target.nodeName == 'SPAN' ? target.parentNode : target;

		dropDiv.classList.remove('drag');

		const fileInput = dropDiv.parentNode.querySelector('input[type="file"]');

		fileInput.files = e.dataTransfer.files;
	};

	drag_enter = (e) => {
		e.preventDefault();
		const target = e.target;
		const dropDiv = target.nodeName == 'SPAN' ? target.parentNode : target;

		if (!dropDiv.classList.contains('drag')) dropDiv.classList.add('drag');
	};
	drag_exit = (e) => {
		e.preventDefault();
		const target = e.target;
		const dropDiv = target.nodeName == 'SPAN' ? target.parentNode : target;

		if (dropDiv.classList.contains('drag')) dropDiv.classList.remove('drag');
	};

	submit = e => {
		e.preventDefault()
		this.props.set_upload_data(new FormData(e.target))
	}
}

export default AddPanel;
