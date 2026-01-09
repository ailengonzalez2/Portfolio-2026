# 📸 Projects Images

Esta carpeta contiene las imágenes de los proyectos del portfolio.

## 📋 Guía de uso

### 1. Formatos recomendados (por orden de prioridad):
- **`.avif`** - Mejor compresión y calidad (recomendado)
- **`.webp`** - Excelente compresión, amplio soporte
- **`.jpg`** / **`.png`** - Formatos tradicionales

### 2. Tamaños recomendados:
Para la sección de proyectos principales (Latest Projects):
- **Ancho mínimo:** 1200px
- **Relación de aspecto:** Flexible (las imágenes se recortarán con `object-cover`)
- **Peso máximo:** < 500KB por imagen (idealmente < 200KB)

Para tarjetas de proyectos:
- **Ancho mínimo:** 800px
- **Relación de aspecto:** 4:3 aproximadamente
- **Peso máximo:** < 300KB

### 3. Convención de nombres:
Usa nombres descriptivos en kebab-case:

```
defi-dashboard.webp
developer-tools.avif
ecotrack-app.jpg
wavelength-music.webp
health-tracker.jpg
ecommerce-redesign.webp
```

### 4. Estructura de carpetas (opcional):
Si tienes muchos proyectos, puedes organizarlos así:

```
/public/projects/
  /featured/        # Proyectos destacados
  /archive/         # Proyectos antiguos
  /thumbnails/      # Miniaturas
```

## 🔧 Cómo usar las imágenes en tu código

En el archivo `app/data/projects.ts`, simplemente usa la ruta relativa:

```typescript
{
  id: 'defi-dashboard',
  title: 'DeFi Dashboard',
  image: '/projects/defi-dashboard.webp',  // ← Ruta local
  // ... resto del proyecto
}
```

O si organizas en subcarpetas:

```typescript
image: '/projects/featured/defi-dashboard.webp'
```

## ✅ Ventajas de usar imágenes locales

1. **Rendimiento**: Las imágenes se optimizan automáticamente con Nuxt Image
2. **Confiabilidad**: No dependes de servicios externos
3. **Control**: Tamaños y formatos exactos para tu diseño
4. **SEO**: Mejor para el posicionamiento web
5. **Offline**: Tu portfolio funciona sin conexión

## 🎨 Optimización de imágenes

Antes de subir tus imágenes, puedes optimizarlas con:

### Online:
- [Squoosh](https://squoosh.app/) - Comprime y convierte formatos
- [TinyPNG](https://tinypng.com/) - Compresión PNG/JPG
- [Cloudinary](https://cloudinary.com/) - Optimización avanzada

### Terminal:
```bash
# Instalar herramientas
npm install -g @squoosh/cli

# Optimizar imágenes
squoosh-cli --webp auto *.jpg
```

## 📝 Checklist antes de subir:
- [ ] Imagen optimizada (< 500KB)
- [ ] Formato moderno (webp/avif preferible)
- [ ] Nombre descriptivo en kebab-case
- [ ] Dimensiones adecuadas (min 1200px ancho)
- [ ] Calidad visual apropiada para tu proyecto
