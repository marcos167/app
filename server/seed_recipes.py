"""
Script to seed the database with recipes from data.ts
Run: python seed_recipes.py
"""
import json
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select
from server.db import engine, create_db_and_tables
from server.models import Recipe

# 29 recipes from data.ts
RECIPES_DATA = [
    {
        "title": "Bolo de Fubá da Vovó",
        "description": "Receita tradicional brasileira, perfeita para o café da tarde. Textura macia e sabor nostálgico.",
        "time": "45 min",
        "servings": "8 porções",
        "calories": "280 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800",
        "rating": 4.8,
        "reviews": 234,
        "ingredients": ["2 xícaras de fubá", "1 xícara de farinha de trigo", "3 ovos", "1 xícara de açúcar", "1/2 xícara de óleo", "1 xícara de leite", "1 colher de fermento"],
        "instructions": [
            {"step": 1, "text": "Pré-aqueça o forno a 180°C."},
            {"step": 2, "text": "Bata os ovos com o açúcar até ficar cremoso."},
            {"step": 3, "text": "Adicione o óleo e o leite, misture bem."},
            {"step": 4, "text": "Acrescente o fubá e a farinha, mexa até homogeneizar."},
            {"step": 5, "text": "Por último, adicione o fermento e misture delicadamente."},
            {"step": 6, "text": "Despeje em forma untada e asse por 40 minutos.", "timerMinutes": 40}
        ],
        "tags": ["Tradicional", "Café", "Sobremesas", "Fácil"],
        "reactions": {"love": 156, "like": 78, "dislike": 2}
    },
    {
        "title": "Pudim de Leite Condensado",
        "description": "O clássico pudim brasileiro cremoso e irresistível.",
        "time": "60 min",
        "servings": "10 porções",
        "calories": "320 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800",
        "rating": 4.9,
        "reviews": 456,
        "ingredients": ["1 lata de leite condensado", "2 latas de leite (mesma medida)", "3 ovos inteiros", "1 xícara de açúcar para calda"],
        "instructions": [
            {"step": 1, "text": "Faça a calda derretendo o açúcar em fogo médio até dourar."},
            {"step": 2, "text": "Despeje na forma e espalhe bem."},
            {"step": 3, "text": "Bata todos os ingredientes do pudim no liquidificador."},
            {"step": 4, "text": "Despeje na forma caramelizada."},
            {"step": 5, "text": "Asse em banho-maria por 50 minutos a 180°C.", "timerMinutes": 50},
            {"step": 6, "text": "Deixe esfriar e desenforme gelado."}
        ],
        "tags": ["Sobremesas", "Tradicional", "Festas"],
        "reactions": {"love": 289, "like": 134, "dislike": 5}
    },
    {
        "title": "Feijoada Completa",
        "description": "O prato mais brasileiro, perfeito para reunir a família.",
        "time": "3 horas",
        "servings": "12 porções",
        "calories": "650 kcal",
        "difficulty": "Difícil",
        "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
        "rating": 4.7,
        "reviews": 189,
        "is_premium": True,
        "ingredients": ["500g feijão preto", "300g carne seca", "200g linguiça calabresa", "200g costela de porco", "150g bacon", "2 folhas de louro", "4 dentes de alho", "1 cebola"],
        "instructions": [
            {"step": 1, "text": "Deixe o feijão e as carnes de molho na véspera."},
            {"step": 2, "text": "Cozinhe o feijão na panela de pressão por 30 minutos.", "timerMinutes": 30},
            {"step": 3, "text": "Em outra panela, frite o bacon e a linguiça."},
            {"step": 4, "text": "Adicione as carnes cozidas ao feijão."},
            {"step": 5, "text": "Faça o refogado com alho e cebola, adicione ao feijão."},
            {"step": 6, "text": "Cozinhe tudo junto por mais 1 hora em fogo baixo.", "timerMinutes": 60}
        ],
        "tags": ["Tradicional", "Almoço", "Carnes", "Feijão"],
        "reactions": {"love": 198, "like": 87, "dislike": 3}
    },
    {
        "title": "Brigadeiro Gourmet",
        "description": "A versão sofisticada do doce mais amado do Brasil.",
        "time": "20 min",
        "servings": "30 unidades",
        "calories": "85 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800",
        "rating": 4.9,
        "reviews": 567,
        "ingredients": ["1 lata leite condensado", "2 colheres chocolate 70%", "1 colher manteiga", "Granulado belga"],
        "instructions": [
            {"step": 1, "text": "Misture o leite condensado, chocolate e manteiga na panela."},
            {"step": 2, "text": "Cozinhe em fogo baixo, mexendo sempre, por 10 minutos.", "timerMinutes": 10},
            {"step": 3, "text": "Quando desgrudar do fundo, está pronto."},
            {"step": 4, "text": "Deixe esfriar e enrole com as mãos untadas."},
            {"step": 5, "text": "Passe no granulado e coloque em forminhas."}
        ],
        "tags": ["Doces", "Festas", "Rápido", "Fácil"],
        "reactions": {"love": 445, "like": 201, "dislike": 1}
    },
    {
        "title": "Coxinha Cremosa",
        "description": "A coxinha perfeita: crocante por fora, cremosa por dentro.",
        "time": "90 min",
        "servings": "25 unidades",
        "calories": "180 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1619221882266-c3eb3dd93a9e?w=800",
        "rating": 4.6,
        "reviews": 234,
        "ingredients": ["500g peito de frango", "500ml caldo de galinha", "250g farinha de trigo", "Catupiry a gosto", "2 ovos para empanar", "Farinha de rosca"],
        "instructions": [
            {"step": 1, "text": "Cozinhe e desfie o frango."},
            {"step": 2, "text": "Faça a massa com caldo e farinha até desgrudar."},
            {"step": 3, "text": "Modele as coxinhas com recheio de frango e catupiry."},
            {"step": 4, "text": "Empane em ovo e farinha de rosca."},
            {"step": 5, "text": "Frite em óleo quente até dourar.", "timerMinutes": 5}
        ],
        "tags": ["Salgados", "Festas", "Lanche"],
        "reactions": {"love": 178, "like": 89, "dislike": 4}
    },
    {
        "title": "Pão de Queijo Mineiro",
        "description": "Autêntico pão de queijo com queijo canastra.",
        "time": "35 min",
        "servings": "20 unidades",
        "calories": "95 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1598733747111-7e0c7a52f5b3?w=800",
        "rating": 4.8,
        "reviews": 345,
        "ingredients": ["500g polvilho azedo", "200ml leite", "100ml óleo", "2 ovos", "200g queijo minas", "Sal a gosto"],
        "instructions": [
            {"step": 1, "text": "Ferva o leite com óleo e sal."},
            {"step": 2, "text": "Escalde o polvilho com a mistura quente."},
            {"step": 3, "text": "Adicione os ovos e o queijo, amasse bem."},
            {"step": 4, "text": "Modele bolinhas e coloque em assadeira."},
            {"step": 5, "text": "Asse a 200°C por 25 minutos.", "timerMinutes": 25}
        ],
        "tags": ["Café", "Salgados", "Mineiro", "Fácil"],
        "reactions": {"love": 267, "like": 123, "dislike": 2}
    },
    {
        "title": "Moqueca Baiana",
        "description": "Sabores da Bahia em um prato aromático e colorido.",
        "time": "50 min",
        "servings": "6 porções",
        "calories": "420 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800",
        "rating": 4.7,
        "reviews": 178,
        "is_premium": True,
        "video_url": "https://youtube.com/example",
        "ingredients": ["1kg peixe firme", "400ml leite de coco", "2 tomates", "2 pimentões", "Azeite de dendê", "Coentro", "Cebola", "Alho"],
        "instructions": [
            {"step": 1, "text": "Tempere o peixe com limão, sal e alho."},
            {"step": 2, "text": "Monte camadas de peixe e vegetais na panela de barro."},
            {"step": 3, "text": "Adicione o leite de coco."},
            {"step": 4, "text": "Cozinhe em fogo baixo por 30 minutos.", "timerMinutes": 30},
            {"step": 5, "text": "Finalize com azeite de dendê e coentro."}
        ],
        "tags": ["Peixes", "Baiano", "Almoço", "Especial"],
        "reactions": {"love": 156, "like": 67, "dislike": 3}
    },
    {
        "title": "Açaí na Tigela",
        "description": "Energia e sabor da Amazônia para seu dia.",
        "time": "10 min",
        "servings": "2 porções",
        "calories": "380 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
        "rating": 4.5,
        "reviews": 289,
        "ingredients": ["400g polpa de açaí", "1 banana", "2 colheres de granola", "Mel a gosto", "Frutas para decorar"],
        "instructions": [
            {"step": 1, "text": "Bata o açaí com banana no liquidificador."},
            {"step": 2, "text": "Despeje na tigela."},
            {"step": 3, "text": "Decore com granola, mel e frutas."},
            {"step": 4, "text": "Sirva imediatamente bem gelado."}
        ],
        "tags": ["Saudável", "Café", "Rápido", "Frutas"],
        "reactions": {"love": 234, "like": 98, "dislike": 5}
    },
    # Additional recipes from FASUL PDF
    {
        "title": "Feijão Tropeiro",
        "description": "Prato típico mineiro com feijão, farinha e linguiça.",
        "time": "45 min",
        "servings": "6 porções",
        "calories": "450 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
        "rating": 4.6,
        "reviews": 145,
        "ingredients": ["500g feijão carioca cozido", "200g linguiça calabresa", "150g bacon", "4 ovos", "2 xícaras farinha de mandioca", "Cebolinha", "Alho"],
        "instructions": [
            {"step": 1, "text": "Frite o bacon e a linguiça picados."},
            {"step": 2, "text": "Adicione o alho e refogue."},
            {"step": 3, "text": "Acrescente o feijão escorrido e misture."},
            {"step": 4, "text": "Adicione a farinha de mandioca e os ovos mexidos."},
            {"step": 5, "text": "Finalize com cebolinha picada."}
        ],
        "tags": ["Mineiro", "Almoço", "Tradicional", "Feijão"],
        "reactions": {"love": 134, "like": 56, "dislike": 2}
    },
    {
        "title": "Pamonha de Milho Verde",
        "description": "Doce ou salgada, uma delícia junina.",
        "time": "60 min",
        "servings": "12 unidades",
        "calories": "220 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800",
        "rating": 4.7,
        "reviews": 98,
        "ingredients": ["12 espigas de milho verde", "1 xícara de leite", "1/2 xícara de açúcar", "Sal a gosto", "Palha de milho para enrolar"],
        "instructions": [
            {"step": 1, "text": "Retire os grãos das espigas e bata no liquidificador com leite."},
            {"step": 2, "text": "Adicione açúcar ou sal conforme preferência."},
            {"step": 3, "text": "Enrole nas palhas de milho."},
            {"step": 4, "text": "Cozinhe em água fervente por 40 minutos.", "timerMinutes": 40}
        ],
        "tags": ["Festa Junina", "Doces", "Milho", "Tradicional"],
        "reactions": {"love": 89, "like": 45, "dislike": 1}
    },
    {
        "title": "Tapioca Recheada",
        "description": "Versátil e sem glúten, perfeita para qualquer hora.",
        "time": "15 min",
        "servings": "2 porções",
        "calories": "180 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
        "rating": 4.4,
        "reviews": 167,
        "ingredients": ["1 xícara goma de tapioca", "Recheio a gosto (queijo, coco, frango)", "Manteiga"],
        "instructions": [
            {"step": 1, "text": "Peneire a goma sobre frigideira antiaderente quente."},
            {"step": 2, "text": "Deixe firmar sem mexer por 2 minutos.", "timerMinutes": 2},
            {"step": 3, "text": "Vire e adicione o recheio."},
            {"step": 4, "text": "Dobre e sirva quente."}
        ],
        "tags": ["Sem Glúten", "Rápido", "Café", "Lanche"],
        "reactions": {"love": 145, "like": 78, "dislike": 3}
    },
    {
        "title": "Arroz Carreteiro",
        "description": "Prato gaúcho substancioso e saboroso.",
        "time": "50 min",
        "servings": "6 porções",
        "calories": "520 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800",
        "rating": 4.5,
        "reviews": 123,
        "ingredients": ["3 xícaras arroz", "500g charque dessalgado", "2 cebolas", "4 dentes alho", "Cheiro-verde", "Pimenta"],
        "instructions": [
            {"step": 1, "text": "Dessalgue e cozinhe o charque, desfie."},
            {"step": 2, "text": "Refogue cebola e alho."},
            {"step": 3, "text": "Adicione o charque desfiado e o arroz."},
            {"step": 4, "text": "Cubra com água e cozinhe por 20 minutos.", "timerMinutes": 20},
            {"step": 5, "text": "Finalize com cheiro-verde."}
        ],
        "tags": ["Gaúcho", "Almoço", "Carnes", "Arroz"],
        "reactions": {"love": 112, "like": 54, "dislike": 2}
    },
    {
        "title": "Quindim",
        "description": "Doce de origem portuguesa com coco e gemas.",
        "time": "50 min",
        "servings": "15 unidades",
        "calories": "150 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800",
        "rating": 4.8,
        "reviews": 201,
        "ingredients": ["10 gemas", "2 xícaras açúcar", "100g coco ralado", "1 colher manteiga"],
        "instructions": [
            {"step": 1, "text": "Bata as gemas com açúcar até clarear."},
            {"step": 2, "text": "Adicione o coco ralado e a manteiga."},
            {"step": 3, "text": "Despeje em forminhas untadas."},
            {"step": 4, "text": "Asse em banho-maria por 40 minutos.", "timerMinutes": 40}
        ],
        "tags": ["Doces", "Sobremesas", "Tradicional", "Festas"],
        "reactions": {"love": 178, "like": 89, "dislike": 1}
    },
    {
        "title": "Baião de Dois",
        "description": "Clássico nordestino com arroz, feijão verde e queijo.",
        "time": "45 min",
        "servings": "6 porções",
        "calories": "480 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        "rating": 4.6,
        "reviews": 134,
        "ingredients": ["2 xícaras arroz", "1 xícara feijão verde", "200g queijo coalho", "200g bacon", "Coentro", "Cebola"],
        "instructions": [
            {"step": 1, "text": "Cozinhe o feijão verde até ficar macio."},
            {"step": 2, "text": "Frite o bacon e reserve."},
            {"step": 3, "text": "Refogue arroz com cebola e alho."},
            {"step": 4, "text": "Adicione feijão, caldo e cozinhe por 20 min.", "timerMinutes": 20},
            {"step": 5, "text": "Misture queijo coalho picado e bacon."}
        ],
        "tags": ["Nordestino", "Almoço", "Arroz", "Feijão"],
        "reactions": {"love": 123, "like": 56, "dislike": 2}
    },
    {
        "title": "Empadão Goiano",
        "description": "Torta recheada típica de Goiás.",
        "time": "90 min",
        "servings": "8 porções",
        "calories": "420 kcal",
        "difficulty": "Difícil",
        "image": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800",
        "rating": 4.7,
        "reviews": 89,
        "is_premium": True,
        "ingredients": ["Massa: 500g farinha, 200g manteiga, 2 ovos", "Recheio: frango, milho, palmito, azeitona, guariroba"],
        "instructions": [
            {"step": 1, "text": "Prepare a massa misturando ingredientes."},
            {"step": 2, "text": "Forre forma com parte da massa."},
            {"step": 3, "text": "Prepare o recheio de frango desfiado com os ingredientes."},
            {"step": 4, "text": "Coloque o recheio e cubra com massa."},
            {"step": 5, "text": "Asse a 180°C por 50 minutos.", "timerMinutes": 50}
        ],
        "tags": ["Goiano", "Tortas", "Almoço", "Especial"],
        "reactions": {"love": 78, "like": 34, "dislike": 1}
    },
    {
        "title": "Vatapá",
        "description": "Creme baiano de camarão e amendoim.",
        "time": "60 min",
        "servings": "8 porções",
        "calories": "380 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
        "rating": 4.6,
        "reviews": 112,
        "ingredients": ["500g camarão seco", "1 xícara amendoim", "200ml leite de coco", "100g castanha de caju", "Gengibre", "Azeite de dendê"],
        "instructions": [
            {"step": 1, "text": "Hidrate e cozinhe o camarão seco."},
            {"step": 2, "text": "Bata amendoim e castanha com leite de coco."},
            {"step": 3, "text": "Refogue o camarão e adicione a pasta."},
            {"step": 4, "text": "Cozinhe até engrossar, adicione dendê."},
            {"step": 5, "text": "Sirva com arroz branco e acarajé."}
        ],
        "tags": ["Baiano", "Camarão", "Tradicional", "Especial"],
        "reactions": {"love": 98, "like": 45, "dislike": 2}
    },
    {
        "title": "Bobó de Camarão",
        "description": "Creme de aipim com camarão, sabor da Bahia.",
        "time": "50 min",
        "servings": "6 porções",
        "calories": "420 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800",
        "rating": 4.7,
        "reviews": 156,
        "ingredients": ["500g camarão fresco", "500g aipim", "400ml leite de coco", "Azeite de dendê", "Coentro", "Pimenta"],
        "instructions": [
            {"step": 1, "text": "Cozinhe o aipim até ficar macio e bata no liquidificador."},
            {"step": 2, "text": "Limpe e tempere os camarões."},
            {"step": 3, "text": "Refogue os camarões e reserve alguns para decorar."},
            {"step": 4, "text": "Misture o creme de aipim, leite de coco e camarões."},
            {"step": 5, "text": "Finalize com dendê e coentro."}
        ],
        "tags": ["Baiano", "Camarão", "Almoço", "Especial"],
        "reactions": {"love": 145, "like": 67, "dislike": 2}
    },
    {
        "title": "Cocada Cremosa",
        "description": "Doce de coco tradicional e irresistível.",
        "time": "30 min",
        "servings": "20 unidades",
        "calories": "120 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800",
        "rating": 4.5,
        "reviews": 189,
        "ingredients": ["500g coco ralado", "400g açúcar", "200ml água", "Cravo e canela a gosto"],
        "instructions": [
            {"step": 1, "text": "Faça uma calda com água e açúcar."},
            {"step": 2, "text": "Adicione o coco ralado e as especiarias."},
            {"step": 3, "text": "Cozinhe mexendo até desgrudar do fundo.", "timerMinutes": 20},
            {"step": 4, "text": "Despeje em forma untada ou modele porções."}
        ],
        "tags": ["Doces", "Coco", "Tradicional", "Festas"],
        "reactions": {"love": 167, "like": 78, "dislike": 1}
    },
    {
        "title": "Cuscuz Paulista",
        "description": "Prato colorido e festivo com sardinha e legumes.",
        "time": "45 min",
        "servings": "8 porções",
        "calories": "280 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=800",
        "rating": 4.4,
        "reviews": 98,
        "ingredients": ["500g farinha de milho", "2 latas sardinha", "1 xícara ervilha", "1 xícara milho", "2 ovos cozidos", "Palmito", "Azeitonas"],
        "instructions": [
            {"step": 1, "text": "Hidrate a farinha de milho com caldo de legumes."},
            {"step": 2, "text": "Decore a forma com ovos, palmito e azeitonas."},
            {"step": 3, "text": "Misture a farinha com sardinha e legumes."},
            {"step": 4, "text": "Pressione na forma decorada."},
            {"step": 5, "text": "Leve à geladeira por 2 horas e desenforme."}
        ],
        "tags": ["Paulista", "Festas", "Almoço", "Sardinha"],
        "reactions": {"love": 78, "like": 45, "dislike": 3}
    },
    {
        "title": "Virado à Paulista",
        "description": "Prato completo tradicional de São Paulo.",
        "time": "60 min",
        "servings": "6 porções",
        "calories": "580 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
        "rating": 4.5,
        "reviews": 123,
        "ingredients": ["500g feijão cozido", "300g bisteca de porco", "4 ovos", "1 banana da terra", "Couve", "Farinha de mandioca"],
        "instructions": [
            {"step": 1, "text": "Frite as bistecas e reserve."},
            {"step": 2, "text": "Frite as bananas e reserve."},
            {"step": 3, "text": "Refogue a couve."},
            {"step": 4, "text": "Amasse o feijão com farinha (tutu)."},
            {"step": 5, "text": "Frite os ovos e monte o prato."}
        ],
        "tags": ["Paulista", "Almoço", "Completo", "Tradicional"],
        "reactions": {"love": 112, "like": 56, "dislike": 2}
    },
    {
        "title": "Farofa de Banana",
        "description": "Acompanhamento doce e salgado irresistível.",
        "time": "20 min",
        "servings": "6 porções",
        "calories": "220 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800",
        "rating": 4.3,
        "reviews": 87,
        "ingredients": ["3 bananas da terra", "2 xícaras farinha de mandioca", "100g manteiga", "Sal e açúcar a gosto"],
        "instructions": [
            {"step": 1, "text": "Pique as bananas em rodelas."},
            {"step": 2, "text": "Frite as bananas na manteiga."},
            {"step": 3, "text": "Adicione a farinha e temperos."},
            {"step": 4, "text": "Mexa até dourar uniformemente."}
        ],
        "tags": ["Acompanhamentos", "Banana", "Rápido", "Fácil"],
        "reactions": {"love": 67, "like": 34, "dislike": 2}
    },
    {
        "title": "Romeu e Julieta",
        "description": "A combinação perfeita de queijo e goiabada.",
        "time": "5 min",
        "servings": "4 porções",
        "calories": "180 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800",
        "rating": 4.6,
        "reviews": 234,
        "ingredients": ["200g queijo minas", "200g goiabada cascão"],
        "instructions": [
            {"step": 1, "text": "Corte o queijo em fatias finas."},
            {"step": 2, "text": "Corte a goiabada em fatias iguais."},
            {"step": 3, "text": "Alterne camadas de queijo e goiabada."},
            {"step": 4, "text": "Sirva como sobremesa ou lanche."}
        ],
        "tags": ["Sobremesas", "Queijo", "Rápido", "Mineiro"],
        "reactions": {"love": 198, "like": 89, "dislike": 1}
    },
    {
        "title": "Curau de Milho",
        "description": "Creme doce de milho verde típico de festa junina.",
        "time": "30 min",
        "servings": "8 porções",
        "calories": "180 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
        "rating": 4.7,
        "reviews": 156,
        "ingredients": ["6 espigas milho verde", "500ml leite", "1 xícara açúcar", "Canela em pó"],
        "instructions": [
            {"step": 1, "text": "Retire os grãos das espigas."},
            {"step": 2, "text": "Bata com leite no liquidificador."},
            {"step": 3, "text": "Coe e cozinhe com açúcar até engrossar.", "timerMinutes": 15},
            {"step": 4, "text": "Despeje em potinhos e polvilhe canela."}
        ],
        "tags": ["Festa Junina", "Doces", "Milho", "Fácil"],
        "reactions": {"love": 134, "like": 67, "dislike": 1}
    },
    {
        "title": "Bolo de Rolo",
        "description": "Fino rocambole pernambucano com goiabada.",
        "time": "90 min",
        "servings": "12 porções",
        "calories": "280 kcal",
        "difficulty": "Difícil",
        "image": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800",
        "rating": 4.8,
        "reviews": 89,
        "is_premium": True,
        "ingredients": ["500g farinha", "500g açúcar", "500g manteiga", "12 ovos", "500g goiabada derretida"],
        "instructions": [
            {"step": 1, "text": "Bata manteiga e açúcar até clarear."},
            {"step": 2, "text": "Adicione ovos um a um e a farinha."},
            {"step": 3, "text": "Asse finas camadas de massa."},
            {"step": 4, "text": "Espalhe goiabada e enrole."},
            {"step": 5, "text": "Repita até formar o rolo característico."}
        ],
        "tags": ["Pernambucano", "Doces", "Especial", "Festas"],
        "reactions": {"love": 78, "like": 34, "dislike": 0}
    },
    {
        "title": "Acarajé",
        "description": "Bolinho de feijão frito típico da Bahia.",
        "time": "60 min",
        "servings": "15 unidades",
        "calories": "250 kcal",
        "difficulty": "Difícil",
        "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
        "rating": 4.7,
        "reviews": 145,
        "ingredients": ["500g feijão fradinho", "1 cebola grande", "Sal a gosto", "Azeite de dendê para fritar", "Vatapá e camarão para recheio"],
        "instructions": [
            {"step": 1, "text": "Deixe o feijão de molho e retire as cascas."},
            {"step": 2, "text": "Bata no liquidificador com cebola."},
            {"step": 3, "text": "Bata a massa com colher de pau até aerada."},
            {"step": 4, "text": "Frite colheradas em azeite de dendê quente."},
            {"step": 5, "text": "Abra e recheie com vatapá e camarão."}
        ],
        "tags": ["Baiano", "Salgados", "Tradicional", "Especi"],
        "reactions": {"love": 134, "like": 56, "dislike": 2}
    },
    {
        "title": "Canjica Doce",
        "description": "Sobremesa cremosa de milho branco com coco.",
        "time": "90 min",
        "servings": "8 porções",
        "calories": "280 kcal",
        "difficulty": "Fácil",
        "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800",
        "rating": 4.6,
        "reviews": 178,
        "ingredients": ["500g milho branco para canjica", "1L leite", "1 lata leite condensado", "100g coco ralado", "Canela e cravo"],
        "instructions": [
            {"step": 1, "text": "Deixe o milho de molho na véspera."},
            {"step": 2, "text": "Cozinhe na pressão por 40 minutos.", "timerMinutes": 40},
            {"step": 3, "text": "Adicione leite, leite condensado e coco."},
            {"step": 4, "text": "Cozinhe até ficar cremoso.", "timerMinutes": 15},
            {"step": 5, "text": "Sirva com canela por cima."}
        ],
        "tags": ["Festa Junina", "Sobremesas", "Cremoso", "Doces"],
        "reactions": {"love": 156, "like": 67, "dislike": 1}
    },
    {
        "title": "Frango com Quiabo",
        "description": "Prato mineiro tradicional com quiabo e angu.",
        "time": "60 min",
        "servings": "6 porções",
        "calories": "380 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800",
        "rating": 4.5,
        "reviews": 112,
        "ingredients": ["1kg frango em pedaços", "500g quiabo", "4 dentes alho", "1 cebola", "Óleo", "Sal e pimenta", "Salsinha"],
        "instructions": [
            {"step": 1, "text": "Tempere o frango e frite até dourar."},
            {"step": 2, "text": "Lave e corte o quiabo, frite separadamente."},
            {"step": 3, "text": "Junte o frango e o quiabo."},
            {"step": 4, "text": "Adicione um pouco de água e cozinhe por 20 min.", "timerMinutes": 20},
            {"step": 5, "text": "Sirva com angu e arroz."}
        ],
        "tags": ["Mineiro", "Frango", "Almoço", "Tradicional"],
        "reactions": {"love": 98, "like": 45, "dislike": 2}
    },
    {
        "title": "Tacacá",
        "description": "Caldo amazônico com tucupi e jambu.",
        "time": "45 min",
        "servings": "6 porções",
        "calories": "180 kcal",
        "difficulty": "Médio",
        "image": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800",
        "rating": 4.6,
        "reviews": 67,
        "ingredients": ["1L tucupi", "200g goma de tapioca", "200g camarão seco", "1 maço jambu", "Sal e pimenta de cheiro"],
        "instructions": [
            {"step": 1, "text": "Ferva o tucupi por 20 minutos para tirar o ácido.", "timerMinutes": 20},
            {"step": 2, "text": "Hidrate a goma de tapioca."},
            {"step": 3, "text": "Cozinhe o camarão e o jambu separadamente."},
            {"step": 4, "text": "Monte na cuia: goma, tucupi, camarão e jambu."},
            {"step": 5, "text": "Sirva bem quente."}
        ],
        "tags": ["Amazônico", "Caldos", "Tradicional", "Regional"],
        "reactions": {"love": 56, "like": 23, "dislike": 1}
    }
]

def seed_database():
    """Populate database with recipes"""
    print("Creating database tables...")
    create_db_and_tables()
    
    with Session(engine) as session:
        # Check if recipes already exist
        existing = session.exec(select(Recipe)).first()
        if existing:
            print(f"Database already has recipes. Skipping seed.")
            return
        
        print(f"Adding {len(RECIPES_DATA)} recipes to database...")
        
        for i, recipe_data in enumerate(RECIPES_DATA, 1):
            recipe = Recipe(
                title=recipe_data["title"],
                description=recipe_data.get("description", ""),
                image=recipe_data.get("image", ""),
                time=recipe_data.get("time", ""),
                calories=recipe_data.get("calories", ""),
                servings=recipe_data.get("servings", ""),
                difficulty=recipe_data.get("difficulty", "Fácil"),
                category=recipe_data.get("tags", [""])[0] if recipe_data.get("tags") else "",
                ingredients=json.dumps(recipe_data.get("ingredients", []), ensure_ascii=False),
                instructions=json.dumps(recipe_data.get("instructions", []), ensure_ascii=False),
                tags=json.dumps(recipe_data.get("tags", []), ensure_ascii=False),
                rating=recipe_data.get("rating", 0.0),
                reviews=recipe_data.get("reviews", 0),
                reactions_love=recipe_data.get("reactions", {}).get("love", 0),
                reactions_like=recipe_data.get("reactions", {}).get("like", 0),
                reactions_dislike=recipe_data.get("reactions", {}).get("dislike", 0),
                is_premium=recipe_data.get("is_premium", False),
                video_url=recipe_data.get("video_url"),
                author=recipe_data.get("author"),
                source=recipe_data.get("source", "Chefex")
            )
            session.add(recipe)
            print(f"  [{i}/{len(RECIPES_DATA)}] Added: {recipe.title}")
        
        session.commit()
        print(f"\n✅ Successfully added {len(RECIPES_DATA)} recipes to database!")

if __name__ == "__main__":
    seed_database()
