const { Pool } = require('pg');

// The connection pool will be configured using the
// configured environment variables.
const pool = new Pool();

async function getRandomMeme() {
    const res = await pool.query('SELECT url FROM memes ORDER BY RANDOM() LIMIT 1');
    return res.rows[0]?.url || "https://media.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif";
}

module.exports = {
    getRandomMeme
};
