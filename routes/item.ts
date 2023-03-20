import Express from 'express';
import { celebrate } from 'celebrate';
import { create } from '../controllers/item';
import * as validator from '../validators/items';
import * as model from '../models/item';
import wrap from '../middleware/wrap';

export default (app: Express.Application) => {
  app.post('/api/v1/item', celebrate(validator.actionsRoute, validator.options), wrap(create(model)));
};
