# Conectown 2026 — Site

Site estático do Conectown 2026. HTML5 + CSS3 + JavaScript Vanilla, sem frameworks,
sem bibliotecas de animação e sem dependências externas de runtime.

Base de conteúdo e decisões: [`Ref/ANALISE-CONECTOWN-2026.md`](Ref/ANALISE-CONECTOWN-2026.md)

## Estrutura

```
index.html
css/style.css        sistema visual (tokens, componentes, reveal)
css/responsive.css   breakpoints 1440 / 1280 / 1024 / 768 / 430 / 390 / 375
js/main.js           header, menu, scrollspy, countdown, acordeão, WhatsApp
js/animations.js     reveal on scroll, entrada do hero, contadores, parallax
assets/brand/        logo, foto do hero e imagem de compartilhamento
assets/speakers/     fotografias originais dos speakers (renomeadas, não editadas)
assets/logos/        logos de realização e apoio
Ref/                 auditoria e material do site anterior (intocado)
```

Rodar localmente:

```bash
python3 -m http.server 8000
```

## Dados oficiais usados

| Item | Valor |
|---|---|
| Data | 07/11/2026, sábado, 8h às 17h |
| Local | Centro Cívico Cultural Antônio Carlos Borges — Rua Buenos Aires, 937, Centro, Santa Rosa/RS |
| Trilhas | 05 e 06/11, 19h às 21h |
| Countdown | `2026-11-07T08:00:00-03:00` (definido em `index.html`, atributo `data-countdown`) |
| WhatsApp | `5555991078999` (único número oficial 2026) |

## Pendências de conteúdo (não inventar — preencher quando disponível)

1. **Trilhas individuais** — a seção mostra as duas noites confirmadas.
   Nomes/temas de cada trilha, quando definidos, entram como novos `<article class="trail">`.
2. **O nome que falta** — o bloco `.speaker-pending` anuncia um único speaker
   restante. Ao confirmar, duplicar um `<li class="speaker">` existente e remover o bloco.
5. **César Saut** — sem links sociais. Os links do site anterior apontavam para
   outra pessoa (perfis de Fernando Camera / iFood) e não foram reaproveitados.
   5b. **Foto do hero** — `hero-speakers.png` mostra 5 pessoas. Confirmar se são os
   speakers confirmados e se a arte deve ser atualizada a cada novo anúncio.
6. **Foto da Goda Kaciusiene** — o arquivo original é uma captura de tela (360×496).
   Substituir `assets/speakers/goda-kaciusiene.png` por uma fotografia quando houver.
7. **Rodapé** — CNPJ, endereço da organização e redes sociais oficiais do evento
   não constavam no site anterior; adicionar em `.site-footer__contact` quando definidos.
8. **Lotes de ingresso** — o lote atual é "Lançamento, 31/08 a 10/09".
   Após essa janela, atualizar valores e o texto de `.ticket__flag`.
9. **Seções removidas a pedido** — Programação 2026, faixa rosa de CTA e o
   bloco final "Conhecimento global. Resultado local." foram retirados do HTML.

## Direção visual (campanha 2026)

Baseada nos mockups aprovados em `Ref/mockups/`.

| Item | Valor |
|---|---|
| Fundo | `#000000` (seções alternam com `#0A0A0A`) |
| Gradiente | `#FF0AC7` → `#FF0700` |
| Tipografia | Montserrat (300 a 900) |
| Texto corpo | `#B5B5B5` · auxiliar `#8A8A8A` |
| Botões | pílula (`border-radius: 999px`) com gradiente |
| Foto do hero | `assets/brand/hero-speakers.webp` (1129×1212, com variante de 708px) |

Ordem do hero: **desktop** = duas colunas (logo, selo, título e botão à esquerda;
foto à direita); **≤1024px** = empilhado na ordem logo → foto → título → selo → botão.

## Notas técnicas

- **Logo preservado**: `assets/brand/logo-conectown.png` é o arquivo original
  (2560×243). Sobre o fundo preto ele é exibido em branco via
  `filter: brightness(0) invert(1)` — é a mesma marca, apenas renderizada em branco,
  como nos mockups. O arquivo não foi editado.
- **Contraste**: branco sobre o gradiente rende ~3.4:1. Os botões grandes usam
  corpo ≥19px em peso 700 e passam como texto grande (AA 3:1). Os selos pequenos
  (`.ticket__flag`) usam texto preto (5.3:1). As pílulas `btn--sm` do header e do
  rodapé usam **texto branco por decisão de design** e ficam em 3.43:1 — abaixo do
  AA para texto pequeno.
- **Patrocinadores × Apoio**: patrocinadores são Sicredi, Sulnet, Viasoft Pay,
  Líder, Ambev/Steffen e Grupo RBS (grade `.logo-grid--lead`, chips maiores).
  Os demais logos ficam em "Apoio".
- **Gradiente nos botões**: `background-origin: border-box` evita que o gradiente
  reinicie na borda transparente de 2px (aparecia uma faixa rosa na ponta direita).
- **Animações**: o conteúdo é visível por padrão. Os estados iniciais só são aplicados
  se `IntersectionObserver` existir (classe `js-anim` no `<html>`), então falha de JS
  nunca deixa uma seção em branco. `prefers-reduced-motion: reduce` desliga tudo.
- **Fontes**: Montserrat via Google Fonts (`<link>`, sem JS), com fallback para a
  stack do sistema.
- **Imagens**: tudo em WebP, gerado com `cwebp` a partir dos PNG/JPEG originais
  (preservados no histórico do git, no commit `70c02b8`). Cada arquivo foi
  encodado no tamanho real de exibição e testado em modo com perda e sem perda,
  ficando com o menor dos dois — logos chapados costumam vencer em *lossless*,
  fotografias em `-q 68..82`. `assets/` caiu de 2,8 MB para 508 KB.
  Duas exceções ficam fora do WebP de propósito:
  `brand-conectown.png` (og:image — os crawlers do X e do LinkedIn não leem WebP)
  e `favicon.png` (o Safari é instável com favicon em WebP).
- **Pendência conhecida**: o `og:image` é retrato (800×1196). Cards de link do
  WhatsApp, LinkedIn e X esperam 1200×630; hoje a imagem é cortada na pré-visualização.
