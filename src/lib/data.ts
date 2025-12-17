export interface Recipe {
  id: string;
  title: string;
  description: string;
  time: string; // e.g., "50 min"
  servings: string; // e.g., "8 porções"
  difficulty: "Fácil" | "Médio" | "Difícil";
  image: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  reactions: {
    love: number;
    like: number;
    dislike: number;
  };
}

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Bolo de Fubá da Vovó",
    description: "Aquele bolo clássico de final de tarde, perfeito com um cafézinho.",
    time: "50 min",
    servings: "8 porções",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=1000&auto=format&fit=crop",
    ingredients: [
      "3 ovos",
      "2 xícaras de fubá",
      "1 xícara de farinha de trigo",
      "2 xícaras de açúcar",
      "1/2 xícara de óleo",
      "1 xícara de leite",
      "1 colher (sopa) de fermento em pó"
    ],
    steps: [
      "Bata os ovos com o açúcar no liquidificador até obter um creme fofo.",
      "Adicione o óleo e o leite e bata mais um pouco.",
      "Em uma tigela, misture o fubá e a farinha de trigo.",
      "Despeje a mistura do liquidificador na tigela e mexa bem.",
      "Por último, adicione o fermento e misture delicadamente.",
      "Despeje em uma forma untada e enfarinhada.",
      "Leve ao forno preaquecido a 180°C por cerca de 40 minutos."
    ],
    tags: ["Bolo", "Café da Tarde", "Vó"],
    reactions: { love: 120, like: 45, dislike: 2 }
  },
  {
    id: "2",
    title: "Pudim de Leite Condensado",
    description: "O pudim mais liso e cremoso que você vai comer na vida.",
    time: "90 min",
    servings: "10 porções",
    difficulty: "Médio",
    image: "https://images.unsplash.com/photo-1517244683847-7454b94e1b65?q=80&w=1000&auto=format&fit=crop",
    ingredients: [
      "1 lata de leite condensado",
      "1 lata de leite (mesma medida)",
      "3 ovos",
      "1 xícara de açúcar (para a calda)"
    ],
    steps: [
      "Para a calda: derreta o açúcar na própria forma de pudim até virar caramelo.",
      "Bata o leite condensado, o leite e os ovos no liquidificador.",
      "Peneire a mistura e despeje na forma caramelizada.",
      "Cubra com papel alumínio e asse em banho-maria por 1h30 a 180°C.",
      "Espere esfriar completamente antes de desenformar."
    ],
    tags: ["Sobremesa", "Clássico", "Festa"],
    reactions: { love: 340, like: 12, dislike: 0 }
  },
  {
    id: "3",
    title: "Feijoada Completa",
    description: "Receita tradicional de domingo para reunir a família.",
    time: "3h",
    servings: "6 pessoas",
    difficulty: "Difícil",
    image: "https://images.unsplash.com/photo-1574484284008-81d0c8705d93?q=80&w=1000&auto=format&fit=crop",
    ingredients: [
      "500g de feijão preto",
      "200g de carne seca",
      "200g de lombo de porco",
      "200g de costelinha de porco",
      "2 paios",
      "2 linguiças calabresas",
      "Temperos a gosto (alho, cebola, louro)"
    ],
    steps: [
      "Deixe o feijão e as carnes salgadas de molho por 12 horas, trocando a água.",
      "Cozinhe o feijão com as folhas de louro.",
      "Em outra panela, cozinhe as carnes dessalgadas.",
      "Junte as carnes ao feijão e deixe apurar o caldo.",
      "Faça um refogado com alho e cebola e jogue no feijão.",
      "Sirva com arroz branco, couve e laranja."
    ],
    tags: ["Almoço", "Domingo", "Salgado"],
    reactions: { love: 210, like: 80, dislike: 5 }
  }
];
