//Ele extrai a latitude, longitude e o nome oficial do local. Se a busca falhar, 
// ele usa coordenadas padrão de Brasília.

// Captura os dados vindos da busca de geolocalização (ex: API do Google ou Nominatim)
const geoData = $input.first().json;

// Busca os dados originais guardados no nó 'Tool Clima Prep' para usar como backup
const ctx = $('Tool Clima Prep').first().json;

// Tenta acessar o primeiro resultado da lista de resultados da API de mapas
const result = geoData?.results?.[0];

// Se houver resultado, pega a latitude; caso contrário, usa a latitude padrão de Brasília
const lat = result?.latitude ?? -15.77;

// Se houver resultado, pega a longitude; caso contrário, usa a longitude padrão de Brasília
const lon = result?.longitude ?? -47.92;

// Tenta pegar o nome oficial da cidade da API, se falhar usa o que o usuário digitou no início
const nomeCidade = result?.name ?? ctx.cidade;

// Tenta pegar o estado (admin1), se falhar tenta o contexto, se não, deixa vazio
const uf = result?.admin1 ?? ctx.estado ?? '';

// Retorna um objeto completo com coordenadas e nomes tratados
return [{ json: { lat, lon, nomeCidade, uf, cidade: ctx.cidade, estado: ctx.estado } }];