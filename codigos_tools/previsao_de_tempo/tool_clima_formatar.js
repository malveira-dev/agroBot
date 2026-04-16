const apiData = $input.first().json;
const ctx = $('Tool Clima Coord').first().json;
const { nomeCidade, uf } = ctx;

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
  const daily = apiData.daily;
  if (!daily) throw new Error('sem dados');

  const chuva = daily.precipitation_sum.slice(0, 5);
  const tempMax = daily.temperature_2m_max.slice(0, 5);
  const tempMin = daily.temperature_2m_min.slice(0, 5);
  const wmo = daily.weathercode.slice(0, 5);

  const totalChuva = chuva.reduce((a, b) => a + (b ?? 0), 0).toFixed(0);
  const maxTemp = Math.max(...tempMax).toFixed(0);
  const minTemp = Math.min(...tempMin).toFixed(0);
  const hoje = wmoDesc(wmo[0]);
  const local = uf ? nomeCidade + '/' + uf : nomeCidade;

  return [{ json: { resultado: local + ' - proximos 5 dias: Chuva acumulada ' + totalChuva + 'mm | Temp min ' + minTemp + 'C / max ' + maxTemp + 'C | Hoje: ' + hoje + ' | Fonte: Open-Meteo' } }];
} catch(e) {
  return [{ json: { resultado: 'Previsao do tempo indisponivel para essa cidade no momento.' } }];
}