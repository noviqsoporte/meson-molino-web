# CLAUDE.md — El Mesón del Molino Web

## Qué es este proyecto

Sitio web completo para **El Mesón del Molino**, un restaurante y salón de eventos. Tiene dos partes:

1. **Sitio público** — escaparate para clientes: galería de espacios, catálogo de paquetes, formulario de reserva de mesa y solicitud de cotización de eventos.
2. **Dashboard admin** (ruta `/admin`) — panel protegido con contraseña para gestionar reservaciones, paquetes, espacios y configuración del sitio.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 App Router |
| Lenguaje | TypeScript (strict mode) |
| Estilos | Tailwind CSS + tokens personalizados |
| Fuentes | Playfair Display (headings) + Inter (body) |
| Íconos | lucide-react |
| Base de datos | Airtable (REST API directa, sin SDK) |
| Imágenes | Cloudinary (upload desde admin, URLs guardadas en Airtable) |
| Hosting | Vercel |

---

## Estructura de carpetas

```
app/
  admin/              # Dashboard admin (protegido por cookie de sesión)
  api/
    auth/             # Login / logout
    reservas/         # CRUD reservaciones
    paquetes/         # CRUD paquetes
    espacios/         # CRUD espacios
    configuracion/    # CRUD config del sitio
  page.tsx            # Homepage pública
  layout.tsx          # Layout raíz (carga config dinámica desde Airtable)

components/
  admin/              # Todos los componentes del dashboard
    LoginForm.tsx
    DashboardHome.tsx  # KPIs del mes
    ReservasAdmin.tsx
    EventosAdmin.tsx
    PaquetesAdmin.tsx
    EspaciosAdmin.tsx
    ConfiguracionAdmin.tsx
    ImageUploader.tsx  # Upload a Cloudinary
    Sidebar.tsx        # Nav responsive (colapsa en móvil)
  public/             # Componentes del sitio público
    Navbar.tsx
    HeroSection.tsx
    RestauranteSection.tsx
    SalonEventosSection.tsx
    PaquetesSection.tsx
    PaqueteCard.tsx    # Card con MiniSlider (3 fotos)
    MiniSlider.tsx     # Carrusel de 3 imágenes
    ReservaMesaForm.tsx
    CotizarEventoForm.tsx
    FloatingButtons.tsx  # WhatsApp / teléfono / correo fijos
    Footer.tsx

lib/
  airtable.ts         # Wrapper de Airtable (todas las funciones CRUD)
  types.ts            # Interfaces TypeScript
```

---

## Modelos de datos (Airtable)

### `Paquete`
```ts
id, nombre, descripcion, foto_url, foto_url_2, foto_url_3,
tipo ("Buffet" | "Evento"),
precio_por_persona, precio_nino, horario,
personas_min, personas_max, incluye,
activo (boolean), orden (number)
```

### `Reserva`
```ts
id, nombre_cliente, telefono, fecha, hora,
personas, tipo ("Mesa" | "Evento"),
paquete_id?, precio_estimado?, notas_admin?,
estado ("Planeada" | "Confirmada" | "Agendada" | "Cancelada"),
fecha_creacion
```

### `Espacio`
```ts
id, nombre, descripcion,
foto_url, foto_url_2, foto_url_3,
seccion ("Restaurante" | "Salon"),
orden, activo
```

### `Configuracion`
```ts
nombre_negocio, telefono_wa, instagram, correo_contacto,
logo_url, hero_foto_url, tagline, direccion, horarios,
color_primario, color_secundario, color_acento
```

---

## Variables de entorno (`.env.local`)

```
AIRTABLE_API_KEY
AIRTABLE_BASE_ID
AIRTABLE_TABLE_PAQUETES
AIRTABLE_TABLE_RESERVAS
AIRTABLE_TABLE_CONFIGURACION
AIRTABLE_TABLE_ESPACIOS
NEXT_PUBLIC_SITE_URL
ADMIN_PASSWORD
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
```

---

## Autenticación admin

- Login simple por contraseña (env `ADMIN_PASSWORD`)
- Cookie `admin_session` con duración de 7 días
- Las rutas API de admin **no validan la cookie** — sólo el frontend la verifica
- No hay OAuth ni JWT

---

## Colores personalizados (Tailwind)

```
background:     #F7F5F2  (beige cálido)
brand.dark:     #1F3D2B  (verde oscuro)
brand.gold:     #C9A227  (dorado)
brand.olive:    #3F6F4E  (verde oliva)
brand.text:     #2B2B2B  (carbón)
```

Los colores del sitio también se pueden sobreescribir dinámicamente desde `Configuracion` (se inyectan como CSS variables en el layout raíz).

---

## Patrones importantes

- **Airtable directa:** `lib/airtable.ts` hace fetch al REST API de Airtable, no usa el SDK oficial.
- **force-dynamic:** Las rutas públicas y de admin usan `export const dynamic = 'force-dynamic'` para garantizar datos frescos en cada request (no cache de Next.js).
- **MiniSlider:** Componente de carrusel para mostrar hasta 3 fotos en PaqueteCard y otros cards. Sólo se activa si hay más de una imagen.
- **Locale es-MX:** El dashboard formatea moneda con `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`.
- **Mobile-first admin:** El Sidebar en admin colapsa en móvil con un botón hamburguesa.
- **Imágenes en Cloudinary:** Se suben desde el componente `ImageUploader.tsx` usando un unsigned upload preset. La URL resultante se guarda como texto plano en Airtable.

---

## Comandos de desarrollo

```bash
npm run dev      # Servidor local en localhost:3000
npm run build    # Build de producción
npm run lint     # ESLint
```

---

## Convenciones de código

- Componentes: exports nombrados (no default), PascalCase
- Archivos: kebab-case
- `async/await` siempre, nunca `.then()`
- Sin `any` en TypeScript sin comentario explicando por qué
- Sin comentarios obvios — sólo los que explican el *por qué* de algo no evidente
- Commits en inglés: `feat(scope): description`

---

## Contexto de negocio

- Cliente: **El Mesón del Molino** — restaurante y salón de eventos en México
- Desarrollado por **Nexora Automatizaciones**
- El sitio maneja dos tipos de reserva: mesas del restaurante y eventos/banquetes en el salón
- Los paquetes tipo `Buffet` tienen precio por persona (adulto y niño) y horario
- Los paquetes tipo `Evento` tienen rango de personas mínimo/máximo y precio por persona
