
const { Client } = require('pg');
const client = new Client({
  host: 'db',
  port: 5432,
  user: 'gabriel',
  password: 'gabriel12',
  database: 'ca_backengine'
});

client.connect(err => {
  if (err) {
    console.error('Connection error:', err.stack);
  } else {
    console.log('Connected to the database');
    client.end();
  }
});

