Nella — Almacén de Útiles Escolares
Aplicación móvil para la gestión interna del almacén Nella, especializado en la venta al por mayor de útiles escolares.
Diseñada para ser operada por una sola persona (el administrador), enfocada en simplicidad y control diario del negocio.

Descripción
Nella es una app desarrollada con React Native + Expo que permite al administrador del almacén:

Visualizar el resumen diario del negocio desde el dashboard (KPIs en tiempo real)
Controlar el stock de productos y recibir alertas cuando baja del mínimo
Registrar entradas y salidas de mercadería (movimientos)
Gestionar clientes (librerías, colegios, distribuidoras, etc.)
Gestionar proveedores con su RUC, contacto y dirección
Acceder de forma segura mediante login con autenticación JWT

Tecnologías
Frontend (React Native)
TecnologíaUsoReact Native + Expo (~54)Framework principal y entorno de desarrolloExpo Router (~6)Navegación basada en archivos (file-based)TypeScriptTipado estáticoReact Navigation (tabs + stacks)Navegación por tabs y stacksAsyncStorage (@react-native-async-storage)Persistencia local (caché y sesión)
Backend (Node.js)
TecnologíaUsoExpress.jsServidor HTTP y definición de rutasMySQL2Base de datos relacionalbcryptHasheo seguro de contraseñasjsonwebtokenAutenticación mediante JWTdotenvGestión de variables de entorno

Arquitectura
almacen-escolar/
├── app/
│ ├── (tabs)/
│ │ ├── dashboard.tsx # KPIs del día, alertas de stock y movimientos recientes
│ │ ├── productos.tsx # Listado de productos con stock
│ │ └── movimientos.tsx # Historial de entradas y salidas
│ ├── clientes.tsx # Gestión de clientes
│ ├── proveedores.tsx # Gestión de proveedores
│ ├── login.tsx # Pantalla de acceso con JWT
│ ├── compra.tsx # Registro de compra (entrada)
│ ├── venta.tsx # Registro de venta (salida)
│ └── \_layout.tsx # Layout raíz con AuthProvider
├── components/ # Componentes reutilizables (KpiCard, ProductoCard, FAB, etc.)
├── context/
│ └── AuthContext.tsx # Contexto de autenticación (login/logout + persistencia de sesión)
├── hooks/
│ ├── useDashboard.ts # Fetch de KPIs con manejo de loading/error
│ ├── useProductos.ts # Fetch + caché AsyncStorage de productos
│ └── useMovimientos.ts # Fetch + caché AsyncStorage de movimientos
├── services/
│ └── api.ts # Cliente HTTP centralizado (apiGet / apiPost + token JWT)
├── styles/ # Estilos separados por pantalla
├── constants/
│ └── theme.ts # Colores y tipografía global
├── backend/
│ └── server.js # API REST (Express + MySQL + JWT)
└── assets/ # Imágenes y recursos visuales

API REST (Backend)
El backend corre en Express.js sobre el puerto 3000. Todos los endpoints (excepto /auth/login) requieren un token JWT en el header Authorization: Bearer <token>.
MétodoEndpointDescripciónPOST/auth/loginAutenticación; retorna token JWT + datos de usuarioGET/productosLista todos los productos ordenados por nombrePOST/productosCrea un nuevo productoGET/movimientosÚltimos 100 movimientos con cliente/proveedorGET/dashboard/kpisKPIs del día: total productos, stock bajo, movimientos y monto vendido
Variables de entorno (backend/.env)
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=
JWT_SECRET=
PORT=3000

Hooks personalizados
useProductos

Carga el listado de productos desde /productos
Al iniciar, muestra primero el caché guardado en AsyncStorage (cache_productos) para respuesta inmediata
Actualiza el caché tras cada fetch exitoso
En caso de error de red, muestra los datos guardados y un aviso al usuario
Expone: productos, loading, error, recargar, agregar

useMovimientos

Misma estrategia de caché con AsyncStorage (cache_movimientos)
Expone: movimientos, loading, error, recargar

useDashboard

Fetch de KPIs sin caché (datos del día actual)
Expone: kpis, loading, error

Persistencia local (AsyncStorage)
La app usa @react-native-async-storage/async-storage para tres propósitos:
ClaveContenidoUsoauth_tokenJWT del usuario autenticadoAutenticación automática al reabrir la appauth_userDatos del usuario (id, nombre, email, rol)Mostrar info del usuario sin consulta extracache_productosArray de productos (JSON)Caché offline; se muestra mientras se refrescan los datoscache_movimientosArray de movimientos (JSON)Ídem para movimientos

Manejo de estados (loading / error / vacío)

Loading: se muestra ActivityIndicator mientras se esperan datos de la API (en login, dashboard, productos y movimientos).
Error de red: mensaje de aviso en pantalla (⚠️ Sin conexión. Datos pueden no estar actualizados.) sin bloquear la UI; se siguen mostrando los datos en caché.
Estado vacío: mensaje informativo cuando no hay movimientos o productos registrados.

Instalación y Ejecución
Requisitos

Node.js >= 18
npm
Expo Go en el celular (para pruebas rápidas) o emulador Android
MySQL >= 8 (para el backend)

1. Frontend
   bash# Clonar el repositorio
   git clone https://github.com/tu-usuario/almacen-escolar.git
   cd almacen-escolar

# Instalar dependencias

npm install

# Iniciar la app

npx expo start
Luego escanea el QR con Expo Go o presiona a para abrir en emulador Android. 2. Backend
bashcd backend

# Instalar dependencias

npm install

# Crear el archivo .env con tus credenciales (ver sección anterior)

cp .env.example .env

# Iniciar el servidor

node server.js

Nota: Si usas un emulador Android, la URL del backend es http://10.0.2.2:3000 (ya configurada en services/api.ts). En dispositivo físico, reemplaza esa IP por la IP local de tu máquina.

Acceso
EmailContraseñaadmin@nella.com(configurada con hash bcrypt en la BD)

Las contraseñas se almacenan con bcrypt. Usa el script backend/generar_hash.js para generar el hash de una nueva contraseña.

Pantallas

Login — Autenticación con email y contraseña; persiste la sesión con JWT en AsyncStorage
Dashboard — KPIs del día (productos, stock bajo, movimientos, ventas), con estados de carga y aviso offline
Productos — Catálogo con stock actual; soporta agregar productos desde la app
Movimientos — Historial de entradas y salidas con cliente/proveedor y monto
Clientes — Directorio de compradores (librerías, colegios, distribuidoras)
Proveedores — Datos de proveedores con RUC, dirección y contacto

## APF3 - Semana 15 (Avance de Proyecto Final)

Optimización de rendimiento, manejo de errores y logging, e integración de funcionalidades nativas del dispositivo.

### Funcionalidades implementadas

- **Logging estructurado**: `services/logger.ts` registra eventos INFO/WARN/ERROR con hora, manteniendo un historial en memoria (mini-Sentry local).
- **Medición de tiempo de API**: `services/medirTiempo.ts` mide la duración de cada llamada; si supera 2000ms se marca como lenta.
- **Manejo de errores de API**: `services/api.ts` centraliza logging, medición y manejo de errores en `apiGet`/`apiPost`.
- **Validaciones de datos**: los hooks (`useProductos`, `useMovimientos`, `useDashboard`) validan respuestas nulas y manejan caché corrupta sin crashear.
- **Permisos y notificaciones**: la app solicita permiso de notificaciones al iniciar (`app/_layout.tsx`) y dispara una notificación local cuando hay productos con stock bajo (`useProductos.ts`).
- **Optimización de renderizado**: listas de productos y movimientos migradas de `.map()` a `FlatList`, con `React.memo` en `ProductoCard` y `MovimientoCard`, y `useCallback`/`useMemo` en las pantallas.
- **Dashboard de rendimiento**: nueva tarjeta "⚡ Rendimiento" con tiempos de carga, cantidad de ítems y aviso visual de carga lenta.
- **Error Boundary global**: `components/ErrorBoundary.tsx` evita pantallas en blanco ante errores inesperados.
- **Mini-registro de logs**: modal accesible desde el Dashboard que muestra el historial de logs (`logger.getHistorial()`).
