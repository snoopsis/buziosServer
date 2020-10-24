const express = require('express');
const mysql = require('mysql');
const ipfilter = require('express-ipfilter').IpFilter;

// Whitelist the following IPs
const ips = ['::ffff:62.97.206.20'];


// Create connection
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'euvcml1112',
  database : 'buzios'
});

// Connect
db.connect((err) => {
  if(err){
      throw err;
  }
  console.log('MySql Connected...');
});

// Start Express
const app = express();

// Create the server
app.use(ipfilter(ips, { mode: 'allow' }));

app.get('/api/status', (req, res) => {
  let sql = 'SELECT * FROM helideck WHERE id = 2';
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      res.json(results);
    });
  });


const port = 6015;

app.listen(port, function () { console.log(`Server running on port ${port}`); });
