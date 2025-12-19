"""
Clean and merge recipes into data.ts format
"""
import json
import re

def clean_instructions(text):
    """Remove extra text from instructions"""
    # Remove page numbers
    text = re.sub(r'\s+\d{1,2}\s+', ' ', text)
    
    # Remove common garbage patterns
    garbage_patterns = [
        r'Comer quitutes da Vovó.*?Profª\. Dora',
        r'APRESENTAÇÃO.*?$',
        r'Receita da Vovó:.*?$',
        r'Receita a Vovó:.*?$',
        r'Alun[ao]:.*?$',
        r'PRATOS SALGADOS.*?$',
        r'PRATOS DOCES.*?$',
        r'MOLHO\s+\d+g.*?$',
        r'\d+\s*$',
    ]
    
    for pattern in garbage_patterns:
        text = re.sub(pattern, '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # Clean whitespace
    text = re.sub(r'\s{2,}', ' ', text)
    return text.strip()

def estimate_time(instructions, ingredients):
    """Estimate cooking time based on keywords"""
    text = instructions.lower()
    
    # Look for time mentions
    time_match = re.search(r'(\d+)\s*minutos', text)
    if time_match:
        mins = int(time_match.group(1))
        if mins >= 60:
            return f"{mins // 60}h{mins % 60:02d}"
        return f"{mins} min"
    
    # Estimate based on complexity
    if any(x in text for x in ['gelar', 'geladeira', 'freezer']):
        return "3h+"
    elif any(x in text for x in ['assar', 'forno']):
        return "45 min"
    elif any(x in text for x in ['cozinhar', 'ferver']):
        return "30 min"
    elif any(x in text for x in ['fritar']):
        return "20 min"
    else:
        return "25 min"

def estimate_servings(title, ingredients):
    """Estimate servings"""
    title_lower = title.lower()
    
    if 'bolo' in title_lower or 'torta' in title_lower:
        return "8 porções"
    elif 'bolinho' in title_lower:
        return "20 unidades"
    elif 'arroz' in title_lower:
        return "6 porções"
    elif 'mousse' in title_lower:
        return "6 porções"
    else:
        return "4 porções"

def get_difficulty(instructions, ingredients):
    """Estimate difficulty"""
    ing_count = len(ingredients)
    inst_len = len(instructions)
    
    if ing_count <= 5 and inst_len < 300:
        return "Fácil"
    elif ing_count > 10 or inst_len > 800:
        return "Difícil"
    else:
        return "Médio"

def get_image_url(category):
    """Get placeholder image based on category"""
    images = {
        "Doce": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop",
        "Salgado": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
        "Sopas": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop",
        "Pães e Biscoitos": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
        "Outros": "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop"
    }
    return images.get(category, images["Outros"])

def main():
    # Load extracted recipes
    with open('livro14_recipes.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    recipes = data['recipes']
    
    # Clean each recipe
    cleaned = []
    for i, r in enumerate(recipes, start=9):  # Start at 9 (after existing 8 recipes)
        clean_inst = clean_instructions(r['instructions'])
        
        # Skip if instructions too short after cleaning
        if len(clean_inst) < 50:
            continue
        
        cleaned_recipe = {
            "id": str(i),
            "title": r['title'],
            "description": f"Receita tradicional da vovó {r['author'] or 'brasileira'}. Sabor caseiro de verdade!",
            "time": estimate_time(r['instructions'], r['ingredients']),
            "servings": estimate_servings(r['title'], r['ingredients']),
            "calories": "250 kcal",  # Estimate
            "difficulty": get_difficulty(clean_inst, r['ingredients']),
            "image": get_image_url(r['category']),
            "rating": 4.5 + (i % 5) * 0.1,  # Vary rating slightly
            "reviews": 50 + (i * 7),
            "is_premium": False,
            "ingredients": r['ingredients'],
            "instructions": [
                {"step": j+1, "text": step.strip()}
                for j, step in enumerate(re.split(r'(?<=[.!])\s+', clean_inst))
                if step.strip() and len(step.strip()) > 10
            ],
            "tags": [r['category'], "Receita da Vovó", "Tradicional", "Caseiro"],
            "source": r['source'],
            "author": r['author'],
            "reactions": {"love": 100 + i * 5, "like": 30 + i * 2, "dislike": i % 3}
        }
        
        cleaned.append(cleaned_recipe)
    
    print(f"Limpas {len(cleaned)} receitas")
    
    # Save cleaned JSON
    with open('livro14_cleaned.json', 'w', encoding='utf-8') as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)
    
    print("Salvo em livro14_cleaned.json")
    
    # Print sample
    for r in cleaned[:3]:
        print(f"\n{r['title']}: {len(r['instructions'])} passos, {len(r['ingredients'])} ingredientes")

if __name__ == "__main__":
    main()
