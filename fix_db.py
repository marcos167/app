import sqlite3

# Conectar ao banco de dados
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Atualizar valores para o formato correto do enum (minúsculo)
cursor.execute("UPDATE user SET plan_tier = 'free' WHERE plan_tier IS NULL OR plan_tier = 'FREE' OR plan_tier = ''")
cursor.execute("UPDATE user SET role = 'user' WHERE role IS NULL OR role = 'USER' OR role = ''")
cursor.execute("UPDATE user SET provider = 'google' WHERE provider = 'GOOGLE'")
cursor.execute("UPDATE user SET provider = 'local' WHERE provider IS NULL OR provider = 'LOCAL' OR provider = ''")
cursor.execute("UPDATE user SET plan_status = 'active' WHERE plan_status IS NULL OR plan_status = ''")

conn.commit()
print(f"Registros atualizados!")

# Mostrar usuários atuais
cursor.execute("SELECT id, email, plan_tier, role, provider FROM user")
users = cursor.fetchall()
for user in users:
    print(f"User: {user}")

conn.close()
print("Banco de dados corrigido!")
