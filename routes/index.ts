import Express from 'express';
import itemRoutes from './item';
import statusRoutes from './status';
import profileRoutes from './profile';

export default (app: Express.Application) => {
  itemRoutes(app);
  statusRoutes(app);
  profileRoutes(app);
};
