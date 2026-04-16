const geoData = $input.first().json;
const ctx = $('Tool Clima Prep').first().json;

const result = geoData?.results?.[0];
const lat = result?.latitude ?? -15.77;
const lon = result?.longitude ?? -47.92;
const nomeCidade = result?.name ?? ctx.cidade;
const uf = result?.admin1 ?? ctx.estado ?? '';

return [{ json: { lat, lon, nomeCidade, uf, cidade: ctx.cidade, estado: ctx.estado } }];