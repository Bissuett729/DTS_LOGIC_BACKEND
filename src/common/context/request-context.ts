import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
    traceId: string;
    userId?: string;
    method?: string;
    path?: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();