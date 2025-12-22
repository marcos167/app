"""
Converte Prisma Schema para SQL do PostgreSQL
Para aplicar no Supabase
"""
import re
from pathlib import Path

SCHEMA_FILE = Path("prisma/schema.prisma")
OUTPUT_FILE = Path("archive/supabase_schema.sql")

def convert_prisma_to_sql(schema_content):
    """Converte Prisma schema para SQL PostgreSQL"""
    
    sql_output = []
    sql_output.append("-- Schema gerado a partir de prisma/schema.prisma")
    sql_output.append("-- Aplicar no Supabase SQL Editor")
    sql_output.append("")
    
    # Extensões necessárias
    sql_output.append("-- Extensões")
    sql_output.append("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
    sql_output.append("")
    
    # Parse models
    model_pattern = r'model\s+(\w+)\s*{([^}]+)}'
    models = re.findall(model_pattern, schema_content, re.MULTILINE | re.DOTALL)
    
    type_mapping = {
        'String': 'TEXT',
        'Int': 'INTEGER',
        'Float': 'REAL',
        'Boolean': 'BOOLEAN',
        'DateTime': 'TIMESTAMP',
        'Json': 'JSONB',
    }
    
    for model_name, model_body in models:
        sql_output.append(f"-- Tabela: {model_name}")
        sql_output.append(f"CREATE TABLE IF NOT EXISTS {model_name.lower()}s (")
        
        fields = []
        indexes = []
        
        lines = model_body.strip().split('\n')
        for line in lines:
            line = line.strip()
            
            # Skip comentários, relações e anotações
            if not line or line.startswith('//') or line.startswith('@@') or '@relation' in line:
                continue
            
            # Parse field
            parts = line.split()
            if len(parts) < 2:
                continue
            
            field_name = parts[0]
            field_type = parts[1].rstrip('?[]')
            
            # Mapear tipo
            sql_type = type_mapping.get(field_type, 'TEXT')
            
            # Nullable
            nullable = '' if '?' not in parts[1] else ''
            not_null = ' NOT NULL' if '?' not in parts[1] else ''
            
            # ID
            if '@id' in line:
                if 'String' in parts[1]:
                    fields.append(f"  {field_name} UUID PRIMARY KEY DEFAULT uuid_generate_v4()")
                else:
                    fields.append(f"  {field_name} SERIAL PRIMARY KEY")
                continue
            
            # Default
            default = ''
            if '@default' in line:
                if 'now()' in line:
                    default = ' DEFAULT CURRENT_TIMESTAMP'
                elif 'autoincrement()' in line:
                    continue  # Já tratado no SERIAL
                elif 'uuid()' in line:
                    default = ' DEFAULT uuid_generate_v4()'
                elif 'false' in line:
                    default = ' DEFAULT false'
                elif 'true' in line:
                    default = ' DEFAULT true'
            
            # Unique
            unique = ' UNIQUE' if '@unique' in line else ''
            
            fields.append(f"  {field_name} {sql_type}{not_null}{default}{unique}")
            
            # Index
            if '@@index' in line:
                index_match = re.search(r'@@index\(\[([^\]]+)\]\)', line)
                if index_match:
                    index_fields = index_match.group(1)
                    indexes.append(f"CREATE INDEX idx_{model_name.lower()}_{index_fields.replace(',', '_')} ON {model_name.lower()}s({index_fields});")
        
        sql_output.append(',\n'.join(fields))
        sql_output.append(");")
        sql_output.append("")
        
        # Add indexes
        for index in indexes:
            sql_output.append(index)
        sql_output.append("")
    
    return '\n'.join(sql_output)

def main():
    """Converter schema"""
    if not SCHEMA_FILE.exists():
        print(f"❌ Arquivo {SCHEMA_FILE} não encontrado!")
        return
    
    print("🚀 Convertendo Prisma Schema para SQL PostgreSQL...")
    
    # Ler schema
    with open(SCHEMA_FILE, 'r', encoding='utf-8') as f:
        schema_content = f.read()
    
    # Converter
    sql_content = convert_prisma_to_sql(schema_content)
    
    # Salvar
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"✅ Schema SQL gerado!")
    print(f"📁 Arquivo: {OUTPUT_FILE}")
    print()
    print("🎯 Próximo passo:")
    print("   1. Abrir Supabase SQL Editor")
    print("   2. Copiar e executar o SQL")
    print("   3. Verificar tabelas criadas")

if __name__ == "__main__":
    main()
