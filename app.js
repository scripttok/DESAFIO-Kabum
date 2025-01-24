const express = require("express");
const app = express();
const path = require("path");

// const cadastrado = document.querySelector("#cadastrar");
// console.log(cadastrado);

// Rota para servir a página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html")); // Caminho absoluto para o arquivo home.html
});

// Rota para servir a página de usuário
app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "user.html"));
});

app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "cadastro.html"));
});

// Inicializando o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
