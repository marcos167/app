"""
Script para exportar dados do SQLite local para JSON
Depois importar no Supabase PostgreSQL
"""
import sqlite3
import json
from pathlib import Path

DATABASE_FILE = "database.db"
OUTPUT_DIR = Path("archive/sqlite_export")

# Criar diretório de output
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def export_table(cursor, table_name):
    """Exporta uma tabela para JSON"""
    try:
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        
        # Pegar nomes das colunas
        columns = [description[0] for description in cursor.description]
        
        # Converter para lista de dicts
        data = []
        for row in rows:
            data.append(dict(zip(columns, row)))
        
        # Salvar JSON
        output_file = OUTPUT_DIR / f"{table_name}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"✅ {table_name}: {len(data)} registros exportados")
        return len(data)
    
    except sqlite3.Error as e:
        print(f"❌ Erro ao exportar {table_name}: {e}")
        return 0

def main():
    """Exportar todas as tabelas"""
    if not Path(DATABASE_FILE).exists():
        print(f"❌ Arquivo {DATABASE_FILE} não encontrado!")
        return
    
    print("🚀 Iniciando exportação do SQLite...")
    print(f"📂 Output: {OUTPUT_DIR}")
    print()
    
    # Conectar ao SQLite
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    # Listar todas as tabelas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    
    total_records = 0
    for table in tables:
        if not table.startswith('sqlite_'):  # Ignorar tabelas do sistema
            count = export_table(cursor, table)
            total_records += count
    
    conn.close()
    
    print()
    print(f"✅ Exportação completa!")
    print(f"📊 Total: {total_records} registros de {len(tables)} tabelas")
    print(f"📁 Arquivos salvos em: {OUTPUT_DIR}")
    print()
    print("🎯 Próximo passo:")
    print("   1. Aplicar schema no Supabase")
    print("   2. Importar dados JSON via Supabase Dashboard ou SQL")

if __name__ == "__main__":
    main()
