const express = require("express");
const mysql = require("mysql");
const moment = require("moment");
const nodeMailer = require("nodemailer");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const Vessel = require("./models/Vessel");
const Windy = require("./models/Windy");

// Confs para HTTPS
// var fs = require('fs')
// var https = require('https')

const m = moment();
const amanha = m.add(1, "day").format("DD/MM/YYYY");

// Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "buzios",
  password: "swing102030",
  database: "buzios",
});

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected...");
});

// Start Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// serve the react app files
app.use(express.static(`/home/snoopsis/nodeSites/buzios/build`));

connectDB();

app.get("/buzios/details", (req, res) => {
  Vessel.find()
    .sort({ date: -1 })
    .limit(1)
    .then((detail) => res.json(detail));
});

app.get("/buzios/condicoes", (req, res) => {
  Windy.find()
    .sort({ date: -1 })
    .limit(5)
    .then((detail) => res.json(detail));
});

app.get("/api/voos", (req, res) => {
  let sql = "SELECT * FROM voos WHERE procedencia LIKE '%SKBU%'";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get("/api/voos/futuros", (req, res) => {
  let sql = "SELECT * FROM voos WHERE data >= '" + amanha + "'";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get("/api/previsao", (req, res) => {
  let sql = "SELECT * FROM previsao";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Inserir Recem Chegado no Buzios
app.post("/novoMembro", function (req, res) {
  var nome = req.body.nome + " " + req.body.sobrenome;
  var empresa = req.body.empresa;
  var posicao = req.body.funcao;
  var nacionalidade = req.body.nacionalidade;
  var cpf = req.body.cpf;
  var nascimento = req.body.nascimento;
  var email = req.body.email;
  var genero = req.body.genero;
  var celular = req.body.celular;
  var nok_nome = req.body.nok_nome;
  var nok_tel = req.body.nok_cel;
  var sql = `INSERT INTO chegada (nome, empresa, posicao, nacionalidade, cpf, nascimento, email, genero, celular, nok_nome, nok_tel) VALUES
    ("${nome}", "${empresa}", "${posicao}","${nacionalidade}","${cpf}","${nascimento}","${email}","${genero}","${celular}","${nok_nome}","${nok_tel}")`;
  var query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Post 1 added...");
  });

  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // should be replaced with real sender's account
      user: "migueledias@gmail.com",
      pass: "Chapeu#Branco*141206",
    },
  });
  let mailOptions = {
    // should be replaced with real recipient's account
    to: "contato@migueldias.net",
    bcc: "tarantula.lan@gmail.com",
    subject: `Novo Cadastro de ${nome}`,
    html: `<p>Chegada de novo Colaborador, seguem informacoes: </p><br />
      <strong>Nome: </strong>${nome} <br />
      <strong>Empresa: </strong>${empresa} <br />
      <strong>Posicao: </strong>${posicao} <br />
      <strong>Nacionalidade: </strong>${nacionalidade} <br />
      <strong>Genero: </strong>${genero} <br />
      <strong>Cpf: </strong>${cpf} <br />
      <strong>Nascimento: </strong>${nascimento} <br />
      <strong>Celular: </strong>${celular} <br />
      <strong>Email: </strong>${email} <br />
      <br />
      <h6>Contato de Emergencia:</h6>
      <br />
      <strong>NOK Nome: </strong>${nok_nome} <br />
      <strong>NOK Telefone: </strong>${nok_tel} <br />
      `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
  });

});

// app.post('/novo-email', function (req, res) {
//   var nome = req.body.nome;
//   var empresa = req.body.empresa;
//   var posicao = req.body.posicao;
//   var nacionalidade = req.body.nacionalidade;
//   var cpf = req.body.cpf;
//   var nascimento = req.body.nascimento;
//   var email = req.body.email;
//   var genero = req.body.genero;
//   var local_nascimento = req.body.local_nascimento;
//   var nok_nome = req.body.nok_nome;
//   var nok_tel = req.body.nok_tel;
//   let transporter = nodeMailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//           // should be replaced with real sender's account
//           user: 'migueledias@gmail.com',
//           pass: 'Ambiguo#Loop*141206'
//       }
//   });
//   let mailOptions = {
//       // should be replaced with real recipient's account
//       to: 'buzios.radiooper@buzios.dof.no',
//       bcc: 'tarantula.lan@gmail.com',
//       subject: `Novo Cadastro de ${nome}`,
//       html: `<p>Chegada de novo Colaborador, seguem informacoes: </p><br />
//       <strong>Nome: </strong>${nome} <br />
//       <strong>Empresa: </strong>${empresa} <br />
//       <strong>Posicao: </strong>${posicao} <br />
//       <strong>Nacionalidade: </strong>${nacionalidade} <br />
//       <strong>Genero: </strong>${genero} <br />
//       <strong>Cpf: </strong>${cpf} <br />
//       <strong>Nascimento: </strong>${nascimento} <br />
//       <strong>Local de Nascimento: </strong>${local_nascimento} <br />
//       <strong>Email: </strong>${email} <br />
//       <br />
//       <h6>Contato de Emergencia:</h6>
//       <br />
//       <strong>NOK Nome: </strong>${nok_nome} <br />
//       <strong>NOK Telefone: </strong>${nok_tel} <br />
//       `
//   };
//   transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//           return console.log(error);
//       }
//       console.log('Message %s sent: %s', info.messageId, info.response);
//   });
//   res.end();
// });

const port = 6010;

app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});

// Confs para HTTPS
// https.createServer(
//   {
//     key: fs.readFileSync("server.key"),
//     cert: fs.readFileSync("server.cert")
//   },
//   app).listen(port, function() {
//     console.log(`Server running on port ${port}`);
//   })



