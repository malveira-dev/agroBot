//recebe os dados meteorológicos (geralmente da API Open-Meteo), traduz códigos 
// numéricos em palavras (como "Céu limpo") e calcula médias e máximas para os próximos 5 dias,
// entregando uma frase pronta.

// Captura os dados climáticos da API (ex: Open-Meteo)
const apiData = $input.first().json;

// Captura as informações de localidade do nó anterior 'Tool Clima Coord'
const ctx = $('Tool Clima Coord').first().json;
const { nomeCidade, uf } = ctx;

// Função auxiliar que converte o código numérico WMO em uma descrição textual em português
const wmoDesc = (code) => {
  if (code === 0) return 'ceu limpo';
  if (code <= 3) return 'parcialmente nublado';
  if (code <= 49) return 'nublado';
  if (code <= 67) return 'chuva';
  if (code <= 82) return 'chuva forte';
  if (code <= 99) return 'tempestade';
  return 'variavel';
};

try {
  // Tenta acessar o bloco de dados diários da API
  const daily = apiData.daily;
  if (!daily) throw new Error('sem dados'); // Se não houver dados, pula para o 'catch'

  // Extrai apenas os dados dos primeiros 5 dias (índices 0 a 4)
  const chuva = daily.precipitation_sum.slice(0, 5);
  const tempMax = daily.temperature_2m_max.slice(0, 5);
  const tempMin = daily.temperature_2m_min.slice(0, 5);
  const wmo = daily.weathercode.slice(0, 5);

  // Soma toda a chuva dos 5 dias e arredonda para 0 casas decimais
  const totalChuva = chuva.reduce((a, b) => a + (b ?? 0), 0).toFixed(0);

  // Encontra a maior temperatura entre os 5 dias
  const maxTemp = Math.max(...tempMax).toFixed(0);

  // Encontra a menor temperatura entre os 5 dias
  const minTemp = Math.min(...tempMin).toFixed(0);

  // Pega o código WMO do dia de hoje (índice 0) e traduz usando a função lá de cima
  const hoje = wmoDesc(wmo[0]);

  // Formata o nome do local: se houver UF, mostra 'Cidade/UF', se não, apenas 'Cidade'
  const local = uf ? nomeCidade + '/' + uf : nomeCidade;

  // Retorna a frase final montada com todos os dados processados
  return [{ json: { resultado: local + ' - proximos 5 dias: Chuva acumulada ' + totalChuva + 'mm | Temp min ' + minTemp + 'C / max ' + maxTemp + 'C | Hoje: ' + hoje + ' | Fonte: Open-Meteo' } }];

} catch(e) {
  // Caso ocorra qualquer erro no bloco acima, retorna esta mensagem de erro padrão
  return [{ json: { resultado: 'Previsao do tempo indisponivel para essa cidade no momento.' } }];
}