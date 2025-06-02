import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { AttendanceRoute } from './routes/attendances.route';

ValidateEnv();

const app = new App([new AttendanceRoute()]);

app.listen();
