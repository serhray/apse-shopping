# APSE TRADING — Roadmap de Consultoria para Importação/Exportação

## 🎯 Visão Geral

**APSE Trading** é uma plataforma de **consultoria e assistência em importação/exportação**, não um B2B marketplace tradicional.

### Como Funciona:
Usuários pagam **taxas progressivas** para receber consultoria especializada em **5 etapas** até completar uma operação de import/export bem-sucedida.

1. **Etapa 1 (Pesquisa de Produtos)** - Usuário paga taxa para receber recomendações de produtos exportáveis
2. **Etapa 2 (Seleção de Produto)** - Escolher entre recomendações da IA ou trazer seu próprio produto
3. **Etapa 3 (Busca de Mercado)** - Paga para encontrar compradores em destinos específicos
4. **Etapa 4 (Logística & Parceiros)** - Encontrar CHB (Agente Aduaneiro), redatores de documentos, transportadoras
5. **Etapa 5 (Conclusão)** - Facilitar fechamento da operação e documentação final

**Diferença crítica**: Não é B2B (A vende para B). É uma **consultoria paga com IA** que busca soluções de mercado.

---

## FASE 1: INFRAESTRUTURA DE BACKEND (Semana 1-2)

### 1.1 Stack & Setup
- [x] **Node.js + Express.js + TypeScript** (já implementado)
- [x] Repositório backend estruturado
- [x] Variáveis de ambiente (.env)
- [x] ESLint, Prettier, TypeScript

### 1.2 Banco de Dados
- [x] **PostgreSQL 18** com Prisma
- [ ] **Schema models ATUALIZADO**:
  - Users (exportadores, importadores, admins, **vendedores, vendors, consultores**)
  - Wallet (saldo, load history, débitos)
  - Services (5 etapas de consultoria)
  - ServicePricingRules (**dinâmico**: % ou fixo, filtros por categoria/geo/época/volume)
  - UserServices (rastrear progresso, **entrada em qualquer etapa**)
  - AIRecommendations (produtos/mercados recomendados)
  - Partners (**tipos**: CHA, docs, shipping, labs, inspetores, bancos, etc)
  - PartnerApprovals (workflow de aprovação)
  - CrawledData (cache de resultados de scraping)
  - Transactions, Payments (Razorpay + Wallet)
  - Messages/Support (suporte antes/depois da compra)
  - DealHistory (operações completadas)

### 1.3 Autenticação
- [x] JWT + bcrypt
- [x] Endpoints: `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh`
- [x] Roles: Exportador, Importador, Admin
- [x] Email verification
- [x] Password reset

### 1.4 API REST Base
- [x] Estrutura modular (controllers, routes, middleware, utils)
- [x] Tratamento de erros centralizado
- [x] Rate limiting
- [x] CORS
- [ ] API documentation (Swagger)

---

## FASE 2: MÓDULO DE SERVIÇOS & CONSULTORIA (Semana 3)

### 2.1 Gerenciamento de Serviços (5 Etapas)
- [ ] **GET** `/api/services` — listar as 5 etapas
- [ ] **GET** `/api/services/:id` — detalhes de uma etapa
- [ ] **GET** `/api/services/:id/pricing` — calcular preço dinâmico
  - **Admin define**: percentual OU valor fixo
  - **Fatores**: categoria, época do ano, geografia, volume
  - **Flexibilidade**: usuário pode entrar em QUALQUER etapa (não é linear)
- [ ] **POST** `/api/services/:id/purchase` — usuário inicia etapa (paga)
- [ ] **GET** `/api/user-services` — listar serviços contratados pelo usuário
- [ ] **GET** `/api/user-services/:id` — status/progresso
- [ ] **Importante**: Usuário pode ignorar recomendações e inserir próprios dados

### 2.2 Recomendações de IA (Etapa 1 & 3)
- [ ] **POST** `/api/ai/export-recommendations` — buscar produtos
  - Input: orçamento, tipo de negócio, destino
  - Output: 3-10 produtos com análise de viabilidade
- [ ] **POST** `/api/ai/market-recommendations` — buscar compradores
  - Input: produto, volume, qualidade
  - Output: mercados e compradores potenciais
- [ ] Cache de recomendações para performance

### 2.3 Catálogo de Produtos Exportáveis
- [ ] Lista pré-definida: maçãs, algodão, escovas de dente, artesanato, brinquedos de madeira, etc
- [ ] Cada produto com: origem, preço médio, demanda global
- [ ] Usuários podem adicionar produtos custom também

### 2.4 Busca & Filtros
- [ ] Search por etapa, país, tipo de produto
- [ ] Filtros: faixa de preço, volume do negócio
- [ ] Ordenação: recomendado, mais barato, mais popular

---

## FASE 3: SISTEMA DE PAGAMENTO & CHECKOUT (Semana 4)

### 3.1 Wallet & Carrinho
- [ ] **POST** `/api/wallet/load` — carregar carteira (UPI, Google Pay, Apple Pay, cartão)
- [ ] **GET** `/api/wallet/balance` — ver saldo
- [ ] **GET** `/api/wallet/transactions` — histórico de créditos/débitos
- [ ] **POST** `/api/cart/services` — adicionar serviço ao carrinho
- [ ] **GET** `/api/cart` — ver serviços a comprar
- [ ] **DELETE** `/api/cart/services/:id` — remover
- [ ] **NOTA**: Não há pagamento múltiplo de etapas (cada etapa é única por contexto)

### 3.2 Checkout & Pagamento
- [ ] **POST** `/api/payments/initiate` — iniciar transação
- [ ] **POST** `/api/payments/verify` — verificar após callback
- [ ] **Métodos de pagamento**:
  - Wallet (saldo na plataforma) — prioridade
  - UPI
  - Google Pay
  - Apple Pay
  - Razorpay (cartão, Netbanking)
- [ ] Invoice automático + email
- [ ] Webhook para confirmar/falhar automaticamente
- [ ] **Regra crítica**: Cada etapa paga separadamente (não há bundle)

### 3.3 Histórico de Compras
- [ ] **GET** `/api/purchases` — serviços já pagos
- [ ] **GET** `/api/purchases/:id/invoice` — baixar recibo
- [ ] **GET** `/api/purchases/:id/results` — acessar recomendações recebidas

### 3.4 Reembolsos
- [ ] Processar refunds parciais/totais
- [ ] Integração Razorpay para reverter
- [ ] Notificações ao usuário

---

## FASE 4: GERENCIAMENTO DE PARCEIROS & SUPPLY CHAIN (Semana 5-6)

### 4.1 Gerenciamento de Parceiros & Consultores
- [ ] **GET** `/api/partners` — listar consultores registrados
- [ ] **Tipos de consultores/parceiros**:
  - CHA (Customs House Agent)
  - Redatores de documentos
  - Shipping partners (transportadoras)
  - Laboratórios (análise de produtos)
  - Inspetores (qualidade)
  - Bancos (financiamento/câmbio)
  - Vendedores (pre-owned)
  - Fornecedores (vendors)
  - Service providers genéricos
- [ ] **GET** `/api/partners/:id` — detalhes (especialidade, rating, taxa)
- [ ] **POST** `/api/partners/register` — self-registration para consultores
- [ ] **Admin approval** workflow para novos parceiros
- [ ] Cada parceiro com: nome, tipo, especialidade, taxa base, documentos, certificações

### 4.2 Matching de Parceiros (IA + Crawling)
- [ ] **POST** `/api/user-services/:id/find-partners` — IA encontra matches
  - **Fonte 1**: Consultores registrados na plataforma APSE Shopping
  - **Fonte 2**: IA crawl de toda internet (scraping de marketplaces, diretórios)
  - Input: tipo produto, destino, volume, complexidade, tipo de consultor
  - Output: 5-10 opções ranqueadas (plataforma + externos)
- [ ] Usuário escolhe qual parceiro contactar
- [ ] Sistema de mensagens/chat direto com consultor

### 4.3 Documentação & Compliance
- [ ] **POST** `/api/documents/generate` — gerar templates
- [ ] **GET** `/api/documents/:id` — baixar documento
- [ ] Checklist de documentos por país
- [ ] Validação de upload + análise
- [ ] Integração com parceiros para revisão

### 4.4 Dashboard Admin
- [ ] **Configuração dinâmica de preços**:
  - Por etapa: percentual OU valor fixo
  - Filtros: categoria produto, geografia, época do ano, volume
  - Interface para admin ajustar em tempo real
- [ ] Métricas: n° usuários, receita, serviços em progresso
- [ ] CRUD de usuários, serviços, parceiros
- [ ] Aprovação de novos consultores (workflow)
- [ ] Relatórios: taxa conversão, receita por etapa
- [ ] Monitor de suporte (tickets)
- [ ] Multi-currency (₹, R$, USD)

### 4.5 Notificações
- [ ] Email: recomendações recebidas, status updates
- [ ] In-app: alerts quando parceiro/mercado encontrado
- [ ] SMS (Twillio) para passos críticos
- [ ] Notification center com histórico

---

## FASE 5: INTELIGÊNCIA ARTIFICIAL & ANÁLISE (Semana 7)

### 5.1 Motor de Recomendação
- [ ] Treinamento com histórico de operações bem-sucedidas
- [ ] Scoring de viabilidade: demanda, competição, preço
- [ ] API para recomendações em tempo real
- [ ] Melhoria contínua com feedback

### 5.2 Análise de Tendências & Web Crawling
- [ ] **IA crawling global**:
  - Buscar compradores em marketplaces internacionais
  - Crawler de diretórios de CHAs, shipping companies
  - Scraping de preços, demanda, certificações
- [ ] Dashboard: produtos em alta, mercados em expansão
- [ ] Alertas de oportunidades
- [ ] Relatórios customizados por indústria
- [ ] Cache de resultados de crawling (Redis) para performance

### 5.3 Chatbot de Suporte (IA)
- [ ] Responde perguntas comuns sobre processo
- [ ] Escalação para agente humano se necessário
- [ ] Histórico de conversas
- [ ] FAQ dinâmica

### 5.4 Previsão de Sucesso
- [ ] Modelo prevê taxa de sucesso da operação
- [ ] Score de risco (baixo/médio/alto)
- [ ] Baseado em: produto, destino, valor, histórico do usuário

---

## FASE 6: SEGURANÇA & CONFORMIDADE (Semana 8)

### 6.1 Criptografia & HTTPS
- [ ] HTTPS em produção (Let's Encrypt)
- [ ] Tokens JWT secure (HTTP-only cookies)
- [ ] Criptografia de PII em repouso

### 6.2 Validação & Proteção
- [ ] Input sanitization
- [ ] Proteção contra SQL injection, XSS, CSRF
- [ ] Rate limiting (DDoS prevention)
- [ ] Validação de email, phone, formatos

### 6.3 Autenticação 2FA
- [ ] OTP por email/SMS (Twillio)
- [ ] Backup codes
- [ ] Recuperação com security questions

### 6.4 Compliance & Privacy
- [ ] GDPR (EU), LGPD (Brasil), Data Protection Law (Índia)
- [ ] Terms of Service, Privacy Policy
- [ ] Data retention policy
- [ ] Direito ao esquecimento (delete account)
- [ ] Audit logs de transações

---

## FASE 7: PERFORMANCE & OTIMIZAÇÃO (Semana 9)

### 7.1 Caching
- [ ] Redis para recomendações, parceiros, mercados
- [ ] Cache invalidation em tempo real
- [ ] Cache regional (geolocalização)

### 7.2 CDN
- [ ] Cloudflare para assets, documentos
- [ ] Reduzir latência global

### 7.3 Otimização de Queries
- [ ] Índices em: userId, status, serviceId, createdAt
- [ ] Query analysis e optimization
- [ ] Lazy loading para datasets grandes

### 7.4 Compressão
- [ ] Gzip para JSON
- [ ] Minificação de frontend
- [ ] Compressão de imagens/documentos

### 7.5 Backup & Disaster Recovery
- [ ] Backup automático do DB (diário/horário)
- [ ] Point-in-time recovery
- [ ] Replicação regional

---

## FASE 8: DEPLOYMENT & DEVOPS (Semana 10)

### 8.1 Containerização
- [ ] Docker para backend
- [ ] Docker Compose para dev local

### 8.2 CI/CD
- [ ] GitHub Actions
- [ ] Testes automáticos na PR
- [ ] Deploy automático em staging (main branch)
- [ ] Deploy manual em produção com aprovação

### 8.3 Hospedagem
- [ ] **Frontend**: Vercel
- [ ] **Backend**: Railway, AWS EC2, DigitalOcean
- [ ] **DB**: AWS RDS ou Railway PostgreSQL
- [ ] **Cache**: Redis Cloud / AWS ElastiCache
- [ ] **Email**: SendGrid / AWS SES
- [ ] **Payments**: Razorpay (já integrado)

### 8.4 Monitoramento
- [ ] Sentry (error tracking)
- [ ] DataDog ou New Relic (APM)
- [ ] CloudWatch logs
- [ ] Alertas de CPU, memória, erro rates

### 8.5 Documentação
- [ ] Swagger/OpenAPI para backend
- [ ] README com setup local
- [ ] Guia de integração para parceiros

---

## DEPENDÊNCIAS CRÍTICAS

| Camada | Tecnologia | Notas |
|--------|-----------|-------|
| **Frontend** | React 19 + TypeScript + Vite | Rodando em Vite |
| **Backend** | Express.js + Prisma + TypeScript | ✅ Em produção |
| **Database** | PostgreSQL 18 + Prisma | ✅ Em produção |
| **Cache** | Redis | ⚠️ Necessário para crawling |
| **Auth** | JWT + bcrypt | ✅ Implementado |
| **Payments** | Razorpay + UPI + Google/Apple Pay + Wallet | ✅ Razorpay, ❌ Wallet |
| **Web Crawler** | Puppeteer / Cheerio / Scrapy | ❌ Futuro |
| **Storage** | AWS S3 ou similar | Futuro |
| **Email** | SendGrid / AWS SES | Futuro |
| **IA** | OpenAI / Custom Model | Futuro |
| **SMS** | Twillio | Para 2FA/OTP |
| **Hosting** | Railway (backend), Vercel (frontend) | Próximo |
| **Monitoring** | Sentry + CloudWatch | Futuro |
| **CI/CD** | GitHub Actions | Futuro |

---

## STATUS GERAL

| Fase | Status | Progresso |
|------|--------|-----------|
| **Fase 1** | ✅ Concluída | Backend setup, auth, DB 100% |
| **Fase 2** | ⏳ Em Progresso | Serviços 30%, IA recomendações 0% |
| **Fase 3** | ⏳ Em Progresso | Pagamento Razorpay 100%, checkout 80% |
| **Fase 4** | ❌ Não iniciada | Parceiros, documentação 0% |
| **Fase 5** | ❌ Não iniciada | IA avançada 0% |
| **Fase 6** | ❌ Não iniciada | Segurança 2FA 0% |
| **Fase 7** | ❌ Não iniciada | Cache, CDN 0% |
| **Fase 8** | ❌ Não iniciada | Docker, deploy 0% |

---

## MUDANÇAS DO ESCOPO ORIGINAL

### ❌ REMOVIDO (Era B2B e-commerce):
- Carrinho de produtos físicos
- Wishlist de produtos
- Reviews/ratings de produtos
- Bulk ordering tradicional
- Wholesale marketplace
- Pre-owned items section

### ✅ ADICIONADO (Consultoria de import/export):
- 5 etapas de consultoria pagável
- Motor de IA para recomendações
- Sistema de matching de parceiros
- Documentação automatizada
- Geração de templates de export/import
- Análise de tendências de mercado
- Suporte especializado em 5 etapas

---

## PRÓXIMOS PASSOS IMEDIATOS (Prioridade)

### ✅ **RESPONDIDO PELO CLIENTE**:
1. **Preços dinâmicos** — Admin define (% ou fixo) com base em: categoria, geografia, época, volume
2. **Parceiros incluem**: CHA, documentadores, shipping, labs, inspetores, bancos, vendedores, vendors, service providers
3. **Registro unificado**: Todos via "APSE Shopping" (comum)
4. **Wallet obrigatório**: Usuário carrega e paga de lá (+ UPI/Google Pay/Apple Pay)
5. **Etapas independentes**: Usuário pode começar em qualquer etapa
6. **IA crawling**: Buscar parceiros registrados + toda internet

### 🚀 **DESENVOLVIMENTO IMEDIATO**:

1. **Schema do Banco de Dados** (Prisma)
   - Modelo `Wallet` (saldo, transações)
   - Modelo `ServicePricing` (dinâmico: percentual/fixo + filtros)
   - Modelo `Partner` (tipo, especialidade, registro, aprovação)
   - Modelo `UserService` (suportar entrada em qualquer etapa)

2. **Sistema de Wallet**
   - Carregar saldo
   - Debitar ao comprar serviço
   - Histórico completo

3. **Admin: Configuração de preços**
   - Interface para definir regras dinâmicas
   - API: `POST /api/admin/pricing-rules`

4. **Registro de Parceiros/Consultores**
   - Self-registration com approval workflow
   - CRUD para admin gerenciar

5. **IA Crawling (Etapa 3 & 4)**
   - Crawler de marketplaces internacionais
   - Crawler de diretórios de CHAs/shipping
   - Combinar com dados internos

6. **Fluxo de entrada flexível**
   - Usuário escolhe etapa de início
   - Permite input manual em qualquer etapa

---

## NOTAS IMPORTANTES

- **MVP Focus**: Fases 1-3 (autenticação, 5 etapas básicas, pagamento)
- **IA Later**: Recomendações podem começar simples, melhorar com dados
- **Parceiros**: Começar com lista fixa, depois permitir self-registration
- **Compliance**: Verificar regularizações de import/export por país
- **Feedback Loop**: Coletar dados de operações bem-sucedidas para treinar modelo
- **Suporte**: Importante ter consultores humanos no início

---

**Last Updated**: 17 de Fevereiro de 2026
**Scope**: Consultoria de Importação/Exportação (NÃO B2B Marketplace)
