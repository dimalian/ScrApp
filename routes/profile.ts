import Express from 'express';
import { requiresAuth } from 'express-openid-connect';
import { get } from '../controllers/profile';
import wrap from '../middleware/wrap';

export default (app: Express.Application) => {
  app.get('/api/v1/profile', requiresAuth(), wrap(get()));
};
