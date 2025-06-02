import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { EmployeeRoute } from './routes/employees.route';

ValidateEnv();

const app = new App([new EmployeeRoute()]);

app.listen();
