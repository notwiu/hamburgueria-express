// Arquivo principal com funções utilitárias
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar máscaras de input
    inicializarMascaras();
    
    // Configurar eventos globais
    configurarEventosGlobais();
    
    // Verificar se há endereço salvo
    verificarEnderecoSalvo();
});

function inicializarMascaras() {
    // Máscara para telefone
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    telefoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 10) {
                value = '(' + value.substring(0, 2) + ') ' + 
                        value.substring(2, 7) + '-' + 
                        value.substring(7, 11);
            } else if (value.length > 6) {
                value = '(' + value.substring(0, 2) + ') ' + 
                        value.substring(2, 6) + '-' + 
                        value.substring(6, 10);
            } else if (value.length > 2) {
                value = '(' + value.substring(0, 2) + ') ' + 
                        value.substring(2, 6);
            } else if (value.length > 0) {
                value = '(' + value.substring(0, 2);
            }
            
            e.target.value = value;
        });
    });
    
    // Máscara para CPF
    const cpfInputs = document.querySelectorAll('input[data-mask="cpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 9) {
                value = value.substring(0, 3) + '.' + 
                        value.substring(3, 6) + '.' + 
                        value.substring(6, 9) + '-' + 
                        value.substring(9, 11);
            } else if (value.length > 6) {
                value = value.substring(0, 3) + '.' + 
                        value.substring(3, 6) + '.' + 
                        value.substring(6, 9);
            } else if (value.length > 3) {
                value = value.substring(0, 3) + '.' + 
                        value.substring(3, 6);
            }
            
            e.target.value = value;
        });
    });
}

function configurarEventosGlobais() {
    // Prevenir envio de formulários com Enter onde não deve
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            const form = e.target.closest('form');
            if (!form || form.getAttribute('data-allow-enter') !== 'true') {
                e.preventDefault();
            }
        }
    });
    
    // Adicionar classe de foco personalizado
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

function verificarEnderecoSalvo() {
    const enderecoSalvo = localStorage.getItem('enderecoEntrega');
    const currentPage = window.location.pathname;
    
    // Se estiver em qualquer página exceto a inicial e não tiver endereço, redirecionar
    if (!enderecoSalvo && !currentPage.includes('index.html') && currentPage !== '/') {
        alert('Por favor, informe seu endereço primeiro.');
        window.location.href = 'index.html';
    }
}

// Funções utilitárias
function formatarMoeda(valor) {
    return 'R$ ' + parseFloat(valor).toFixed(2).replace('.', ',');
}

function formatarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length === 8) {
        return cep.substring(0,5) + '-' + cep.substring(5);
    }
    return cep;
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verificar dígitos repetidos
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    // Validar segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// Exportar funções para uso global
if (typeof window !== 'undefined') {
    window.utils = {
        formatarMoeda,
        formatarCEP,
        validarEmail,
        validarCPF
    };
}