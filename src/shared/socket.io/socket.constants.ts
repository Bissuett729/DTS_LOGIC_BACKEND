/**
 * Constantes de eventos de Socket.IO
 * Estos eventos se emiten a los clientes cuando ocurren cambios importantes
 */

export const SOCKET_EVENTS = {
  // Eventos de Usuarios
  USER: {
    CREATED: 'user:created',
    UPDATED: 'user:updated',
    DELETED: 'user:deleted',
    PASSWORD_CHANGED: 'user:password-changed',
    PROFILE_IMAGE_UPDATED: 'user:profile-image-updated',
  },

  // Eventos de Tools
  TOOL: {
    CREATED: 'tool:created',
    UPDATED: 'tool:updated',
    DELETED: 'tool:deleted',
    ASSIGNED: 'tool:assigned',
    REMOVED: 'tool:removed',
  },

  // Eventos de Tool Templates
  TOOL_TEMPLATE: {
    CREATED: 'tool-template:created',
    UPDATED: 'tool-template:updated',
    DELETED: 'tool-template:deleted',
    APPLIED: 'tool-template:applied',
  },

  // Eventos de Roles
  ROLE: {
    CREATED: 'role:created',
    UPDATED: 'role:updated',
    DELETED: 'role:deleted',
    ASSIGNED: 'role:assigned',
  },

  // Eventos de Líneas
  LINE: {
    CREATED: 'line:created',
    UPDATED: 'line:updated',
    DELETED: 'line:deleted',
  },

  // Eventos de DownTime
  DOWN_TIME: {
    CREATED: 'downtime:created',
    UPDATED: 'downtime:updated',
    DELETED: 'downtime:deleted',
  },

  // Eventos de Departamentos
  DEPARTMENT: {
    CREATED: 'department:created',
    UPDATED: 'department:updated',
    DELETED: 'department:deleted',
  },

  // Eventos de Business Units
  BUSINESS_UNIT: {
    CREATED: 'business-unit:created',
    UPDATED: 'business-unit:updated',
    DELETED: 'business-unit:deleted',
  },

  // Eventos de Shifts
  SHIFT: {
    CREATED: 'shift:created',
    UPDATED: 'shift:updated',
    DELETED: 'shift:deleted',
  },

  // Eventos de Notificaciones
  NOTIFICATION: {
    NEW: 'notification:new',
    READ: 'notification:read',
    DELETED: 'notification:deleted',
  },
} as const;

/**
 * Tipo para asegurar que solo se usen eventos válidos
 */
export type SocketEvent = 
  | typeof SOCKET_EVENTS.USER[keyof typeof SOCKET_EVENTS.USER]
  | typeof SOCKET_EVENTS.TOOL[keyof typeof SOCKET_EVENTS.TOOL]
  | typeof SOCKET_EVENTS.TOOL_TEMPLATE[keyof typeof SOCKET_EVENTS.TOOL_TEMPLATE]
  | typeof SOCKET_EVENTS.ROLE[keyof typeof SOCKET_EVENTS.ROLE]
  | typeof SOCKET_EVENTS.LINE[keyof typeof SOCKET_EVENTS.LINE]
  | typeof SOCKET_EVENTS.DOWN_TIME[keyof typeof SOCKET_EVENTS.DOWN_TIME]
  | typeof SOCKET_EVENTS.DEPARTMENT[keyof typeof SOCKET_EVENTS.DEPARTMENT]
  | typeof SOCKET_EVENTS.BUSINESS_UNIT[keyof typeof SOCKET_EVENTS.BUSINESS_UNIT]
  | typeof SOCKET_EVENTS.SHIFT[keyof typeof SOCKET_EVENTS.SHIFT]
  | typeof SOCKET_EVENTS.NOTIFICATION[keyof typeof SOCKET_EVENTS.NOTIFICATION];
