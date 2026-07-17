# Engemix Landing Page - PRD

## Problem Statement
Usuário forneceu HTML da página inicial da Engemix. Objetivo: adicionar como rota `/home`, remover todos os links externos e garantir visualização mobile (Android/iOS).

## Architecture
- React + FastAPI + MongoDB (template padrão)
- Rota `/` → redireciona para `/home`
- Rota `/home` → Componente Home (`/app/frontend/src/pages/Home.jsx`)

## Core Requirements
- Página `/home` funcional a partir do HTML enviado
- Todos os links externos removidos (`api.whatsapp.com`, `engemix.com.br/quem-somos`, `engemix.com.br/onde-estamos`, `pavimentodeconcreto.com`, `333obra.com.br`)
- Design responsivo (desktop + mobile Android/iOS)

## What's Implemented (2026-02)
- Rota `/home` com todas as seções: Hero carousel (6 slides com autoplay + navegação), A Engemix, Benefícios (5 cards), Nossos Produtos, Pavimento de Concreto, Onde Estamos, Votorantim/Engemix, Banner parceria
- Links externos substituídos por `#`
- Layout responsivo mobile-first com Tailwind
- data-testid em elementos interativos

## Prioritized Backlog
- P0: Outras rotas mencionadas pelo usuário (aguardando definição)
- P1: Backend/CRUD conforme necessidade futura
- P2: Formulário de contato, orçamento online, integração WhatsApp interna
