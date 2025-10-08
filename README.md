# EMAIL CLASSIFICATION

Um projeto desenvolvido para **automatizar a leitura e classificação de e-mails corporativos** usando **inteligência artificial**, separando mensagens **produtivas** (que exigem ação ou resposta) de **improdutivas** (como agradecimentos, notificações ou correntes).

## A interface
![Image](https://github.com/user-attachments/assets/1c0ae3eb-886f-4368-8e86-2d99f0fcf4e9)

![Image](https://github.com/user-attachments/assets/bf926e9d-f0a1-41df-ae95-7ad4757026b0)

## 🎯 Objetivo do Projeto

O **Email Classifier AI** foi criado para demonstrar o uso de **modelos de linguagem (LLMs)** aplicados à classificação de textos reais no contexto empresarial. A aplicação processa e-mails recebidos (como texto ou arquivo `.txt`/`.pdf`) e, utilizando a **API da OpenAI**, identifica:

- **Categoria:** `Produtivo` ou `Improdutivo`  
- **Confiança:** valor numérico entre 0 e 1  
- **Resposta sugerida:** mensagem em português com tom profissional  


## 🚀 Desafio

Este projeto foi desenvolvido como parte do **Desafio AutoU**, cujo objetivo era criar uma aplicação prática de IA que:

- Consuma um **modelo de linguagem** via API,  
- Tenha **interface web interativa**,  
- Exiba **resultados em tempo real**,  
- E demonstre **integração entre frontend (React)** e **backend (FastAPI)**.

## ⚙️ Funcionalidades

### ✅ Etapas Funcionais

- Upload de e-mails em `.txt` e `.pdf`  
- Envio de texto manual via formulário  
- Conexão com a **API da OpenAI**  
- Classificação de e-mails (`Produtivo` / `Improdutivo`)  
- Geração automática de resposta em português  
- Layout responsivo com **React** e **CSS customizado**  

### ⚠️ Etapas em Desenvolvimento

- Sistema de autenticação de usuários  
- Armazenamento do histórico em banco de dados  
- Testes automatizados (`pytest`)  
- Deploy contínuo via **GitHub Actions + Render/Vercel**

## 🧰 Tecnologias e Frameworks

| Tecnologia | Função | Motivo da Escolha |
|-------------|--------|------------------|
| **FastAPI** | Backend / API REST | Desempenho, tipagem forte e integração simples com Pydantic |
| **OpenAI Python SDK** | Integração com LLM | Cliente oficial com suporte JSON |
| **React (CRA + CRACO)** | Frontend interativo | Framework moderno e modular (é o que achei interessante) |
| **Uvicorn** | Servidor ASGI | Leve e rápido para desenvolvimento e deploy |
| **CORS Middleware** | Comunicação frontend-backend | Necessário para integração local |
| **pdfminer.six** | Leitura de arquivos PDF | Extração de texto leve e eficaz |
| **GitHub Actions** | CI/CD | Automação de build e testes |
| **Tailwind / CSS customizado** | Estilização | Criação de UI responsiva e elegante |

---

## 🧠 API Utilizada

### 🔹 OpenAI Chat Completions API

A aplicação utiliza a rota `client.chat.completions.create()` da **OpenAI** para realizar a classificação dos textos.

**Configurações principais:**
- **Modelo padrão:** `gpt-4o-mini` (fallback: `gpt-3.5-turbo`)  
- **Temperatura:** `0.2` — prioriza consistência nas respostas  
- **Formato:** JSON estruturado  
- **Campos retornados:**
  - `category` — `Produtivo` ou `Improdutivo`
  - `confidence` — valor entre `0` e `1`
  - `suggested_response` — resposta curta e educada em português  

**Prompt utilizado:**
O prompt do sistema orienta o modelo a classificar o e-mail com base em indícios linguísticos e regras específicas, assegurando consistência e tom profissional.

---

## 🔐 Variáveis de Ambiente

As chaves de API não devem ser expostas no código.  
Crie um arquivo `.env` na raiz do projeto:

```bash
foo@bar:~$ OPENAI_API_KEY=sk-xxxxxxx
foo@bar:~$ OPENAI_MODEL=gpt-4o-mini
```
- Para rodar o front, é necessário estar na pasta `/src`:
  
```bash
foo@bar:~$ cd src
foo@bar:~$ npm install
foo@bar:~$ npm start
```

## 🧮 Status de uso 

| Componente               | Estado          | Descrição                             |
| ------------------------ | --------------- | ------------------------------------- |
| 🧠 API OpenAI            | ✅ Funcional     | Classificação e resposta automática   |
| 🧱 Backend (FastAPI)     | ✅ Funcional     | Endpoint `/process` ativo             |
| 💻 Frontend (React)      | ✅ Funcional     | Interface e interação com API         |
| 📁 Upload de arquivos    | ✅ Funcional     | Aceita `.txt` e `.pdf`                |
| 🔒 Variáveis de ambiente | ✅ Implementado  | Ocultas via `.env` e GitHub Secrets   |
| ☁️ Deploy                | ⚙️ Em andamento | Configuração CI/CD via GitHub Actions |
| 🧪 Testes automatizados  | 🚧 Pendente     | Implementação com `pytest` e mock API |



## 

<div align="center">

**Ana Karolina Costa da Silva**  
*Mestranda em Informática — PUC-Rio*  
*Engenharia de Computação — IFCE*  
*October, 2025*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/karolyneehcs)
[![GitHub](https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/wtfkar0l)

</div>
