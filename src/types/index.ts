// ─── Auth & Usuarios ────────────────────────────────────────────────

export type RolCodigo = "ADMIN" | "STOCK" | "PEDIDOS" | "CLIENT";

export interface Rol {
  codigo: RolCodigo;
  nombre: string;
  descripcion?: string | null;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string | null;
  activo: boolean;
  roles: Rol[];
  created_at: string;
}

// ─── Categorías ─────────────────────────────────────────────────────

export interface Categoria {
  id: number;
  parent_id?: number | null;
  nombre: string;
  descripcion?: string | null;
  imagen_url?: string | null;
  created_at: string;
  updated_at: string;
  subcategorias?: Categoria[];
}

// ─── Unidad de Medida ───────────────────────────────────────────────

export interface UnidadMedida {
  id: number;
  nombre: string;
  simbolo: string;
  tipo: string;
}

// ─── Ingredientes ───────────────────────────────────────────────────

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string | null;
  stock_cantidad: number;
  es_alergeno: boolean;
}

// ─── Productos ──────────────────────────────────────────────────────

export interface Producto {
  id: number;
  unidad_venta_id?: number | null;
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  imagenes_url?: string[] | null;
  stock_cantidad: number;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Pedidos ────────────────────────────────────────────────────────

export type EstadoPedidoCodigo =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "EN_PREP"
  | "ENTREGADO"
  | "CANCELADO";

export type FormaPagoCodigo = "MERCADOPAGO" | "EFECTIVO" | "TRANSFERENCIA";

export interface EstadoPedido {
  codigo: EstadoPedidoCodigo;
  descripcion: string;
  orden: number;
  es_terminal: boolean;
}

export interface FormaPago {
  codigo: FormaPagoCodigo;
  descripcion: string;
  habilitado: boolean;
}

export interface DetallePedido {
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  nombre_snapshot: string;
  precio_snapshot: number;
  subtotal_snap: number;
  personalizacion?: number[] | null;
}

export interface HistorialEstadoPedido {
  id: number;
  pedido_id: number;
  estado_desde?: EstadoPedidoCodigo | null;
  estado_hacia: EstadoPedidoCodigo;
  usuario_id?: number | null;
  motivo?: string | null;
  created_at: string;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  direccion_id?: number | null;
  estado_codigo: EstadoPedidoCodigo;
  forma_pago_codigo: FormaPagoCodigo;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  notas?: string | null;
  created_at: string;
  updated_at: string;
  detalles?: DetallePedido[];
  historial?: HistorialEstadoPedido[];
}

// ─── Paginación genérica ────────────────────────────────────────────

export interface Paginated<T> {
  total: number;
  skip: number;
  limit: number;
  items: T[];
}