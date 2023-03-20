// core
import express from 'express';
import { errors } from 'celebrate';
import bodyParser from 'body-parser';
import authorize from './middleware/authorize';

// middleware
import { notFound, unexpected } from './middleware/error-handler';
import routes from './routes';

process.on('unhandledRejection', (reason: Error, promise) => {
  console.error('Unhandled Rejection at:', reason.stack || reason, 'for promise:', promise);
});

const app = express();
app.use(bodyParser.json());
app.use(authorize);

routes(app);

app.use(notFound);
app.use(errors());
app.use(unexpected);

export default app;
