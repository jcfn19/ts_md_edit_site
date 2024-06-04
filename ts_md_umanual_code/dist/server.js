import express from 'express';
const app = express();
import sqlite3 from 'better-sqlite3';
const db = sqlite3('brukerveiledning.db', { verbose: console.log });
import session from 'express-session';
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
app.use(express.static(publicDirectoryPath));
app.use(express.static(path.join(__dirname, '../dist')));
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
function rootRouterole(request, response) {
    if (request.session.logedin !== true) {
        response.redirect("/index.html");
        return;
    }
    else {
        const sql = db.prepare('SELECT * FROM users WHERE user.uuserrole');
        const info = sql.all();
        response.send(info);
    }
}
app.get('/userroleraw', rootRouterole);
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
//# sourceMappingURL=server.js.map