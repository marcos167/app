"""
Recipe Extraction Script v2 for Livro14 FASUL
Better pattern-based extraction
"""
import json
import re
import uuid

def extract_recipes_v2():
    """Extract recipes using pattern matching from raw text"""
    
    with open('livro14_raw.txt', 'r', encoding='utf-8') as f:
        text = f.read()
    
    recipes = []
    
    # Known recipe titles from the index (lines 226-260 in raw text)
    known_recipes = [
        "Mousse de Maracujá", "Arroz Doce com Canela", "Ninhos de Abelha",
        "Rocambole", "Cocada de Cenoura", "Arroz Campeiro", "Bolinho da Vovó",
        "Macarrão Caseiro com Carne Moída e Queijo", "Curau de Milho",
        "Peixe Acebolado com Batata Doce", "Fatias Húngaras", "Brodo",
        "Bolinho de Chuva", "Bolinho de Arroz", "Bolo de Cenoura",
        "Coxinhas da Asa Empanada", "Bolo sem Farinha", "Polenta Recheada",
        "Cuca Rápida de Royal", "Fricassê de Frango", "Espera Marido",
        "Vatapá", "Doce de Leite", "Torteis", "Curau", "Lasanha de Carne Moída",
        "Torta Gelada de Chocolate", "Salgadinho de Orégano", "Risoto de Macarrão",
        "Farofa Simples", "Bolinho de Mandioca", "Torta Salgada",
        "Sopa de Agnoline", "Biscoito de Polvilho", "Lasanha de Carne"
    ]
    
    # Split text into chunks between "INGREDIENTES" sections
    chunks = re.split(r'\n(?=INGREDIENTES)', text)
    
    for chunk in chunks[1:]:  # Skip first chunk (intro)
        if len(chunk) < 50:
            continue
            
        recipe = {
            'id': str(uuid.uuid4())[:8],
            'title': '',
            'category': 'Outros',
            'ingredients': [],
            'instructions': '',
            'source': 'Livro14 – FASUL',
            'author': None,
            'contributor': None,
            'imageURL': None
        }
        
        # Extract ingredients section
        ing_match = re.search(r'INGREDIENTES\s*\n(.*?)(?:MODO DE PREPARO|PARA EMPANAR|RECHEIO|COBERTURA|MASSA|MOLHO)', chunk, re.DOTALL)
        if ing_match:
            ing_text = ing_match.group(1)
            # Split into lines and filter
            for line in ing_text.split('\n'):
                line = line.strip()
                if line and len(line) > 2 and not line.isdigit():
                    # Skip headers
                    if line.upper() in ['INGREDIENTES', 'MODO DE PREPARO', 'MASSA', 'RECHEIO']:
                        continue
                    recipe['ingredients'].append(line)
        
        # Extract modo de preparo
        prep_match = re.search(r'MODO DE PREPARO\s*\n?(.*?)(?:Receita da Vovó|$)', chunk, re.DOTALL)
        if prep_match:
            prep_text = prep_match.group(1)
            # Clean up
            prep_text = re.sub(r'\n+', ' ', prep_text)
            prep_text = re.sub(r'\s{2,}', ' ', prep_text)
            # Remove recipe name if it appears
            for name in known_recipes:
                prep_text = prep_text.replace(name, '')
            recipe['instructions'] = prep_text.strip()[:2000]  # Limit length
        
        # Find recipe title
        for name in known_recipes:
            if name in chunk:
                recipe['title'] = name
                break
        
        # If no title found, try to extract from end
        if not recipe['title']:
            title_match = re.search(r'(?:^\s*|\n)([A-Z][a-záéíóúàâêôãõç\s]+(?:de|da|com)?[A-Za-záéíóúàâêôãõç\s]{3,30})\s*\n\s*Receita da Vovó', chunk)
            if title_match:
                recipe['title'] = title_match.group(1).strip()
        
        # Extract author info
        author_match = re.search(r'Receita da Vovó:\s*([^\n]+)', chunk)
        if author_match:
            recipe['author'] = author_match.group(1).strip()
        
        contributor_match = re.search(r'Alun[ao]:\s*([^\n]+)', chunk)
        if contributor_match:
            recipe['contributor'] = contributor_match.group(1).strip()
        
        # Categorize
        title_lower = recipe['title'].lower()
        if any(x in title_lower for x in ['bolo', 'torta gelada', 'pudim', 'brigadeiro', 'mousse', 'doce', 'cocada', 'arroz doce', 'curau', 'ninhos', 'rocambole', 'cuca', 'espera marido']):
            recipe['category'] = 'Doce'
        elif any(x in title_lower for x in ['biscoito', 'bolinho da vovó', 'bolinho de chuva', 'fatias']):
            recipe['category'] = 'Pães e Biscoitos'
        elif any(x in title_lower for x in ['sopa', 'brodo', 'caldo']):
            recipe['category'] = 'Sopas'
        elif any(x in title_lower for x in ['arroz campeiro', 'macarrão', 'lasanha', 'polenta', 'fricassê', 'vatapá', 'torteis', 'risoto', 'coxinha', 'peixe', 'farofa', 'bolinho de arroz', 'bolinho de mandioca', 'torta salgada', 'salgadinho', 'agnoline']):
            recipe['category'] = 'Salgado'
        
        # Only add if has minimum data
        if recipe['title'] and len(recipe['ingredients']) >= 2:
            recipes.append(recipe)
    
    return recipes

def main():
    print("Extraindo receitas (v2)...")
    recipes = extract_recipes_v2()
    
    # Remove duplicates by title
    seen_titles = set()
    unique_recipes = []
    for r in recipes:
        if r['title'] not in seen_titles:
            seen_titles.add(r['title'])
            unique_recipes.append(r)
    
    # Statistics
    stats = {
        'total_recipes': len(unique_recipes),
        'by_category': {},
        'without_category': 0
    }
    
    for recipe in unique_recipes:
        cat = recipe.get('category', 'Outros')
        if cat == 'Outros':
            stats['without_category'] += 1
        stats['by_category'][cat] = stats['by_category'].get(cat, 0) + 1
    
    output = {
        'recipes': unique_recipes,
        'statistics': stats
    }
    
    # Save JSON
    with open('livro14_recipes.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\n=== Extração Completa ===")
    print(f"Total de receitas: {len(unique_recipes)}")
    print(f"Categorias: {stats['by_category']}")
    print(f"Salvo em: livro14_recipes.json")
    
    # Print sample
    print("\n=== Amostra ===")
    for recipe in unique_recipes[:5]:
        print(f"\n📖 {recipe['title']}")
        print(f"   Categoria: {recipe['category']}")
        print(f"   Ingredientes: {len(recipe['ingredients'])} itens")
        print(f"   Vovó: {recipe['author']}")

if __name__ == "__main__":
    main()
