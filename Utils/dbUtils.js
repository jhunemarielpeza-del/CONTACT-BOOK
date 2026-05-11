const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

const readDB = async () => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], contacts: [] };
  }
};

const writeDB = async (data) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

module.exports = { readDB, writeDB };