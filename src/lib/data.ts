// Complete Recipe Database - 29 Recipes
// 8 Original + 21 from Livro14 FASUL

export interface RecipeInstruction {
  step: number;
  text: string;
  timerMinutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  time: string;
  servings: string;
  calories: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  image: string;
  video_url?: string;
  is_premium?: boolean;
  rating?: number;
  reviews?: number;
  ingredients: string[];
  instructions: RecipeInstruction[];
  tags: string[];
  source?: string;
  author?: string | null;
  reactions: {
    love: number;
    like: number;
    dislike: number;
  };
}

export const recipes: Recipe[] = [
  // === RECEITAS ORIGINAIS (1-8) ===
  {
    id: "1",
    title: "Bolo de Fubá da Vovó",
    description: "Aquele bolo clássico de final de tarde, perfeito com um cafézinho.",
    time: "50 min",
    servings: "8 porções",
    calories: "280 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviews: 156,
    ingredients: [
      "3 ovos grandes",
      "2 xícaras de fubá mimoso",
      "1 xícara de farinha de trigo",
      "2 xícaras de açúcar refinado",
      "1/2 xícara de óleo vegetal",
      "1 xícara de leite integral",
      "1 colher (sopa) de fermento em pó",
      "1 pitada de sal"
    ],
    instructions: [
      { step: 1, text: "Preaqueça o forno a 180°C por 10 minutos.", timerMinutes: 10 },
      { step: 2, text: "Bata os ovos com o açúcar no liquidificador por 2 minutos.", timerMinutes: 2 },
      { step: 3, text: "Adicione o óleo e o leite e bata por mais 1 minuto.", timerMinutes: 1 },
      { step: 4, text: "Em uma tigela, misture o fubá, farinha e sal." },
      { step: 5, text: "Despeje a mistura do liquidificador e mexa bem." },
      { step: 6, text: "Adicione o fermento e misture delicadamente." },
      { step: 7, text: "Unte uma forma e despeje a massa." },
      { step: 8, text: "Asse por 40 minutos ou até dourar.", timerMinutes: 40 },
      { step: 9, text: "Espere esfriar 15 minutos antes de desenformar.", timerMinutes: 15 }
    ],
    tags: ["Bolo", "Café da Tarde", "Tradicionais"],
    reactions: { love: 342, like: 89, dislike: 2 }
  },
  {
    id: "2",
    title: "Pudim de Leite Condensado",
    description: "O pudim mais liso e cremoso que você vai comer na vida.",
    time: "2h30",
    servings: "10 porções",
    calories: "320 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1517244683847-7454b94e1b65?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    reviews: 423,
    ingredients: [
      "1 lata de leite condensado (395g)",
      "1 lata de leite (mesma medida)",
      "3 ovos inteiros",
      "1 xícara de açúcar para a calda"
    ],
    instructions: [
      { step: 1, text: "Para a calda: derreta o açúcar na forma até virar caramelo.", timerMinutes: 5 },
      { step: 2, text: "Bata o leite condensado, leite e ovos no liquidificador.", timerMinutes: 3 },
      { step: 3, text: "Peneire a mistura e despeje na forma caramelizada." },
      { step: 4, text: "Cubra com papel alumínio." },
      { step: 5, text: "Asse em banho-maria por 90 minutos a 180°C.", timerMinutes: 90 },
      { step: 6, text: "Espere esfriar completamente antes de desenformar." }
    ],
    tags: ["Sobremesa", "Clássico", "Festa"],
    reactions: { love: 567, like: 134, dislike: 5 }
  },
  {
    id: "3",
    title: "Feijoada Completa",
    description: "Receita tradicional de domingo para reunir a família.",
    time: "4h",
    servings: "8 pessoas",
    calories: "650 kcal",
    difficulty: "Difícil",
    image: "https://images.unsplash.com/photo-1574484284008-81d0c8705d93?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    reviews: 289,
    is_premium: true,
    ingredients: [
      "500g de feijão preto",
      "200g de carne seca (dessalgada)",
      "200g de costela de porco defumada",
      "200g de lombo de porco",
      "2 linguiças calabresas",
      "2 paios",
      "1 cebola grande picada",
      "6 dentes de alho amassados",
      "3 folhas de louro"
    ],
    instructions: [
      { step: 1, text: "Deixe o feijão de molho por 12 horas." },
      { step: 2, text: "Deixe as carnes salgadas de molho por 24 horas." },
      { step: 3, text: "Cozinhe o feijão com louro por 30 minutos.", timerMinutes: 30 },
      { step: 4, text: "Cozinhe todas as carnes por 40 minutos.", timerMinutes: 40 },
      { step: 5, text: "Corte as carnes em pedaços." },
      { step: 6, text: "Refogue cebola e alho por 5 minutos.", timerMinutes: 5 },
      { step: 7, text: "Adicione as carnes e deixe dourar 10 minutos.", timerMinutes: 10 },
      { step: 8, text: "Junte o feijão e deixe apurar 45 minutos.", timerMinutes: 45 },
      { step: 9, text: "Sirva com arroz, couve, farofa e laranja." }
    ],
    tags: ["Almoço", "Domingo", "Tradicional Brasileiro"],
    reactions: { love: 421, like: 156, dislike: 8 }
  },
  {
    id: "4",
    title: "Brigadeiro Gourmet",
    description: "O brigadeiro perfeito com aquele ponto de brilho inconfundível.",
    time: "25 min",
    servings: "30 unidades",
    calories: "85 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    reviews: 678,
    ingredients: [
      "1 lata de leite condensado (395g)",
      "2 colheres (sopa) de manteiga sem sal",
      "4 colheres (sopa) de chocolate em pó 50%",
      "Chocolate granulado para enrolar"
    ],
    instructions: [
      { step: 1, text: "Misture leite condensado, manteiga e chocolate." },
      { step: 2, text: "Cozinhe mexendo por 12 minutos até desgrudar.", timerMinutes: 12 },
      { step: 3, text: "Transfira para prato untado e espalhe." },
      { step: 4, text: "Deixe esfriar por 30 minutos.", timerMinutes: 30 },
      { step: 5, text: "Modele bolinhas e passe no granulado." }
    ],
    tags: ["Doces", "Festa", "Fácil", "Chocolate"],
    reactions: { love: 892, like: 234, dislike: 3 }
  },
  {
    id: "5",
    title: "Coxinha Cremosa",
    description: "Coxinha com massa crocante por fora e recheio cremoso por dentro.",
    time: "1h30",
    servings: "25 unidades",
    calories: "180 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    reviews: 234,
    ingredients: [
      "500g de peito de frango",
      "1 cebola média picada",
      "3 dentes de alho",
      "200g de cream cheese",
      "2 xícaras de caldo de frango",
      "2 xícaras de farinha de trigo",
      "1 colher (sopa) de manteiga",
      "Farinha de rosca para empanar",
      "2 ovos batidos",
      "Óleo para fritar"
    ],
    instructions: [
      { step: 1, text: "Cozinhe o frango por 25 minutos.", timerMinutes: 25 },
      { step: 2, text: "Desfie bem fininho e reserve o caldo." },
      { step: 3, text: "Refogue cebola, alho, frango e cream cheese por 5 minutos.", timerMinutes: 5 },
      { step: 4, text: "Aqueça o caldo com manteiga até ferver." },
      { step: 5, text: "Adicione a farinha e mexa por 3 minutos.", timerMinutes: 3 },
      { step: 6, text: "Deixe esfriar por 20 minutos.", timerMinutes: 20 },
      { step: 7, text: "Modele em formato de gota com o recheio." },
      { step: 8, text: "Passe no ovo e na farinha de rosca." },
      { step: 9, text: "Frite por 4 minutos até dourar.", timerMinutes: 4 }
    ],
    tags: ["Salgados", "Lanche", "Festa"],
    reactions: { love: 345, like: 123, dislike: 12 }
  },
  {
    id: "6",
    title: "Pão de Queijo Mineiro",
    description: "Receita autêntica de Minas Gerais. Crocante por fora, macio por dentro!",
    time: "40 min",
    servings: "20 unidades",
    calories: "95 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1598142982220-ebe26e3aaf9e?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviews: 567,
    ingredients: [
      "500g de polvilho azedo",
      "1 xícara de leite",
      "1/2 xícara de óleo vegetal",
      "2 ovos grandes",
      "200g de queijo minas curado ralado",
      "1 colher (chá) de sal",
      "100g de queijo parmesão ralado"
    ],
    instructions: [
      { step: 1, text: "Preaqueça o forno a 200°C por 15 minutos.", timerMinutes: 15 },
      { step: 2, text: "Aqueça leite, óleo e sal até ferver." },
      { step: 3, text: "Despeje sobre o polvilho e escalde bem." },
      { step: 4, text: "Deixe esfriar por 10 minutos.", timerMinutes: 10 },
      { step: 5, text: "Adicione os ovos um a um, amassando bem." },
      { step: 6, text: "Incorpore os queijos ralados." },
      { step: 7, text: "Modele bolinhas e coloque em assadeira." },
      { step: 8, text: "Asse por 20 minutos até dourar.", timerMinutes: 20 }
    ],
    tags: ["Lanche", "Mineiro", "Café da Manhã", "Queijo"],
    reactions: { love: 789, like: 234, dislike: 5 }
  },
  {
    id: "7",
    title: "Açaí na Tigela",
    description: "Açaí cremoso com granola crocante e frutas frescas.",
    time: "10 min",
    servings: "2 porções",
    calories: "380 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    reviews: 345,
    ingredients: [
      "400g de polpa de açaí congelada",
      "1 banana madura congelada",
      "100ml de leite ou água de coco",
      "2 colheres (sopa) de mel",
      "Granola a gosto",
      "Frutas frescas para decorar"
    ],
    instructions: [
      { step: 1, text: "Retire a polpa de açaí do congelador 5 minutos antes.", timerMinutes: 5 },
      { step: 2, text: "Bata no liquidificador açaí, banana e leite por 2 minutos.", timerMinutes: 2 },
      { step: 3, text: "Adicione o mel e bata mais um pouco." },
      { step: 4, text: "Despeje em tigelas e decore com granola e frutas." },
      { step: 5, text: "Sirva imediatamente!" }
    ],
    tags: ["Saudável", "Verão", "Lanche", "Frutas"],
    reactions: { love: 456, like: 167, dislike: 8 }
  },
  {
    id: "8",
    title: "Moqueca Baiana",
    description: "Tradicional moqueca com peixe fresco e azeite de dendê.",
    time: "50 min",
    servings: "4 pessoas",
    calories: "420 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviews: 198,
    is_premium: true,
    ingredients: [
      "800g de filé de peixe",
      "Suco de 2 limões",
      "3 tomates maduros fatiados",
      "2 cebolas grandes em rodelas",
      "1 pimentão verde e 1 amarelo fatiados",
      "400ml de leite de coco",
      "3 colheres (sopa) de azeite de dendê",
      "Coentro fresco picado",
      "Sal e pimenta a gosto"
    ],
    instructions: [
      { step: 1, text: "Tempere o peixe com limão, sal e pimenta. Marine por 15 minutos.", timerMinutes: 15 },
      { step: 2, text: "Faça camadas: peixe, tomate, cebola e pimentões." },
      { step: 3, text: "Despeje o leite de coco por cima." },
      { step: 4, text: "Cozinhe tampado por 25 minutos sem mexer.", timerMinutes: 25 },
      { step: 5, text: "Adicione o azeite de dendê." },
      { step: 6, text: "Apure por mais 5 minutos.", timerMinutes: 5 },
      { step: 7, text: "Finalize com coentro e sirva com arroz e pirão." }
    ],
    tags: ["Almoço", "Peixe", "Nordestino", "Tradicional"],
    reactions: { love: 321, like: 98, dislike: 4 }
  },

  // === RECEITAS DO LIVRO14 FASUL (9-29) ===
  {
    id: "9",
    title: "Mousse de Maracujá",
    description: "Receita tradicional da vovó Adenice. Sabor caseiro de verdade!",
    time: "3h+",
    servings: "6 porções",
    calories: "250 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
    rating: 4.9,
    reviews: 113,
    ingredients: [
      "2 caixinhas de gelatina sabor maracujá",
      "2 xícaras (chá) de água",
      "1 lata de leite condensado",
      "2 claras batidas em neve"
    ],
    instructions: [
      { step: 1, text: "Dissolva a gelatina na água fervente." },
      { step: 2, text: "Despeje o leite condensado no liquidificador e acrescente a gelatina, batendo sempre." },
      { step: 3, text: "Coloque em uma tigela, acrescente as claras em neve e misture até ficar bem leve." },
      { step: 4, text: "Deixe gelar por aproximadamente 3 horas.", timerMinutes: 180 }
    ],
    tags: ["Doce", "Receita da Vovó", "Tradicional"],
    source: "Livro14 – FASUL",
    author: "Adenice de Fátima Melim Silva",
    reactions: { love: 145, like: 48, dislike: 0 }
  },
  {
    id: "10",
    title: "Arroz Doce com Canela",
    description: "Receita tradicional brasileira. Sabor caseiro de verdade!",
    time: "30 min",
    servings: "6 porções",
    calories: "280 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
    rating: 4.5,
    reviews: 120,
    ingredients: [
      "3 xícaras (chá) de arroz branco",
      "2 latas de leite condensado",
      "1 litro de leite",
      "50g de coco ralado",
      "Canela em pó"
    ],
    instructions: [
      { step: 1, text: "Coloque água em uma panela grande e deixe ferver." },
      { step: 2, text: "Lave o arroz e coloque para cozinhar." },
      { step: 3, text: "Em outro recipiente, ferva o leite." },
      { step: 4, text: "Após o arroz estar cozido, coloque o leite, o leite condensado e o coco ralado." },
      { step: 5, text: "Depois de pronto, coloque em um recipiente e polvilhe canela em pó." }
    ],
    tags: ["Doce", "Receita da Vovó", "Tradicional"],
    source: "Livro14 – FASUL",
    reactions: { love: 150, like: 50, dislike: 1 }
  },
  {
    id: "11",
    title: "Rocambole",
    description: "Receita tradicional da vovó Lídia. Massa fofa e recheio cremoso!",
    time: "45 min",
    servings: "8 porções",
    calories: "220 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
    rating: 4.6,
    reviews: 127,
    ingredients: [
      "7 ovos",
      "7 colheres (sopa) de açúcar",
      "7 colheres (sopa) de farinha de trigo",
      "5 colheres (sopa) de água",
      "1 colher (sopa) de fermento em pó"
    ],
    instructions: [
      { step: 1, text: "Bata as claras em neve, acrescente as gemas uma a uma." },
      { step: 2, text: "Coloque o açúcar aos poucos." },
      { step: 3, text: "Por último, adicione a farinha, a água e o fermento." },
      { step: 4, text: "Unte a assadeira e leve para assar.", timerMinutes: 15 },
      { step: 5, text: "Espere esfriar, coloque o recheio e enrole com auxílio de um pano úmido." }
    ],
    tags: ["Doce", "Receita da Vovó", "Festa"],
    source: "Livro14 – FASUL",
    author: "Lídia Schlickmann",
    reactions: { love: 155, like: 52, dislike: 2 }
  },
  {
    id: "12",
    title: "Cocada de Cenoura",
    description: "Receita única que combina cenoura com coco. Sabor incrível!",
    time: "1h",
    servings: "20 unidades",
    calories: "120 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
    rating: 4.7,
    reviews: 134,
    ingredients: [
      "1 coco médio",
      "1 kg de cenoura",
      "1 kg de açúcar mascavo",
      "1 abacaxi ou outra fruta desejada"
    ],
    instructions: [
      { step: 1, text: "Bata o abacaxi no liquidificador." },
      { step: 2, text: "Rale no ralo grosso a cenoura e o coco." },
      { step: 3, text: "Misture tudo, junte as frutas e o açúcar mascavo." },
      { step: 4, text: "Leve ao fogo até dar o ponto desejado.", timerMinutes: 30 },
      { step: 5, text: "Espalhe numa forma enfarinhada os rolinhos de cocada." },
      { step: 6, text: "Leve à geladeira até endurecer.", timerMinutes: 60 }
    ],
    tags: ["Doce", "Receita da Vovó", "Tradicional"],
    source: "Livro14 – FASUL",
    reactions: { love: 160, like: 54, dislike: 0 }
  },
  {
    id: "13",
    title: "Arroz Campeiro",
    description: "Receita tradicional da vovó Olga. Arroz bem temperado!",
    time: "30 min",
    servings: "6 porções",
    calories: "350 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
    rating: 4.8,
    reviews: 141,
    ingredients: [
      "3 xícaras (chá) de arroz",
      "200g de presunto picado",
      "½ tomate picado",
      "½ cebola picada",
      "1 lata de ervilha",
      "2 cubos de caldo de carne",
      "1 colher (sopa) de manteiga",
      "½ xícara (chá) de tempero verde"
    ],
    instructions: [
      { step: 1, text: "Derreta a manteiga em uma panela." },
      { step: 2, text: "Adicione todos os ingredientes picados e a ervilha." },
      { step: 3, text: "Refogue bem por 5 minutos.", timerMinutes: 5 },
      { step: 4, text: "Adicione o arroz, o caldo de carne e água para cozinhar." },
      { step: 5, text: "Cozinhe até o arroz ficar macio. Adicione sal a gosto.", timerMinutes: 20 }
    ],
    tags: ["Salgado", "Receita da Vovó", "Almoço"],
    source: "Livro14 – FASUL",
    author: "Olga Bressan",
    reactions: { love: 165, like: 56, dislike: 1 }
  },
  {
    id: "14",
    title: "Bolinho da Vovó",
    description: "Receita tradicional da vovó Rosa. Bolinhos fritos irresistíveis!",
    time: "25 min",
    servings: "20 unidades",
    calories: "150 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
    rating: 4.9,
    reviews: 148,
    ingredients: [
      "3 ovos",
      "2 xícaras (chá) de açúcar",
      "2 colheres (sopa) de margarina",
      "½ kg de farinha de trigo",
      "2 colheres (café) de sal amoníaco",
      "3 xícaras (chá) de leite"
    ],
    instructions: [
      { step: 1, text: "Misture todos os ingredientes em uma tigela." },
      { step: 2, text: "Aqueça o óleo em uma panela funda." },
      { step: 3, text: "Frite porções da massa em óleo bem quente até dourar.", timerMinutes: 15 }
    ],
    tags: ["Doce", "Receita da Vovó", "Lanche"],
    source: "Livro14 – FASUL",
    author: "Rosa Santos da Silva",
    reactions: { love: 170, like: 58, dislike: 2 }
  },
  {
    id: "15",
    title: "Curau de Milho",
    description: "Receita tradicional de festa junina. Cremoso e delicioso!",
    time: "25 min",
    servings: "6 porções",
    calories: "200 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
    rating: 4.5,
    reviews: 155,
    ingredients: [
      "4 espigas de milho verde",
      "1 litro de leite",
      "2 colheres (sopa) de margarina",
      "1 xícara (chá) de açúcar"
    ],
    instructions: [
      { step: 1, text: "Rale as espigas de milho ou corte com uma faca." },
      { step: 2, text: "Bata no liquidificador o milho com o leite.", timerMinutes: 2 },
      { step: 3, text: "Coloque em uma panela a mistura batida." },
      { step: 4, text: "Acrescente a margarina e o açúcar." },
      { step: 5, text: "Cozinhe até engrossar, mexendo sempre.", timerMinutes: 20 },
      { step: 6, text: "Sirva quente ou gelado com canela." }
    ],
    tags: ["Doce", "Receita da Vovó", "Festa Junina"],
    source: "Livro14 – FASUL",
    reactions: { love: 175, like: 60, dislike: 0 }
  },
  {
    id: "16",
    title: "Peixe Acebolado com Batata Doce",
    description: "Receita saudável e saborosa da vovó Catarina.",
    time: "30 min",
    servings: "4 porções",
    calories: "320 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop",
    rating: 4.6,
    reviews: 162,
    ingredients: [
      "3 batatas doce grandes",
      "4 cebolas grandes",
      "4 tomates",
      "500g de filé de peixe",
      "1 fio de óleo de oliva",
      "Sal e temperos a gosto"
    ],
    instructions: [
      { step: 1, text: "Corte as cebolas e os tomates em rodelas." },
      { step: 2, text: "Tempere o filé de peixe a gosto." },
      { step: 3, text: "Em uma panela de ferro, coloque um fio de óleo de oliva." },
      { step: 4, text: "Forre o fundo com cebolas, depois tomates, batatas e o peixe por cima." },
      { step: 5, text: "Cozinhe por 15 a 20 minutos.", timerMinutes: 20 },
      { step: 6, text: "Sirva com arroz branco e salada verde." }
    ],
    tags: ["Salgado", "Saudável", "Peixe"],
    source: "Livro14 – FASUL",
    author: "Catarina Marinello Girotto",
    reactions: { love: 180, like: 62, dislike: 1 }
  },
  {
    id: "17",
    title: "Brodo",
    description: "Caldo de galinha italiano da vovó Amalia. Reconfortante!",
    time: "2h30",
    servings: "6 porções",
    calories: "180 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop",
    rating: 4.7,
    reviews: 169,
    ingredients: [
      "1 galinha caipira",
      "6 dentes de alho",
      "1 maço de cheiro verde",
      "2 galhos de manjerona",
      "2 cebolas médias",
      "2 colheres (sopa) de óleo",
      "Sal e pimenta a gosto"
    ],
    instructions: [
      { step: 1, text: "Refogue alho, cebolas e temperos no óleo.", timerMinutes: 5 },
      { step: 2, text: "Corte a galinha em pedaços grandes e coloque na panela." },
      { step: 3, text: "Cubra com água e tempere com sal e pimenta." },
      { step: 4, text: "Cozinhe por aproximadamente 2 horas.", timerMinutes: 120 },
      { step: 5, text: "Sirva o caldo em xícaras com pão caseiro fatiado." }
    ],
    tags: ["Sopa", "Receita da Vovó", "Italiano"],
    source: "Livro14 – FASUL",
    author: "Amalia Maria Madalena Fardo Giordani",
    reactions: { love: 185, like: 64, dislike: 2 }
  },
  {
    id: "18",
    title: "Bolinho de Chuva",
    description: "Receita tradicional da vovó Olga. Perfeito para dias frios!",
    time: "25 min",
    servings: "20 unidades",
    calories: "100 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
    rating: 4.8,
    reviews: 176,
    ingredients: [
      "1 ovo",
      "1 colher (sopa) de maizena",
      "1 colher (chá) de sal",
      "1 colher (chá) de fermento em pó",
      "2 xícaras (chá) de leite ou água",
      "Farinha de trigo até dar o ponto"
    ],
    instructions: [
      { step: 1, text: "Bata o ovo, a maizena, o sal e o fermento." },
      { step: 2, text: "Adicione o leite ou água." },
      { step: 3, text: "Coloque a farinha até dar ponto (não pode ficar duro)." },
      { step: 4, text: "Frite porções em óleo quente até dourar.", timerMinutes: 15 },
      { step: 5, text: "Passe em açúcar com canela e sirva." }
    ],
    tags: ["Doce", "Receita da Vovó", "Lanche"],
    source: "Livro14 – FASUL",
    author: "Olga Lazarette Dartora",
    reactions: { love: 190, like: 66, dislike: 0 }
  },
  {
    id: "19",
    title: "Bolinho de Arroz",
    description: "Receita tradicional da vovó Aracy. Ótimo para aproveitar sobras!",
    time: "25 min",
    servings: "15 unidades",
    calories: "130 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
    rating: 4.9,
    reviews: 183,
    ingredients: [
      "2 pratos de arroz cozido (pode ser sobras)",
      "2 ovos",
      "½ xícara (chá) de salsinha e cebolinha picados",
      "2 colheres (sopa) de farinha de trigo",
      "1 colher (café) de fermento",
      "Sal a gosto",
      "Óleo para fritar"
    ],
    instructions: [
      { step: 1, text: "Misture todos os ingredientes (menos a farinha) em uma tigela." },
      { step: 2, text: "Adicione a farinha aos poucos até dar liga." },
      { step: 3, text: "Modele bolinhas ou rolinhos." },
      { step: 4, text: "Se desejar, recheie com presunto ou queijo." },
      { step: 5, text: "Frite em óleo quente até dourar.", timerMinutes: 10 }
    ],
    tags: ["Salgado", "Receita da Vovó", "Aproveitamento"],
    source: "Livro14 – FASUL",
    author: "Aracy Piola",
    reactions: { love: 195, like: 68, dislike: 1 }
  },
  {
    id: "20",
    title: "Bolo sem Farinha",
    description: "Bolo de chocolate sem farinha da vovó Santa Libra.",
    time: "35 min",
    servings: "8 porções",
    calories: "280 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
    rating: 4.5,
    reviews: 190,
    ingredients: [
      "7 ovos",
      "7 colheres (sopa) de chocolate em pó",
      "7 colheres (sopa) de açúcar",
      "4 colheres (sopa) de óleo",
      "2 colheres (sopa) de margarina",
      "50g de coco ralado",
      "1 colher (sopa) cheia de fermento em pó"
    ],
    instructions: [
      { step: 1, text: "Bata tudo no liquidificador até ficar homogêneo." },
      { step: 2, text: "Por último, acrescente o fermento e bata brevemente." },
      { step: 3, text: "Unte uma assadeira com manteiga e farinha." },
      { step: 4, text: "Despeje a massa e leve ao forno médio por 25 minutos.", timerMinutes: 25 }
    ],
    tags: ["Doce", "Receita da Vovó", "Chocolate"],
    source: "Livro14 – FASUL",
    author: "Santa Libra Stelter",
    reactions: { love: 200, like: 70, dislike: 2 }
  },
  {
    id: "21",
    title: "Polenta Recheada",
    description: "Receita tradicional da vovó Benedita. Gratinada com queijo!",
    time: "40 min",
    servings: "6 porções",
    calories: "380 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
    rating: 4.6,
    reviews: 197,
    ingredients: [
      "2 copos de fubá fino",
      "5 copos de água",
      "2 caldos de galinha caipira",
      "2 dentes de alho amassados",
      "200g de mussarela",
      "Sal a gosto"
    ],
    instructions: [
      { step: 1, text: "Desmanche o fubá na água fria." },
      { step: 2, text: "Acrescente sal, alho e caldo de galinha." },
      { step: 3, text: "Cozinhe até desgrudar do fundo da panela.", timerMinutes: 20 },
      { step: 4, text: "Em uma forma refratária, faça camadas de polenta, molho e mussarela." },
      { step: 5, text: "Leve ao forno para gratinar por 15 minutos.", timerMinutes: 15 },
      { step: 6, text: "Sirva com arroz branco e salada verde." }
    ],
    tags: ["Salgado", "Receita da Vovó", "Gratinado"],
    source: "Livro14 – FASUL",
    author: "Benedita Marcelino",
    reactions: { love: 205, like: 72, dislike: 0 }
  },
  {
    id: "22",
    title: "Cuca Rápida de Royal",
    description: "Receita tradicional da vovó Joana. Cuca fofa com canela!",
    time: "45 min",
    servings: "8 porções",
    calories: "260 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
    rating: 4.7,
    reviews: 204,
    ingredients: [
      "2 ovos (claras em neve)",
      "1 xícara (chá) de nata fresca",
      "1 xícara (chá) de leite",
      "1½ xícara (chá) de açúcar",
      "Raspas de 1 limão",
      "Farinha de trigo até o ponto de massa de bolo",
      "1 colher (sopa) de fermento Royal",
      "Canela em pó"
    ],
    instructions: [
      { step: 1, text: "Bata as gemas com o açúcar até ficar homogêneo." },
      { step: 2, text: "Junte a nata, o leite, as raspas de limão e a farinha aos poucos." },
      { step: 3, text: "Adicione as claras em neve e o fermento delicadamente." },
      { step: 4, text: "Coloque a massa em uma forma retangular." },
      { step: 5, text: "Espalhe canela em pó por cima antes de assar." },
      { step: 6, text: "Asse em forno médio por 30 minutos.", timerMinutes: 30 }
    ],
    tags: ["Doce", "Receita da Vovó", "Café da Tarde"],
    source: "Livro14 – FASUL",
    author: "Joana Ferreira Colla",
    reactions: { love: 210, like: 74, dislike: 1 }
  },
  {
    id: "23",
    title: "Espera Marido",
    description: "Receita tradicional da vovó Odila. Sobremesa irresistível!",
    time: "40 min",
    servings: "6 porções",
    calories: "300 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
    rating: 4.8,
    reviews: 211,
    ingredients: [
      "1 lata de leite condensado",
      "2 latas de leite",
      "3 gemas",
      "1 colher (sopa) de maizena",
      "1 pitada de baunilha",
      "1 creme de leite",
      "2 colheres (sopa) de açúcar"
    ],
    instructions: [
      { step: 1, text: "Cozinhe o leite condensado, leite, gemas e maizena em banho-maria." },
      { step: 2, text: "Mexa até engrossar e deixe esfriar.", timerMinutes: 20 },
      { step: 3, text: "Forre uma tigela com bolachas passadas no leite." },
      { step: 4, text: "Coloque o creme resfriado sobre as bolachas." },
      { step: 5, text: "Bata as claras em neve com açúcar e misture o creme de leite." },
      { step: 6, text: "Coloque por cima e leve à geladeira.", timerMinutes: 60 }
    ],
    tags: ["Doce", "Receita da Vovó", "Sobremesa"],
    source: "Livro14 – FASUL",
    author: "Odila Draeger",
    reactions: { love: 215, like: 76, dislike: 2 }
  },
  {
    id: "24",
    title: "Vatapá",
    description: "Receita tradicional da vovó Eduarda. Sabor nordestino autêntico!",
    time: "50 min",
    servings: "6 porções",
    calories: "450 kcal",
    difficulty: "Difícil",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
    rating: 4.9,
    reviews: 218,
    is_premium: true,
    ingredients: [
      "1 a 2kg de camarão salgado e descascado",
      "1 vidro de leite de coco de 200ml",
      "1 xícara (chá) de azeite de dendê",
      "1 xícara (chá) de farinha de trigo",
      "2 a 4 litros de água",
      "1 cebola picada, cebolinha, coentro",
      "1 dente de alho, sal a gosto",
      "½ pimenta de cheiro",
      "½ pimentão"
    ],
    instructions: [
      { step: 1, text: "Refogue o camarão com azeite de dendê, cebola, coentro, alho e temperos.", timerMinutes: 10 },
      { step: 2, text: "Cozinhe as cabeças dos camarões em água e reserve o caldo." },
      { step: 3, text: "Adicione o refogado ao caldo e deixe ferver." },
      { step: 4, text: "Dissolva a farinha em água e despeje no caldo, mexendo sempre." },
      { step: 5, text: "Cozinhe por 25-30 minutos mexendo sempre.", timerMinutes: 30 },
      { step: 6, text: "Adicione mais azeite de dendê e cozinhe mais 10 minutos.", timerMinutes: 10 },
      { step: 7, text: "Finalize com leite de coco e sirva com arroz branco e pimenta." }
    ],
    tags: ["Salgado", "Receita da Vovó", "Nordestino", "Camarão"],
    source: "Livro14 – FASUL",
    author: "Eduarda dos Santos Rocha",
    reactions: { love: 220, like: 78, dislike: 0 }
  },
  {
    id: "25",
    title: "Doce de Leite",
    description: "Receita tradicional da vovó Maria José. Cremoso e delicioso!",
    time: "1h",
    servings: "1 pote",
    calories: "180 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
    rating: 4.7,
    reviews: 160,
    ingredients: [
      "1 litro de leite",
      "2 xícaras (chá) de açúcar",
      "1 pitada de fermento em pó",
      "1 colher (café) de farinha de trigo"
    ],
    instructions: [
      { step: 1, text: "Junte todos os ingredientes em uma panela." },
      { step: 2, text: "Mexa bem para dissolver o açúcar." },
      { step: 3, text: "Cozinhe em fogo brando, mexendo sempre.", timerMinutes: 45 },
      { step: 4, text: "Cozinhe até ficar cremoso e dourado." },
      { step: 5, text: "Despeje em um recipiente e deixe esfriar." }
    ],
    tags: ["Doce", "Receita da Vovó", "Tradicional"],
    source: "Livro14 – FASUL",
    author: "Maria José Rodrigues Cardoso",
    reactions: { love: 180, like: 60, dislike: 1 }
  },
  {
    id: "26",
    title: "Fatias Húngaras",
    description: "Receita tradicional da vovó Iria. Massa doce recheada!",
    time: "1h30",
    servings: "20 unidades",
    calories: "200 kcal",
    difficulty: "Difícil",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
    rating: 4.6,
    reviews: 145,
    ingredients: [
      "2 tabletes de fermento de pão",
      "4 colheres (sopa) de açúcar",
      "1 xícara (chá) de leite morno",
      "1 colher (chá) rasa de mel",
      "50g de manteiga",
      "2 ovos",
      "Farinha de trigo para dar o ponto",
      "Leite condensado para cobrir",
      "300g de coco ralado (recheio)",
      "½ lata de leite condensado (recheio)"
    ],
    instructions: [
      { step: 1, text: "Dissolva o fermento com açúcar e sal." },
      { step: 2, text: "Acrescente leite morno, ovos e manteiga." },
      { step: 3, text: "Adicione farinha até desgrudar das mãos." },
      { step: 4, text: "Deixe descansar até dobrar de volume.", timerMinutes: 20 },
      { step: 5, text: "Abra a massa e espalhe o recheio de coco." },
      { step: 6, text: "Enrole como rocambole e corte em fatias." },
      { step: 7, text: "Asse em forno baixo por 40 minutos até dourar.", timerMinutes: 40 },
      { step: 8, text: "Espalhe leite condensado por cima depois de assadas." }
    ],
    tags: ["Doce", "Receita da Vovó", "Massa"],
    source: "Livro14 – FASUL",
    author: "Iria Schaefer Spies",
    reactions: { love: 175, like: 55, dislike: 2 }
  },
  {
    id: "27",
    title: "Fricassê de Frango",
    description: "Receita tradicional da vovó Angelina. Cremoso e saboroso!",
    time: "40 min",
    servings: "6 porções",
    calories: "380 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
    rating: 4.8,
    reviews: 188,
    ingredients: [
      "3 peitos de frango em cubinhos",
      "1 dente de alho picado",
      "Sal e pimenta a gosto",
      "1 cebola picada",
      "2 colheres (sopa) de maionese",
      "1 colher (sopa) de manteiga",
      "½ copo de catchup",
      "⅓ copo de mostarda",
      "1 copo de cogumelos",
      "1 copo de creme de leite",
      "Batata palha"
    ],
    instructions: [
      { step: 1, text: "Tempere o frango com alho, maionese, sal e pimenta." },
      { step: 2, text: "Derreta a manteiga e doure a cebola." },
      { step: 3, text: "Adicione o frango e doure bem.", timerMinutes: 10 },
      { step: 4, text: "Acrescente os cogumelos, catchup e mostarda." },
      { step: 5, text: "Quando ferver, adicione o creme de leite e desligue." },
      { step: 6, text: "Sirva com arroz branco e batata palha." }
    ],
    tags: ["Salgado", "Receita da Vovó", "Frango"],
    source: "Livro14 – FASUL",
    author: "Angelina da Silva Batista",
    reactions: { love: 195, like: 65, dislike: 1 }
  },
  {
    id: "28",
    title: "Farofa Simples",
    description: "Receita tradicional da vovó Miraci. Perfeita para acompanhar!",
    time: "20 min",
    servings: "6 porções",
    calories: "280 kcal",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
    rating: 4.5,
    reviews: 130,
    ingredients: [
      "500g de farinha de mandioca",
      "2 cebolas médias",
      "2 ovos",
      "⅓ xícara (chá) de azeitonas verdes",
      "70g de bacon",
      "100g de manteiga",
      "½ xícara (chá) de uvas-passas (opcional)"
    ],
    instructions: [
      { step: 1, text: "Corte a cebola em fatias finas." },
      { step: 2, text: "Pique as azeitonas e o bacon em cubinhos." },
      { step: 3, text: "Derreta a manteiga e refogue o bacon por 2 minutos.", timerMinutes: 2 },
      { step: 4, text: "Adicione a cebola e refogue mais 2 minutos.", timerMinutes: 2 },
      { step: 5, text: "Junte azeitonas, uvas-passas e a farinha de mandioca." },
      { step: 6, text: "Bata os ovos e despeje na panela, misturando rapidamente." },
      { step: 7, text: "Sirva quente." }
    ],
    tags: ["Salgado", "Receita da Vovó", "Acompanhamento"],
    source: "Livro14 – FASUL",
    author: "Miraci do Nascimento de Lima",
    reactions: { love: 160, like: 50, dislike: 0 }
  },
  {
    id: "29",
    title: "Bolinho de Mandioca",
    description: "Receita tradicional da vovó Enesia. Crocante por fora, macio por dentro!",
    time: "40 min",
    servings: "15 unidades",
    calories: "150 kcal",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
    rating: 4.7,
    reviews: 172,
    ingredients: [
      "½kg de mandioca cozida",
      "1 colher (sopa) de cebola picadinha",
      "1 colher (sopa) de salsa picadinha",
      "2 colheres (sopa) de queijo ralado",
      "1 colher (chá) de sal",
      "1 colher (chá) de fermento em pó",
      "1 pitada de pimenta do reino",
      "Óleo para fritar"
    ],
    instructions: [
      { step: 1, text: "Amasse a mandioca cozida com um garfo ou espremedor." },
      { step: 2, text: "Adicione cebola, salsa, queijo, fermento, sal e pimenta." },
      { step: 3, text: "Misture bem até formar uma massa homogênea." },
      { step: 4, text: "Modele os bolinhos no tamanho desejado." },
      { step: 5, text: "Frite em óleo quente, virando para dourar por igual.", timerMinutes: 10 },
      { step: 6, text: "Retire com escumadeira e escorra em papel absorvente." }
    ],
    tags: ["Salgado", "Receita da Vovó", "Petisco"],
    source: "Livro14 – FASUL",
    author: "Enesia Rossato",
    reactions: { love: 185, like: 62, dislike: 1 }
  }
];

// Helper to get recipe by ID
export const getRecipeById = (id: string): Recipe | undefined => {
  return recipes.find(r => r.id === id);
};

// Helper to search recipes
export const searchRecipes = (query: string): Recipe[] => {
  const lowerQuery = query.toLowerCase();
  return recipes.filter(r =>
    r.title.toLowerCase().includes(lowerQuery) ||
    r.description.toLowerCase().includes(lowerQuery) ||
    r.tags.some(t => t.toLowerCase().includes(lowerQuery))
  );
};

// Helper to get recipes by category
export const getRecipesByTag = (tag: string): Recipe[] => {
  return recipes.filter(r => r.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
};
