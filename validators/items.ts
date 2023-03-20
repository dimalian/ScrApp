import { Joi } from 'celebrate';

export const url = {
  params: Joi.object({
    url: Joi.string(),
  }),
};

export const actions = {
  url: Joi.string().optional(),
  element: {
    selector: Joi.string().required(),
    text: Joi.string().optional(),
    action: Joi.string().valid('click', 'focus', 'copy', 'type').optional(),
  },
  wait: Joi.number().positive().optional(),
  screenshot: {
    type: Joi.string().valid('fullscreen', 'element', 'viewport').required(),
    selector: Joi.string().optional(),
  },
};

export const repeat = {
  repeat: Joi.object({
    times: Joi.number().positive().required(),
    actions: Joi.array().items(Joi.object(actions)),
  }).optional(),
};

export const actionsRoute = {
  body: Joi.object({
    url: Joi.string().required(),
    actions: Joi.array().items(Joi.object({ ...actions, ...repeat })),
  }),
};

export const options = { allowUnknown: true, stripUnknown: true };
