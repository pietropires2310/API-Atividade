/* API - Dev: Vagner Lima 03.11.2026 */

// 1. Guarda em uma constante a URL base da nossa API que está rodando no Node.js (porta 3000)
const API_URL = 'http://localhost:3000/api/pokemons';

// 2. Captura os elementos da página HTML usando os IDs
const form = document.getElementById('pokemonForm');       // O formulário de cadastro
const nomeInput = document.getElementById('nomeInput');    // O campo de texto do nome
const tipoInput = document.getElementById('tipoInput');    // O campo de texto do tipo
const listaPokemons = document.getElementById('listaPokemons'); // A lista <ul> onde os Pokémons serão inseridos

// --- OPERAÇÃO 1: READ (Ler / Listar) ---
async function carregarPokemons() {
    // Requisição GET para o servidor
    const res = await fetch(API_URL);

    // Converte os dados brutos de texto JSON para um Array em JavaScript
    const dados = await res.json();

    // Limpa a lista na tela para não duplicar Pokémons antigos
    listaPokemons.innerHTML = '';

    // Percorre cada objeto 'pokemon' dentro do Array 'dados'
    dados.forEach(pokemon => {
        // Cria um novo elemento de lista (<li>) na memória do navegador
        const li = document.createElement('li');

        // Define o HTML interno da <li> com ID, nome, tipo e os botões Editar e Excluir
        li.innerHTML = `
            <span><strong>#${pokemon.id} ${pokemon.nome}</strong> (${pokemon.tipo})</span>
            <div>
                <button class="btn-edit" onclick="editarPokemon(${pokemon.id}, '${pokemon.nome}', '${pokemon.tipo}')">Editar</button>
                <button class="btn-del" onclick="deletarPokemon(${pokemon.id})">Excluir</button>
            </div>
        `;

        // Adiciona a <li> recém-criada dentro da lista <ul> visível no HTML
        listaPokemons.appendChild(li);
    });
}

// --- OPERAÇÃO 2: CREATE (Criar / Cadastrar) ---
form.addEventListener('submit', async (e) => {
    // Previne o comportamento padrão do HTML (recarregar a página)
    e.preventDefault();

    // Cria um objeto com os dados digitados (removendo espaços das pontas com .trim())
    const novoPokemon = {
        nome: nomeInput.value.trim(),
        tipo: tipoInput.value.trim()
    };

    // Requisição HTTP POST enviando os dados para a API
    const res = await fetch(API_URL, {
        method: 'POST', // Define o método HTTP como POST (usado para criação)
        headers: { 'Content-Type': 'application/json' }, // Avisa ao servidor que enviamos JSON
        body: JSON.stringify(novoPokemon) // Converte o objeto JavaScript em String formatada em JSON
    });

    // Se a API respondeu com sucesso (Status 200 até 299)
    if (res.ok) {
        nomeInput.value = ''; // Limpa o campo de texto do nome
        tipoInput.value = ''; // Limpa o campo de texto do tipo
        carregarPokemons();   // Recarrega a lista para exibir o novo Pokémon
    }
});

// --- OPERAÇÃO 3: UPDATE (Atualizar / Editar) ---
// Recebe o ID e os dados atuais do Pokémon para fazer a alteração
async function editarPokemon(id, nomeAtual, tipoAtual) {
    // Pergunta ao usuário os novos valores preenchendo a caixa de texto com os dados atuais
    const novoNome = prompt("Digite o novo nome do Pokémon:", nomeAtual);
    const novoTipo = prompt("Digite o novo tipo do Pokémon:", tipoAtual);

    // Validação simples: só envia se o usuário preencheu os dois campos e não clicou em "Cancelar"
    if (novoNome && novoTipo) {
        // Monta o objeto com as informações atualizadas
        const pokemonAtualizado = {
            nome: novoNome.trim(),
            tipo: novoTipo.trim()
        };

        // Requisição PUT para a URL específica do Pokémon (ex: http://localhost:3000/api/pokemons/1)
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT', // Define o método HTTP como PUT (usado para atualização)
            headers: { 'Content-Type': 'application/json' }, // Informa que o corpo da requisição é um JSON
            body: JSON.stringify(pokemonAtualizado) // Transforma o objeto JavaScript em texto JSON
        });

        // Se o servidor confirmar a atualização (Status 200)
        if (res.ok) {
            carregarPokemons(); // Recarrega a lista para exibir os dados alterados na tela
        }
    }
}

// --- OPERAÇÃO 4: DELETE (Excluir / Remover) ---
// Recebe o ID do Pokémon que deve ser apagado
async function deletarPokemon(id) {
    // Requisição com o ID específico no final (exemplo: http://localhost:3000/api/pokemons/1)
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE' // Define o método HTTP como DELETE (usado para remoção)
    });

    // Se o servidor confirmar que excluiu com sucesso
    if (res.ok) {
        carregarPokemons(); // Recarrega a lista para remover o Pokémon apagado da tela
    }
}

// Executa a função imediatamente quando a página é carregada pela primeira vez no navegador
carregarPokemons();
