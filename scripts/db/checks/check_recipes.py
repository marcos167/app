import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Check recipes table
    cur.execute("SELECT COUNT(*) FROM recipe")
    count = cur.fetchone()[0]
    print(f"\n📊 Total de receitas no banco: {count}")
    
    # Get sample recipes
    cur.execute("SELECT id, title, status FROM recipe LIMIT 10")
    recipes = cur.fetchall()
    
    print("\n📝 Primeiras 10 receitas:")
    for recipe in recipes:
        print(f"  ID: {recipe[0]} | Título: {recipe[1]} | Status: {recipe[2]}")
    
    # Check status distribution
    cur.execute("SELECT status, COUNT(*) FROM recipe GROUP BY status")
    status_counts = cur.fetchall()
    
    print("\n📈 Distribuição por status:")
    for status, count in status_counts:
        print(f"  {status}: {count}")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Erro: {e}")
