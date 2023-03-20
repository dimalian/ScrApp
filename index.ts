import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { port } from './config';

app.listen(port);
console.info(`Listening on port ${port}`);
