"""
Database Seed Script for Chefex
Creates initial admin user and essential data
"""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session
from server.db import engine, create_db_and_tables
from server.models import User
from server.core.security import get_password_hash
from datetime import datetime


def create_admin():
    """Create the initial admin user"""
    with Session(engine) as session:
        # Check if admin already exists
        from sqlmodel import select
        existing = session.exec(
            select(User).where(User.email == "admin@chefex.com")
        ).first()
        
        if existing:
            print("⚠️  Admin já existe: admin@chefex.com")
            return existing
        
        admin = User(
            email="admin@chefex.com",
            full_name="Admin Chefex",
            hashed_password=get_password_hash("ChefexAdmin2024!"),
            provider="local",
            role="admin",
            plan_tier="masterchef",
            email_verified=True,
            created_at=datetime.utcnow()
        )
        session.add(admin)
        session.commit()
        session.refresh(admin)
        
        print("✅ Admin criado com sucesso!")
        print(f"   Email: admin@chefex.com")
        print(f"   Senha: ChefexAdmin2024!")
        print(f"   Role: admin")
        
        return admin


def create_categories():
    """Create default recipe categories"""
    categories = [
        "Café da Manhã",
        "Almoço", 
        "Jantar",
        "Sobremesas",
        "Lanches",
        "Bebidas",
        "Saladas",
        "Sopas",
        "Massas",
        "Carnes",
        "Peixes",
        "Vegano",
        "Vegetariano",
        "Low Carb",
        "Fitness",
        "Doces",
        "Salgados",
        "Bolos",
        "Pizzas",
        "Hambúrgueres"
    ]
    
    print(f"📁 {len(categories)} categorias padrão disponíveis")
    return categories


def seed_all():
    """Run all seed functions"""
    print("\n🌱 Iniciando seed do banco de dados...\n")
    
    # Ensure tables exist
    create_db_and_tables()
    print("✅ Tabelas verificadas/criadas\n")
    
    # Create admin
    create_admin()
    print()
    
    # Create categories
    create_categories()
    print()
    
    print("🎉 Seed concluído com sucesso!\n")


if __name__ == "__main__":
    seed_all()
