import express from 'express';
const app = express();
import sqlite3 from 'better-sqlite3';
const db = sqlite3('brukerveiledning.db', {verbose: console.log})
import session from 'express-session';
import zlib from 'zlib';

app.use(session({
    secret: "qwerty",
    resave: false,
    saveUninitialized: false
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

function rootRoute(request, response) {
    const sql = db.prepare('SELECT * FROM users');
    const info = sql.all();
    response.send(info);
}

app.get('/usersrawjson', rootRoute)

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDirectoryPath = path.join(__dirname, "../src")
app.use(express.static(publicDirectoryPath))
app.use(express.static(path.join(__dirname, '../dist')));

// form handler for the login
function formhandlerlog(request, response) {
    const bsql = db.prepare('SELECT * FROM users WHERE users.uname = ?')
    const row: any = bsql.get(request.body.lusername);
    const testuser = request.body.lusername;
    console.log(testuser);

    if (row === undefined) {
        request.session.logedin = false;
        response.redirect("/index.html");
        console.log("incorrect username");
        return;
    } else {
        request.session.lusername = row.username;
        console.log(row.upassword);
        if (request.body.lpassword == row.upassword) {
            request.session.logedin = true;
            request.session.lpassword = row.password;
            request.session.lrole = row.uuserrole;
            response.redirect("/userguide.html");
        } else {
            request.session.logedin = false;
            response.redirect("/index.html");
            console.log("incorrect password");
            return;
        }
    }
    console.log(request.session.logedin);
}

app.post('/flogin', formhandlerlog);

//function for decompressing the data on loading userguide.html & sending it to editpage.js
// function decompressf(){
//     const row: any = db.prepare('SELECT umcontents FROM usermanualt WHERE umid = ?').get(1);
//     const compressedData = Buffer.from(row.umcontents, 'base64').toString();
//     const decompressedData = zlib.inflateSync(compressedData).toString();

//     console.log(decompressedData);
// }

// checks if the user is logged in and sends the users role to editpage.js
function rootRouterole(request, response) {
    if (request.session.logedin!== true) {
        response.redirect("/index.html")
        return;
    } else if (request.session.lrole) {
        response.json(request.session.lrole);
    } else {
        response.json({ message: 'No session data' });
    }
}

app.get('/userroleraw', rootRouterole)

function formhandlerfeedback(request, response) {
    console.log(request.body);

    console.log(request.body.brukerveiledning)

    //should compress the data
    const data = (request.body.brukerveiledning);

    try {
        // Ensure data is a valid string
        if (typeof data !== 'string' || !data) {
          throw new TypeError('Invalid data: Data must be a non-empty string.');
        }

        const compressedData = zlib.deflateSync(data);//.toString('base64');
        
        const stmt = db.prepare('INSERT INTO usermanualt (umcontents) VALUES (?)');
        stmt.run(compressedData);//compressed data

        response.send("compressed data sendt")

        console.log('Data successfully compressed and inserted into the database.');
    } catch (error) {
        console.error('Error compressing and inserting data:', error);
    }
}

app.post('/sendjsonbody', formhandlerfeedback);

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})
