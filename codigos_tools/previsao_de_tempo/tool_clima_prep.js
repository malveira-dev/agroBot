//serve para "padronizar" os dados que chegam. Ele tenta encontrar o nome da 
// cidade e do estado em diferentes formatos (português ou inglês) e define valores
// padrão caso nada seja encontrado.

// Captura o primeiro objeto JSON que chega ao nó
const input = $input.first().json;

// Define a cidade: tenta 'cidade', se não existir tenta 'city', se não, usa 'Brasilia' como padrão
const cidade = input.cidade ?? input.city ?? 'Brasilia';

// Define o estado: tenta 'estado', se não existir tenta 'state', se não, deixa como nulo
const estado = input.estado ?? input.state ?? null;

// Retorna o resultado formatado para o n8n continuar o fluxo
return [{ json: { cidade, estado } }];