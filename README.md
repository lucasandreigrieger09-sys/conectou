# Conectown 2026 — Site

Site estático do Conectown 2026. HTML5 + CSS3 + JavaScript Vanilla, sem frameworks,
sem bibliotecas de animação e sem dependências externas de runtime.

Base de conteúdo e decisões: [`Ref/ANALISE-CONECTOWN-2026.md`](Ref/ANALISE-CONECTOWN-2026.md)

## Estrutura

```
index.html
css/style.css        sistema visual (tokens, componentes, reveal) + responsivo
                     no fim do arquivo, sob o banner RESPONSIVO
                     breakpoints 1440 / 1280 / 1100 / 1024 / 900 / 768 / 430 / 390 / 375
js/main.js           header, menu, scrollspy, countdown, acordeão, WhatsApp
js/animations.js     reveal on scroll, entrada do hero, contadores, parallax
assets/brand/        logo, foto do hero e imagem de compartilhamento
assets/speakers/     fotografias originais dos speakers (renomeadas, não editadas)
assets/logos/        logos de realização e apoio
assets/fonts/        Montserrat variável (woff2), servido pelo próprio domínio
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
6. **Fotos da Goda Kaciusiene e do César Saut** — as duas únicas que ficam visivelmente
   ruins, e o motivo é a resolução de origem, não a compressão.
   A caixa `.speaker__media` pinta ~343 CSS px; num celular 3x isso são 1029 px reais.
   Ampliação de cada foto nesse cenário:

   | foto | fonte | recorte usado (4:5) | ampliação |
   |---|---|---|---|
   | Fernando | 1030×1401 | 1030×1288 | 1,00x |
   | Juan Pablo | 683×1024 | 683×854 | 1,51x |
   | Anderson | 760×834 | 667×834 | 1,54x |
   | **César** | 760×541 | **433×541** | **2,38x** |
   | **Goda** | 360×496 | 360×450 | **2,86x** |

   - **Goda**: o original é uma captura de tela em PNG **indexado de 256 cores**.
     Comparado lado a lado no tamanho de exibição, o webp publicado é indistinguível
     do PNG de origem — aumentar a qualidade só gastaria bytes. Só uma foto nova resolve.
   - **César**: o arquivo nunca passou pela otimização (hash idêntico desde o commit
     inicial). Ele já chegou ao projeto como um WebP com perda de 10 KB para 760×541,
     cerca de 0,2 bit por pixel, quando uma foto decente usa 1 a 2. Pior: é **paisagem**
     dentro de uma caixa retrato 4:5, então o `object-fit: cover` descarta 43% da largura.

   **O que pedir ao cliente**: retrato, proporção 4:5, mínimo 1030×1288 px
   (ideal 1200×1500), JPEG ou PNG em cor plena. Não serve captura de tela nem imagem
   salva de página web.
7. **Rodapé** — CNPJ, endereço da organização e redes sociais oficiais do evento
   não constavam no site anterior; adicionar em `.site-footer__contact` quando definidos.
8. **Lotes de ingresso** — o lote atual é "1º lote, 11/09 a 10/10":
   R$ 260,00 associado ACISAP, R$ 325,00 público geral. O pack de empresas
   não muda por lote (R$ 240,00 e R$ 305,00 por unidade, mínimo 10).
   Após 10/10, atualizar valores e o texto de `.ticket__flag`.
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

A **ordem de entrada** da animação segue o `data-hero-step` no HTML e é a mesma nos
dois layouts: logo (120 ms) → foto (250 ms) → título (380 ms) → frase de apoio
(510 ms) → data e local (640 ms) → botão (770 ms). O passo é de 130 ms e cada
elemento leva 700 ms para completar a transição. Não há exceção no JS: quem manda
é o atributo.

## Notas técnicas

- **Logo preservado**: `assets/brand/logo-conectown.png` é o arquivo original
  (2560×243). Sobre o fundo preto ele é exibido em branco via
  `filter: brightness(0) invert(1)` — é a mesma marca, apenas renderizada em branco,
  como nos mockups. O arquivo não foi editado.
- **Contraste**: branco sobre o gradiente rende ~3.4:1. Os botões grandes usam
  corpo ≥19px em peso 700 e passam como texto grande (AA 3:1). Os selos pequenos
  (`.ticket__flag`) e o texto do card `.trail--cta` usam **branco por decisão de
  design** e ficam entre 3.43:1 (ponta rosa) e 3.98:1 (ponta vermelha). O título
  do `.trail--cta` passa como texto grande (AA 3:1); o selo e o parágrafo ficam
  abaixo do AA para texto pequeno. Mesma decisão das pílulas `btn--sm` do header
  e do rodapé.
- **Patrocinadores × Apoio**: patrocinadores são Sicredi, Sulnet, Viasoft Pay,
  Líder, Ambev/Steffen e Grupo RBS (grade `.logo-grid--lead`, chips maiores).
  Os demais logos ficam em "Apoio".
- **Gradiente nos botões**: `background-origin: border-box` evita que o gradiente
  reinicie na borda transparente de 2px (aparecia uma faixa rosa na ponta direita).
- **Animações**: o conteúdo é visível por padrão. Os estados iniciais só são aplicados
  se `IntersectionObserver` existir (classe `js-anim` no `<html>`), então falha de JS
  nunca deixa uma seção em branco. `prefers-reduced-motion: reduce` desliga tudo.
- **Fontes**: Montserrat **variável**, servido pelo próprio domínio
  (`assets/fonts/montserrat-var.woff2`, 34 KB, subset latin, eixo 400–800).
  Um arquivo cobre os cinco pesos; os cinco estáticos equivalentes somam 173 KB.
  O Google Fonts saiu do caminho crítico: eram duas conexões novas
  (`fonts.googleapis.com` e depois `fonts.gstatic.com`) e ~750 ms de bloqueio
  antes do primeiro pixel. Hoje a página **não faz nenhuma requisição de terceiros**
  para renderizar — o único terceiro é o iframe do mapa, que é `loading="lazy"`.
  O arquivo é pré-carregado com `<link rel="preload" as="font" crossorigin>`;
  o `crossorigin` é obrigatório mesmo sendo o mesmo domínio, porque fontes são
  sempre buscadas em modo CORS — sem ele o navegador baixa o arquivo duas vezes.
- **Arquivos em `assets/` nunca mudam de conteúdo no mesmo nome.** O cabeçalho é
  `immutable` por um ano, então trocar os bytes mantendo a URL deixaria quem já
  visitou o site com a versão antiga por 12 meses. Ao publicar uma imagem nova,
  **mude o nome do arquivo** — é por isso que existe `fernando-schuler-1030.webp`
  em vez de `fernando-schuler.webp`.
- **URLs de css/js são versionadas** (`style.css?v=<hash>`) e os cabeçalhos
  mandam revalidar sempre. Isso existe por causa de um bug real: quando
  `responsive.css` virou parte de `style.css`, quem tinha o `style.css` antigo
  em cache (`max-age=3600`) passou a receber o HTML novo — que não pede mais o
  `responsive.css` — junto da folha velha, que não tinha a parte responsiva.
  Resultado: o site abria sem nenhuma regra de mobile. Trocar só o cabeçalho não
  conserta caches já envenenados, porque o navegador nem pergunta enquanto a
  cópia estiver fresca; só uma URL diferente força a busca.
  **Ao mexer em `css/style.css`, `js/main.js` ou `js/animations.js`, atualize o
  `?v=` do `<link>`/`<script>` correspondente em `index.html`.**
- **Uma folha de estilo só**: `responsive.css` foi anexado ao fim de `style.css`.
  Eram duas requisições em série bloqueando a primeira pintura, e a segunda
  esperava ~450 ms só por estar atrás da primeira. A ordem da cascata é idêntica
  à de antes, porque o arquivo antigo era 100% blocos `@media`.
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
