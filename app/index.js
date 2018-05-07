import express from 'express';
import expressSession from 'express-session';
import FileStore from 'session-file-store';
import bodyParser from 'body-parser';
import Logger from 'logger';

const logger = Logger.createLogger();
const fileStore = new FileStore(expressSession)();
const app = express();
const defaultWatsonCredentials = {
	url: 'https://gateway.watsonplatform.net/assistant/api',
	version: '2018-02-16'
};







app.post('/connect', (req, res) => {
	if (!req.body || !req.body.username || !req.body.password) {
		res.status(400).end(`Example: ${JSON.stringify(defaultWatsonCredentials, null, 2)}`);
		return;
	}
	let session = req.session;
	session.watsonAssistant = Object.assign({}, defaultWatsonCredentials, req.body);
	res.status(200).end('Success');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
	store: fileStore,
	secret: ['sekr3t'],
	resave: true,
	saveUninitialized: true
}));
app.use(/^(?!\/?connect)/, (req, res, next) => {
	if (!req.session.watsonAssistant) {
		res.send(401, 'Unauthorized! Setup a watson session using HTTP: POST /connect');
		return;
	}
	logger.info('req.session.watsonAssistant:', req.session.watsonAssistant);
	next();
});
let server = app.listen(3000, () => {
	let host = server.address().address;
	let port = server.address().port;
	logger.info('App listening at http://%s:%s', host, port);
});
