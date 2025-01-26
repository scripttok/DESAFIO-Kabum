### DESAFIO-Kabum

# Como execultar o programa

# Projeto de Cadastro de Clientes

Este projeto é uma aplicação web para gerenciar clientes, com funcionalidades de cadastro, edição e remoção.Um teste para a empresa Kabum a quem adreço por poder participar deste projeto. Ele utiliza Node.js no backend, MySQL como banco de dados e Docker.

## Tecnologias Utilizadas
- Node.js
- Express
- MySQL
- Docker
- HTML, CSS, JavaScript

## Requisitos
Certifique-se de ter os seguintes itens instalados no seu sistema:

1. [Docker](https://www.docker.com/)
2. [Docker Compose](https://docs.docker.com/compose/)
3. Node.js (v14 ou superior)
4. npm (gerenciador de pacotes do Node.js)

## Passos para Rodar o Projeto Localmente

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Configurar o Banco de Dados

Certifique-se de que o Docker esteja em execução e configure o banco de dados usando o arquivo `docker-compose.yml`.

#### Conteúdo do `docker-compose.yml`:

```yaml
services:
  db:
    image: mysql:5.7
    container_name: mysql-db
    environment:
      MYSQL_ROOT_PASSWORD: 12345
      MYSQL_DATABASE: mybanc
      MYSQL_USER: xablau
      MYSQL_PASSWORD: 12345
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
    driver: local
```

Inicie o contêiner do MySQL com:

```bash
docker-compose up -d
```

O banco de dados estará acessível em `localhost:3306` com as credenciais:
- Usuário: `xablau`
- Senha: `12345`
- Banco de Dados: `mybanc`

### 3. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=xablau
DB_PASSWORD=12345
DB_NAME=mybanc
PORT=3000
```

### 4. Instalar Dependências

Instale as dependências do projeto com o seguinte comando:

```bash
npm install
```

### 5. Executar as Migrações do Banco de Dados

Certifique-se de que o banco de dados está rodando e execute as migrações para criar as tabelas necessárias:

```bash
npm run migrate
```

### 6. Iniciar o Servidor

Inicie o servidor Node.js com o seguinte comando:

```bash
node app.js
```

O projeto estará rodando em `http://localhost:3000`.

### 7. Testar a Aplicação

- Acesse a página inicial: `http://localhost:3000`
- Cadastre clientes, edite informações e gerencie endereços na interface.

