-- Schema gerado a partir de prisma/schema.prisma
-- Aplicar no Supabase SQL Editor

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela: User
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  image TEXT,
  bio TEXT,
  level TEXT NOT NULL,
  plan TEXT NOT NULL,
  role TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL,
  recipes TEXT NOT NULL,
  savedRecipes TEXT NOT NULL,
  history TEXT NOT NULL,
  likes TEXT NOT NULL,
  comments TEXT NOT NULL,
  adminLogs TEXT NOT NULL,
  refreshTokens TEXT NOT NULL
);


-- Tabela: Recipe
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  time TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  steps TEXT NOT NULL,
  status TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL,
  deletedAt TIMESTAMP,
  authorId TEXT NOT NULL,
  savedBy TEXT NOT NULL,
  history TEXT NOT NULL,
  likes TEXT NOT NULL,
  comments TEXT NOT NULL
);


-- Tabela: SavedRecipe
CREATE TABLE IF NOT EXISTS savedrecipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId TEXT NOT NULL,
  recipeId TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Tabela: History
CREATE TABLE IF NOT EXISTS historys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId TEXT NOT NULL,
  recipeId TEXT NOT NULL,
  viewedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Tabela: Like
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId TEXT NOT NULL,
  recipeId TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Tabela: Comment
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  rating INTEGER NOT NULL,
  images TEXT NOT NULL,
  status TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  userId TEXT NOT NULL,
  recipeId TEXT NOT NULL
);


-- Tabela: Category
CREATE TABLE IF NOT EXISTS categorys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  isActive BOOLEAN NOT NULL DEFAULT true,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL
);


-- Tabela: RefreshToken
CREATE TABLE IF NOT EXISTS refreshtokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hashedToken TEXT NOT NULL UNIQUE,
  userId TEXT NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expiresAt TIMESTAMP NOT NULL
);


-- Tabela: RateLimit
CREATE TABLE IF NOT EXISTS ratelimits (
  key UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  count INTEGER NOT NULL,
  resetAt TIMESTAMP NOT NULL
);


-- Tabela: AdminLog
CREATE TABLE IF NOT EXISTS adminlogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  ip TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

