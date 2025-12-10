// SISTEMA DE CARRINHO SIMPLIFICADO E FUNCIONAL

let carrinhoItens = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cardápio carregado - inicializando carrinho...');
    
    // Carregar endereço
    carregarEndereco();
    
    // Carregar carrinho do localStorage
    carregarCarrinhoStorage();
    
    // Configurar filtros
    configurarFiltrosCategoria();
    
    // Configurar botões de adicionar
    configurarBotoesAdicionar();
    
    // Configurar interface do carrinho
    atualizarInterfaceCarrinho();
    
    // Configurar eventos do modal
    configurarModalCarrinho();
});

// ==================== FUNÇÕES BÁSICAS ====================

function carregarEndereco() {
    try {
        const enderecoSalvo = localStorage.getItem('enderecoEntrega');
        const enderecoHeader = document.getElementById('endereco-header');
        
        if (enderecoSalvo && enderecoHeader) {
            const dados = JSON.parse(enderecoSalvo);
            const enderecoCurto = dados.endereco ? dados.endereco.split('-')[0].trim() : 'Endereço';
            enderecoHeader.textContent = enderecoCurto;
        }
    } catch (e) {
        console.error('Erro ao carregar endereço:', e);
    }
}

function carregarCarrinhoStorage() {
    try {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        if (carrinhoSalvo) {
            carrinhoItens = JSON.parse(carrinhoSalvo);
            console.log('Carrinho carregado:', carrinhoItens.length, 'itens');
        }
    } catch (e) {
        console.error('Erro ao carregar carrinho:', e);
        carrinhoItens = [];
        localStorage.removeItem('carrinho');
    }
}

function salvarCarrinhoStorage() {
    try {
        localStorage.setItem('carrinho', JSON.stringify(carrinhoItens));
        console.log('Carrinho salvo:', carrinhoItens);
    } catch (e) {
        console.error('Erro ao salvar carrinho:', e);
    }
}

// ==================== GESTÃO DO CARRINHO ====================

function adicionarItemAoCarrinho(id, nome, preco, categoria = 'hamburguer') {
    console.log('Adicionando item:', id, nome, preco);
    
    // Verificar se já existe
    const itemIndex = carrinhoItens.findIndex(item => item.id == id);
    
    if (itemIndex >= 0) {
        // Aumentar quantidade
        carrinhoItens[itemIndex].quantidade += 1;
        console.log('Item existente, nova quantidade:', carrinhoItens[itemIndex].quantidade);
    } else {
        // Adicionar novo item
        carrinhoItens.push({
            id: id,
            nome: nome,
            preco: parseFloat(preco),
            quantidade: 1,
            categoria: categoria
        });
        console.log('Novo item adicionado');
    }
    
    salvarCarrinhoStorage();
    atualizarInterfaceCarrinho();
    mostrarConfirmacao(nome);
    
    // Animar botão
    const botao = document.querySelector(`[data-id="${id}"]`);
    if (botao) {
        botao.classList.add('adicionado');
        botao.innerHTML = '<i class="fas fa-check"></i> Adicionado';
        setTimeout(() => {
            botao.classList.remove('adicionado');
            botao.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
        }, 1500);
    }
}

function removerItemDoCarrinho(id) {
    console.log('Removendo item:', id);
    carrinhoItens = carrinhoItens.filter(item => item.id != id);
    salvarCarrinhoStorage();
    atualizarInterfaceCarrinho();
    
    // Se o modal estiver aberto, atualizar
    const modal = document.getElementById('modalCarrinho');
    if (modal && modal.style.display === 'flex') {
        renderizarItensModal();
    }
}

function alterarQuantidadeItem(id, delta) {
    console.log('Alterando quantidade:', id, delta);
    
    const itemIndex = carrinhoItens.findIndex(item => item.id == id);
    
    if (itemIndex >= 0) {
        const novaQuantidade = carrinhoItens[itemIndex].quantidade + delta;
        
        if (novaQuantidade < 1) {
            // Remover item se quantidade for 0
            if (confirm('Deseja remover este item do carrinho?')) {
                removerItemDoCarrinho(id);
            }
            return;
        }
        
        if (novaQuantidade > 10) {
            alert('Quantidade máxima é 10');
            return;
        }
        
        carrinhoItens[itemIndex].quantidade = novaQuantidade;
        salvarCarrinhoStorage();
        atualizarInterfaceCarrinho();
        
        // Se o modal estiver aberto, atualizar
        const modal = document.getElementById('modalCarrinho');
        if (modal && modal.style.display === 'flex') {
            renderizarItensModal();
        }
    }
}

// ==================== INTERFACE DO CARRINHO ====================

function atualizarInterfaceCarrinho() {
    console.log('Atualizando interface do carrinho...');
    
    // Calcular totais
    const totalItens = carrinhoItens.reduce((total, item) => total + item.quantidade, 0);
    const totalValor = carrinhoItens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    console.log('Total itens:', totalItens, 'Total valor:', totalValor);
    
    // Atualizar contador no header
    const headerContador = document.getElementById('headerCarrinhoQtd');
    if (headerContador) {
        headerContador.textContent = totalItens;
        headerContador.style.display = totalItens > 0 ? 'inline-flex' : 'none';
        console.log('Contador header atualizado:', totalItens);
    }
    
    // Atualizar contador no carrinho flutuante
    const contadorFlutuante = document.getElementById('contadorCarrinho');
    if (contadorFlutuante) {
        contadorFlutuante.textContent = totalItens;
        console.log('Contador flutuante atualizado:', totalItens);
    }
    
    // Atualizar total no carrinho flutuante
    const totalFlutuante = document.getElementById('totalCarrinho');
    if (totalFlutuante) {
        totalFlutuante.textContent = totalValor.toFixed(2);
        console.log('Total flutuante atualizado:', totalValor);
    }
    
    // Mostrar/ocultar carrinho flutuante
    const carrinhoFlutuante = document.getElementById('carrinhoFlutuante');
    if (carrinhoFlutuante) {
        carrinhoFlutuante.style.display = totalItens > 0 ? 'block' : 'none';
        console.log('Carrinho flutuante:', totalItens > 0 ? 'visível' : 'oculto');
    }
}

// ==================== MODAL DO CARRINHO ====================

function configurarModalCarrinho() {
    console.log('Configurando modal do carrinho...');
    
    // Abrir modal ao clicar no carrinho flutuante
    const carrinhoFlutuante = document.getElementById('carrinhoFlutuante');
    if (carrinhoFlutuante) {
        carrinhoFlutuante.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clicou no carrinho flutuante');
            abrirModalCarrinho();
        });
    }
    
    // Fechar modal com botão X
    const btnFechar = document.querySelector('.fechar-modal');
    if (btnFechar) {
        btnFechar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clicou no botão fechar');
            fecharModalCarrinho();
        });
    }
    
    // Botão finalizar pedido
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clicou em finalizar pedido');
            finalizarPedido();
        });
    }
    
    // Botão continuar comprando
    const btnContinuar = document.querySelector('.btn-continuar');
    if (btnContinuar) {
        btnContinuar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clicou em continuar comprando');
            fecharModalCarrinho();
        });
    }
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modalCarrinho');
        if (event.target === modal) {
            console.log('Clicou fora do modal');
            fecharModalCarrinho();
        }
    });
}

function abrirModalCarrinho() {
    console.log('Abrindo modal do carrinho...');
    const modal = document.getElementById('modalCarrinho');
    if (modal) {
        modal.style.display = 'flex';
        renderizarItensModal();
    }
}

function fecharModalCarrinho() {
    console.log('Fechando modal do carrinho...');
    const modal = document.getElementById('modalCarrinho');
    if (modal) {
        modal.style.display = 'none';
    }
}

function renderizarItensModal() {
    console.log('Renderizando itens no modal...');
    
    const corpo = document.getElementById('corpoCarrinho');
    const rodape = document.getElementById('rodapeCarrinho');
    
    if (!corpo || !rodape) {
        console.error('Elementos do modal não encontrados!');
        return;
    }
    
    if (carrinhoItens.length === 0) {
        console.log('Carrinho vazio, mostrando mensagem');
        corpo.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fas fa-shopping-basket"></i>
                <p>Seu carrinho está vazio</p>
                <p class="texto-pequeno">Adicione itens deliciosos do nosso cardápio!</p>
            </div>
        `;
        rodape.style.display = 'none';
        return;
    }
    
    console.log('Renderizando', carrinhoItens.length, 'itens');
    
    // Calcular subtotal
    let subtotal = 0;
    let html = '';
    
    carrinhoItens.forEach(item => {
        const totalItem = item.preco * item.quantidade;
        subtotal += totalItem;
        
        html += `
            <div class="item-carrinho" data-id="${item.id}">
                <div class="item-info">
                    <h4>${item.nome}</h4>
                    <p class="item-descricao">${item.descricao || 'Produto artesanal'}</p>
                    <p class="item-preco">R$ ${item.preco.toFixed(2)} cada</p>
                </div>
                <div class="item-controles">
                    <div class="quantidade-controle">
                        <button class="btn-quantidade btn-diminuir" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantidade">${item.quantidade}</span>
                        <button class="btn-quantidade btn-aumentar" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="item-total">
                        R$ ${totalItem.toFixed(2)}
                    </div>
                    <button class="btn-remover-item" data-id="${item.id}" title="Remover item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    corpo.innerHTML = html;
    rodape.style.display = 'block';
    
    // Calcular totais finais
    const frete = 8.50;
    const total = subtotal + frete;
    
    // Atualizar resumo
    document.getElementById('subtotalCarrinho').textContent = subtotal.toFixed(2);
    document.getElementById('freteCarrinho').textContent = frete.toFixed(2);
    document.getElementById('totalFinal').textContent = total.toFixed(2);
    
    // Configurar eventos dos botões NOVAMENTE (IMPORTANTE!)
    configurarEventosItensModal();
    
    console.log('Modal renderizado com sucesso');
}

function configurarEventosItensModal() {
    console.log('Configurando eventos dos itens no modal...');
    
    // Botões de diminuir
    document.querySelectorAll('.btn-diminuir').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = this.getAttribute('data-id');
            console.log('Diminuir item:', id);
            alterarQuantidadeItem(parseInt(id), -1);
        });
    });
    
    // Botões de aumentar
    document.querySelectorAll('.btn-aumentar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = this.getAttribute('data-id');
            console.log('Aumentar item:', id);
            alterarQuantidadeItem(parseInt(id), 1);
        });
    });
    
    // Botões de remover
    document.querySelectorAll('.btn-remover-item').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = this.getAttribute('data-id');
            console.log('Remover item:', id);
            if (confirm('Deseja remover este item do carrinho?')) {
                removerItemDoCarrinho(parseInt(id));
            }
        });
    });
}

// ==================== FUNÇÕES AUXILIARES ====================

function mostrarConfirmacao(nomeProduto) {
    console.log('Mostrando confirmação para:', nomeProduto);
    
    const modal = document.getElementById('modalAdicionado');
    if (modal) {
        modal.style.display = 'flex';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 1500);
    }
}

function configurarFiltrosCategoria() {
    console.log('Configurando filtros de categoria...');
    
    const botoesCategoria = document.querySelectorAll('.categoria-btn');
    const produtos = document.querySelectorAll('.card-produto');
    
    botoesCategoria.forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe ativo de todos
            botoesCategoria.forEach(btn => btn.classList.remove('ativo'));
            
            // Adicionar ao clicado
            this.classList.add('ativo');
            
            const categoria = this.dataset.categoria;
            console.log('Filtrando por categoria:', categoria);
            
            // Filtrar produtos
            produtos.forEach(produto => {
                if (categoria === 'todos' || produto.dataset.categoria === categoria) {
                    produto.style.display = 'block';
                } else {
                    produto.style.display = 'none';
                }
            });
        });
    });
}

function configurarBotoesAdicionar() {
    console.log('Configurando botões de adicionar...');
    
    const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
    
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const id = this.getAttribute('data-id');
            const nome = this.getAttribute('data-nome');
            const preco = this.getAttribute('data-preco');
            const categoria = this.closest('.card-produto').dataset.categoria;
            
            console.log('Adicionando ao carrinho:', { id, nome, preco, categoria });
            
            adicionarItemAoCarrinho(parseInt(id), nome, preco, categoria);
        });
    });
}

function finalizarPedido() {
    console.log('Finalizando pedido...');
    
    if (carrinhoItens.length === 0) {
        alert('Seu carrinho está vazio! Adicione itens antes de finalizar.');
        return;
    }
    
    // Salvar dados do pedido
    const endereco = localStorage.getItem('enderecoEntrega');
    const pedido = {
        itens: carrinhoItens,
        subtotal: carrinhoItens.reduce((total, item) => total + (item.preco * item.quantidade), 0),
        frete: 8.50,
        taxa: 2.00,
        endereco: endereco ? JSON.parse(endereco) : null,
        data: new Date().toISOString(),
        numero: 'BURG' + Date.now().toString().substr(-6)
    };
    
    localStorage.setItem('pedidoAtual', JSON.stringify(pedido));
    
    console.log('Pedido salvo, redirecionando para checkout...');
    
    // Redirecionar para checkout
    window.location.href = 'checkout.html';
}

// ==================== FUNÇÕES GLOBAIS ====================

// Torna as funções disponíveis globalmente
window.abrirCarrinho = abrirModalCarrinho;
window.fecharCarrinho = fecharModalCarrinho;
window.irParaCheckout = finalizarPedido;

console.log('Sistema de carrinho inicializado com sucesso!');