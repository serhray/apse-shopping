# APSE Shopping — Novo Roadmap de Reestruturação

## Objetivo
Refazer o frontend para ficar visualmente equivalente ao site de referência (https://apseshopping.com), com melhorias de qualidade visual e mantendo 4 módulos no menu principal.

## Escopo Confirmado pelo Cliente
1. E-commerce Retail and Wholesale ✅
2. Request for Quote ✅
3. Services and Pre-Owned ✅
4. Export and Import ✅ (módulo novo no novo site)

## Diretriz de Produto
- Direção principal: estilo e-commerce (B2C visual/fluxo de loja)
- Implementação: código e assets próprios (sem copiar código proprietário)
- Meta: manter estrutura do site de referência + design melhorado

---

## FASE A — Base Visual e Navegação
- [x] Reestruturar `Header` para refletir menu e hierarquia visual do site de referência
- [x] Validar ordem e rotas dos 4 módulos no navbar
- [x] Ajustar topbar (contatos/atalhos) com versão própria
- [x] Garantir responsividade do header/menu

## FASE B — Home (Layout Principal)
- [x] Hero/banner principal com slider e CTA
- [x] Blocos de benefícios (shipping/guarantee/support)
- [x] Seção de promoções horizontais
- [x] Seção “Top Categories”
- [x] Seções de produtos (featured/best/latest/top rated)
- [x] Footer estilo e-commerce consistente

## FASE C — Módulos
- [ ] **Retail/Wholesale**: revisar layout e consistência visual com a nova home
- [ ] **Request for Quote**: manter funcionalidade e alinhar UI
- [ ] **Services & Pre-Owned**: manter páginas e padronizar estilo
- [ ] **Export & Import**: integrar completamente no mesmo padrão visual

## FASE D — Qualidade e Entrega
- [ ] Revisão responsiva (desktop/tablet/mobile)
- [ ] Revisão de acessibilidade básica (focus/labels/contraste)
- [ ] Revisão de performance de imagens e assets
- [ ] Build final e validação pré-deploy
- [ ] Deploy e validação visual em produção

---

## MVP — Gaps que ainda faltam
- [ ] Padronizar UX visual de **todas** as páginas dos 4 módulos (spacing, tipografia, botões, cards)
- [ ] Revisar fluxo de autenticação no contexto e-commerce:
	- [x] usuário comum após login → Home (`/`)
	- [x] admin após login → painel Admin (`/admin`)
- [ ] Definir comportamento para links topbar (`Locate Me`, redes sociais) e placeholders
- [ ] Garantir estados vazios e mensagens amigáveis (sem erros técnicos expostos)
- [ ] Revisar conteúdo de texto para linguagem comercial e-commerce (remover termos legados B2B)
- [ ] Fechar checklist mobile para Header/Home/Retail/Wholesale/Export-Import

---

## Backlog de Segurança (continua ativo no backend)
- [ ] Rate limiting por IP em rotas críticas
- [ ] Sanitização de input e proteção XSS
- [ ] CSRF strategy conforme fluxo de autenticação
- [ ] Compliance docs (Privacy/Terms/Cookies)

---

## Próximo Passo Imediato
Iniciar **FASE C**: revisar e padronizar as páginas dos 4 módulos (Retail/Wholesale, Request for Quote, Services & Pre-Owned e Export & Import) para o mesmo nível visual da Home.
