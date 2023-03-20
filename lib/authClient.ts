import axios from 'axios';
import { auth0 } from '../config';

const client = axios.create({
  baseURL: auth0.domain,
});

export default client;
