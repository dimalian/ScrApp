import { Action } from './Action.type';

export type Repeat = {
  repeat: {
    times: number;
    actions: Action[];
  };
};
