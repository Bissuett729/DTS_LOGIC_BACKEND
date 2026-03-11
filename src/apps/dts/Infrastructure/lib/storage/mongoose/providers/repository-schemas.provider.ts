import * as schema from '../schemas';

export const MongooseSchemas = [
    { name: schema.DownTime.name,   schema: schema.DownTimeSchema },
    { name: schema.Department.name, schema: schema.DepartmentSchema },
    { name: schema.Line.name,       schema: schema.LineSchema },
]; 
