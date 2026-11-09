# Tecnotronics PR · Demo web

Demo de sitio informativo para **Tecnotronics Office Equipment** (San Juan, Puerto Rico): reparación y venta de impresoras, copiadoras y computadoras.

Hecho por NEXIX Tech Studio con React + TypeScript + Vite + Framer Motion + Lenis.

## Secciones

1. **Preloader** con la espiral de la marca
2. **Hero** claro tipo cielo: titular en dos tonos con íconos en línea y un arco de tarjetas flotantes (en móvil, formato web app)
3. **Marquee de marcas** que reacciona a la velocidad del scroll
4. **Manifiesto** con píldoras animadas y texto que se ilumina al hacer scroll
5. **Servicios**: scroll horizontal fijo (en desktop) con 6 servicios
6. **Proceso**: una orden de servicio se "imprime" mientras haces scroll
7. **Por qué Tecnotronics**: bento con contadores animados
8. **Pre-diagnóstico interactivo**: el cliente elige equipo y síntoma, y envía el caso por WhatsApp
9. **Impacto social**: donación de equipos a entidades sin fines de lucro
10. **FAQ**, **Contacto** con mapa y **Footer**

## Desarrollo

```bash
npm install
npm run dev
```

## Publicación

`npm run build` genera `dist/`. El workflow `.github/workflows/deploy.yml` publica en GitHub Pages en cada push a `main`
(activar en *Settings → Pages → Source: GitHub Actions*).

Las fotografías vienen de Unsplash (licencia libre de uso comercial). A las de equipos se les quitó el fondo con IA.
