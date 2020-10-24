const express = require("express");
const mysql = require("mysql");
const moment = require("moment");
const nodeMailer = require("nodemailer");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const Vessel = require("./models/Vessel");
const Windy = require("./models/Windy");
const path = require("path");
require("dotenv").config();

const m = moment();
const amanha = m.add(1, "day").format("DD/MM/YYYY");

// Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
});

// Connect
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected...");
});

connectDB();

// Start Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Init Middleware
app.use(express.json({ extended: false }));

// ## AQUI COMECA A SERVIR OS ARQUIVOS ESTATICOS DA RAIZ /
// Serve the static files from the React app
app.use(express.static(path.join("/home/snoopsis/nodeSites/buzios/build")));

// ## COMECA A API E PRECISA ESTAR ANTES DE DEIXARMOS AS CHAMADAS PARA OS ROUTES DINAMICAS
app.get("/buzios/details", (req, res) => {
  Vessel.find()
    .sort({ date: -1 })
    .limit(1)
    .then(detail => res.json(detail));
});

// app.get("/buzios/condicoes", (req, res) => {
//   Windy.find()
//     .sort({ date: -1 })
//     .limit(5)
//     .then((detail) => res.json(detail));
// });

app.get("/api/voos", (req, res) => {
  let sql = "SELECT * FROM voos WHERE procedencia LIKE '%SKBU%'";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// app.get("/api/voos/futuros", (req, res) => {
//   let sql = "SELECT * FROM voos WHERE data >= '" + amanha + "'";
//   let query = db.query(sql, (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

app.get("/api/previsao", (req, res) => {
  let sql = "SELECT * FROM previsao";
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Inserir Recem Chegado no Buzios
app.post("/novoMembro", function(req, res) {
  var nome = req.body.nome;
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
      user: process.env.USEREMAIL,
      pass: process.env.SENHAEMAIL
    }
  });

  // let transporter = nodeMailer.createTransport({
  //   host: "smtp.sendgrid.net",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     // should be replaced with real sender's account
  //     user: "apikey",
  //     pass:
  //       process.env.SENDGRIDKEY
  //   }
  // });

  let mailOptions = {
    // should be replaced with real recipient's account
    from: "radiooper@buzios.dof.no",
    to: "skb.radio@technipfmc.com",
    bcc: "radiooper@buzios.dof.no",
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
      `
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
  });
});

// ## AQUI DEIXA TODOS OS ROUTES DO APP DINAMICOS MENOS OS DA API EM CIMA
// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join("/home/snoopsis/nodeSites/buzios/build/index.html"));
});

const port = 6010;

app.listen(port, function() {
  console.log(`Server running on port ${port}`);
});
