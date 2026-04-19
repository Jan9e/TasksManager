const {Pool}  = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "tasksmanager",
    password: "secret",
    port: 5432,
});

module.exports = pool;