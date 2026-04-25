# Nella — Almacén de Útiles Escolares

Aplicación móvil para la gestión interna del almacén **Nella**, especializado en la venta al por mayor de útiles escolares.
Diseñada para ser operada por una sola persona (el administrador), enfocada en simplicidad y control diario del negocio.

---

## Descripción

Nella es una app desarrollada con **React Native + Expo** que permite al administrador del almacén:

- Visualizar el resumen diario del negocio desde el dashboard
- Controlar el stock de productos y recibir alertas cuando baja del mínimo
- Registrar entradas y salidas de mercadería (movimientos)
- Gestionar clientes (librerías, colegios, distribuidoras, etc.)
- Gestionar proveedores con su RUC, contacto y dirección
- Acceder de forma segura mediante login con usuario y contraseña

---

## Tecnologías

| Tecnología       | Uso                           |
| ---------------- | ----------------------------- |
| React Native     | Framework principal           |
| Expo (~54)       | Entorno de desarrollo y build |
| Expo Router      | Navegación basada en archivos |
| TypeScript       | Tipado estático               |
| React Navigation | Navegación por tabs y stacks  |

---

## Estructura del Proyecto

```
proyecto-almacen-escolar/
├── app/
│   ├── (tabs)/
│   │   ├── dashboard.tsx      # Resumen diario, KPIs, alertas y movimientos
│   │   ├── productos.tsx      # Listado de productos
│   │   └── movimientos.tsx    # Historial de entradas y salidas
│   ├── clientes.tsx           # Gestión de clientes
│   ├── proveedores.tsx        # Gestión de proveedores
│   ├── login.tsx              # Pantalla de acceso
│   └── _layout.tsx            # Layout raíz con AuthProvider
├── components/                # Componentes reutilizables (cards, inputs, botones)
├── context/
│   └── AuthContext.tsx        # Contexto de autenticación
├── styles/                    # Estilos separados por pantalla
├── constants/
│   └── theme.ts               # Colores y tipografía global
└── assets/                    # Imágenes y recursos visuales
```

---

## Instalación y Uso

### Requisitos

- Node.js >= 18
- npm o yarn
- Expo Go instalado en el celular (para pruebas rápidas)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/proyecto-almacen-escolar.git
cd proyecto-almacen-escolar

# 2. Instalar dependencias
npm install

# 3. Iniciar la app
npx expo start
```

Luego escanea el QR con la app **Expo Go** desde tu celular, o presiona `a` para abrir en emulador Android.

---

## Acceso

La app usa autenticación local de usuario único:

| Usuario | Contraseña |
| ------- | ---------- |
| `admin` | `1234`     |

> Se recomienda cambiar estas credenciales antes de usar la app en producción.

---

## Pantallas

- **Dashboard** — KPIs del día (productos, stock bajo, movimientos, ventas), alertas de stock mínimo y últimos movimientos
- **Productos** — Catálogo de útiles escolares manejados al por mayor
- **Movimientos** — Registro de entradas y salidas de mercadería
- **Clientes** — Directorio de compradores (librerías, colegios, distribuidoras)
- **Proveedores** — Datos de proveedores con RUC, dirección y contacto

---

## Estado del Proyecto

> En desarrollo — los datos actuales son de prueba (mock data). Próximamente se integrará una base de datos real.

---

## Autor

Proyecto desarrollado para el almacén **Nella**.
