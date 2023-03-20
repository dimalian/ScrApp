import Knex from 'knex';
import { dbConnection, dbPoolMax, dbPoolMin } from '../config';

const knexConfig = {
  client: 'pg',
  connection: dbConnection,
  pool: { min: dbPoolMin, max: dbPoolMax },
};

export const knex = Knex(knexConfig);

/**
 * Truncate a table, typically for testing purposes.
 */
export const truncate = async (table: string) => knex.raw(`truncate table ${table}`);

/**
 * Destroy the database connection.
 */

export const destroy = async () => knex.destroy();
