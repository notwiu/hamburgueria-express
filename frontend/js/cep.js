// Validação e consulta de CEP
document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep-input');
    const btnConsultar = document.getElementById('btn-consultar-cep');
    const confirmacaoDiv = document.getElementById('confirmacao-endereco');
    const enderecoCompleto = document.getElementById('endereco-completo');
    const cepConfirmacao = document.getElementById('cep-confirmacao');
    const valorFrete = document.getElementById('valor-frete');
    const btnContinuar = document.getElementById('btn-continuar-cardapio');
    
    // Máscara para CEP
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        
        e.target.value = value;
        
        // Habilitar botão se CEP estiver completo
        btnConsultar.disabled = value.length !== 9;
    });
    
    // Consultar CEP
    btnConsultar.addEventListener('click', consultarCEP);
    
    // Permitir Enter no campo CEP
    cepInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.length === 9) {
            consultarCEP();
        }
    });
    
    async function consultarCEP() {
        const cep = cepInput.value.replace('-', '');
        
        if (cep.length !== 8) {
            alert('Por favor, insira um CEP válido (8 dígitos)');
            return;
        }
        
        // Mostrar loading
        btnConsultar.innerHTML = '<div class="loading"></div> Consultando...';
        btnConsultar.disabled = true;
        
        try {
            // Chamar a API do backend
            const response = await fetch('http://localhost:5000/api/validar-cep', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cep: cep })
            });
            
            const data = await response.json();
            
            if (data.valido) {
                // Mostrar confirmação de endereço
                enderecoCompleto.textContent = data.endereco;
                cepConfirmacao.textContent = data.cep;
                valorFrete.textContent = `R$ ${data.detalhes.frete.toFixed(2)}`;
                
                // Salvar dados no localStorage para uso posterior
                localStorage.setItem('enderecoEntrega', JSON.stringify({
                    cep: data.cep,
                    endereco: data.endereco,
                    detalhes: data.detalhes,
                    complemento: '',
                    referencia: '',
                    frete: data.detalhes.frete
                }));
                
                // Mostrar seção de confirmação com animação
                confirmacaoDiv.classList.remove('hidden');
                confirmacaoDiv.style.animation = 'none';
                setTimeout(() => {
                    confirmacaoDiv.style.animation = 'slideUp 0.6s ease-out';
                }, 10);
                
                // Rolar para a confirmação
                confirmacaoDiv.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('CEP não encontrado. Por favor, verifique o número.');
            }
        } catch (error) {
            console.error('Erro ao consultar CEP:', error);
            alert('Erro ao consultar CEP. Por favor, tente novamente.');
            
            // Simular resposta para demonstração
            simularRespostaCEP(cep);
        } finally {
            // Restaurar botão
            btnConsultar.innerHTML = '<i class="fas fa-search"></i> Consultar';
            btnConsultar.disabled = false;
        }
    }
    
    function simularRespostaCEP(cep) {
        // Simulação para demonstração
        const cepFormatado = cep.substring(0,5) + '-' + cep.substring(5);
        const frete = Math.random() * 5 + 5; // Frete entre 5 e 10 reais
        
        enderecoCompleto.textContent = `Rua Simulada, ${Math.floor(Math.random() * 1000)} - Centro - São Paulo/SP`;
        cepConfirmacao.textContent = cepFormatado;
        valorFrete.textContent = `R$ ${frete.toFixed(2)}`;
        
        localStorage.setItem('enderecoEntrega', JSON.stringify({
            cep: cepFormatado,
            endereco: enderecoCompleto.textContent,
            detalhes: { frete: frete },
            complemento: '',
            referencia: '',
            frete: frete
        }));
        
        confirmacaoDiv.classList.remove('hidden');
        confirmacaoDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Continuar para o cardápio
    btnContinuar.addEventListener('click', function() {
        // Salvar complemento e referência
        const enderecoData = JSON.parse(localStorage.getItem('enderecoEntrega') || '{}');
        enderecoData.complemento = document.getElementById('complemento').value;
        enderecoData.referencia = document.getElementById('referencia').value;
        localStorage.setItem('enderecoEntrega', JSON.stringify(enderecoData));
        
        // Redirecionar para a página do cardápio
        window.location.href = 'cardapio.html';
    });
    
    // Preencher campos se já tiver dados salvos
    const enderecoSalvo = localStorage.getItem('enderecoEntrega');
    if (enderecoSalvo) {
        const data = JSON.parse(enderecoSalvo);
        cepInput.value = data.cep;
        
        // Disparar consulta automática
        if (cepInput.value.length === 9) {
            setTimeout(() => {
                consultarCEP();
            }, 500);
        }
    }
});