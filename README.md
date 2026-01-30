# 🌦️ AtmosInsight

![](https://img.shields.io/badge/Status-Em%20desenvolvimento-green)
![](https://img.shields.io/github/commit-activity/t/Sacul-Lucas/AtmosInsight?color=green)
![](https://img.shields.io/github/contributors/Sacul-Lucas/AtmosInsight?color=green)

Plataforma full-stack para coleta, processamento, análise e visualização de dados climáticos, com geração de insights inteligentes, arquitetura baseada em microsserviços, mensageria e foco em performance, escalabilidade e experiência do usuário.

O sistema permite que o usuário altere dinamicamente a localização de interesse para visualizar dados climáticos históricos, atuais e tendências, sem acoplamento direto ao usuário — garantindo maior flexibilidade, reutilização de dados e eficiência.

Este projeto foi desenvolvido inicialmente como parte de um desafio técnico e posteriormente refinado para compor o portfólio profissional, com foco em boas práticas de engenharia de software.

# 🧭 Visão geral da arquitetura

Fluxo completo de dados:

          API Clima (Open-Meteo)
                    ↓
         Serviço Python (Producer)
                    ↓
         Message Broker (RabbitMQ)
                    ↓
           Worker Go (Consumer)
                    ↓
               API NestJS
                    ↓
                 MongoDB
                    ↓
         Frontend (React Dashboard)

Principais características arquiteturais:

- Arquitetura orientada a eventos

- Processamento assíncrono via fila

- Separação clara de responsabilidades por serviço

- Infraestrutura totalmente containerizada com Docker Compose

- Base preparada para escalar horizontalmente

# :hammer: Funcionalidades do projeto

🌍 Localizações (Locations)

- `Gerenciamento de localizações:` criação, listagem, edição e remoção de localizações

- `Desacoplamento de usuários:` localizações não estão atreladas a usuários específicos

- `Alta reutilização de dados:` múltiplos usuários podem consultar a mesma localização

- `Troca dinâmica:` o usuário escolhe a localização para visualizar os dados e insights


🌦️ Coleta e processamento de dados climáticos

- `Coleta periódica:` serviço em Python coleta dados climáticos em intervalos configuráveis

- `Dados coletados (exemplos):`

  - Temperatura

  - Umidade

  - Velocidade do vento

  - Condição do céu

  - Probabilidade de chuva

- `Normalização dos dados:` antes do envio à fila

- `Mensageria:` envio dos dados em formato JSON para o Message Broker


📨 Fila e Worker (Go)

- `Consumo de mensagens:` worker em Go consome dados climáticos da fila

- `Validação e transformação:` garante integridade e consistência

- `Integração com API:` envio dos dados para a API NestJS

- `Controle de fluxo:` ack / nack e retry básico

- `Logs:` registro das operações principais para observabilidade


🧠 Insights e análise inteligente (em desenvolvimento)

- `Geração de insights baseada em dados históricos`

- `Cálculos estatísticos:`

  - Média de temperatura e umidade

  - Tendência climática (subida/queda)

- `Classificação climática:`

  - Frio, agradável, quente, extremo

  - Alertas inteligentes:

  - Alta chance de chuva

  - Calor extremo

  - Frio intenso

- `Resumos textuais automáticos (exemplo):` “Nos últimos 3 dias, a temperatura média foi de 27°C, com tendência de aumento.”

💡 A camada de IA foi pensada para ser extensível, permitindo futuramente integração com modelos de linguagem ou serviços externos.


🧑‍💻 Usuários e autenticação

- `CRUD completo de usuários`

- `Autenticação JWT`

- `Rotas protegidas`

- `Criptografia de senhas`

- `Usuário padrão:` criado automaticamente na inicialização via variáveis de ambiente

📊 Dashboard (Frontend - em desenvolvimento)

- `Dashboard climático interativo`

- `Cards principais:`

  - Temperatura atual

  - Umidade

  - Vento

  - Condição climática

- `Gráficos históricos:`

  - Temperatura ao longo do tempo

  - Probabilidade de chuva

- `Tabela de registros climáticos`

- `Insights em destaque`

- `Troca de localização em tempo real`

- `Feedback visual:` loading, erro e sucesso

📁 Exportação de dados (em desenvolvimento)

- `Exportação CSV`

- `Exportação XLSX`

- `Download direto via Dashboard`


🌐 Integração com API pública (em desenvolvimento)

- `Consumo de API pública paginada`

- `Backend atua como intermediário`

- `Paginação e detalhe de itens`

- `Página dedicada no frontend`


# 🐳 Infraestrutura e execução

📦 Pré-requisitos

- Docker

- Docker Compose


# ▶️ Executando o projeto localmente

    # Clone o repositório
    git clone https://github.com/Sacul-Lucas/AtmosInsight.git

    # Acesse a pasta do projeto
    cd AtmosInsight

    # Suba toda a stack
    docker compose --profile dev --env-file .env.dev up --build

Após a inicialização:

- Frontend: http://localhost:1000

- API NestJS: http://localhost:1500

- RabbitMQ (se aplicável): http://localhost:5672

⚠️ Todas as variáveis de ambiente estão documentadas no arquivo `.env`.

# 🛠️ Tecnologias e ferramentas utilizadas
Frontend

- `React`

- `Vite`

- `TypeScript`

- `Tailwind CSS`

- `shadcn/ui`

- `Axios`

- `Chart.js / Recharts`

Backend

- `NestJS`

- `TypeScript`

- `MongoDB`

- `JWT`

- `CSV / XLSX Export`

Dados e mensageria

- `Python (requests / httpx)`

- `Go`

- `RabbitMQ ou Redis`

Infraestrutura

- `Docker`

- `Docker Compose`

# 🧪 Boas práticas aplicadas

- `Separação clara de responsabilidades`

- `Validação de dados`

- `Tratamento de erros`

- `Logs por serviço`

- `Padronização de commits`

- `Tipagem forte (TypeScript)`

- `Código preparado para escalabilidade`

# 🎯 Objetivo do projeto no portfólio

Este projeto demonstra competências em:

- `Arquitetura distribuída`

- `Integração entre múltiplas linguagens`

- `Processamento assíncrono`

- `Engenharia de dados`

- `Desenvolvimento full-stack moderno`

- `Design de APIs`

- `Experiência do usuário`

- `Boas práticas de engenharia`

# 👤 Autor
<img loading="lazy" src="https://github.com/user-attachments/assets/f0edeae3-bd26-463a-b051-919b4d2dd5b8" width=115><br><sub>Lucas de Matos</sub>
