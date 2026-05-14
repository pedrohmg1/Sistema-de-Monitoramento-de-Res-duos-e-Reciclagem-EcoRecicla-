# EcoRecicla - Sistema de Monitoramento de Resíduos e Reciclagem

O **EcoRecicla** é uma solução completa para o gerenciamento e monitoramento de descartes e processos de reciclagem. Desenvolvido com uma arquitetura moderna dividida entre um backend robusto em Java e um frontend dinâmico em React, o sistema foca na simplicidade e eficiência para operações de controle de resíduos.

[print] ## 🚀 Funcionalidades Principais

O sistema opera sobre um modelo CRUD completo para a gestão de registros:

* **Cadastro de Resíduos**: Adição de novos registros detalhados de descarte.
* **Listagem em Tempo Real**: Visualização de todos os resíduos monitorados.
* **Edição de Registros**: Atualização rápida de informações já cadastradas.
* **Exclusão Segura**: Remoção de registros do banco de dados.

## 🛠 Tecnologias e Ferramentas

### Backend
* **Linguagem**: Java 17
* **Framework**: Spring Boot (WebMVC)
* **Persistência**: Spring Data MongoDB
* **Gerenciador de Dependências**: Maven

### Frontend
* **Framework**: React 19
* **Tooling**: Vite
* **Linguagem**: TypeScript
* **Estilização & Ícones**: Lucide React
* **Comunicação**: Axios

## ⚙️ Pré-requisitos

Para rodar o projeto localmente, você precisará de:
1.  **JDK 17** ou superior.
2.  **Node.js** (v18+ recomendado).
3.  **Maven** instalado e configurado no PATH.
4.  **MongoDB** rodando localmente (porta padrão 27017).

## 💻 Configuração e Execução

### 1. Backend (API)

O backend utiliza o arquivo `application.properties` para configurações de ambiente.

1.  Acesse a pasta do servidor:
    ```bash
    cd backend
    ```
2.  Certifique-se de que o seu MongoDB está ativo.
3.  Verifique o arquivo `src/main/resources/application.properties`:
    ```properties
    server.port=8080
    spring.data.mongodb.uri=mongodb://localhost:27017/ecorecicla
    ```
4.  Execute a aplicação:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

[print] ### 2. Frontend (Web)

A URL de conexão está configurada diretamente na constante `API_URL` no código do cliente.

1.  Acesse a pasta da interface:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Acesse `http://localhost:5173` no seu navegador.

[print] ---
*Desenvolvido para facilitar a gestão ambiental e promover a sustentabilidade.*
