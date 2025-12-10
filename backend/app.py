from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permitir requisições do frontend

# Banco de dados simulado em memória
PRODUTOS = {
    "hamburgueres": [
        {"id": 1, "nome": "Clássico", "descricao": "Pão brioche, hambúrguer 180g, queijo, alface, tomate", "preco": 24.90, "imagem": "hamburguer1.jpg", "categoria": "hamburguer"},
        {"id": 2, "nome": "Bacon Supreme", "descricao": "Bacon crocante, cheddar, molho especial, cebola caramelizada", "preco": 29.90, "imagem": "hamburguer2.jpg", "categoria": "hamburguer"},
        {"id": 3, "nome": "Vegetariano", "descricao": "Hambúrguer de grão-de-bico, rúcula, tomate seco, queijo coalho", "preco": 22.90, "imagem": "hamburguer3.jpg", "categoria": "hamburguer"},
        {"id": 4, "nome": "Duplo Cheddar", "descricao": "Dois hambúrgueres, cheddar derretido, cebola roxa, picles", "preco": 32.90, "imagem": "hamburguer4.jpg", "categoria": "hamburguer"}
    ],
    "combos": [
        {"id": 101, "nome": "Combo Família", "descricao": "2x Clássico + 2x Coca 600ml + Batata Grande", "preco": 89.90, "imagem": "combo1.jpg", "categoria": "combo"},
        {"id": 102, "nome": "Combo Duplo", "descricao": "1x Bacon Supreme + 1x Coca 350ml + Batata Média", "preco": 49.90, "imagem": "combo2.jpg", "categoria": "combo"},
        {"id": 103, "nome": "Combo Vegetariano", "descricao": "1x Vegetariano + Suco Natural + Batata Doce", "preco": 39.90, "imagem": "combo3.jpg", "categoria": "combo"}
    ],
    "bebidas": [
        {"id": 201, "nome": "Coca-Cola 2L", "descricao": "Refrigerante Coca-Cola 2 litros", "preco": 12.00, "imagem": "bebida1.jpg", "categoria": "bebida"},
        {"id": 202, "nome": "Suco Natural Laranja", "descricao": "Suco de laranja natural 500ml", "preco": 8.00, "imagem": "bebida2.jpg", "categoria": "bebida"},
        {"id": 203, "nome": "Água Mineral 500ml", "descricao": "Água mineral sem gás", "preco": 4.00, "imagem": "bebida3.jpg", "categoria": "bebida"},
        {"id": 204, "nome": "Milkshake Chocolate", "descricao": "Milkshake de chocolate 400ml", "preco": 14.90, "imagem": "bebida4.jpg", "categoria": "bebida"}
    ]
}

# CEPs válidos simulados (região: frete)
CEPS_VALIDOS = {
    "01001-000": {"logradouro": "Praça da Sé", "bairro": "Sé", "cidade": "São Paulo", "estado": "SP", "frete": 5.00},
    "01310-100": {"logradouro": "Avenida Paulista", "bairro": "Bela Vista", "cidade": "São Paulo", "estado": "SP", "frete": 6.50},
    "04538-132": {"logradouro": "Rua Funchal", "bairro": "Vila Olímpia", "cidade": "São Paulo", "estado": "SP", "frete": 8.00},
    "22451-000": {"logradouro": "Avenida das Américas", "bairro": "Barra da Tijuca", "cidade": "Rio de Janeiro", "estado": "RJ", "frete": 9.50}
}

# Carrinho global (em produção seria por sessão)
carrinhos = {}

@app.route('/api/validar-cep', methods=['POST'])
def validar_cep():
    data = request.json
    cep = data.get('cep', '').replace('-', '')
    
    # Simulação de busca de CEP
    if len(cep) == 8:
        cep_formatado = f"{cep[:5]}-{cep[5:]}"
        
        if cep_formatado in CEPS_VALIDOS:
            endereco = CEPS_VALIDOS[cep_formatado]
            return jsonify({
                "valido": True,
                "cep": cep_formatado,
                "endereco": f"{endereco['logradouro']}, {endereco['bairro']} - {endereco['cidade']}/{endereco['estado']}",
                "detalhes": endereco,
                "entrega_disponivel": True
            })
    
    # Se não encontrou nos válidos, simula um endereço genérico
    return jsonify({
        "valido": True,
        "cep": f"{cep[:5]}-{cep[5:]}",
        "endereco": f"Rua Simulada, 123 - Centro - São Paulo/SP",
        "detalhes": {"logradouro": "Rua Simulada", "bairro": "Centro", "cidade": "São Paulo", "estado": "SP", "frete": 7.50},
        "entrega_disponivel": True
    })

@app.route('/api/produtos', methods=['GET'])
def listar_produtos():
    categoria = request.args.get('categoria', '')
    
    if categoria in PRODUTOS:
        return jsonify(PRODUTOS[categoria])
    elif categoria == 'todos':
        todos = []
        for cat in PRODUTOS.values():
            todos.extend(cat)
        return jsonify(todos)
    else:
        return jsonify(PRODUTOS)

@app.route('/api/adicionar-carrinho', methods=['POST'])
def adicionar_carrinho():
    data = request.json
    session_id = data.get('session_id', 'default')
    produto_id = data.get('produto_id')
    quantidade = data.get('quantidade', 1)
    
    # Encontrar produto em todas as categorias
    produto = None
    for categoria in PRODUTOS.values():
        for p in categoria:
            if p['id'] == produto_id:
                produto = p.copy()
                break
        if produto:
            break
    
    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404
    
    produto['quantidade'] = quantidade
    
    # Adicionar ao carrinho da sessão
    if session_id not in carrinhos:
        carrinhos[session_id] = []
    
    # Verificar se produto já está no carrinho
    for item in carrinhos[session_id]:
        if item['id'] == produto_id:
            item['quantidade'] += quantidade
            break
    else:
        carrinhos[session_id].append(produto)
    
    return jsonify({
        "sucesso": True,
        "carrinho": carrinhos[session_id],
        "total_itens": sum(item['quantidade'] for item in carrinhos[session_id])
    })

@app.route('/api/carrinho/<session_id>', methods=['GET'])
def ver_carrinho(session_id):
    if session_id in carrinhos:
        return jsonify({
            "itens": carrinhos[session_id],
            "total_itens": sum(item['quantidade'] for item in carrinhos[session_id]),
            "subtotal": sum(item['preco'] * item['quantidade'] for item in carrinhos[session_id])
        })
    return jsonify({"itens": [], "total_itens": 0, "subtotal": 0})

@app.route('/api/remover-item', methods=['POST'])
def remover_item():
    data = request.json
    session_id = data.get('session_id', 'default')
    produto_id = data.get('produto_id')
    
    if session_id in carrinhos:
        carrinhos[session_id] = [item for item in carrinhos[session_id] if item['id'] != produto_id]
    
    return jsonify({"sucesso": True})

@app.route('/api/finalizar-pedido', methods=['POST'])
def finalizar_pedido():
    data = request.json
    session_id = data.get('session_id', 'default')
    
    if session_id not in carrinhos or not carrinhos[session_id]:
        return jsonify({"erro": "Carrinho vazio"}), 400
    
    # Gerar número de pedido
    numero_pedido = f"HBG-{datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
    
    # Calcular total
    subtotal = sum(item['preco'] * item['quantidade'] for item in carrinhos[session_id])
    frete = data.get('frete', 8.50)
    total = subtotal + frete
    
    # Criar pedido
    pedido = {
        "numero": numero_pedido,
        "data": datetime.now().isoformat(),
        "itens": carrinhos[session_id].copy(),
        "endereco": data.get('endereco', {}),
        "subtotal": subtotal,
        "frete": frete,
        "total": total,
        "pagamento": data.get('pagamento', {}),
        "status": "Em preparação",
        "tempo_estimado": random.randint(25, 45)
    }
    
    # Limpar carrinho
    carrinhos[session_id] = []
    
    return jsonify({
        "sucesso": True,
        "pedido": pedido,
        "mensagem": f"Pedido {numero_pedido} confirmado!"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)