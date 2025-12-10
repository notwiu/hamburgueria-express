// Gerenciamento do carrinho
class Carrinho {
    constructor() {
        this.sessionId = 'user_' + Math.random().toString(36).substr(2, 9);
        this.itens = [];
        this.subtotal = 0;
        this.frete = 8.50;
        this.total = 0;
        this.observador = null;
        
        this.inicializar();
        this.carregarCarrinho();
    }
    
    inicializar() {
        // Elementos do DOM
        this.carrinhoToggle = document.getElementById('carrinho-toggle');
        this.modalCarrinho = document.getElementById('modal-carrinho');
        this.btnFecharModal = document.querySelector('.btn-fechar');
        this.carrinhoItens = document.getElementById('carrinho-itens');
        this.carrinhoVazio = document.getElementById('carrinho-vazio');
        this.carrinhoResumo = document.getElementById('carrinho-resumo');
        this.carrinhoContador = document.getElementById('carrinho-contador');
        this.carrinhoValor = document.getElementById('carrinho-valor');
        this.btnFinalizar = document.getElementById('btn-finalizar-pedido');
        
        // Event Listeners
        if (this.carrinhoToggle) {
            this.carrinhoToggle.addEventListener('click', () => this.toggleModal());
        }
        
        if (this.btnFecharModal) {
            this.btnFecharModal.addEventListener('click', () => this.fecharModal());
        }
        
        if (this.btnFinalizar) {
            this.btnFinalizar.addEventListener('click', () => this.finalizarPedido());
        }
        
        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === this.modalCarrinho) {
                this.fecharModal();
            }
        });
    }
    
    async carregarCarrinho() {
        try {
            const response = await fetch(`http://localhost:5000/api/carrinho/${this.sessionId}`);
            const data = await response.json();
            
            this.itens = data.itens || [];
            this.subtotal = data.subtotal || 0;
            this.atualizarResumo();
            this.atualizarInterface();
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            // Tentar carregar do localStorage como fallback
            this.carregarLocalStorage();
        }
    }
    
    carregarLocalStorage() {
        const carrinhoSalvo = localStorage.getItem('carrinho_' + this.sessionId);
        if (carrinhoSalvo) {
            this.itens = JSON.parse(carrinhoSalvo);
            this.calcularSubtotal();
            this.atualizarInterface();
        }
    }
    
    salvarLocalStorage() {
        localStorage.setItem('carrinho_' + this.sessionId, JSON.stringify(this.itens));
    }
    
    async adicionarItem(produtoId, quantidade = 1) {
        try {
            const response = await fetch('http://localhost:5000/api/adicionar-carrinho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: this.sessionId,
                    produto_id: produtoId,
                    quantidade: quantidade
                })
            });
            
            const data = await response.json();
            
            if (data.sucesso) {
                this.itens = data.carrinho;
                this.atualizarResumo();
                this.atualizarInterface();
                this.animarCarrinho();
                
                // Salvar no localStorage também
                this.salvarLocalStorage();
                
                // Notificar observador
                if (this.observador) {
                    this.observador.onItemAdicionado(produtoId);
                }
                
                return true;
            }
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            // Fallback: adicionar localmente
            this.adicionarItemLocal(produtoId, quantidade);
            return true;
        }
        
        return false;
    }
    
    adicionarItemLocal(produtoId, quantidade) {
        // Buscar produto (em uma implementação real, viria de uma API)
        const produto = this.buscarProdutoMock(produtoId);
        
        if (!produto) return false;
        
        // Verificar se já está no carrinho
        const itemExistente = this.itens.find(item => item.id === produtoId);
        
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            this.itens.push({
                ...produto,
                quantidade: quantidade
            });
        }
        
        this.calcularSubtotal();
        this.atualizarInterface();
        this.animarCarrinho();
        this.salvarLocalStorage();
        
        return true;
    }
    
    buscarProdutoMock(produtoId) {
        // Mock de produtos (em produção, viria da API)
        const produtosMock = {
            1: { id: 1, nome: "Clássico", descricao: "Pão brioche, hambúrguer 180g", preco: 24.90, categoria: "hamburguer" },
            2: { id: 2, nome: "Bacon Supreme", descricao: "Bacon, cheddar, molho especial", preco: 29.90, categoria: "hamburguer" },
            101: { id: 101, nome: "Combo Família", descricao: "2x Clássico + Coca + Batata", preco: 89.90, categoria: "combo" },
            201: { id: 201, nome: "Coca-Cola 2L", descricao: "Refrigerante 2 litros", preco: 12.00, categoria: "bebida" }
        };
        
        return produtosMock[produtoId];
    }
    
    async removerItem(produtoId) {
        try {
            const response = await fetch('http://localhost:5000/api/remover-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: this.sessionId,
                    produto_id: produtoId
                })
            });
            
            this.itens = this.itens.filter(item => item.id !== produtoId);
            this.atualizarResumo();
            this.atualizarInterface();
            this.salvarLocalStorage();
        } catch (error) {
            console.error('Erro ao remover item:', error);
            // Fallback: remover localmente
            this.itens = this.itens.filter(item => item.id !== produtoId);
            this.calcularSubtotal();
            this.atualizarInterface();
            this.salvarLocalStorage();
        }
    }
    
    atualizarQuantidade(produtoId, novaQuantidade) {
        if (novaQuantidade < 1) {
            this.removerItem(produtoId);
            return;
        }
        
        const item = this.itens.find(item => item.id === produtoId);
        if (item) {
            item.quantidade = novaQuantidade;
            this.calcularSubtotal();
            this.atualizarInterface();
            this.salvarLocalStorage();
        }
    }
    
    calcularSubtotal() {
        this.subtotal = this.itens.reduce((total, item) => {
            return total + (item.preco * item.quantidade);
        }, 0);
    }
    
    atualizarResumo() {
        this.calcularSubtotal();
        this.total = this.subtotal + this.frete;
        
        // Atualizar elementos do resumo se existirem
        const resumoSubtotal = document.getElementById('resumo-subtotal');
        const resumoFrete = document.getElementById('resumo-frete');
        const resumoTotal = document.getElementById('resumo-total');
        
        if (resumoSubtotal) resumoSubtotal.textContent = this.subtotal.toFixed(2);
        if (resumoFrete) resumoFrete.textContent = this.frete.toFixed(2);
        if (resumoTotal) resumoTotal.textContent = this.total.toFixed(2);
    }
    
    atualizarInterface() {
        // Atualizar contador e valor do carrinho flutuante
        const totalItens = this.itens.reduce((total, item) => total + item.quantidade, 0);
        
        if (this.carrinhoContador) {
            this.carrinhoContador.textContent = totalItens;
            this.carrinhoContador.style.display = totalItens > 0 ? 'flex' : 'none';
        }
        
        if (this.carrinhoValor) {
            this.carrinhoValor.textContent = this.total.toFixed(2);
        }
        
        // Mostrar/ocultar carrinho flutuante
        const carrinhoFlutuante = document.getElementById('carrinho-flutuante');
        if (carrinhoFlutuante) {
            carrinhoFlutuante.classList.toggle('hidden', totalItens === 0);
        }
        
        // Atualizar modal do carrinho se estiver aberto
        this.atualizarModalCarrinho();
    }
    
    atualizarModalCarrinho() {
        if (!this.carrinhoItens || !this.carrinhoVazio || !this.carrinhoResumo) return;
        
        if (this.itens.length === 0) {
            this.carrinhoVazio.classList.remove('hidden');
            this.carrinhoItens.classList.add('hidden');
            this.carrinhoResumo.classList.add('hidden');
        } else {
            this.carrinhoVazio.classList.add('hidden');
            this.carrinhoItens.classList.remove('hidden');
            this.carrinhoResumo.classList.remove('hidden');
            
            // Renderizar itens
            this.carrinhoItens.innerHTML = '';
            
            this.itens.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'carrinho-item';
                itemElement.innerHTML = `
                    <div class="item-info">
                        <h4>${item.nome}</h4>
                        <p>${item.descricao || ''}</p>
                    </div>
                    <div class="item-controles">
                        <div class="quantidade-controle">
                            <button class="btn-diminuir" data-id="${item.id}">-</button>
                            <span>${item.quantidade}</span>
                            <button class="btn-aumentar" data-id="${item.id}">+</button>
                        </div>
                        <div class="item-preco">
                            R$ ${(item.preco * item.quantidade).toFixed(2)}
                        </div>
                        <button class="btn-remover" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                this.carrinhoItens.appendChild(itemElement);
            });
            
            // Adicionar event listeners aos botões
            this.carrinhoItens.querySelectorAll('.btn-diminuir').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    const item = this.itens.find(item => item.id === id);
                    if (item) {
                        this.atualizarQuantidade(id, item.quantidade - 1);
                    }
                });
            });
            
            this.carrinhoItens.querySelectorAll('.btn-aumentar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    const item = this.itens.find(item => item.id === id);
                    if (item) {
                        this.atualizarQuantidade(id, item.quantidade + 1);
                    }
                });
            });
            
            this.carrinhoItens.querySelectorAll('.btn-remover').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.closest('.btn-remover').dataset.id);
                    this.removerItem(id);
                });
            });
        }
        
        this.atualizarResumo();
    }
    
    animarCarrinho() {
        const carrinhoIcon = document.querySelector('.carrinho-icon');
        if (carrinhoIcon) {
            carrinhoIcon.classList.remove('pulse');
            void carrinhoIcon.offsetWidth; // Trigger reflow
            carrinhoIcon.classList.add('pulse');
            
            // Remover classe após animação
            setTimeout(() => {
                carrinhoIcon.classList.remove('pulse');
            }, 500);
        }
    }
    
    toggleModal() {
        if (this.modalCarrinho) {
            this.modalCarrinho.classList.toggle('hidden');
            if (!this.modalCarrinho.classList.contains('hidden')) {
                this.atualizarModalCarrinho();
            }
        }
    }
    
    fecharModal() {
        if (this.modalCarrinho) {
            this.modalCarrinho.classList.add('hidden');
        }
    }
    
    async finalizarPedido() {
        // Obter endereço do localStorage
        const enderecoData = JSON.parse(localStorage.getItem('enderecoEntrega') || '{}');
        
        if (!enderecoData.cep) {
            alert('Por favor, informe seu endereço antes de finalizar o pedido.');
            this.fecharModal();
            window.location.href = 'index.html';
            return;
        }
        
        // Em uma implementação real, aqui viria a tela de pagamento
        // Por enquanto, vamos simular o processamento
        
        try {
            const response = await fetch('http://localhost:5000/api/finalizar-pedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: this.sessionId,
                    endereco: enderecoData,
                    frete: enderecoData.frete || this.frete,
                    pagamento: {
                        metodo: 'cartao',
                        status: 'aprovado'
                    }
                })
            });
            
            const data = await response.json();
            
            if (data.sucesso) {
                // Redirecionar para tela de confirmação
                localStorage.setItem('ultimoPedido', JSON.stringify(data.pedido));
                window.location.href = 'confirmacao.html';
            }
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            // Fallback: redirecionar para confirmação simulada
            localStorage.setItem('ultimoPedido', JSON.stringify({
                numero: 'HBG-' + Date.now(),
                total: this.total,
                itens: this.itens
            }));
            window.location.href = 'confirmacao.html';
        }
    }
    
    setObservador(observador) {
        this.observador = observador;
    }
    
    limpar() {
        this.itens = [];
        this.subtotal = 0;
        this.total = 0;
        this.atualizarInterface();
        localStorage.removeItem('carrinho_' + this.sessionId);
    }
}

// Instanciar carrinho global
const carrinho = new Carrinho();

// Exportar para uso em outras páginas
if (typeof window !== 'undefined') {
    window.carrinho = carrinho;
}