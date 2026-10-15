let carrinho = [];


// FILTRAR CATEGORIA

function filtrarCategoria(categoria) {

    const produtos = document.querySelectorAll(".produto");

    produtos.forEach(function(produto) {

        const categoriaProduto = produto.dataset.categoria;

        if (categoria === "todos" ||
            categoriaProduto === categoria) {

            produto.style.display = "block";

        } else {

            produto.style.display = "none";

        }

    });
}


// ADICIONAR AO CARRINHO

function adicionarCarrinho(nome, preco) {

    carrinho.push({
        nome: nome,
        preco: preco
    });

    atualizarCarrinho();
}


// ATUALIZAR CARRINHO

function atualizarCarrinho() {

    const carrinhoElemento =
        document.getElementById("carrinho");

    const totalElemento =
        document.getElementById("total");

    if (carrinho.length === 0) {

        carrinhoElemento.innerHTML =
            "<p>Seu carrinho está vazio.</p>";

        totalElemento.textContent = "0,00";

        return;
    }


    carrinhoElemento.innerHTML = "";

    let total = 0;


    carrinho.forEach(function(item, index) {

        total += item.preco;

        const div = document.createElement("div");

        div.classList.add("item-carrinho");

        div.innerHTML = `
            <span>${item.nome}</span>

            <strong>
                R$ ${item.preco.toFixed(2).replace(".", ",")}
            </strong>

            <button onclick="removerItem(${index})">
                Remover
            </button>
        `;

        carrinhoElemento.appendChild(div);

    });


    totalElemento.textContent =
        total.toFixed(2).replace(".", ",");
}


// REMOVER ITEM

function removerItem(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();
}


// LOGIN

function abrirLogin() {

    document.getElementById("modalLogin").style.display =
        "block";
}


function fecharLogin() {

    document.getElementById("modalLogin").style.display =
        "none";
}


function login() {

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const mensagem =
        document.getElementById("mensagemLogin");


    if (email === "" || senha === "") {

        mensagem.textContent =
            "Preencha todos os campos.";

        return;
    }


    mensagem.textContent =
        "Login realizado com sucesso!";
}


// FIDELIDADE

function mostrarRecompensa() {

    const pontos =
        Number(document.getElementById("pontos").textContent);

    const recompensa =
        document.getElementById("recompensa");


    if (pontos >= 100) {

        recompensa.textContent =
            "Você possui pontos suficientes para uma recompensa!";

    } else {

        recompensa.textContent =
            "Continue acumulando pontos para desbloquear recompensas.";

    }
}


// Finalizar Pedido

function finalizarPedido(event) {
    event.preventDefault();

    const consentimento = document.getElementById("consentimento");
    const formulario = document.getElementById("form-pedido");

    if (carrinho.length === 0) {
        alert("Adicione pelo menos um item ao pedido.");
        return;
    }

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    if (!consentimento.checked) {
        alert("É necessário aceitar o aviso de privacidade.");
        return;
    }

    alert("Pedido confirmado! Pagamento demonstrativo, sem cobrança real.");

    // Limpa o carrinho após a confirmação demonstrativa.
    carrinho.length = 0;
    atualizarCarrinho();
    formulario.reset();
}

// EXIBIR A UNIDADE SELECIONADA NO CARDÁPIO

document.addEventListener("DOMContentLoaded", function () {
    const nomeUnidade = document.getElementById("nome-unidade");

    if (nomeUnidade) {
        const unidade = localStorage.getItem("unidadeSelecionada");

        nomeUnidade.textContent = unidade || "Selecione uma unidade";
    }
});

function selecionarUnidade(nomeUnidade) {
    localStorage.setItem("unidadeSelecionada", nomeUnidade);
}

function mostrarUnidadeSelecionada() {
    const nomeUnidade = localStorage.getItem("unidadeSelecionada");
    const elemento = document.getElementById("nome-unidade");

    if (elemento && nomeUnidade) {
        elemento.textContent = nomeUnidade;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    mostrarUnidadeSelecionada();
    filtrarProdutosPorUnidade();
});


function filtrarProdutosPorUnidade() {
    const unidade = localStorage.getItem("unidadeSelecionada");
    const produtos = document.querySelectorAll(".product-card");

    produtos.forEach(function(produto) {
        const unidades = produto.dataset.unidades;

        if (!unidade || !unidades) {
            produto.style.display = "";
            return;
        }

        const unidadesDisponiveis = unidades.split(",").map(function(nome) {
            return nome.trim();
        });

        produto.style.display =
            unidadesDisponiveis.includes(unidade) ? "" : "none";
    });
}