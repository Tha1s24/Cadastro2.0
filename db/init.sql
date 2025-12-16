-- Cria o banco e a tabela para o exemplo de cadastro
CREATE DATABASE IF NOT EXISTS cadastros_db;
USE cadastros_db;

-- =========================
-- Tabela: users
-- =========================
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  telefone VARCHAR(50),
  senha VARCHAR(255) NOT NULL, -- para armazenar hash da senha
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);