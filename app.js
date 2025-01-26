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
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "cadastro.html"));
});

app.get("/clientes", (req, res) => {
  const query = `
    SELECT clientes.*, enderecos.endereco, enderecos.cidade, enderecos.estado, enderecos.cep
    FROM clientes
    LEFT JOIN enderecos ON clientes.id = enderecos.cliente_id
    WHERE enderecos.id IN (SELECT MAX(id) FROM enderecos GROUP BY cliente_id)
  `;

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

    const queryEnderecos = "SELECT * FROM enderecos WHERE cliente_id = ?";
    db.query(queryEnderecos, [id], (err, enderecos) => {
      if (err) {
        console.error("Erro ao buscar endereços:", err);
        return res.status(500).send("Erro ao buscar endereços");
      }

      res.render("editar", { cliente: results[0], enderecos });
    });
  });
});

app.post("/cadastro", (req, res) => {
  const {
    nome,
    data_nascimento,
    cpf,
    rg,
    telefone,
    endereco,
    cidade,
    estado,
    cep,
  } = req.body;

  const queryCliente = `
    INSERT INTO clientes (nome, data_nascimento, cpf, rg, telefone)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    queryCliente,
    [nome, data_nascimento, cpf, rg, telefone],
    (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar cliente:", err);
        return res.status(500).send("Erro ao cadastrar cliente");
      }

      const clienteId = result.insertId;

      if (endereco && cidade && estado && cep) {
        const queryEndereco = `
        INSERT INTO enderecos (cliente_id, endereco, cidade, estado, cep)
        VALUES (?, ?, ?, ?, ?)
      `;

        db.query(
          queryEndereco,
          [clienteId, endereco, cidade, estado, cep],
          (err) => {
            if (err) {
              console.error("Erro ao cadastrar endereço:", err);
              return res.status(500).send("Erro ao cadastrar endereço");
            }

            res.redirect("/clientes");
          }
        );
      } else {
        res.redirect("/clientes");
      }
    }
  );
});

app.post("/cliente/:id/enderecos", (req, res) => {
  const { id } = req.params;
  const { endereco, cidade, estado, cep } = req.body;

  const queryEndereco = `
    INSERT INTO enderecos (cliente_id, endereco, cidade, estado, cep)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    queryEndereco,
    [id, endereco, cidade, estado, cep],
    (err, result) => {
      if (err) {
        console.error("Erro ao adicionar o endereço:", err);
        return res.status(500).send("Erro ao adicionar o endereço");
      }

      res.redirect(`/cliente/${id}/editar`);
    }
  );
});

app.put("/cliente/:id", (req, res) => {
  const { id } = req.params;
  const { nome, data_nascimento, cpf, rg, telefone, enderecos } = req.body;

  const queryCliente = `
    UPDATE clientes
    SET nome = ?, data_nascimento = ?, cpf = ?, rg = ?, telefone = ?
    WHERE id = ?
  `;

  db.query(
    queryCliente,
    [nome, data_nascimento, cpf, rg, telefone, id],
    (err) => {
      if (err) {
        console.error("Erro ao atualizar cliente:", err);
        return res.status(500).send("Erro ao atualizar cliente");
      }

      if (enderecos && enderecos.length > 0) {
        enderecos.forEach((endereco) => {
          const queryEndereco = `
          INSERT INTO enderecos (cliente_id, endereco, cidade, estado, cep)
          VALUES (?, ?, ?, ?, ?)
        `;
          db.query(queryEndereco, [
            id,
            endereco.endereco,
            endereco.cidade,
            endereco.estado,
            endereco.cep,
          ]);
        });
      }

      res.redirect(`/cliente/${id}/editar`);
    }
  );
});

app.delete("/endereco/:id", (req, res) => {
  const enderecoId = req.params.id;

  const query = "DELETE FROM enderecos WHERE id = ?";
  db.query(query, [enderecoId], (err) => {
    if (err) {
      console.error("Erro ao deletar o endereço:", err);
      return res.status(500).send("Erro ao deletar o endereço");
    }

    res.redirect(`/cliente/${req.params.id}/editar`);
  });
});

app.delete("/cliente/:id", (req, res) => {
  const clienteId = req.params.id;

  const deleteEnderecosQuery = "DELETE FROM enderecos WHERE cliente_id = ?";

  db.query(deleteEnderecosQuery, [clienteId], (err) => {
    if (err) {
      console.error("Erro ao apagar endereços:", err);
      return res.status(500).send("Erro ao apagar endereços");
    }

    const deleteClienteQuery = "DELETE FROM clientes WHERE id = ?";
    db.query(deleteClienteQuery, [clienteId], (err) => {
      if (err) {
        console.error("Erro ao deletar o cliente:", err);
        return res.status(500).send("Erro ao deletar o cliente");
      }

      res.redirect("/clientes");
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
