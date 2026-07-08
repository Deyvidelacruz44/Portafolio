# Portafolio — Programador · IA · Automatizaciones

Portafolio profesional construido con HTML, CSS y JavaScript vanilla. Diseño moderno con tema dark/light, animaciones suaves y optimizado para SEO.

## Estructura

```
├── index.html              → Página principal (7 secciones)
├── blog/
│   ├── index.html          → Listado de artículos
│   └── articulo-ejemplo.html → Artículo de ejemplo
├── css/
│   ├── variables.css       → Colores, tipografía, espaciados
│   ├── styles.css          → Estilos principales
│   └── animations.css      → Animaciones y scroll reveal
├── js/
│   ├── main.js             → Theme toggle, nav, carrusel, formulario
│   ├── projects.js         → Datos y renderizado de proyectos
│   └── animations.js       → Intersection Observer + parallax
├── assets/
│   └── images/             → Tus imágenes aquí
└── netlify.toml            → Configuración de deploy
```

## Personalización

1. **Tu información**: Busca y reemplaza `TuNombre`, `tu@email.com`, `tuusuario` en todos los archivos
2. **Proyectos**: Edita el array `projects` en `js/projects.js` con tus proyectos reales
3. **Testimonios**: Edita las testimonial cards en `index.html`
4. **Blog**: Duplica `blog/articulo-ejemplo.html` para crear nuevos artículos
5. **Imágenes**: Reemplaza los emojis placeholder con imágenes reales en `assets/images/`
6. **Colores**: Modifica la paleta en `css/variables.css`

## Deploy en Netlify

1. Sube el proyecto a un repositorio de GitHub
2. Conecta el repositorio en [Netlify](https://app.netlify.com)
3. El formulario de contacto funciona automáticamente con Netlify Forms
4. (Opcional) Configura un dominio personalizado en Netlify

## Desarrollo local

Abre `index.html` directamente en el navegador o usa un servidor local:

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve .
```
