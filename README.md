# FoodStore - Admin App

Frontend de administración para el sistema FoodStore. Es la app interna que realicé para gestionar categorías, productos, pedidos, usuarios y ver las estadísticas del negocio.

## Link al video



## Tecnologías

- React 18 + TypeScript
- TanStack Query — gestión de estado del servidor
- Zustand — estado global (sesión, WebSocket)
- Axios, React Router, Tailwind CSS, Recharts
- WebSocket nativo con reconexión exponencial
- Vite

## Estructura del Proyecto (Feature-based)

foodstore-admin/

├── src/

│   ├── api/                    # Cliente HTTP (Axios)

│   │   └── client.ts

│   ├── components/             # Componentes compartidos

│   │   ├── Sidebar.tsx

│   │   ├── Header.tsx

│   │   ├── Layout.tsx

│   │   ├── Modal.tsx

│   │   ├── ProtectedRoute.tsx

│   │   ├── EstadoBadge.tsx

│   │   ├── ConnectionBadge.tsx

│   │   ├── StatCard.tsx

│   │   └── ImageUploader.tsx

│   ├── features/               # Módulos por dominio

│   │   ├── auth/                # Autenticación

│   │   │   ├── LoginPage.tsx

│   │   │   └── authService.ts

│   │   ├── categorias/          # Gestión de categorías

│   │   │   ├── CategoriasPage.tsx

│   │   │   ├── CategoriaForm.tsx

│   │   │   └── categoriaService.ts

│   │   ├── productos/           # Gestión de productos

│   │   │   ├── ProductosPage.tsx

│   │   │   ├── ProductoForm.tsx

│   │   │   └── productoService.ts

│   │   ├── pedidos/              # Gestión de pedidos

│   │   │   ├── PedidosPage.tsx

│   │   │   ├── PedidoDetailModal.tsx

│   │   │   └── pedidoService.ts

│   │   ├── usuarios/             # Gestión de usuarios y roles

│   │   │   ├── UsuariosPage.tsx

│   │   │   └── usuarioService.ts

│   │   ├── estadisticas/         # KPIs y gráficos

│   │   │   └── estadisticaService.ts

│   │   └── uploads/              # Subida de imágenes (Cloudinary)

│   │       └── uploadService.ts

│   ├── hooks/                    # Hooks personalizados

│   │   └── useAdminOrdersFeed.ts # Conexión WebSocket con reconexión

│   ├── pages/                     # Páginas de nivel superior

│   │   └── DashboardPage.tsx

│   ├── store/                     # Estado global (Zustand)

│   │   ├── authStore.ts

│   │   └── wsStore.ts

│   ├── types/                     # Tipos TypeScript compartidos

│   │   └── index.ts

│   ├── App.tsx                    # Router principal

│   ├── main.tsx                   # Punto de entrada

│   └── index.css                  # Estilos globales (Tailwind)

├── .env                           # Variables de entorno

├── index.html

├── package.json

├── tailwind.config.js

├── tsconfig.json

└── vite.config.ts

Cada feature contiene su página, sus componentes específicos y su `service` con las llamadas a la API.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Disponible en `http://localhost:5173`.

## Variables de Entorno

Crear un `.env` en la raíz:

VITE_API_URL=http://localhost:8000

## Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/dashboard` | Protegido | KPIs y gráficos |
| `/productos` | Protegido | CRUD productos + Cloudinary |
| `/categorias` | Protegido | CRUD categorías jerárquico + Cloudinary |
| `/pedidos` | Protegido | FSM, historial, WebSocket en tiempo real |
| `/usuarios` | Protegido | Listado y gestión de roles |
| `/login` | Público | Inicio de sesión |

## Autenticación

Login restringido a roles `ADMIN`, `STOCK` y `PEDIDOS`. JWT vía cookie HttpOnly para REST; el access token también se guarda en memoria (Zustand) para autenticar el WebSocket.

## WebSocket en tiempo real

`useAdminOrdersFeed` conecta a `/ws/admin/pedidos` con reconexión exponencial automática, e invalida la caché de TanStack Query ante cualquier cambio de estado de pedido.

## Usuario de prueba

Email: admin@foodstore.com
Password: Admin1234!

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | Linter |
| `npm run preview` | Preview del build |

## Backend

Corre en `http://localhost:8000`. Docs en `/docs` (Swagger).

Repo: [Parcial2-back](https://github.com/alexRodriguezProg/Parcial2-back)