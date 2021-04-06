const path = require('path')
const sqlite = require('sqlite3').verbose()

const db = new sqlite.Database(path.join(path.dirname(require.main.filename), 'backend', 'data', 'data.db'), (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('db opened successfully')
    }
})


const seed = () => {
    db.serialize(() => {

        db.get(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = $name`, {
            $name: 'Users'
        }, (err, row) => {

            if (!err && !row) {
                db.serialize(() => {
                    db.run(`CREATE TABLE Users (id INTEGER PRIMARY KEY, name TEXT, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);`)
                    db.run(`INSERT INTO Users (name, email, password) VALUES ('Test User', 'test@hlg.edu', '$2b$12$Wpe7/lQ9Lyz3nKPljOLjS.26ZWRozLBbb9q1JVj/EU4MprxIA4o9y');`)
                })
            }

        })

        // check for other tables needed
    });
}

seed()

module.exports = db