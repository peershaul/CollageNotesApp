const express = require('express');
const multer = require('multer');
const morgan = require('morgan');
const path = require('path');
const uuid = require('uuid').v4;
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const formidable = require('formidable');

const app = express();

const PORT = process.env.PORT || 3500;
const maindir = path.join(__dirname, '..');
console.log(`main directory is: ${maindir}`);

const urlParser = bodyParser.urlencoded({ extended: true }); // This used for the url encoded bodies of some http requests
const jsonParser = bodyParser.json(); // This used for the json encoded bodies of some other http requests


// Setting up the storage protocol for this server
const file_upload_storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const form = formidable.IncomingForm()

		form.parse(req, (err, fields, files) => {
			console.log(err)
			cb('look')
		})
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}	
})
// using and activating some useful apps
const upload = multer({ storage: file_upload_storage }); // upload is the variable that interfaces multer for the ftp server

app.use(morgan('dev')); // This is a logger for the develpment phase
app.use(cors()); // cors is always useful:)
app.use(urlParser)

/** The user class, here for interfacing the multiple users around here easily */
class User {
	constructor(username, id) {
		(this.username = username), (this.id = id);
		if (!fs.existsSync(path.join(maindir, `public/files/${id}`)))
			fs.mkdirSync(path.join(maindir, `public/files/${id}`));
	}
}

let users = [];
function initialize_users() {
	const f = JSON.parse(fs.readFileSync('JSON/user.json'))['users'];
	for (let i = 0; i < f.length; i++) users.push(new User(f[i]['username'], f[i]['id']));
}

// Authenticate users
function internal_login(username, password) {
	const users = JSON.parse(fs.readFileSync('JSON/user.json'))['users'];
	console.log(`${username} attempt's login`);
	for (let i = 0; i < users.length; i++) {
		console.log(`check if ${username} is ${users[i]['username']}`);
		if (users[i]['username'] == username) {
			if (users[i]['password'] === password) return [ users[i]['id'], null ];
			else return [ null, 'invalid-password' ];
		}
	}

	return [ null, 'not-found' ];
}

function internal_signup(username, password) {
	let f = JSON.parse(fs.readFileSync('JSON/user.json'));
	for (let i = 0; i < f.users.length; i++) if (f.users[i].username == username) return [ null, 'exists' ];

	const id = uuid();
	f.users.push({ username, password, id });
	fs.writeFileSync('JSON/user.json', JSON.stringify(f));

	users.push(new User(username, id));

	return [ id, null ];
}

function userid_exist(id) {
	console.log(`check id: ${id}`);
	for (let i = 0; i < users.length; i++) {
		console.log(`checking if ${users[i].id}`);
		if (users[i].id == id) return true;
	}

	return false;
}

function delete_user(id) {
	let f = JSON.parse(fs.readFileSync('JSON/user.json'));
	let found = false;
	console.log(`given id: ${id}`);
	for (let i = 0; i < f.users.length; i++) {
		console.log(`current file id: ${f.users[i].id}`);
		if (f.users[i].id === id) {
			found = true;
			f.users.splice(i, i + 1);
			break;
		}
	}

	if (!found) return 'not-found-file';

	found = false;

	for (let i = 0; i < users.length; i++)
		if (users[i].id == id) {
			found = true;
			users.splice(i, i + 1);
			break;
		}

	if (!found) return 'not-found-array';

	fs.writeFileSync('JSON/user.json', JSON.stringify(f));
	fs.rmdirSync(path.join(maindir, `public/files/${id}`), {
		recursive: true
	});
	return 'no-error';
}

function look_at_dir(filepath) {
	let files = [];

	if (!fs.existsSync(filepath)) return false;

	const raw_files = fs.readdirSync(filepath);

	for (let i = 0; i < raw_files.length; i++) {
		const stat = fs.statSync(path.join(filepath, raw_files[i]));
		files.push({
			name: raw_files[i],
			is_dir: stat.isDirectory()
		});
	}

	return files;
}

initialize_users();


app.get('/', (req, res) => {
	res.send("Hello from the ftp server")
})

app.post('/login', jsonParser, (req, res) => {
	const [ id, error ] = internal_login(req.body.username, req.body.password);

	console.log(req.body);

	res.json({
		id: id,
		username: req.body.username,
		password: req.body.password,
		error: id == null,
		message: error
	});
});

app.post('/signup', jsonParser, (req, res) => {
	const message = internal_signup(req.body.username, req.body.password);
	res.json({
		message: message[1],
		username: req.body.username,
		password: req.body.password,
		id: message[0],
		error: message[0] == null
	});
});

app.delete('/user/:id', (req, res) => {
	const response = delete_user(req.params.id);
	const error = response != 'no-error';
	res.json({
		deleted_id: error ? null : req.params.id,
		message: response,
		error: error
	});
});

app.post('/look_dir', jsonParser, (req, res) => {
	console.log(req.body);
	if (!userid_exist(req.body.userid))
		return res.json({
			error: true,
			filepath: req.body.filepath,
			files: null,
			message: 'user doesnt exist'
		});

	if (req.body.filepath == undefined)
		return res.json({ error: true, filepath: null, files: null, message: 'filepath doesnt specified' });

	const files = look_at_dir(path.join(maindir, 'public/files', req.body.userid, req.body.filepath));
	if (typeof files == 'boolean' && !files)
		return res.json({
			error: true,
			filepath: req.body.filepath,
			files: null,
			message: 'path not found'
		});

	return res.json({
		error: false,
		filepath: req.body.filepath,
		files: files,
		message: null
	});
});

app.post('/create_dir', jsonParser, (req, res) => {
	console.log(req.body);

	if(req.body.userid == "" || req.body.userid == null || req.body.userid == undefined)
		return res.json({
			error : true,
			created_path: null,
			message: 'user-not-defined'
		})

	if (!userid_exist(req.body.userid))
		return res.json({
			error: true,
			created_path: null,
			message: 'user-not-exist'
		});

	const files = look_at_dir(path.join(maindir, 'public/files', req.body.userid, req.body.location))
	if(typeof files == 'boolean' && !files)
		return res.json({
			error: true,
			created_path: null, 
			message: 'path-not-found'
		})
	
	for(let i = 0; i < files.length; i++)
		if(files[i].name == req.body.name)
			return res.json({
				error: true, 
				created_path: null,
				message: 'path-already-exist'
			})
	fs.mkdir(path.join(maindir, 'public/files', req.body.userid, req.body.location, req.body.name), 
		(err) =>{
			if(err) {
				return res.json({
					error: true,
					created_path: null,
					message: 'internal-error'
				})
			}

			return res.json({
				error: false,
				created_path: path.join(req.body.location, req.body.name),
				message: 'path-created'
			})

		})
	
});


app.post('/create_file', jsonParser, (req, res) => {
	console.log(req.body)

	const body = req.body 

	if(body.userid == "" || body.userid == null || body.userid == undefined) 
		return res.json({
			error: true,
			created_file: null,
			message: 'user id not specified'
		})

	if(!userid_exist(body.userid))
		return res.json({
			error: true,
			created_file: null,
			message: 'user not found'
		})

	const local_location = path.join(maindir, 'public/files', body.userid, body.location)		
	const files = look_at_dir(local_location)
	if(typeof files == 'boolean' && !files)
		return res.json({
			error: true,
			created_file: null, 
			message: 'location doesnt exist'
		})

	for(let i = 0; i < files.length; i++)
		if(files[i].name == body.name)
			return res.json({
				error: true, 
				created_file: null, 
				message: 'path already exist'
			})


	fs.appendFile(path.join(local_location, body.name), '',
		err => {
			if(err) {
				res.json({
					error: true, 
					created_file: null,
					message: 'internal error'
				})
				throw err
			}

			return res.json({
				error: false,
				created_file: path.join(body.location, body.name),
				message: 'file created successfully'
			})
		})
})


app.post('/upload_file', (req, res) => {
	const form = new formidable.IncomingForm()

	form.parse(req => (err, fields, files) => {
		if(err){
			console.log(err.message)
			return 
		}

		console.log(fields)
	})
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}.....`));
