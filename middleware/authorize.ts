import { auth } from 'express-openid-connect';
import { auth0 } from '../config';

const authorize = auth({
  authRequired: false,
  auth0Logout: true,
  secret: auth0.secret,
  baseURL: auth0.baseURL,
  clientID: auth0.clientID,
  issuerBaseURL: auth0.issuerBaseURL,
});

export default authorize;
