//O objetivo deste código é identificar qual produto o usuário deseja consultar e retornar o "ticker" 
// (código de bolsa) correto para a API do Yahoo Finance.

// 1. Pega o primeiro item (JSON) recebido pelo nó anterior no n8n.
const input = $input.first().json;

// 2. Tenta pegar a commodity de 'input.commodity' ou 'input.query'. 
// Se ambos forem nulos, usa 'soja'. Depois remove espaços e deixa tudo em minúsculo.
const commodity = (input.commodity ?? input.query ?? 'soja').toLowerCase().trim();

// 3. Define um dicionário (objeto) que relaciona o nome digitado ao Ticker da bolsa.
const commodityMap = {
  'soja':      { nome: 'Soja',      ticker: 'ZS=F' },
  'milho':     { nome: 'Milho',     ticker: 'ZC=F' },
  'cafe':      { nome: 'Café',      ticker: 'KC=F' },
  'algodao':   { nome: 'Algodão',   ticker: 'CT=F' },
  'boi gordo': { nome: 'Boi Gordo', ticker: 'GF=F' },
  'boi':       { nome: 'Boi Gordo', ticker: 'GF=F' },
  'trigo':     { nome: 'Trigo',     ticker: 'ZW=F' },
  'arroz':     { nome: 'Arroz',     ticker: 'ZR=F' },
};

// 4. Busca no mapa acima a commodity tratada. 
// Se não encontrar (??), cria um objeto usando o próprio nome digitado e o ticker da soja.
const dados = commodityMap[commodity] ?? { nome: commodity, ticker: 'ZS=F' };

// 5. Retorna o resultado formatado para o próximo nó do n8n.
return [{ json: { nomeProduto: dados.nome, ticker: dados.ticker, commodity } }];