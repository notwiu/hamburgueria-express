# hamburgueria-express
🍔 BurgerExpress - Sistema de Delivery Completo
Um sistema completo de delivery de hamburgueria com frontend moderno (HTML, CSS, JS) e backend em Python (Flask). Sistema funcional com carrinho, checkout, múltiplos métodos de pagamento e confirmação de pedidos.

https://img.shields.io/badge/Status-Completo-success
https://img.shields.io/badge/Tecnologias-HTML%252FCSS%252FJS%252FPython-blue

📋 Índice
Funcionalidades

Pré-requisitos

Instalação e Execução

Estrutura do Projeto

Telas do Sistema

Configuração

Como Usar

Solução de Problemas

Próximas Melhorias

🚀 Funcionalidades
✅ Implementadas
Tela de CEP/Endereço com validação e cálculo de frete

Cardápio completo com categorias (Hambúrgueres, Combos, Bebidas, Acompanhamentos)

Carrinho interativo com aumento/diminuição/remoção de itens

Checkout completo com 3 métodos de pagamento:

PIX com QR Code e timer de 10 segundos

Cartão de Crédito com validação

Cartão de Débito com validação

Confirmação de pedido com acompanhamento

Design responsivo para mobile e desktop

Animações suaves em todas as interações

Persistência com localStorage

🎯 Destaques
Interface moderna e intuitiva

Simulação realista de pagamentos

Fluxo completo do usuário

Fácil personalização

⚙️ Pré-requisitos
Para o Frontend (HTML/CSS/JS):
Navegador moderno (Chrome, Firefox, Edge)

Nada mais! O frontend funciona sozinho

Para o Backend (Python/Flask - Opcional):
Python 3.8 ou superior

pip (gerenciador de pacotes do Python)

🛠️ Instalação e Execução
OPÇÃO 1: Apenas Frontend (RECOMENDADO PARA TESTE RÁPIDO)
Baixe os arquivos em uma pasta:

text
hamburgueria-express/
├── index.html          # Tela inicial (CEP)
├── cardapio.html       # Cardápio completo
├── checkout.html       # Checkout e pagamento
├── confirmacao.html    # Confirmação do pedido
├── styles.css          # Estilos principais
├── cardapio.css        # Estilos do cardápio
├── checkout.css        # Estilos do checkout
├── confirmacao.css     # Estilos da confirmação
├── cardapio.js         # Lógica do cardápio
└── checkout.js         # Lógica do checkout
Abra o arquivo index.html no navegador

Pronto! O sistema funciona 100% no frontend

OPÇÃO 2: Com Backend Python (Flask)
Passo 1: Instalar Python
Windows: Baixe do python.org

Mac: Já vem instalado ou use brew install python

Linux: sudo apt install python3 python3-pip

Passo 2: Configurar Ambiente Virtual
bash
# Na pasta do projeto, execute:
python -m venv venv

# Ativar o ambiente virtual:
# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
Passo 3: Instalar Dependências
bash
pip install flask flask-cors
Passo 4: Criar Arquivo do Backend
Crie um arquivo app.py com:

python
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/teste', methods=['GET'])
def teste():
    return jsonify({"mensagem": "Backend funcionando!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
Passo 5: Executar o Backend
bash
python app.py
Acesse: http://localhost:5000/api/teste

Passo 6: Executar o Frontend
Abra o index.html no navegador ou use um servidor local:

bash
# Na pasta do frontend:
python -m http.server 8000
Acesse: http://localhost:8000

📁 Estrutura do Projeto
text
hamburgueria-express/
│
├── frontend/                    # Interface do usuário
│   ├── index.html              # Tela inicial (CEP)
│   ├── cardapio.html           # Cardápio com produtos
│   ├── checkout.html           # Checkout e pagamento
│   ├── confirmacao.html        # Confirmação do pedido
│   │
│   ├── css/                    # Estilos
│   │   ├── styles.css          # Estilos gerais
│   │   ├── cardapio.css        # Estilos do cardápio
│   │   ├── checkout.css        # Estilos do checkout
│   │   └── confirmacao.css     # Estilos da confirmação
│   │
│   └── js/                     # Scripts JavaScript
│       ├── cardapio.js         # Lógica do cardápio/carrinho
│       └── checkout.js         # Lógica do checkout/pagamento
│
├── backend/                    # API Python (Opcional)
│   ├── app.py                 # Aplicação Flask
│   ├── requirements.txt       # Dependências Python
│   └── venv/                  # Ambiente virtual
│
└── images/                    # Imagens dos produtos (Opcional)
    ├── produtos/
    └── categorias/
🖥️ Telas do Sistema
1. Tela Inicial (index.html)
text
🍔 BurgerExpress
Informe seu CEP para delivery
[CEP: _____-___] [CONSULTAR]
2. Cardápio (cardapio.html)
Categorias: Hambúrgueres, Combos, Bebidas, Acompanhamentos

Cards com produtos, preços e botão "Adicionar"

Carrinho flutuante com contador

3. Checkout (checkout.html)
Resumo do pedido

Endereço de entrega

Métodos de pagamento: PIX, Cartão de Crédito, Cartão de Débito

Formulários de pagamento

4. Confirmação (confirmacao.html)
Número do pedido

Tempo estimado

Resumo completo

Botões: Novo pedido, Acompanhar, Compartilhar

⚙️ Configuração
Personalizar Produtos
No cardapio.html, edite os cards de produto:

html
<div class="card-produto" data-categoria="hamburgueres">
    <div class="produto-imagem">
        <!-- Sua imagem aqui -->
        <img src="images/seu-hamburguer.jpg" alt="Nome do Hambúrguer">
    </div>
    <div class="produto-info">
        <h3>Nome do Hambúrguer</h3>
        <p class="produto-descricao">Descrição do produto</p>
        <div class="produto-preco">
            <span class="preco-atual">R$ 29,90</span>
        </div>
        <button class="btn-adicionar" 
                data-id="1" 
                data-nome="Nome do Hambúrguer" 
                data-preco="29.90">
            <i class="fas fa-plus"></i> Adicionar
        </button>
    </div>
</div>
Mudar Cores
No styles.css, edite as variáveis CSS:

css
:root {
    --primary: #FF6B35;      /* Cor principal (laranja) */
    --primary-dark: #E55A2B; /* Cor escura */
    --secondary: #FFA500;    /* Cor secundária */
    --dark: #1A1A1A;         /* Cor de texto */
    /* ... outras cores */
}
Adicionar Imagens
Coloque suas imagens na pasta images/

No HTML, substitua:

html
<!-- De: -->
<i class="fas fa-hamburger"></i>

<!-- Para: -->
<img src="images/seu-produto.jpg" alt="Nome do Produto">
🎮 Como Usar
Fluxo do Usuário:
Informe o CEP na tela inicial

Confirme o endereço e complementos

Acesse o cardápio e adicione itens ao carrinho

Ajuste quantidades no carrinho (ícone no canto)

Vá para checkout e escolha pagamento

PIX: QR Code aparece por 10 segundos → redireciona automaticamente

Cartão: Preencha dados → confirmação

Veja a confirmação do pedido com número e tempo estimado

Testando Pagamentos:
PIX: Aguarde 10 segundos após QR Code aparecer

Cartão: Use dados fictícios:

Número: 4242 4242 4242 4242

Validade: 12/30

CVV: 123

Nome: TESTE

🔧 Solução de Problemas
Problema: Página não carrega
text
Solução: Verifique se todos os arquivos estão na mesma pasta
Problema: Carrinho não funciona
text
Solução: Abra o console do navegador (F12) e recarregue
Problema: QR Code não aparece
text
Solução: O sistema usa QR Code simulado. Aguarde 10 segundos
Problema: Backend não inicia
bash
# Verifique o Python:
python --version

# Verifique as dependências:
pip list

# Execute com debug:
python app.py --debug
🚀 Próximas Melhorias
Planejadas:
Backend completo com banco de dados

Sistema de login de usuários

Histórico de pedidos

Avaliações dos produtos

Cupons de desconto

API de CEP real (ViaCEP)

Integração com WhatsApp para pedidos

Painel administrativo

Como contribuir:
Faça um fork do projeto

Crie uma branch: git checkout -b minha-melhoria

Commit suas mudanças: git commit -m 'Adicionei X'

Push: git push origin minha-melhoria

Abra um Pull Request

📞 Suporte
Problemas comuns:
"Carrinho não salva": O navegador bloqueia localStorage? Verifique configurações

"CSS não carrega": Verifique caminhos dos arquivos CSS no HTML

"JavaScript não funciona": Verifique console do navegador (F12 → Console)

Para ajuda:
Verifique o console do navegador (F12)

Confira se todos os arquivos estão na mesma pasta

Teste em outro navegador

Recarregue a página com Ctrl+F5

📝 Licença
Este projeto é para fins educacionais e demonstração. Sinta-se livre para usar, modificar e distribuir.

✨ Créditos
Design: Interface moderna com CSS Grid/Flexbox

Ícones: Font Awesome 6

Fontes: Google Fonts (Poppins)

Cores: Paleta personalizada para hamburgueria

Desenvolvido com: HTML5, CSS3, JavaScript ES6+, Python Flask