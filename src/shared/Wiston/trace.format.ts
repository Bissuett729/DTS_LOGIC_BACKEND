import { format } from 'winston';
import { requestContext } from '../../common/context/request-context';

export const traceFormat = format((info) => {
    const store = requestContext.getStore();
    if (store?.traceId) {
        info.traceId = store.traceId;
    }
    return info;
});