// confirmacao.js
document.addEventListener('DOMContentLoaded', function() {
    carregarPedidoConfirmacao();
});

function carregarPedidoConfirmacao() {
    const pedidoSalvo = localStorage.getItem('ultimoPedido');
    
    if (pedidoSalvo) {
        try {
            const pedido = JSON.parse(pedidoSalvo);
            
            // Atualizar informações do pedido
            document.getElementById('numero-pedido').textContent = pedido.numero || 'Pedido #000000';
            document.getElementById('status-pedido').textContent = pedido.status || 'Pedido confirmado';
            document.getElementById('tempo-entrega').textContent = pedido.tempoEstimado || '30-40 minutos';
            document.getElementById('metodo-pagamento').textContent = formatarMetodoPagamento(pedido.metodo);
            
            // Endereço
            if (pedido.endereco) {
                document.getElementById('endereco-confirmacao').textContent = pedido.endereco.endereco || 'Endereço não informado';
            }
            
            // Calcular totais
            const subtotal = pedido.itens ? pedido.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0) : 0;
            const frete = pedido.frete || 7.50;
            const taxa = pedido.taxa || 2.00;
            const total = pedido.total || (subtotal + frete + taxa);
            
            document.getElementById('subtotal-confirmacao').textContent = subtotal.toFixed(2);
            document.getElementById('frete-confirmacao').textContent = frete.toFixed(2);
            document.getElementById('taxa-confirmacao').textContent = taxa.toFixed(2);
            document.getElementById('total-confirmacao').textContent = total.toFixed(2);
            
            // Listar itens
            const container = document.getElementById('lista-itens-confirmacao');
            if (pedido.itens && pedido.itens.length > 0) {
                let html = '';
                pedido.itens.forEach(item => {
                    html += `
                        <div class="item-confirmacao">
                            <span>${item.quantidade}x ${item.nome}</span>
                            <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                        </div>
                    `;
                });
                container.innerHTML = html;
            }
            
        } catch (e) {
            console.error('Erro ao carregar pedido:', e);
            mostrarPedidoExemplo();
        }
    } else {
        mostrarPedidoExemplo();
    }
}

function formatarMetodoPagamento(metodo) {
    const metodos = {
        'pix': 'PIX',
        'cartao_credito': 'Cartão de Crédito',
        'cartao_debito': 'Cartão de Débito'
    };
    return metodos[metodo] || metodo || 'PIX';
}

function mostrarPedidoExemplo() {
    // Dados de exemplo para demonstração
    document.getElementById('numero-pedido').textContent = 'BURG' + Date.now().toString().substr(-6);
    document.getElementById('tempo-entrega').textContent = '30-40 minutos';
}

function acompanharPedido() {
    document.getElementById('modalAcompanhamento').style.display = 'flex';
}

function fecharModalAcompanhamento() {
    document.getElementById('modalAcompanhamento').style.display = 'none';
}

function contatarEntregador() {
    alert('Ligando para o entregador... (simulação)');
}

function compartilharPedido() {
    if (navigator.share) {
        navigator.share({
            title: 'Meu pedido BurgerExpress',
            text: `Acabei de fazer um pedido no BurgerExpress! Nº ${document.getElementById('numero-pedido').textContent}`,
            url: window.location.href
        });
    } else {
        alert('Link do pedido copiado para a área de transferência!');
    }
}