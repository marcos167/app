# Monetization System Migration Guide

## Quick Start

Execute a migration para criar todas as tabelas do sistema de monetização:

```bash
# Opção 1: Via Python diretamente
python server/migrations/create_monetization_tables.py

# Opção 2: Via Alembic (se configurado)
alembic upgrade head
```

## Tabelas Criadas

### 1. `platform_settings`
Configuração global da plataforma (singleton)
- Controla fase atual (community/active/partnerships)
- Define taxas de conversão
- Limites de saque

### 2. `user_contribution_points`
Pontos e gamificação de cada usuário
- Pontos totais e disponíveis
- Níveis (1-10) e XP
- Badges conquistados
- Métricas de impacto social

### 3. `points_ledger`
Histórico auditável de todas as transações de pontos
- Registro imutável
- Fraud score automático
- IP tracking

### 4. `financial_ledger`
Saldo financeiro dos usuários (quando monetização ativa)
- Saldo em BRL
- Status KYC
- Configurações de saque

### 5. `financial_transactions`
Transações financeiras individuais
- Conversões de pontos
- Saques
- Bônus retroativos

## Após a Migration

### 1. Verificar instalação
```python
from server.models.monetization import PlatformSettings
from server.database import SessionLocal

db = SessionLocal()
settings = db.query(PlatformSettings).first()
print(f"Fase atual: {settings.current_phase}")
print(f"Monetização ativa: {settings.monetization_enabled}")
```

### 2. Acessar Admin Panel
- URL: `http://localhost:3000/admin/monetization`
- Controlar fases da plataforma
- Executar conversão retroativa

### 3. Testar Sistema
```python
# Distribuir pontos para um usuário
from server.api.endpoints.monetization import award_points, PointsActionType

award_points(
    db=db,
    user_id=1,
    points=100,
    action_type=PointsActionType.RECIPE_PUBLISHED,
    description="Primeira receita publicada!"
)
```

## Rollback (Se necessário)

```sql
DROP TABLE IF EXISTS financial_transactions CASCADE;
DROP TABLE IF EXISTS financial_ledger CASCADE;
DROP TABLE IF EXISTS points_ledger CASCADE;
DROP TABLE IF EXISTS user_contribution_points CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column();
```

## Próximos Passos

1. ✅ Rodar migration
2. ✅ Verificar no admin panel
3. ✅ Criar usuários de teste
4. ✅ Distribuir pontos
5. ✅ Simular ativação de monetização
6. ✅ Testar conversão retroativa
