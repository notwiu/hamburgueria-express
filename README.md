# Burger Delivery

[![Status](https://img.shields.io/badge/Status-Completo-success)](https://github.com)
[![Technologies](https://img.shields.io/badge/Stack-HTML%20|%20CSS%20|%20JS%20|%20Python-blue)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

Plataforma completa de delivery de hambúrgueres com interface moderna, carrinho interativo e múltiplos métodos de pagamento.

## Visão Geral

Sistema de delivery funcional com arquitetura frontend/backend opcional. O frontend é totalmente independente e funciona sem necessidade de backend.

**Funcionalidades principais:**
- ✅ Validação de CEP com cálculo de frete
- ✅ Cardápio com 4 categorias (Hambúrgueres, Combos, Bebidas, Acompanhamentos)
- ✅ Carrinho persistente com localStorage
- ✅ 3 métodos de pagamento (PIX, Débito, Crédito)
- ✅ Design responsivo (mobile-first)
- ✅ Animações fluidas

## Início Rápido

### Opção 1: Apenas Frontend (Recomendado)

```bash
# 1. Clone ou baixe o projeto
# 2. Abra index.html no navegador
# Pronto! ✨
```

### Opção 2: Com Backend Python

```bash
# 1. Instale dependências
pip install -r backend/requirements.txt

# 2. Execute o backend
python backend/app.py

# 3. Em outro terminal, sirva o frontend
python -m http.server 8000

# Acesse http://localhost:8000
```

## Estrutura do Projeto

```
.
├── frontend/
│   ├── index.html              # Tela inicial (CEP)
│   ├── cardapio.html           # Cardápio com produtos
│   ├── checkout.html           # Pagamento
│   ├── confirmacao.html        # Confirmação de pedido
│   ├── css/                    # Estilos
│   │   ├── styles.css
│   │   ├── cardapio.css
│   │   ├── checkout.css
│   │   └── confirmacao.css
│   └── js/                     # Lógica JavaScript
│       ├── main.js
│       ├── cardapio.js
│       ├── carrinho.js
│       └── checkout.js
├── backend/                    # API Flask (opcional)
│   ├── app.py
│   ├── routes.py
│   ├── database.py
│   └── requirements.txt
└── README.md
```

## Fluxo de Uso

1. **Informar CEP** → Validação e cálculo de frete
2. **Navegar Cardápio** → Adicionar itens ao carrinho
3. **Revisar Carrinho** → Ajustar quantidades
4. **Checkout** → Escolher método de pagamento
5. **Confirmação** → Receber número do pedido

## Configuração

### Personalizar Produtos

Edite `frontend/cardapio.html` e altere os dados do produto:

```html
<div class="card-produto" data-categoria="hamburgueres" data-id="1">
    <h3>Nome do Hambúrguer</h3>
    <p>Descrição</p>
    <span class="preco">R$ 29,90</span>
</div>
```

### Alterar Cores

Edite as variáveis CSS em `frontend/css/styles.css`:

```css
:root {
    --primary: #FF6B35;      /* Cor principal */
    --primary-dark: #E55A2B;
    --secondary: #FFA500;
    --dark: #1A1A1A;
}
```

## Requisitos

- **Frontend:** Navegador moderno (Chrome, Firefox, Edge, Safari)
- **Backend:** Python 3.8+ e pip

## Métodos de Pagamento

| Método | Status | Detalhes |
|--------|--------|----------|
| PIX | ✅ Simulado | QR Code com timer de 10s |
| Cartão Crédito | ✅ Simulado | Validação de campos |
| Cartão Débito | ✅ Simulado | Validação de campos |

**Dados de teste:** `4242 4242 4242 4242` | Validade: `12/30` | CVV: `123`

## Solução de Problemas

| Problema | Solução |
|----------|---------|
| Página não carrega | Verifique se todos os arquivos estão na mesma pasta |
| Carrinho não funciona | Abra DevTools (F12) e verifique o console |
| Estilos não carregam | Confirme caminhos relativos dos CSS no HTML |
| Backend não inicia | Execute `python --version` e verifique dependências |

## Desenvolvimento

### Estrutura de Branches

```bash
git checkout -b feature/sua-funcionalidade
git commit -m "feat: descrição da mudança"
git push origin feature/sua-funcionalidade
```

### Stack Tecnológico

- **Frontend:** HTML5, CSS3 (Grid/Flexbox), JavaScript ES6+
- **Backend:** Python 3, Flask, CORS
- **Design:** Font Awesome 6, Google Fonts (Poppins)

## Melhorias Futuras

- [ ] Backend completo com banco de dados
- [ ] Sistema de autenticação
- [ ] Histórico de pedidos
- [ ] Avaliações de produtos
- [ ] Cupons e promoções
- [ ] Integração ViaCEP
- [ ] Notificações via WhatsApp
- [ ] Painel administrativo

## Licença

MIT © 2024

## Suporte

Para dúvidas ou reportar bugs, abra uma [issue](https://github.com/notwiu/hamburgueria-express/issues).