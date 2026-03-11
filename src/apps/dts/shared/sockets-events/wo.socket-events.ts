export const DTS_SOCKETS_EVENTS = {
    LINE: {
        CREATED: 'line:created',
        UPDATED: 'line:updated',
        DELETED: 'line:deleted',
    },
    DOWN_TIME: {
        CREATED: 'downtime:created',
        UPDATED: 'downtime:updated',
        DELETED: 'downtime:deleted',
    },
    DEPARTMENT: {
        CREATED: 'department:created',
        UPDATED: 'department:updated',
        DELETED: 'department:deleted',
    },
} as const;