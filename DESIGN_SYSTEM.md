# MaxDeal Design System

## Propósito

MaxDeal diseña infraestructura digital para negocios que necesitan presentar
mejor su propuesta, recibir más consultas y convertir atención en oportunidades.

La estética debe comunicar precisión, sobriedad, claridad y criterio comercial.
No debe parecer una startup SaaS genérica, una plantilla ni una colección de
componentes decorativos.

---

## Principios

1. Cada sección tiene un protagonista.
2. El espacio negativo debe reforzar jerarquía, no crear distancia vacía.
3. El azul representa acción, foco, selección e importancia.
4. Las cards se usan solo cuando agrupan unidades comparables e independientes.
5. El contenido comercial debe explicar resultados y decisiones, no tecnologías.
6. Ninguna métrica, cliente, testimonio o resultado se publica sin respaldo real.
7. La experiencia móvil se diseña como una composición propia, no como desktop reducido.
8. Las animaciones no deben bloquear lectura, navegación ni conversión.

---

## Color

### Fondos

| Token | Valor | Uso |
|---|---|---|
| `--bg-base` | `#05080D` | Fondo general |
| `--bg-depth-1` | `#080E16` | Cambios tonales suaves |
| `--bg-depth-2` | `#0C1522` | Superficies agrupadas |
| `--bg-depth-3` | `#101C2B` | Cards y paneles necesarios |

### Texto

| Token | Valor | Uso |
|---|---|---|
| `--text-primary` | `#F4F6F8` | Títulos y información principal |
| `--text-secondary` | `#C7D0DA` | Texto de lectura |
| `--text-muted` | `#98A5B5` | Metadata y apoyo |

### Marca

| Token | Valor | Uso |
|---|---|---|
| `--accent` | `#1683FF` | CTA, foco, estados activos |
| `--accent-bright` | `#37B5FF` | Hover e información destacada |
| `--accent-deep` | `#0B3A73` | Fondos de feature y profundidad |

### Líneas

| Token | Valor | Uso |
|---|---|---|
| `--line` | `rgba(255,255,255,.08)` | Separación estructural |
| `--line-accent` | `rgba(22,131,255,.38)` | Elementos interactivos importantes |

Distribución visual aproximada:
- 80% neutral
- 15% profundidad azulada
- 5% azul eléctrico

---

## Tipografía

### Familias

- Titulares: `Space Grotesk`
- Texto y UI: `Inter`

### Escala

| Nivel | Desktop | Mobile | Uso |
|---|---:|---:|---|
| Hero H1 | 68px | 42px | Propuesta de valor |
| H2 | 42px | 30px | Protagonista de sección |
| H3 | 20px | 19px | Servicios/proyectos |
| Body destacado | 18px | 17px | Descripción editorial |
| Body | 16px | 16px | Lectura general |
| Metadata | 12px | 12px | Categorías y contexto |

### Reglas

- Máximo dos familias tipográficas.
- Máximo tres pesos por familia.
- Las mayúsculas pequeñas se reservan para categorías y contexto.
- Nunca usar texto pequeño para compensar exceso de información.
- El cuerpo debe mantener line-height entre 1.55 y 1.75.

---

## Grid y layout

### Desktop

- Contenedor máximo: 1180px.
- Grid conceptual: 12 columnas.
- Hero: 6 columnas de contenido + 6 columnas visuales.
- Editorial: texto de 5 a 7 columnas.
- Servicios: tres columnas.
- Portafolio: tres columnas o dos piezas grandes.
- Feature/Pack: composición 7 + 5 o 8 + 4.

### Tablet

- Grid conceptual: 8 columnas.
- Hero: texto arriba, visual debajo o al costado según espacio.
- Servicios: dos columnas o una columna según ancho disponible.

### Mobile

- Grid conceptual: 4 columnas.
- Una columna de lectura.
- Cards apiladas.
- Botones mínimos de 48px de alto.
- Ningún texto esencial bajo 14px.
- No hay scroll horizontal.

---

## Espaciado

| Token | Valor |
|---|---:|
| `--space-1` | 8px |
| `--space-2` | 12px |
| `--space-3` | 16px |
| `--space-4` | 24px |
| `--space-5` | 32px |
| `--space-6` | 48px |
| `--space-7` | 72px |
| `--space-8` | 112px |

Regla:
- Las secciones abiertas usan `--space-8`.
- Las secciones de contenido usan `--space-7`.
- Las cards usan padding de `--space-4` o `--space-5`.
- No ajustar márgenes arbitrariamente fuera de esta escala.

---

## Superficies

### Tipo A: Open

Contenido directo sobre el canvas general.
Uso:
- Hero
- Filosofía
- Proceso
- FAQ

### Tipo B: Content

Agrupa contenido comparable.
Uso:
- Servicios
- Proyectos

### Tipo C: Feature

Interrupción visual intencional.
Uso:
- Pack Emprendedor
- CTA final

### Tipo D: Close

Cierre visual y llamada a la acción.
Uso:
- CTA final
- Footer

---

## Botones

### Primary

- Fondo: `--accent`
- Texto: blanco
- Radio: 999px
- Alto mínimo: 48px
- Uso: acción principal única

### Secondary

- Fondo transparente
- Sin borde innecesario
- Texto: `--text-secondary`
- Uso: navegación secundaria o lectura adicional

### Interacción

- Hover: desplazamiento vertical máximo de 2px.
- No glow permanente.
- El glow se permite solo en hover o focus.
- Focus visible siempre presente.

---

## Cards

Se permiten solamente para:

1. Servicios.
2. Proyectos.
3. Comparación estrictamente necesaria.

No usar cards para:

- Filosofía.
- Proceso.
- Testimonios sin respaldo.
- Argumentos cortos.
- Información de apoyo.
- Decoración.

Cada card debe contener:

1. Categoría opcional.
2. Título.
3. Una explicación corta.
4. Precio, metadata o enlace.

---

## Imágenes

- Hero: una pieza fuerte, integrada a la composición.
- Portafolio: dos o tres proyectos bien presentados.
- Bajo el fold: `loading="lazy"`.
- Hero: no lazy loading.
- Todas las imágenes tienen `width`, `height` y `alt`.
- Formato preferido: WebP o AVIF.
- No usar imágenes stock obvias.
- No usar imágenes de clientes sin permiso.
- Los conceptos deben etiquetarse como conceptos.

---

## Motion

Permitido:

- Entrada corta al hacer scroll.
- Hover en botones, cards de servicios y proyectos.
- Cambio de color y borde.
- Desplazamiento máximo de 4px a 6px.

Evitar:

- Parallax.
- Glow constante.
- Animaciones decorativas permanentes.
- Texto que se mueve sin motivo.
- Animar todos los elementos.
- Movimiento que compita con el CTA.

Respetar siempre:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accesibilidad

- HTML semántico.
- Un único H1 por página.
- Contraste suficiente.
- Focus visible en enlaces, botones, inputs y summary.
- SVG decorativo: `aria-hidden="true"`.
- Imágenes informativas: `alt` descriptivo.
- Botones y enlaces deben explicar su destino.
- No usar color como único indicador de estado.
- Formularios con labels reales.
- Carrusel futuro con pausa, controles visibles y navegación por teclado.

---

## SEO

Home:
- Title: `Diseño web y soluciones digitales para negocios | MaxDeal`
- H1: propuesta de valor, no keyword stuffing.
- H2: servicios, proceso, proyectos, FAQ.
- Meta description: una explicación natural del servicio.
- Canonical correcto.
- Open Graph con imagen real cuando exista.
- Schema únicamente con datos comerciales verificables.
- Sitemap y robots.txt.
- Páginas futuras:
  - `/diseno-web`
  - `/landing-pages`
  - `/automatizacion-whatsapp`
  - `/sitios-web`
  - `/proyectos`
  - `/contacto`

---

## Orden de la home

1. Hero: propuesta de valor.
2. Criterio: una buena web comienza entendiendo el negocio.
3. Soluciones: elección según necesidad.
4. Pack: la opción recomendada.
5. Filosofía: diferenciación en composición editorial.
6. Proceso: confianza y previsibilidad.
7. Proyectos: evidencia visual, sin inventar clientes.
8. FAQ: eliminar dudas reales.
9. CTA final: iniciar proyecto.
10. Footer: navegación y datos reales.

