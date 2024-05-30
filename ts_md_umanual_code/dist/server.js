import express from 'express';
const app = express();
import sqlite3 from 'better-sqlite3';
const db = sqlite3('brukerveiledning.db', { verbose: console.log });
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
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
//# sourceMappingURL=server.js.map