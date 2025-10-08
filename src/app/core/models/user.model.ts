/** Representa al usuario autenticado. */
export interface User {
  /** Identificador único */
  id: string;
  /** Correo electrónico único */
  email: string;
  /** Nombre completo para visualización */
  fullName: string;
  /** Indicador de activación */
  isActive: boolean;
  /** Rol asignado en el dominio */
  role: string;
}
