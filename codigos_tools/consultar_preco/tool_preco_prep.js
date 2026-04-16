const input = $input.first().json;
const commodity = (input.commodity ?? input.query ?? 'soja').toLowerCase().trim();

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

const dados = commodityMap[commodity] ?? { nome: commodity, ticker: 'ZS=F' };

return [{ json: { nomeProduto: dados.nome, ticker: dados.ticker, commodity } }];