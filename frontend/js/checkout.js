// Sistema de Checkout Completo
let carrinhoItens = [];
let metodoPagamento = 'pix';
let totalPedido = 0;
let timerPix = null;
let timerRedirect = null;

document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinho();
    carregarEndereco();
    renderizarCarrinho();
    calcularTotal();
    criarFormulariosPagamento();
    inicializarPix();
    atualizarBotaoFinalizar();
});

// Funções de Carrinho
function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
        carrinhoItens = JSON.parse(carrinhoSalvo);
    }
}

function renderizarCarrinho() {
    const container = document.getElementById('checkout-carrinho');
    
    if (carrinhoItens.length === 0) {
        container.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fas fa-shopping-basket"></i>
                <p>Seu carrinho está vazio</p>
                <a href="cardapio.html" class="btn-primary">
                    <i class="fas fa-utensils"></i> Ver Cardápio
                </a>
            </div>
        `;
        atualizarBotaoFinalizar();
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    carrinhoItens.forEach((item, index) => {
        const totalItem = item.preco * item.quantidade;
        subtotal += totalItem;
        
        html += `
            <div class="checkout-item">
                <div class="item-imagem-checkout" style="background: linear-gradient(135deg, ${getCorCategoria(item.categoria)}, ${getCorCategoria(item.categoria, true)});">
                    <i class="${getIconeCategoria(item.categoria)}"></i>
                </div>
                <div class="item-info-checkout">
                    <h4>${item.nome}</h4>
                    <div class="item-detalhes-checkout">
                        <span class="item-quantidade-checkout">
                            ${item.quantidade}x
                        </span>
                        <span class="item-preco-checkout">
                            R$ ${totalItem.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('checkout-subtotal').textContent = subtotal.toFixed(2);
}

function getCorCategoria(categoria, secondary = false) {
    const cores = {
        'hamburguer': secondary ? '#FFA500' : '#FF6B35',
        'combo': secondary ? '#357ABD' : '#4A90E2',
        'bebida': secondary ? '#B22222' : '#8B0000',
        'acompanhamento': secondary ? '#A0522D' : '#8B4513'
    };
    return cores[categoria] || (secondary ? '#FFA500' : '#FF6B35');
}

function getIconeCategoria(categoria) {
    const icones = {
        'hamburguer': 'fas fa-hamburger',
        'combo': 'fas fa-gift',
        'bebida': 'fas fa-glass-whiskey',
        'acompanhamento': 'fas fa-french-fries'
    };
    return icones[categoria] || 'fas fa-utensils';
}

// Funções de Endereço
function carregarEndereco() {
    const enderecoSalvo = localStorage.getItem('enderecoEntrega');
    const nomeElement = document.getElementById('endereco-nome');
    const completoElement = document.getElementById('endereco-completo');
    
    if (enderecoSalvo && nomeElement && completoElement) {
        const dados = JSON.parse(enderecoSalvo);
        const enderecoCurto = dados.endereco ? dados.endereco.split('-')[0].trim() : 'Endereço não informado';
        nomeElement.textContent = enderecoCurto;
        completoElement.textContent = dados.endereco || 'Por favor, informe seu endereço';
    }
}

// Funções de Total
function calcularTotal() {
    const subtotal = carrinhoItens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    const frete = 7.50;
    const taxa = 2.00;
    totalPedido = subtotal + frete + taxa;
    
    document.getElementById('resumo-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('resumo-frete').textContent = frete.toFixed(2);
    document.getElementById('resumo-taxa').textContent = taxa.toFixed(2);
    document.getElementById('resumo-total').textContent = totalPedido.toFixed(2);
    document.getElementById('pix-valor').textContent = totalPedido.toFixed(2);
}

// Funções de Pagamento
function criarFormulariosPagamento() {
    // Formulário PIX
    const pixConteudo = document.getElementById('pix-conteudo');
    pixConteudo.innerHTML = `
        <div class="form-pix">
            <p>Clique no botão abaixo para gerar o QR Code PIX</p>
            <button class="btn-gerar-pix" onclick="gerarQRCodePix()">
                <i class="fas fa-qrcode"></i> Gerar QR Code PIX
            </button>
        </div>
    `;
    
    // Formulário Cartão de Crédito
    const creditoConteudo = document.getElementById('credito-conteudo');
    creditoConteudo.innerHTML = `
        <div class="form-cartao">
            <div class="form-grupo">
                <label for="numero-cartao">Número do Cartão</label>
                <input type="text" id="numero-cartao" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatarNumeroCartao(this)">
            </div>
            
            <div class="form-grupo">
                <label for="nome-cartao">Nome no Cartão</label>
                <input type="text" id="nome-cartao" placeholder="SEU NOME COMPLETO">
            </div>
            
            <div class="form-linha">
                <div class="form-grupo">
                    <label for="validade-cartao">Validade (MM/AA)</label>
                    <input type="text" id="validade-cartao" placeholder="MM/AA" maxlength="5" oninput="formatarValidade(this)">
                </div>
                
                <div class="form-grupo">
                    <label for="cvv-cartao">CVV</label>
                    <input type="text" id="cvv-cartao" placeholder="123" maxlength="3" oninput="formatarCVV(this)">
                </div>
            </div>
            
            <div class="form-grupo">
                <label for="parcelas-cartao">Parcelas</label>
                <select id="parcelas-cartao">
                    ${gerarOpcoesParcelas()}
                </select>
            </div>
        </div>
    `;
    
    // Formulário Cartão de Débito
    const debitoConteudo = document.getElementById('debito-conteudo');
    debitoConteudo.innerHTML = `
        <div class="form-cartao">
            <div class="form-grupo">
                <label for="numero-debito">Número do Cartão</label>
                <input type="text" id="numero-debito" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatarNumeroCartao(this)">
            </div>
            
            <div class="form-grupo">
                <label for="nome-debito">Nome no Cartão</label>
                <input type="text" id="nome-debito" placeholder="SEU NOME COMPLETO">
            </div>
            
            <div class="form-linha">
                <div class="form-grupo">
                    <label for="validade-debito">Validade (MM/AA)</label>
                    <input type="text" id="validade-debito" placeholder="MM/AA" maxlength="5" oninput="formatarValidade(this)">
                </div>
                
                <div class="form-grupo">
                    <label for="cvv-debito">CVV</label>
                    <input type="text" id="cvv-debito" placeholder="123" maxlength="3" oninput="formatarCVV(this)">
                </div>
            </div>
            
            <div class="form-grupo">
                <label for="senha-debito">Senha</label>
                <input type="password" id="senha-debito" placeholder="••••" maxlength="6">
            </div>
        </div>
    `;
}

function gerarOpcoesParcelas() {
    let options = '<option value="1">1x R$ ' + totalPedido.toFixed(2) + ' (à vista)</option>';
    for (let i = 2; i <= 6; i++) {
        const valorParcela = (totalPedido / i).toFixed(2);
        options += `<option value="${i}">${i}x R$ ${valorParcela}</option>`;
    }
    return options;
}

// Formatação de campos
function formatarNumeroCartao(input) {
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length > 16) {
        valor = valor.substring(0, 16);
    }
    
    let formatado = '';
    for (let i = 0; i < valor.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formatado += ' ';
        }
        formatado += valor[i];
    }
    
    input.value = formatado;
}

function formatarValidade(input) {
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length > 4) {
        valor = valor.substring(0, 4);
    }
    
    if (valor.length >= 2) {
        input.value = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    } else {
        input.value = valor;
    }
}

function formatarCVV(input) {
    input.value = input.value.replace(/\D/g, '').substring(0, 3);
}

// Seleção de Método de Pagamento
function selecionarMetodo(metodo) {
    metodoPagamento = metodo;
    
    // Remover classe ativo de todos
    document.querySelectorAll('.metodo-pagamento').forEach(el => {
        el.classList.remove('ativo');
    });
    
    // Esconder todos os conteúdos
    document.querySelectorAll('.metodo-conteudo').forEach(el => {
        el.style.display = 'none';
    });
    
    // Ativar o método selecionado
    const metodoElement = document.querySelector(`[data-metodo="${metodo}"]`);
    if (metodoElement) {
        metodoElement.classList.add('ativo');
        const conteudo = metodoElement.querySelector('.metodo-conteudo');
        if (conteudo) {
            conteudo.style.display = 'block';
        }
    }
    
    // Atualizar progresso
    atualizarProgresso(2);
    atualizarBotaoFinalizar();
}

// PIX Functions
function inicializarPix() {
    // Gerar código PIX aleatório
    const codigo = gerarCodigoPix();
    document.getElementById('pix-codigo').textContent = codigo;
}

function gerarQRCodePix() {
    const modal = document.getElementById('modalPix');
    const qrContainer = document.getElementById('qr-code');
    const codigoPix = document.getElementById('pix-codigo').textContent;
    
    // Mostrar modal primeiro
    modal.style.display = 'flex';
    
    // Limpar container
    qrContainer.innerHTML = '';
    
    // Gerar QR Code FALSO (simulado) para evitar problemas
    qrContainer.innerHTML = `
        <div style="width:200px;height:200px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;border-radius:8px;position:relative;">
            <div style="text-align:center;">
                <i class="fas fa-qrcode" style="font-size:3rem;color:#666;margin-bottom:10px;"></i>
                <p style="color:#666;font-size:0.9rem;">QR Code de Exemplo</p>
                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:180px;height:180px;display:grid;grid-template-columns:repeat(11,1fr);gap:2px;">
                    ${Array(121).fill(0).map((_, i) => 
                        `<div style="background:${Math.random() > 0.5 ? '#000' : '#fff'};border-radius:1px;"></div>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Iniciar timer de 10 segundos (corrigido)
    iniciarTimerPix();
}

function iniciarTimerPix() {
    let segundos = 10; // Alterado de 30 para 10 segundos
    const timerElement = document.getElementById('pix-timer');
    const redirectElement = document.getElementById('redirect-timer');
    
    // Garantir que timers anteriores sejam limpos
    if (timerPix) {
        clearInterval(timerPix);
    }
    if (timerRedirect) {
        clearInterval(timerRedirect);
    }
    
    // Atualizar timer a cada segundo
    timerPix = setInterval(() => {
        segundos--;
        
        if (timerElement) timerElement.textContent = segundos;
        if (redirectElement) redirectElement.textContent = segundos;
        
        // Mudar cor quando estiver nos últimos 5 segundos
        if (segundos <= 5) {
            if (timerElement && timerElement.parentElement) {
                timerElement.parentElement.style.background = '#DC3545';
            }
        }
        
        // Quando chegar a 0, redirecionar
        if (segundos <= 0) {
            clearInterval(timerPix);
            timerPix = null;
            finalizarPedidoPix();
        }
    }, 1000);
}

function finalizarPedidoPix() {
    // Esconder modal de processamento se estiver aberto
    document.getElementById('modalProcessando').style.display = 'none';
    
    // Fechar modal do PIX
    const modalPix = document.getElementById('modalPix');
    if (modalPix) {
        modalPix.style.display = 'none';
    }
    
    // Criar pedido
    const pedido = criarPedido('pix');
    
    // Redirecionar para confirmação
    setTimeout(() => {
        window.location.href = 'confirmacao.html';
    }, 500);
}

function processarPagamento() {
    if (carrinhoItens.length === 0) {
        alert('Seu carrinho está vazio! Adicione itens antes de finalizar.');
        return;
    }
    
    // Mostrar modal de processamento
    const modalProcessando = document.getElementById('modalProcessando');
    if (modalProcessando) {
        modalProcessando.style.display = 'flex';
    }
    
    // Simular processamento baseado no método escolhido
    setTimeout(() => {
        switch(metodoPagamento) {
            case 'pix':
                // Esconder modal de processamento
                if (modalProcessando) {
                    modalProcessando.style.display = 'none';
                }
                // Gerar QR Code PIX diretamente
                gerarQRCodePix();
                break;
                
            case 'credito':
                if (validarCartaoCredito()) {
                    processarCartaoCredito();
                } else {
                    if (modalProcessando) modalProcessando.style.display = 'none';
                }
                break;
                
            case 'debito':
                if (validarCartaoDebito()) {
                    processarCartaoDebito();
                } else {
                    if (modalProcessando) modalProcessando.style.display = 'none';
                }
                break;
                
            default:
                alert('Por favor, selecione uma forma de pagamento');
                if (modalProcessando) modalProcessando.style.display = 'none';
                return;
        }
    }, 1000); // Reduzido para 1 segundo
}


// Validação de Cartão
function validarCartaoCredito() {
    const numero = document.getElementById('numero-cartao').value.replace(/\s/g, '');
    const nome = document.getElementById('nome-cartao').value.trim();
    const validade = document.getElementById('validade-cartao').value;
    const cvv = document.getElementById('cvv-cartao').value;
    
    if (!numero || numero.length !== 16) {
        alert('Por favor, insira um número de cartão válido (16 dígitos)');
        return false;
    }
    
    if (!nome || nome.length < 3) {
        alert('Por favor, insira o nome completo como está no cartão');
        return false;
    }
    
    if (!validade || !/^\d{2}\/\d{2}$/.test(validade)) {
        alert('Por favor, insira uma validade no formato MM/AA');
        return false;
    }
    
    if (!cvv || cvv.length !== 3) {
        alert('Por favor, insira um CVV válido (3 dígitos)');
        return false;
    }
    
    return true;
}

function validarCartaoDebito() {
    const numero = document.getElementById('numero-debito').value.replace(/\s/g, '');
    const nome = document.getElementById('nome-debito').value.trim();
    const validade = document.getElementById('validade-debito').value;
    const cvv = document.getElementById('cvv-debito').value;
    const senha = document.getElementById('senha-debito').value;
    
    if (!numero || numero.length !== 16) {
        alert('Por favor, insira um número de cartão válido (16 dígitos)');
        return false;
    }
    
    if (!nome || nome.length < 3) {
        alert('Por favor, insira o nome completo como está no cartão');
        return false;
    }
    
    if (!validade || !/^\d{2}\/\d{2}$/.test(validade)) {
        alert('Por favor, insira uma validade no formato MM/AA');
        return false;
    }
    
    if (!cvv || cvv.length !== 3) {
        alert('Por favor, insira um CVV válido (3 dígitos)');
        return false;
    }
    
    if (!senha || senha.length !== 4) {
        alert('Por favor, insira uma senha de 4 dígitos');
        return false;
    }
    
    return true;
}

// Processamento do Pagamento
function processarPagamento() {
    if (carrinhoItens.length === 0) {
        alert('Seu carrinho está vazio! Adicione itens antes de finalizar.');
        return;
    }
    
    // Mostrar modal de processamento
    document.getElementById('modalProcessando').style.display = 'flex';
    
    // Simular processamento baseado no método escolhido
    setTimeout(() => {
        switch(metodoPagamento) {
            case 'pix':
                gerarQRCodePix();
                break;
                
            case 'credito':
                if (validarCartaoCredito()) {
                    processarCartaoCredito();
                } else {
                    document.getElementById('modalProcessando').style.display = 'none';
                }
                break;
                
            case 'debito':
                if (validarCartaoDebito()) {
                    processarCartaoDebito();
                } else {
                    document.getElementById('modalProcessando').style.display = 'none';
                }
                break;
                
            default:
                alert('Por favor, selecione uma forma de pagamento');
                document.getElementById('modalProcessando').style.display = 'none';
                return;
        }
    }, 1500);
}

function processarCartaoCredito() {
    // Simular processamento do cartão
    setTimeout(() => {
        document.getElementById('modalProcessando').style.display = 'none';
        
        // Criar pedido
        const pedido = criarPedido('cartao_credito');
        
        // Redirecionar para confirmação
        redirecionarParaConfirmacao(pedido);
    }, 2000);
}

function processarCartaoDebito() {
    // Simular processamento do cartão
    setTimeout(() => {
        document.getElementById('modalProcessando').style.display = 'none';
        
        // Criar pedido
        const pedido = criarPedido('cartao_debito');
        
        // Redirecionar para confirmação
        redirecionarParaConfirmacao(pedido);
    }, 2000);
}

function finalizarPedidoPix() {
    // Criar pedido
    const pedido = criarPedido('pix');
    
    // Redirecionar para confirmação
    redirecionarParaConfirmacao(pedido);
}

function criarPedido(metodo) {
    const numeroPedido = 'BURG' + Date.now().toString().substr(-6);
    const endereco = JSON.parse(localStorage.getItem('enderecoEntrega') || '{}');
    
    const pedido = {
        numero: numeroPedido,
        data: new Date().toISOString(),
        itens: carrinhoItens,
        total: totalPedido,
        metodo: metodo,
        endereco: endereco,
        status: metodo === 'pix' ? 'Aguardando pagamento' : 'Pagamento confirmado',
        tempoEstimado: '30-40 minutos'
    };
    
    // Salvar pedido no localStorage
    localStorage.setItem('ultimoPedido', JSON.stringify(pedido));
    
    // Limpar carrinho
    localStorage.removeItem('carrinho');
    carrinhoItens = [];
    
    return pedido;
}

function redirecionarParaConfirmacao(pedido) {
    // Salvar número do pedido para a página de confirmação
    localStorage.setItem('numeroPedido', pedido.numero);
    
    // Redirecionar após 1 segundo
    setTimeout(() => {
        window.location.href = 'confirmacao.html';
    }, 1000);
}

// Funções Auxiliares
function atualizarProgresso(passo) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        if (index < passo) {
            step.classList.add('ativo');
        } else {
            step.classList.remove('ativo');
        }
    });
}

function atualizarBotaoFinalizar() {
    const btn = document.getElementById('btn-finalizar');
    if (btn) {
        btn.disabled = carrinhoItens.length === 0;
    }
}

// Fechar modais ao clicar fora
window.addEventListener('click', function(event) {
    const modalPix = document.getElementById('modalPix');
    if (event.target === modalPix) {
        fecharModalPix();
    }
});

// Fechar com ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        fecharModalPix();
        document.getElementById('modalProcessando').style.display = 'none';
    }
});

// Atualizar total quando carrinho mudar
window.addEventListener('storage', function(event) {
    if (event.key === 'carrinho') {
        carregarCarrinho();
        renderizarCarrinho();
        calcularTotal();
        atualizarBotaoFinalizar();
    }
});

window.addEventListener('beforeunload', function() {
    if (timerPix) {
        clearInterval(timerPix);
    }
    if (timerRedirect) {
        clearInterval(timerRedirect);
    }
});