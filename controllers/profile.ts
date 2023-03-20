import Express from 'express';

export const get = () => async (req: Express.Request, res: Express.Response) => {
  res.send(JSON.stringify(req.oidc.user));
};
