const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const db = mysql.createConnection({
  host: "localhost",
  user: "xablau",
  password: "12345",
  database: "mybanc",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "cadastro.html"));
});

app.post("/cadastro", (req, res) => {
  const { nome, data_nascimento, cpf, rg, telefone } = req.body;

  const query = `
    INSERT INTO clientes (nome, data_nascimento, cpf, rg, telefone)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nome, data_nascimento, cpf, rg, telefone],
    (err, results) => {
      if (err) {
        console.error("Erro ao salvar os dados:", err);
        return res.status(500).send("Erro ao salvar os dados");
      }
      console.log("Cliente cadastrado com sucesso:", results);
      res.redirect("/clientes");
    }
  );
});

app.get("/clientes", (req, res) => {
  const query = "SELECT * FROM clientes";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar os clientes:", err);
      return res.status(500).send("Erro ao buscar os clientes");
    }

    res.render("clientes", { clientes: results });
  });
});

app.get("/cliente/:id/editar", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM clientes WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar cliente:", err);
      return res.status(500).send("Erro ao buscar cliente");
    }

    res.render("editar", { cliente: results[0] });
  });
});

app.put("/cliente/:id", (req, res) => {
  const { id } = req.params;
  const { nome, data_nascimento, cpf, rg, telefone } = req.body;

  const query = `
    UPDATE clientes
    SET nome = ?, data_nascimento = ?, cpf = ?, rg = ?, telefone = ?
    WHERE id = ?
  `;

  db.query(query, [nome, data_nascimento, cpf, rg, telefone, id], (err) => {
    if (err) {
      console.error("Erro ao atualizar cliente:", err);
      return res.status(500).send("Erro ao atualizar cliente");
    }

    res.redirect("/clientes");
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
