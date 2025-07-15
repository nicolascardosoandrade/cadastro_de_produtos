-- Criação do banco de dados
CREATE DATABASE cadastro_produtos;

-- Seleciona o banco para uso
USE cadastro_produtos;

-- Criação da tabela de produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

use cadastro_produtos
select*from produtos