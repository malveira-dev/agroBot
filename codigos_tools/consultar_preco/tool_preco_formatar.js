// 1. Captura os dados brutos que vieram da requisição HTTP (API).
const apiData = $input.first().json;

// 2. Abre um bloco "try": se algo aqui dentro der erro (ex: dado faltando), o código pula para o "catch".
try {
    // 3. Navega na estrutura profunda do JSON da Yahoo Finance para chegar aos metadados.
    const meta   = apiData.chart.result[0].meta;
    
    // 4. Extrai informações específicas: preço atual, moeda (USD/BRL) e o símbolo (ex: ZS=F).
    const preco  = meta.regularMarketPrice;
    const moeda  = meta.currency;
    const symbol = meta.symbol;

    // 5. Formata o número do preço para o padrão brasileiro (ex: 1.500,50) com 2 casas decimais.
    const precoFmt = preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    // 6. Constrói a frase final combinando as variáveis em uma "template string".
    return [{ json: { 
        resultado: `${symbol} — ${precoFmt} ${moeda} | Fonte: Yahoo Finance` 
    }}];

} catch(e) {
    // 7. Se houver erro (ex: API fora do ar), retorna uma mensagem de erro em vez de travar o fluxo.
    return [{ json: { resultado: `Erro ao buscar cotação: ${e.message}` } }];
}