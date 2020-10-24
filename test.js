const express = require("express");
const mysql = require("mysql");
const nodeMailer = require("nodemailer");
const bodyParser = require("body-parser");

// Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "buzios",
  password: "swing102030",
  database: "buzios"
});

// Connect
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected...");
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Create DB
app.get("/createdb", (req, res) => {
  var sql = "CREATE DATABASE nodemysql";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database created...");
  });
});

// Create table
app.get("/createpoststable", (req, res) => {
  var sql =
    "CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Posts table created...");
  });
});

// Insert post 1
app.post("/novoMembro", (req, res) => {
  var nome = req.body.nome;
  var empresa = req.body.empresa;
  var posicao = req.body.posicao;
  var nacionalidade = req.body.nacionalidade;
  var cpf = req.body.cpf;
  var nascimento = req.body.nascimento;
  var email = req.body.email;
  var sql = `INSERT INTO chegada (nome, empresa, posicao, nacionalidade, cpf, nascimento, email) VALUES ("${nome}", "${empresa}", "${posicao}","${nacionalidade}","${cpf}","${nascimento}","${email}")`;
  var query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Post 1 added...");
  });
});

// Insert post 2
app.get("/addpost2", (req, res) => {
  var post = { title: "Post Two", body: "This is post number two" };
  var sql = "INSERT INTO posts SET ?";
  var query = db.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Post 2 added...");
  });
});

// Select posts
app.get("/getposts", (req, res) => {
  var sql = "SELECT * FROM posts";
  var query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

// Select single post
app.post("/getpost/id", (req, res) => {
  var sql = `SELECT * FROM posts WHERE id = ${req.body.id}`;
  var query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Post fetched...");
  });
});

// Update post
app.post("/updatepost/id", (req, res) => {
  var sql = `UPDATE posts SET title = '${req.body.title}', body = '${req.body.body}' WHERE id = ${req.body.id}`;
  var query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Post updated...");
  });
});

// Delete post
app.post("/deletepost", (req, res) => {
  var id = req.body.id;
  //   console.log(id);
  var sql = `DELETE FROM posts WHERE id = ${id}`;
  var query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Post deleted...");
  });
});

app.get('/novo-email', function (req, res) {
  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          // should be replaced with real sender's account
          user: 'migueledias@gmail.com',
          pass: 'Ambiguo#Loop*141206'
      }
  });
  let mailOptions = {
      // should be replaced with real recipient's account
      to: 'tarantula.lan@gmail.com',
      subject: "ISTO E UM EMAIL DE TEST",
      body: "ISTO E UM EMAIL DE TESTE"
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
  res.writeHead(301, { Location: 'index.html' });
  res.end();
});

app.listen("3008", () => {
  console.log("Server started on port 3008");
});
