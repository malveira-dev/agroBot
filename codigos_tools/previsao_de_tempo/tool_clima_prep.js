const apiData = $input.first().json;

try {
    const meta   = apiData.chart.result[0].meta;
    const preco  = meta.regularMarketPrice;
    const moeda  = meta.currency;
    const symbol = meta.symbol;

    const precoFmt = preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    return [{ json: { 
        resultado: `${symbol} — ${precoFmt} ${moeda} | Fonte: Yahoo Finance` 
    }}];
} catch(e) {
    return [{ json: { resultado: `Erro ao buscar cotação: ${e.message}` } }];
}