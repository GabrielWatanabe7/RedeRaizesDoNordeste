"use strict";

// ========================================
// CARRINHO
// ========================================

let carrinho = [];

function formatarPreco(valor) {
    return valor.toFixed(2).replace(".", ",");
}

// Adicionar produto ao carrinho
function adicionarCarrinho(nome, preco) {
    preco = Number(preco);

    const produtoExistente = carrinho.find(function(item) {
        return item.nome === nome && item.preco === preco;
    });

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}

// Aplicar promoção recebida pela URL
function aplicarPromocaoDaUrl() {
    const parametros = new URLSearchParams(window.location.search);
    const promocao = parametros.get("promo");

    const promocoes = {
        "frango-com-baiao": {
            nome: "Frango com baião",
            preco: 27.90
        },

        "cartola": {
            nome: "Cartola",
            preco: 9.90
        },

        "combo-nordestino": {
            nome: "Combo Nordestino (Baião de dois, suco de maracujá e cartola)",
            preco: 42.90
        }
    };

    if (!promocao || !promocoes[promocao]) {
        return;
    }

    const produto = promocoes[promocao];

    adicionarCarrinho(produto.nome, produto.preco);

    alert(
        produto.nome + " foi adicionado ao carrinho por R$ " +
        formatarPreco(produto.preco) + "!"
    );

    // Remove o parâmetro para evitar adicionar novamente ao atualizar a página.
    window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.hash
    );
}

// Atualizar itens e total
function atualizarCarrinho() {
    const carrinhoElemento = document.getElementById("carrinho");
    const totalElemento = document.getElementById("total");

    if (!carrinhoElemento || !totalElemento) {
        return;
    }

    carrinhoElemento.innerHTML = "";

    if (carrinho.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Seu carrinho está vazio.";
        carrinhoElemento.appendChild(mensagem);

        totalElemento.textContent = "0,00";
        return;
    }

    let total = 0;

    carrinho.forEach(function(item, index) {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        const div = document.createElement("div");
        div.classList.add("item-carrinho");

        const nome = document.createElement("span");
        nome.textContent = item.nome;

        const quantidade = document.createElement("span");
        quantidade.textContent = "Quantidade: " + item.quantidade;

        const preco = document.createElement("strong");
        preco.textContent = "R$ " + formatarPreco(subtotal);

        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.textContent = "Remover";
        botaoRemover.classList.add("btn-remover");

        botaoRemover.addEventListener("click", function() {
            removerItem(index);
        });

        div.appendChild(nome);
        div.appendChild(quantidade);
        div.appendChild(preco);
        div.appendChild(botaoRemover);

        carrinhoElemento.appendChild(div);
    });

    totalElemento.textContent = formatarPreco(total);
}

// Remover uma unidade do produto no carrinho
function removerItem(index) {
    if (index < 0 || index >= carrinho.length) {
        return;
    }

    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
    } else {
        carrinho.splice(index, 1);
    }

    atualizarCarrinho();
}

// ========================================
// FILTRO DE CATEGORIAS
// ========================================

function filtrarCategoria(categoria) {
    const produtos = document.querySelectorAll(".product-card");

    produtos.forEach(function(produto) {
        const categoriaProduto = produto.dataset.categoria;

        // Se o cartão não possuir data-categoria,
        // ele continua visível.
        if (
            categoria === "todos" ||
            !categoriaProduto ||
            categoriaProduto === categoria
        ) {
            produto.style.display = "";
        } else {
            produto.style.display = "none";
        }
    });
}

// ========================================
// LOGIN DEMONSTRATIVO
// ========================================

function abrirLogin() {
    const modal = document.getElementById("modalLogin");

    if (modal) {
        modal.style.display = "block";
    }
}

function fecharLogin() {
    const modal = document.getElementById("modalLogin");

    if (modal) {
        modal.style.display = "none";
    }
}

function login() {
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const mensagem = document.getElementById("mensagemLogin");

    if (!email || !senha || !mensagem) {
        return;
    }

    if (email.value.trim() === "" || senha.value.trim() === "") {
        mensagem.textContent = "Preencha todos os campos.";
        return;
    }

    mensagem.textContent =
        "Validação demonstrativa concluída. A autenticação real não está configurada.";
}

// ========================================
// FIDELIDADE
// ========================================

function mostrarRecompensa() {
    const pontosElemento = document.getElementById("pontos");
    const recompensa = document.getElementById("recompensa");

    if (!pontosElemento || !recompensa) {
        return;
    }

    const pontos = Number(pontosElemento.textContent);

    if (pontos >= 100) {
        recompensa.textContent =
            "Você possui pontos suficientes para uma recompensa!";
    } else {
        recompensa.textContent =
            "Continue acumulando pontos para desbloquear recompensas.";
    }
}

// ========================================
// SELEÇÃO DE UNIDADE
// ========================================

function selecionarUnidade(nomeUnidade) {
    if (!nomeUnidade || !nomeUnidade.trim()) {
        return;
    }

    localStorage.setItem("unidadeSelecionada", nomeUnidade.trim());
}

function mostrarUnidadeSelecionada() {
    const nomeUnidade = localStorage.getItem("unidadeSelecionada");
    const elemento = document.getElementById("nome-unidade");

    if (elemento) {
        elemento.textContent =
            nomeUnidade || "Selecione uma unidade";
    }
}

// Mostrar apenas os produtos disponíveis na unidade
function filtrarProdutosPorUnidade() {
    const unidade = localStorage.getItem("unidadeSelecionada");
    const produtos = document.querySelectorAll(".product-card");

    produtos.forEach(function(produto) {
        const unidades = produto.dataset.unidades;

        if (!unidade || !unidades) {
            produto.style.display = "";
            return;
        }

        const unidadesDisponiveis = unidades
            .split(",")
            .map(function(nome) {
                return nome.trim();
            });

        produto.style.display =
            unidadesDisponiveis.includes(unidade) ? "" : "none";
    });
}
const idProduto = window.location.hash;

if (idProduto) {
    setTimeout(function() {
        const produto = document.querySelector(idProduto);

        if (produto && produto.style.display !== "none") {
            produto.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }, 100);
}

// ========================================
// FINALIZAR PEDIDO
// ========================================

function finalizarPedido(event) {
    if (event) {
        event.preventDefault();
    }

    const formulario = document.getElementById("form-pedido");
    const consentimento = document.getElementById("consentimento");

    if (carrinho.length === 0) {
        alert("Adicione pelo menos um item ao pedido.");
        return;
    }

    if (!formulario) {
        alert("Não foi possível localizar o formulário do pedido.");
        return;
    }

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    if (!consentimento || !consentimento.checked) {
        alert("É necessário aceitar o aviso de privacidade.");
        return;
    }

    const dadosUsuario = localStorage.getItem("usuarioLogado");

    if (!dadosUsuario) {
        alert("Entre na sua conta antes de finalizar o pedido.");
        window.location.href = "perfil.html";
        return;
    }

    let usuarioLogado;

    try {
        usuarioLogado = JSON.parse(dadosUsuario);
    } catch (erro) {
        alert("Não foi possível identificar sua conta. Entre novamente.");
        localStorage.removeItem("usuarioLogado");
        window.location.href = "perfil.html";
        return;
    }

    if (!usuarioLogado || !usuarioLogado.email) {
        alert("Não foi possível identificar sua conta. Entre novamente.");
        window.location.href = "perfil.html";
        return;
    }

    const unidade = localStorage.getItem("unidadeSelecionada");

    if (!unidade) {
        alert("Selecione uma unidade antes de confirmar o pedido.");
        return;
    }

    const pagamento = formulario.querySelector(
        'input[name="pagamento"]:checked'
    );

    if (!pagamento) {
        alert("Selecione um método de pagamento.");
        return;
    }

    const total = carrinho.reduce(function(soma, item) {
        return soma + (item.preco * item.quantidade);
    }, 0);

    const novoPedido = {
        id: Date.now(),
        clienteEmail: usuarioLogado.email,
        data: new Date().toLocaleString("pt-BR"),
        unidade: unidade,
        itens: carrinho.map(function(item) {
            return {
                nome: item.nome,
                preco: item.preco,
                quantidade: item.quantidade,
                subtotal: item.preco * item.quantidade
            };
        }),
        total: total,
        status: "Pedido recebido"
    };

    salvarPedido(novoPedido);

    const pontosGanhos = registrarPontosDoPedido(novoPedido);

    const resumoPedido = carrinho.map(function(item) {
        return item.nome +
            " (Quantidade: " + item.quantidade + ")" +
            " - R$ " + formatarPreco(item.preco * item.quantidade);
    }).join("\n");

    alert(
        "PEDIDO DEMONSTRATIVO CONFIRMADO!\n\n" +
        "Unidade: " + unidade + "\n\n" +
        "Itens:\n" + resumoPedido + "\n\n" +
        "Total: R$ " + formatarPreco(total) + "\n" +
        "Pagamento: " + pagamento.value + "\n\n" +
        "Pontos de fidelidade ganhos: " + pontosGanhos + "\n\n" +
        "Nenhuma cobrança real foi realizada."
    );

    // Limpar o carrinho após a confirmação demonstrativa.
    carrinho = [];
    atualizarCarrinho();
    formulario.reset();
}

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener("DOMContentLoaded", function() {
    mostrarUnidadeSelecionada();
    filtrarProdutosPorUnidade();
    atualizarCarrinho();

    aplicarPromocaoDaUrl();

    mostrarRecompensa();
    exibirPedidos();
    atualizarPaginaFidelidade();

    configurarCadastroLogin();
    atualizarPerfilUsuario();
    atualizarDadosClientePedido();
});

function obterPedidos() {
    const dadosUsuario = localStorage.getItem("usuarioLogado");

    if (!dadosUsuario) {
        return [];
    }

    let usuario;

    try {
        usuario = JSON.parse(dadosUsuario);
    } catch (erro) {
        return [];
    }

    if (!usuario || !usuario.email) {
        return [];
    }

    let pedidos;

    try {
        pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    } catch (erro) {
        return [];
    }

    if (!Array.isArray(pedidos)) {
        return [];
    }

    return pedidos.filter(function(pedido) {
        return pedido &&
            typeof pedido.clienteEmail === "string" &&
            pedido.clienteEmail.toLowerCase() === usuario.email.toLowerCase();
    });
}

function salvarPedido(pedido) {
    let pedidos = [];

    try {
        pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    } catch (erro) {
        pedidos = [];
    }

    if (!Array.isArray(pedidos)) {
        pedidos = [];
    }

    pedidos.unshift(pedido);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

function exibirPedidos() {
    const lista = document.getElementById("lista-pedidos");

    if (!lista) return;

    lista.innerHTML = "";

    const dadosUsuario = localStorage.getItem("usuarioLogado");

    if (!dadosUsuario) {
        lista.textContent =
            "Entre na sua conta para visualizar seus pedidos.";
        return;
    }

    let usuarioLogado;

    try {
        usuarioLogado = JSON.parse(dadosUsuario);
    } catch (erro) {
        lista.textContent = "Não foi possível identificar sua conta. Entre novamente.";
        return;
    }

    if (!usuarioLogado || !usuarioLogado.email) {
        lista.textContent = "Não foi possível identificar sua conta. Entre novamente.";
        return;
    }

    let todosPedidos = [];

    try {
        todosPedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    } catch (erro) {
        lista.textContent = "Não foi possível carregar seus pedidos.";
        return;
    }

    const pedidos = todosPedidos
        .filter(function(pedido) {
            return pedido.clienteEmail &&
                usuarioLogado.email &&
                pedido.clienteEmail.toLowerCase() ===
                usuarioLogado.email.toLowerCase();
        })
        .sort(function(a, b) {
            return Number(b.id) - Number(a.id);
        });

    if (pedidos.length === 0) {
        lista.textContent =
            "Você ainda não realizou nenhum pedido.";
        return;
    }

    const etapas = [
        "Pedido recebido",
        "Em preparação",
        "Saiu para entrega",
        "Concluído"
    ];

    pedidos.forEach(function(pedido) {
        const card = document.createElement("article");
        card.className = "order-card";

        const titulo = document.createElement("h2");
        titulo.textContent = "Pedido #" + pedido.id;

        const data = document.createElement("p");
        data.textContent = "Data: " + pedido.data;

        const unidade = document.createElement("p");
        unidade.textContent = "Unidade: " + pedido.unidade;

        const detalhes = document.createElement("details");
        detalhes.className = "order-details";

        const resumo = document.createElement("summary");
        resumo.textContent = "Ver detalhes do pedido";

        const listaItens = document.createElement("ul");
        listaItens.className = "order-items";

        (pedido.itens || []).forEach(function(item) {
            const linha = document.createElement("li");

            const quantidade = Number(item.quantidade) || 1;
            const precoUnitario = Number(item.preco) || 0;
            const subtotal = precoUnitario * quantidade;

            linha.textContent =
                item.nome +
                " — " + quantidade + " unidade(s)" +
                " — R$ " + subtotal.toFixed(2).replace(".", ",");

            listaItens.appendChild(linha);
        });

        detalhes.append(resumo, listaItens);

        const total = document.createElement("p");
        total.className = "order-total";
        total.textContent =
            "Total: R$ " +
            Number(pedido.total).toFixed(2).replace(".", ",");

        const tituloStatus = document.createElement("h3");
        tituloStatus.textContent = "Acompanhe seu pedido";

        const statusAtual = etapas.indexOf(pedido.status);
        const etapaValida = statusAtual !== -1;

        const status = document.createElement("p");
        status.className = "order-status";
        status.textContent = "Status: " + pedido.status;

        const timeline = document.createElement("div");
        timeline.className = "order-timeline";

        etapas.forEach(function(etapa, indice) {
            const passo = document.createElement("div");
            passo.className = "order-step";

            if (etapaValida && indice < statusAtual) {
                passo.classList.add("completed");
            } else if (etapaValida && indice === statusAtual) {
                passo.classList.add("current");
            }

            const marcador = document.createElement("span");
            marcador.className = "order-step-marker";
            marcador.textContent =
                etapaValida && indice < statusAtual
                    ? "✓"
                    : String(indice + 1);

            const nomeEtapa = document.createElement("span");
            nomeEtapa.className = "order-step-label";
            nomeEtapa.textContent = etapa;

            passo.append(marcador, nomeEtapa);
            timeline.appendChild(passo);
        });

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "btn btn-primary";

        if (pedido.status === "Concluído") {
            botao.textContent = "Pedido concluído";
            botao.disabled = true;
        } else if (!etapaValida) {
            botao.textContent = "Status inválido";
            botao.disabled = true;
        } else {
            botao.textContent = "Avançar status (simulação)";
            botao.addEventListener("click", function() {
                atualizarStatusPedido(pedido.id);
            });
        }

        card.append(
            titulo,
            data,
            unidade,
            detalhes,
            total,
            tituloStatus,
            status,
            timeline,
            botao
        );

        lista.appendChild(card);
    });
}

function atualizarStatusPedido(id) {
    const pedidosUsuario = obterPedidos();

    const pedido = pedidosUsuario.find(function(item) {
        return String(item.id) === String(id);
    });

    if (!pedido) {
        alert("Pedido não encontrado.");
        return;
    }

    const etapas = [
        "Pedido recebido",
        "Em preparação",
        "Saiu para entrega",
        "Concluído"
    ];

    const etapaAtual = etapas.indexOf(pedido.status);

    if (etapaAtual === -1) {
        alert("Status do pedido inválido.");
        return;
    }

    if (etapaAtual === etapas.length - 1) {
        alert("Este pedido já foi concluído.");
        return;
    }

    pedido.status = etapas[etapaAtual + 1];

    let todosPedidos = [];

    try {
        todosPedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    } catch (erro) {
        alert("Não foi possível atualizar o pedido.");
        return;
    }

    const indice = todosPedidos.findIndex(function(item) {
        return String(item.id) === String(id) &&
            item.clienteEmail.toLowerCase() ===
            JSON.parse(localStorage.getItem("usuarioLogado")).email.toLowerCase();
    });

    if (indice === -1) {
        alert("Pedido não encontrado.");
        return;
    }

    todosPedidos[indice] = pedido;

    localStorage.setItem("pedidos", JSON.stringify(todosPedidos));

    exibirPedidos();
}


function obterPontos() {
    const dadosUsuario = localStorage.getItem("usuarioLogado");

    if (!dadosUsuario) {
        return 0;
    }

    const usuario = JSON.parse(dadosUsuario);
    const chavePontos = "pontosFidelidade_" + usuario.email.toLowerCase();

    return Number(localStorage.getItem(chavePontos)) || 0;
}

function adicionarPontos(valorPedido) {
    const dadosUsuario = localStorage.getItem("usuarioLogado");

    if (!dadosUsuario) {
        return 0;
    }

    const usuario = JSON.parse(dadosUsuario);
    const chavePontos = "pontosFidelidade_" + usuario.email.toLowerCase();

    const pontosGanhos = Math.floor(Number(valorPedido));
    const saldoAtual = obterPontos();
    const novoSaldo = saldoAtual + pontosGanhos;

    localStorage.setItem(chavePontos, novoSaldo);

    return pontosGanhos;
}

function atualizarPaginaFidelidade() {
    const saldoElemento = document.getElementById("saldo-pontos");
    const estadoElemento = document.getElementById("estado-recompensa");
    const botao = document.getElementById("botao-resgatar");
    const mensagem = document.getElementById("mensagem-fidelidade");

    if (!saldoElemento || !estadoElemento || !botao) {
        return;
    }

    const dadosUsuario = localStorage.getItem("usuarioLogado");

    if (!dadosUsuario) {
        saldoElemento.textContent = "Entre na sua conta";
        estadoElemento.textContent = "Faça login para consultar seus pontos.";
        botao.disabled = true;
        botao.textContent = "Resgatar";

        if (mensagem) {
            mensagem.textContent = "";
        }

        return;
    }

    const saldo = obterPontos();
    const recompensasDisponiveis = Math.floor(saldo / 100);
    const pontosRestantes = saldo % 100;

    saldoElemento.textContent =
        saldo + (saldo === 1 ? " ponto" : " pontos");

    if (recompensasDisponiveis > 0) {
        estadoElemento.textContent =
            "Você pode resgatar " +
            recompensasDisponiveis +
            (recompensasDisponiveis === 1
                ? " recompensa!"
                : " recompensas!");

        botao.disabled = false;
        botao.textContent = "Resgatar recompensa";
    } else {
        estadoElemento.textContent =
            "Faltam " + (100 - pontosRestantes) +
            " pontos para sua próxima recompensa.";

        botao.disabled = true;
        botao.textContent = "Resgatar recompensa";
    }
}

function resgatarRecompensa() {
    const mensagem = document.getElementById("mensagem-fidelidade");
    const dadosUsuario = localStorage.getItem("usuarioLogado");

    if (!dadosUsuario) {
        if (mensagem) {
            mensagem.textContent =
                "Entre na sua conta para resgatar uma recompensa.";
        }
        return;
    }

    let usuario;

    try {
        usuario = JSON.parse(dadosUsuario);
    } catch (erro) {
        if (mensagem) {
            mensagem.textContent =
                "Não foi possível identificar sua conta. Entre novamente.";
        }
        return;
    }

    if (!usuario || !usuario.email) {
        if (mensagem) {
            mensagem.textContent =
                "Não foi possível identificar sua conta. Entre novamente.";
        }
        return;
    }

    const email = usuario.email.toLowerCase();
    const chavePontos = "pontosFidelidade_" + email;
    const saldo = obterPontos();

    if (saldo < 100) {
        if (mensagem) {
            mensagem.textContent =
                "Você precisa de 100 pontos para resgatar uma recompensa.";
        }

        atualizarPaginaFidelidade();
        return;
    }

    const novoSaldo = saldo - 100;

    localStorage.setItem(chavePontos, novoSaldo);

    if (mensagem) {
        mensagem.textContent =
            "Recompensa demonstrativa resgatada com sucesso! " +
            "Você utilizou 100 pontos e ficou com " +
            novoSaldo + (novoSaldo === 1 ? " ponto." : " pontos.");
    }

    atualizarPaginaFidelidade();
}

function configurarCadastroLogin() {
    const formularioCadastro = document.getElementById("form-cadastro");
    const formularioLogin = document.getElementById("form-login");

    // Cadastro de usuário
    if (formularioCadastro && !formularioCadastro.dataset.configurado) {
        formularioCadastro.dataset.configurado = "true";

        formularioCadastro.addEventListener("submit", function(event) {
            event.preventDefault();

            const nome = document.getElementById("cadastro-nome").value.trim();
            const email = document.getElementById("cadastro-email").value.trim().toLowerCase();
            const senha = document.getElementById("cadastro-senha").value;
            const mensagem = document.getElementById("mensagem-cadastro");

            mensagem.textContent = "";

            if (!nome || !email || !senha) {
                mensagem.textContent = "Preencha todos os campos.";
                return;
            }

            if (senha.length < 6) {
                mensagem.textContent = "A senha deve ter pelo menos 6 caracteres.";
                return;
            }

            let usuarios;

            try {
                usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            } catch (erro) {
                mensagem.textContent = "Não foi possível consultar os cadastros salvos.";
                return;
            }

            if (!Array.isArray(usuarios)) {
                mensagem.textContent = "Os dados de cadastro estão inválidos.";
                return;
            }

            const emailExiste = usuarios.some(function(usuario) {
                return usuario &&
                    typeof usuario.email === "string" &&
                    usuario.email.toLowerCase() === email;
            });

            if (emailExiste) {
                mensagem.textContent = "Este e-mail já está cadastrado. Faça login.";
                return;
            }

            usuarios.push({
                nome: nome,
                email: email,
                senha: senha
            });

            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            mensagem.textContent = "Cadastro realizado com sucesso! Agora faça login.";
            formularioCadastro.reset();
        });
    }

    // Login de usuário
    if (formularioLogin && !formularioLogin.dataset.configurado) {
        formularioLogin.dataset.configurado = "true";

        formularioLogin.addEventListener("submit", function(event) {
            event.preventDefault();

            const email = document.getElementById("login-email").value.trim().toLowerCase();
            const senha = document.getElementById("login-senha").value;
            const mensagem = document.getElementById("mensagem-login");

            mensagem.textContent = "";

            let usuarios;

            try {
                usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            } catch (erro) {
                mensagem.textContent = "Não foi possível consultar os cadastros salvos.";
                return;
            }

            if (!Array.isArray(usuarios)) {
                mensagem.textContent = "Os dados de cadastro estão inválidos.";
                return;
            }

            const usuarioEncontrado = usuarios.find(function(usuario) {
                return usuario &&
                    typeof usuario.email === "string" &&
                    typeof usuario.senha === "string" &&
                    usuario.email.toLowerCase() === email &&
                    usuario.senha === senha;
            });

            if (!usuarioEncontrado) {
                mensagem.textContent = "E-mail ou senha incorretos.";
                return;
            }

            localStorage.setItem("usuarioLogado", JSON.stringify({
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email
            }));

            formularioLogin.reset();

            atualizarPerfilUsuario();
        });
    }
}

function atualizarPerfilUsuario() {
    const areaPerfil = document.getElementById("area-perfil");
    const nomeUsuario = document.getElementById("nome-usuario");
    const emailUsuario = document.getElementById("email-usuario");
    const botaoSair = document.getElementById("botao-sair");
    const areaFormularios = document.querySelector(".perfil-container");
    const mensagemCadastro = document.getElementById("mensagem-cadastro");
    const mensagemLogin = document.getElementById("mensagem-login");

    if (!areaPerfil || !nomeUsuario || !emailUsuario) {
        return;
    }

    let usuario = null;

    try {
        const dados = localStorage.getItem("usuarioLogado");
        usuario = dados ? JSON.parse(dados) : null;
    } catch (erro) {
        localStorage.removeItem("usuarioLogado");
    }

    const usuarioValido = usuario &&
        typeof usuario.nome === "string" &&
        typeof usuario.email === "string";

    areaPerfil.hidden = !usuarioValido;

    if (areaFormularios) {
        areaFormularios.hidden = Boolean(usuarioValido);
    }

    if (usuarioValido) {
        nomeUsuario.textContent = usuario.nome;
        emailUsuario.textContent = usuario.email;
    } else {
        nomeUsuario.textContent = "";
        emailUsuario.textContent = "";
    }

    if (mensagemCadastro) {
        mensagemCadastro.textContent = "";
    }

    if (mensagemLogin) {
        mensagemLogin.textContent = "";
    }

    if (botaoSair && !botaoSair.dataset.configurado) {
        botaoSair.dataset.configurado = "true";

        botaoSair.addEventListener("click", function() {
            localStorage.removeItem("usuarioLogado");
            atualizarPerfilUsuario();

            if (mensagemLogin) {
                mensagemLogin.textContent = "Você saiu da sua conta.";
            }
        });
    }
}

function atualizarDadosClientePedido() {
    const dadosSalvos = localStorage.getItem("usuarioLogado");

    const campoNome = document.getElementById("nome-cliente");
    const campoEmail = document.getElementById("email-cliente");
    const grupoNome = document.getElementById("campo-nome-cliente");
    const grupoEmail = document.getElementById("campo-email-cliente");

    // Esta função só atua na página que contém o formulário do pedido.
    if (!campoNome || !campoEmail) {
        return;
    }

    let usuario = null;

    try {
        usuario = dadosSalvos ? JSON.parse(dadosSalvos) : null;
    } catch (erro) {
        usuario = null;
    }

    const usuarioLogadoValido = usuario &&
        typeof usuario.nome === "string" &&
        typeof usuario.email === "string";

    if (usuarioLogadoValido) {
        campoNome.value = usuario.nome;
        campoEmail.value = usuario.email;

        // Não pede novamente dados que já estão na conta.
        campoNome.required = false;
        campoEmail.required = false;

        if (grupoNome) grupoNome.hidden = true;
        if (grupoEmail) grupoEmail.hidden = true;
    } else {
        campoNome.value = "";
        campoEmail.value = "";

        campoNome.required = true;
        campoEmail.required = true;

        if (grupoNome) grupoNome.hidden = false;
        if (grupoEmail) grupoEmail.hidden = false;
    }
}

function registrarPontosDoPedido(pedido) {
    const dadosUsuario = localStorage.getItem("usuarioLogado");

    if (!dadosUsuario || !pedido || pedido.id == null) {
        return 0;
    }

    let usuario;

    try {
        usuario = JSON.parse(dadosUsuario);
    } catch (erro) {
        return 0;
    }

    if (!usuario || !usuario.email) {
        return 0;
    }

    const email = usuario.email.toLowerCase();
    const chavePedidos = "pedidosComPontos_" + email;

    let pedidosProcessados = [];

    try {
        pedidosProcessados =
            JSON.parse(localStorage.getItem(chavePedidos)) || [];
    } catch (erro) {
        pedidosProcessados = [];
    }

    // Impede que o mesmo pedido conceda pontos novamente.
    if (pedidosProcessados.includes(String(pedido.id))) {
        return 0;
    }

    const pontosGanhos = Math.floor(Number(pedido.total));

    if (!Number.isFinite(pontosGanhos) || pontosGanhos <= 0) {
        return 0;
    }

// Credita os pontos primeiro.
    const pontosCreditados = adicionarPontos(pedido.total);

    if (pontosCreditados !== pontosGanhos) {
        return 0;
    }

// Registra o pedido como processado.
    pedidosProcessados.push(String(pedido.id));

    localStorage.setItem(
        chavePedidos,
        JSON.stringify(pedidosProcessados)
    );

    return pontosGanhos;
}

document.addEventListener("DOMContentLoaded", function () {
    const botaoMenu = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu-principal");

    if (!botaoMenu || !menu) return;

    botaoMenu.addEventListener("click", function () {
        const menuAberto = menu.classList.toggle("menu-aberto");

        botaoMenu.setAttribute("aria-expanded", String(menuAberto));
        botaoMenu.setAttribute(
            "aria-label",
            menuAberto ? "Fechar menu" : "Abrir menu"
        );

        botaoMenu.textContent = menuAberto ? "✕" : "☰";
    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            menu.classList.remove("menu-aberto");
            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.setAttribute("aria-label", "Abrir menu");
            botaoMenu.textContent = "☰";
        });
    });
});