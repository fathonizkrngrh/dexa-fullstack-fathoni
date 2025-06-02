import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { FileRoute } from './routes/file.route';

ValidateEnv();

const app = new App([new FileRoute()]);

app.listen();
