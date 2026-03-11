import { Injectable, Logger } from '@nestjs/common';
import { SocketIOClient } from './socketIo.service';
import { SOCKET_EVENTS, SocketEvent } from './socket.constants';

/**
 * Servicio de notificaciones por Socket.IO
 * Proporciona métodos convenientes para enviar notificaciones a usuarios específicos o a todos
 */
@Injectable()
export class SocketNotificationService {
  private readonly logger = new Logger(SocketNotificationService.name);

  constructor(private readonly socketService: SocketIOClient) {}

  /**
   * Envía una notificación a un usuario específico
   * @param userId ID del usuario al que enviar la notificación
   * @param event Evento de socket a emitir
   * @param data Datos a enviar con la notificación
   */
  async notifyUser(userId: string, event: SocketEvent, data: any): Promise<void> {
    try {
      const room = this.getUserRoom(userId);
      await this.socketService.emitEventRoom(room, event, {
        timestamp: new Date().toISOString(),
        userId,
        data,
      });
      this.logger.log(`Notificación enviada al usuario ${userId}: ${event}`);
    } catch (error) {
      this.logger.error(`Error al enviar notificación a usuario ${userId}: ${error.message}`);
    }
  }

  /**
   * Envía una notificación a múltiples usuarios
   * @param userIds Array de IDs de usuarios
   * @param event Evento de socket a emitir
   * @param data Datos a enviar con la notificación
   */
  async notifyUsers(userIds: string[], event: SocketEvent, data: any): Promise<void> {
    try {
      const promises = userIds.map(userId => this.notifyUser(userId, event, data));
      await Promise.all(promises);
      this.logger.log(`Notificación enviada a ${userIds.length} usuarios: ${event}`);
    } catch (error) {
      this.logger.error(`Error al enviar notificaciones a múltiples usuarios: ${error.message}`);
    }
  }

  /**
   * Envía una notificación a todos los usuarios conectados
   * @param event Evento de socket a emitir
   * @param data Datos a enviar con la notificación
   */
  async notifyAll(event: SocketEvent, data: any): Promise<void> {
    try {
      await this.socketService.emitEvent(event, {
        timestamp: new Date().toISOString(),
        data,
      });
      this.logger.log(`Notificación broadcast enviada a todos: ${event}`);
    } catch (error) {
      this.logger.error(`Error al enviar notificación broadcast: ${error.message}`);
    }
  }

  /**
   * Notifica sobre la creación de un usuario
   * @param user Datos del usuario creado
   * @param notifyToUserId ID del usuario que debe recibir la notificación (opcional, si no se especifica se envía a todos)
   */
  async notifyUserCreated(user: any, notifyToUserId?: string): Promise<void> {
    if (notifyToUserId) {
      await this.notifyUser(notifyToUserId, SOCKET_EVENTS.USER.CREATED, user);
    } else {
      await this.notifyAll(SOCKET_EVENTS.USER.CREATED, user);
    }
  }

  /**
   * Notifica sobre la actualización de un usuario
   * @param userId ID del usuario actualizado
   * @param updatedUser Usuario completo actualizado
   */
  async notifyUserUpdated(userId: string, updatedUser: any): Promise<void> {
    // Notificar a todos los usuarios conectados con el usuario completo
    await this.notifyAll(SOCKET_EVENTS.USER.UPDATED, {
      userId,
      ...updatedUser,
      _id: updatedUser._id || updatedUser.id || userId, // Asegurar que _id esté presente
    });
  }

  /**
   * Notifica sobre la eliminación de un usuario
   * @param userId ID del usuario eliminado
   */
  async notifyUserDeleted(userId: string): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.USER.DELETED, { userId });
  }

  /**
   * Notifica sobre el cambio de contraseña de un usuario
   * @param userId ID del usuario
   */
  async notifyPasswordChanged(userId: string): Promise<void> {
    await this.notifyUser(userId, SOCKET_EVENTS.USER.PASSWORD_CHANGED, { userId });
  }

  /**
   * Notifica sobre la actualización de la imagen de perfil
   * @param userId ID del usuario
   * @param imageUrl URL de la nueva imagen
   */
  async notifyProfileImageUpdated(userId: string, imageUrl: string): Promise<void> {
    await this.notifyUser(userId, SOCKET_EVENTS.USER.PROFILE_IMAGE_UPDATED, {
      userId,
      imageUrl,
    });
  }

  /**
   * Notifica sobre la creación de una herramienta
   * @param tool Datos de la herramienta creada
   */
  async notifyToolCreated(tool: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.TOOL.CREATED, tool);
  }

  /**
   * Notifica sobre la actualización de una herramienta
   * @param toolId ID de la herramienta
   * @param updatedData Datos actualizados
   */
  async notifyToolUpdated(toolId: string, updatedData: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.TOOL.UPDATED, {
      toolId,
      ...updatedData,
    });
  }

  /**
   * Notifica sobre la eliminación de una herramienta
   * @param toolId ID de la herramienta eliminada
   */
  async notifyToolDeleted(toolId: string): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.TOOL.DELETED, { toolId });
  }

  /**
   * Notifica sobre la asignación de una herramienta a un usuario
   * @param userId ID del usuario
   * @param tool Datos de la herramienta asignada
   */
  async notifyToolAssigned(userId: string, tool: any): Promise<void> {
    await this.notifyUser(userId, SOCKET_EVENTS.TOOL.ASSIGNED, {
      userId,
      tool,
    });
  }

  /**
   * Notifica sobre herramientas agregadas a un usuario
   * @param userId ID del usuario
   * @param userData Usuario actualizado con todas sus herramientas
   * @param addedTools Herramientas que fueron agregadas
   */
  async notifyToolsAdded(userId: string, userData: any, addedTools: any[]): Promise<void> {
    await this.notifyUser(userId, SOCKET_EVENTS.TOOL.ASSIGNED, {
      userId,
      user: userData,
      addedTools,
    });
  }

  /**
   * Notifica sobre herramientas removidas de un usuario
   * @param userId ID del usuario
   * @param userData Usuario actualizado con sus herramientas restantes
   * @param removedToolIds IDs de herramientas que fueron removidas
   */
  async notifyToolsRemoved(userId: string, userData: any, removedToolIds: string[]): Promise<void> {
    await this.notifyUser(userId, SOCKET_EVENTS.TOOL.REMOVED, {
      userId,
      user: userData,
      removedToolIds,
    });
  }

  /**
   * Notifica sobre la aplicación de un template de herramientas
   * @param userId ID del usuario al que se le aplicó el template
   * @param templateId ID del template aplicado
   * @param userData Datos completos del usuario actualizado con las nuevas tools
   */
  async notifyToolTemplateApplied(userId: string, templateId: string, userData?: any): Promise<void> {
    await this.notifyUser(userId, SOCKET_EVENTS.TOOL_TEMPLATE.APPLIED, {
      userId,
      templateId,
      user: userData, // Usuario actualizado con las tools agregadas
    });
  }

  /**
   * Notifica sobre la creación de un template de herramientas
   * @param template Datos del template creado
   */
  async notifyToolTemplateCreated(template: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.TOOL_TEMPLATE.CREATED, template);
  }

  /**
   * Notifica sobre la actualización de un template de herramientas
   * @param templateId ID del template
   * @param updatedData Datos actualizados
   */
  async notifyToolTemplateUpdated(templateId: string, updatedData: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.TOOL_TEMPLATE.UPDATED, {
      templateId,
      ...updatedData,
    });
  }

  /**
   * Notifica sobre la eliminación de un template de herramientas
   * @param templateId ID del template eliminado
   */
  async notifyToolTemplateDeleted(templateId: string): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.TOOL_TEMPLATE.DELETED, { templateId });
  }

  /**
   * Notifica sobre la creación de un rol
   * @param role Datos del rol creado
   */
  async notifyRoleCreated(role: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.ROLE.CREATED, role);
  }

  /**
   * Notifica sobre la actualización de un rol
   * @param roleId ID del rol
   * @param updatedData Datos actualizados
   */
  async notifyRoleUpdated(roleId: string, updatedData: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.ROLE.UPDATED, {
      roleId,
      ...updatedData,
    });
  }

  /**
   * Notifica sobre la eliminación de un rol
   * @param roleId ID del rol eliminado
   */
  async notifyRoleDeleted(roleId: string): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.ROLE.DELETED, { roleId });
  }

  /**
   * Notifica sobre la creación de un departamento
   * @param department Datos del departamento creado
   */
  async notifyDepartmentCreated(department: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.DEPARTMENT.CREATED, department);
  }

  /**
   * Notifica sobre la actualización de un departamento
   * @param departmentId ID del departamento
   * @param updatedData Datos actualizados
   */
  async notifyDepartmentUpdated(departmentId: string, updatedData: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.DEPARTMENT.UPDATED, {
      departmentId,
      ...updatedData,
    });
  }

  /**
   * Notifica sobre la eliminación de un departamento
   * @param departmentId ID del departamento eliminado
   */
  async notifyDepartmentDeleted(departmentId: string): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.DEPARTMENT.DELETED, { departmentId });
  }

  /**
   * Notifica sobre la creación de un turno
   * @param shift Datos del turno creado
   */
  async notifyShiftCreated(shift: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.SHIFT.CREATED, shift);
  }

  /**
   * Notifica sobre la actualización de un turno
   * @param shiftId ID del turno
   * @param updatedData Datos actualizados
   */
  async notifyShiftUpdated(shiftId: string, updatedData: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.SHIFT.UPDATED, {
      shiftId,
      ...updatedData,
    });
  }

  /**
   * Notifica sobre la eliminación de un turno
   * @param shiftId ID del turno eliminado
   */
  async notifyShiftDeleted(shiftId: string): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.SHIFT.DELETED, { shiftId });
  }

  /**
   * Notifica sobre la creación de una business unit
   * @param businessUnit Datos de la business unit creada
   */
  async notifyBusinessUnitCreated(businessUnit: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.BUSINESS_UNIT.CREATED, businessUnit);
  }

  /**
   * Notifica sobre la actualización de una business unit
   * @param businessUnitId ID de la business unit
   * @param updatedData Datos actualizados
   */
  async notifyBusinessUnitUpdated(businessUnitId: string, updatedData: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.BUSINESS_UNIT.UPDATED, {
      businessUnitId,
      ...updatedData,
    });
  }

  /**
   * Notifica sobre la eliminación de una business unit
   * @param businessUnitId ID de la business unit eliminada
   */
  async notifyBusinessUnitDeleted(businessUnitId: string): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.BUSINESS_UNIT.DELETED, { businessUnitId });
  }

  // ─── Line notifications ────────────────────────────────────────────────────

  async notifyLineCreated(line: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.LINE.CREATED, line);
  }

  async notifyLineUpdated(lineId: string, updatedData: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.LINE.UPDATED, { lineId, ...updatedData });
  }

  async notifyLineDeleted(lineId: string): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.LINE.DELETED, { lineId });
  }

  // ─── DownTime notifications ────────────────────────────────────────────────

  async notifyDownTimeCreated(downTime: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.DOWN_TIME.CREATED, downTime);
  }

  async notifyDownTimeUpdated(downTimeId: string, updatedData: any): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.DOWN_TIME.UPDATED, { downTimeId, ...updatedData });
  }

  async notifyDownTimeDeleted(downTimeId: string): Promise<void> {
    await this.notifyAll(SOCKET_EVENTS.DOWN_TIME.DELETED, { downTimeId });
  }

  /**
   * Genera el nombre de la sala para un usuario específico
   * @param userId ID del usuario
   * @returns Nombre de la sala
   */
  private getUserRoom(userId: string): string {
    return `user:${userId}`;
  }
}
