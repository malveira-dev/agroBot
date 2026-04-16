# 🤖 AgroBot - Assistente de Inteligência para o Agronegócio

O **AgroBot** é um fluxo de automação construído no [n8n](https://n8n.io/) projetado para atuar como um assistente de inteligência de mercado para o agronegócio brasileiro, operando diretamente pelo WhatsApp. Ele responde a dúvidas de produtores, traders e analistas sobre cotações de commodities, previsões meteorológicas e realiza conversões de medidas agrícolas padrão.

## 📋 Visão Geral

Este workflow recebe mensagens de uma integração com o WhatsApp (via Evolution API), identifica se a mensagem é de texto ou de áudio (realizando a transcrição automática, se necessário) e processa a solicitação utilizando um Agente de Inteligência Artificial (OpenAI). Por fim, ele envia a resposta de volta ao usuário e marca a mensagem como lida.

## ✨ Principais Funcionalidades

* **Atendimento Omnichannel (Texto e Áudio):** Suporta mensagens de texto normais e transcreve mensagens de voz automaticamente usando o Whisper da OpenAI.
* **Inteligência de Mercado:** Consulta em tempo real preços e cotações de commodities agrícolas (soja, milho, boi gordo, etc.) via sub-workflow.
* **Previsão do Tempo:** Consulta dados climáticos para qualquer região do Brasil.
* **Conversão de Medidas Nativas:** O próprio bot é instruído a calcular conversões úteis (ex: Alqueires para Hectares, Sacas para Kg, Arroba para Kg de carcaça).
* **Memória de Conversa:** Mantém o contexto da conversa baseado no número de telefone do usuário.

---

## ⚙️ Arquitetura do Fluxo (Como Funciona)

O fluxo é dividido nas seguintes etapas lógicas:

1. **Webhook (Entrada):** Recebe o payload (dados) das mensagens enviadas pelo WhatsApp.
2. **Tratamento de Dados (`Dados`):** Extrai as variáveis vitais como `mensagem`, `telefoneUsuario`, `nomeUsuario`, `IdMensagem`, `instancia` e `tipoMensagem`.
3. **Roteamento (`Switch`):**
    * Se for **Texto** (`conversation`): Vai direto para o processamento do Agente de IA.
    * Se for **Áudio** (`audioMessage`):
        1. Faz o download do áudio base64 pela Evolution API.
        2. Converte o arquivo de base64 para binário.
        3. Envia para a OpenAI realizar a transcrição (`Transcrever áudio`).
        4. Substitui a variável `mensagem` pelo texto transcrito (`Set mensagem.`).
4. **Processamento da IA (`AgroBot`):**
    * Usa um **Agente LangChain** alimentado pelo modelo `gpt-4.1-mini` da OpenAI.
    * Injeta um *System Prompt* detalhado com a persona do AgroBot.
    * Acessa o histórico da conversa (`Simple Memory`).
    * Pode invocar **Ferramentas (Tools)** baseadas em outros fluxos do n8n:
        * `consultar_preco`: Aciona o sub-workflow para buscar cotações na CONAB/CEPEA.
        * `consultar_previsão_tempo`: Aciona o sub-workflow para buscar dados no Open-Meteo.
5. **Ações Finais:**
    * `Marcar mensagens como lidas`: Sinaliza na API do WhatsApp que a mensagem foi processada.
    * `Enviar texto`: Devolve a resposta final gerada pela IA para o número de WhatsApp do usuário.

---

## 🔑 Dependências e Credenciais Necessárias

Para que este workflow funcione corretamente, você precisará configurar as seguintes credenciais no seu n8n:

* **Evolution API:** Necessária para comunicação com o WhatsApp (Download de mídia, envio de mensagens e marcação de leitura).
    * *Credencial no fluxo:* `Evolution account`.
* **OpenAI API:**
    * Necessária para o cérebro do Agente (LLM Chat) e para a transcrição de áudios (Whisper).
    * *Credencial no fluxo:* `OpenAi account`.
* **Sub-Workflows:**
    * É obrigatório ter os seguintes fluxos (workflows) ativos no mesmo ambiente n8n para que as ferramentas do agente funcionem:
        * ID `lccevabohCqJvYyf` (Consultar preço)
        * ID `7JDh5tISb1rpyleD` (Previsão de tempo)

---

## 🛠️ Detalhes Técnicos dos Nós

Abaixo está o resumo dos nós e suas operações específicas:

| Nome do Nó | Tipo | Operação/Configuração Principal |
| :--- | :--- | :--- |
| **Webhook** | `n8n-nodes-base.webhook` | Método POST no path `/agrobot`. |
| **Dados** | `n8n-nodes-base.set` | Define variáveis globais puxando os dados do JSON (`body.data.message.conversation`, etc). |
| **Switch** | `n8n-nodes-base.switch` | Regras de validação baseadas no campo `tipoMensagem`. |
| **Download áudio** | `evolutionApi` | Operação: `get-media-base64` com conversão para MP4 habilitada. |
| **Transcrever áudio** | `langchain.openAi` | Recurso: `audio` / Operação: `transcribe` (Idioma: `pt`). |
| **AgroBot** | `langchain.agent` | Nó central. Usa prompt dinâmico definido em `options.systemMessage`. |
| **OpenAI Chat Model** | `langchain.lmChatOpenAi` | Modelo: `gpt-4.1-mini`. |
| **Simple Memory** | `langchain.memoryBufferWindow` | Chave da sessão: `{{ $('Dados').item.json.telefoneUsuario }}`. |
| **consultar_preco** | `langchain.toolWorkflow` | Aciona fluxo externo passando a *commodity* e *data* (opcional). |
| **consultar_previsão_tempo**| `langchain.toolWorkflow` | Aciona fluxo externo passando *cidade* e *estado* (UF). |
| **Marcar mensagens como lidas** | `evolutionApi` | Operação: `read-messages` vinculada ao `IdMensagem`. |
| **Enviar texto** | `evolutionApi` | Operação: Envio simples de texto utilizando o output do nó AgroBot. |

---

## 📝 Persona e Prompt do Agente

O comportamento do bot é ditado pelas diretrizes abaixo configuradas nativamente no nó do agente:

* **Tom:** Direto, amigável e confiável (sem jargões técnicos de programação).
* **Formato de Saída:** Respostas curtas (máx. 5 linhas), formatadas em PT-BR (ex: R$ 1.250,00), informando sempre a fonte dos dados e a data. **Sem uso de formatação Markdown** para garantir renderização perfeita no WhatsApp.
* **Limitações Inseridas:** Proibido dar recomendações financeiras de compra/venda. Foco restrito ao agronegócio.

---

## 🚀 Como Rodar o Projeto (Passo a Passo)

Para implementar este fluxo no seu ambiente n8n, siga as etapas abaixo:

### 1. Preparação
* Tenha uma instância do **n8n** rodando (versão recomendada: 1.0+).
* Tenha em mãos suas chaves de API da **OpenAI** e os dados de conexão da sua **Evolution API**.
* Certifique-se de já ter importado e ativado os sub-workflows de *Preço* e *Previsão do Tempo* no seu n8n.

### 2. Importando o Workflow Principal
1. Copie todo o código JSON do projeto AgroBot.
2. Abra o n8n e clique em **Add Workflow** (ou crie um novo fluxo em branco).
3. Clique em qualquer lugar da tela em branco e aperte `Ctrl + V` (Windows/Linux) ou `Cmd + V` (Mac) para colar o fluxo. Os nós aparecerão automaticamente na tela.

### 3. Configurando Credenciais
1. Você notará alertas nos nós que exigem conexão externa (OpenAI e Evolution API).
2. Clique no nó **OpenAI Chat Model**, vá na seção de credenciais e selecione sua conta OpenAI (ou crie uma nova inserindo sua chave de API). Repita isso no nó **Transcrever áudio**.
3. Clique no nó **Download áudio**, selecione a credencial da sua Evolution API. Repita o processo nos nós **Enviar texto** e **Marcar mensagens como lidas**.

### 4. Ajustando as Ferramentas (Sub-workflows)
1. Abra o nó **consultar_preco**. No campo *Workflow ID*, selecione o fluxo correspondente à consulta de preços no seu n8n.
2. Abra o nó **consultar_previsão_tempo** e faça o mesmo, selecionando o fluxo responsável pelo clima.

### 5. Configurando o Webhook na Evolution API
1. Abra o nó inicial **Webhook**.
2. Copie a **Test URL** (para testes em desenvolvimento) ou a **Production URL** (para produção).
3. Vá até as configurações da sua instância na Evolution API e configure este Webhook para escutar o evento de recebimento de mensagens (geralmente `messages.upsert`).

### 6. Ativação e Testes
1. No canto superior direito do n8n, alterne a chave no topo da tela para **Active**.
2. Pegue seu celular e envie uma mensagem de teste para o número de WhatsApp conectado (Ex: *"Qual o preço da saca de soja hoje?"* ou mande um áudio perguntando se vai chover em uma cidade específica).
3. Acompanhe a aba **Executions** no n8n para ver o fluxo processando a mensagem e garantindo que não existam erros na resposta.
