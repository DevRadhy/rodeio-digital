# Identidade visual — Rodeo Digital

Fonte: rodeo-digital-manual.pdf, versão 2 / 2026. A seção 07, página 09, não se aplica: os vereditos continuam usando X para positiva e O para negativa. As regras esportivas não foram alteradas pelo manual visual.

## Fonte única dos estilos

`app/styles/globals.css` define as variáveis CSS em `:root` e `.dark`, expostas ao Tailwind v4 por `@theme inline`. Componentes devem usar os tokens semânticos, sem repetir cores hexadecimais ou escalas como emerald/slate.

- `font-display`: Big Shoulders Display, títulos de página/seção em caixa alta, pesos 700–900. H1: 40–48 px responsivo; seções: 24–28 px.
- `font-sans`: Inter, textos e nomes dos competidores em caixa normal.
- `font-mono tabular-nums`: JetBrains Mono, inscrições, parciais e contagens; sem itálico.

As fontes são instaladas via Fontsource e servidas no build, sem requisições ao Google Fonts.

## Tokens de cor

| Uso | Classes / tokens |
| --- | --- |
| Telas, cards, texto | `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground` |
| Ação e positiva | `bg-primary`, `text-primary`, `text-primary-foreground` |
| Inscrição em julgamento | `ring-success`, `bg-success/10` |
| Cabeçalhos de destaque | `bg-brand-deep`, `text-brand-deep-foreground` |
| Corda, bônus e acentos | `border-rope`, `bg-rope/10`, `text-rope-ink` |
| Veredito negativo | `bg-negative`, `text-negative`, `text-negative-foreground` |
| Avisos / ações destrutivas | `text-destructive` (tinta corda com contraste) |

`secondary` e `accent` são superfícies discretas para os estados do shadcn/Base UI. O verde vivo é usado no token `success`; o vermelho é reservado ao veredito negativo. As cores auxiliares de superfície e texto complementam a paleta para manter legibilidade. Em superfícies esmeralda profunda, vereditos negativos usam uma base `bg-card` para preservar contraste.

O tema segue inicialmente o sistema e pode ser alternado no cabeçalho. O placar mantém sua versão escura independente do tema administrativo.
