import express from 'express';
const app = express();
import sqlite3 from 'better-sqlite3';
const db = sqlite3('brukerveiledning.db', { verbose: console.log });
import session from 'express-session';
import zlib from 'zlib';
// if github freezes on sync changes/commit: git reset --soft HEAD~2
app.use(session({
    secret: "qwerty",
    resave: false,
    saveUninitialized: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
function rootRoute(request, response) {
    const sql = db.prepare('SELECT * FROM users');
    const info = sql.all();
    response.send(info);
}
app.get('/usersrawjson', rootRoute);
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDirectoryPath = path.join(__dirname, "../src");
//app.use(express.static(publicDirectoryPath))
app.use(express.static(path.join(__dirname, '../dist/public')));
// form handler for the login
function formhandlerlog(request, response) {
    const bsql = db.prepare('SELECT * FROM users WHERE users.uname = ?');
    const row = bsql.get(request.body.lusername);
    const testuser = request.body.lusername;
    console.log(testuser);
    if (row === undefined) {
        request.session.logedin = false;
        response.redirect("/index.html");
        console.log("incorrect username");
        return;
    }
    else {
        request.session.lusername = row.username;
        console.log(row.upassword);
        if (request.body.lpassword == row.upassword) {
            request.session.logedin = true;
            request.session.lpassword = row.password;
            request.session.lrole = row.uuserrole;
            response.redirect("/userguide.html");
        }
        else {
            request.session.logedin = false;
            response.redirect("/index.html");
            console.log("incorrect password");
            return;
        }
    }
    console.log(request.session.logedin);
}
app.post('/flogin', formhandlerlog);
//function for decompressing the data & sending it to editpage.js
function rootRoutedecompress(request, response) {
    const row = db.prepare('SELECT umcontents FROM usermanualt ORDER BY umid DESC LIMIT 1').get(); //gets newest added data from db
    console.log(row);
    const compressedData = Buffer.from(row.umcontents, 'base64');
    const decompressedData = zlib.inflateSync(compressedData);
    console.log('decompressedData ' + decompressedData);
    response.send(decompressedData);
}
app.get('/decompressedtext', rootRoutedecompress);
//function for getting date from db
function rootRoutelastedited(request, response) {
    const row = db.prepare('SELECT ldate FROM lastEdited ORDER BY lid DESC LIMIT 1').get();
    console.log(row);
    if (row && row.ldate) {
        const date = new Date(row.ldate);
        date.setHours(date.getHours() + 1); // Adjust for 1 hour difference
        const info = date.toISOString().slice(0, 19).replace('T', ' ');
        response.send(info);
    }
    else {
        response.status(404).send('No data found');
    }
}
app.get('/lasteditedtext', rootRoutelastedited);
// checks if the user is logged in and sends the users role to editpage.js
function rootRouterole(request, response) {
    if (request.session.logedin !== true) {
        response.redirect("/index.html");
        return;
    }
    else if (request.session.lrole) {
        response.json(request.session.lrole);
    }
    else {
        response.json({ message: 'No session data' });
    }
}
app.get('/userroleraw', rootRouterole);
//function for getting data from js & compresses it, also gets when page was last modefied & inserts it to db
function formhandlerfeedback(request, response) {
    const data = '' + (request.body.brukerveiledning);
    try {
        if (typeof data !== 'string' || !data) {
            throw new TypeError('Invalid data: Data must be a non-empty string.');
        }
        const compressedData = zlib.deflateSync(data).toString('base64');
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        // Start a transaction
        const insertTransaction = db.transaction((data1, data2) => {
            const stmt1 = db.prepare('INSERT INTO lastEdited (ldate) VALUES (?)');
            stmt1.run(data1.column1);
            const stmt2 = db.prepare('INSERT INTO usermanualt (umcontents) VALUES (?)');
            stmt2.run(data2.column2);
        });
        // Execute the transaction
        insertTransaction({ column1: formattedDate }, // Data for table1
        { column2: compressedData } // Data for table2
        );
        response.status(201).send("Compressed data sent"); //response created
    }
    catch (error) {
        if (error instanceof TypeError) {
            response.status(400).send('Bad Request: ' + error.message); //client-side error
        }
        else {
            response.status(500).send('Internal Server Error: ' + error.message); //server error
        }
    }
}
app.post('/sendjsonbody', formhandlerfeedback);
// function for uploading the sent file to db
function formhandleruploadfile(request, response) {
    (request.body.filopplastning);
    try {
        const nfsql = db.prepare('INSERT INTO sidenavfile (sffile) VALUES (?)');
        nfsql.run(request.body.filopplastning);
        response.status(201).send("New file uploaded!"); // file sent to db
    }
    catch (error) {
        if (error instanceof TypeError) {
            response.status(400).send('Bad Request: ' + error.message);
        }
        else {
            response.status(500).send('Internal Server Error: ' + error.message);
        }
    }
}
app.post('/sendfilebody', formhandleruploadfile);
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
//# sourceMappingURL=server.js.map