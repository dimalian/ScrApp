import Express from 'express';

export const notFound = (req: Express.Request, res: Express.Response) => {
  res.status(404).send({ error: 'Unknown URL' });
};

export const unexpected: Express.ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  let message = err.message || err;

  if (status === 500) {
    console.error(err);
  }

  return res.status(status).send({ error: message });
};
