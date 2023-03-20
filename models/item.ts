import joi from 'joi';
import humps from 'humps';
import { knex } from '../lib/db';

// our DB type
export type Item = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
};

// our type after we run through Humps
export type ItemCamel = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export const table = 'item';
export const schema = {
  name: joi.string().required(),
};

/**
 * Find all items, optionally with limit and offset to enable paging scenarios.
 *
 */
export const find = async (limit?: number, offset?: number) => {
  const query = knex<Item>(table).select('*').orderBy('id', 'asc');

  if (limit) {
    query.limit(limit);
  }
  if (limit && offset) {
    query.offset(offset);
  }

  const results = await query;
  return results.map((r: Item) => humps.camelizeKeys(r)) as ItemCamel[];
};

/**
 * Find a item by ID
 */
export const findById = async (id: number) => {
  const query = knex<Item>(table).select('*').where({ id });

  const results = await query;
  if (results && results.length) {
    return humps.camelizeKeys(results[0]) as ItemCamel;
  }

  return null;
};

/**
 * Create a item
 */
interface CreateProps {
  name: string;
}

export const create = async (data: CreateProps) => {
  const v = joi.object(schema).validate(data, { presence: 'required' });
  if (v.error) {
    throw new Error(`Validation error: ${v.value}`);
  }

  const results: number[] = await knex<Item>(table).insert(humps.decamelizeKeys(data)).returning('id');

  return results[0];
};

/**
 * Update a item
 */
interface UpdateProps {
  name: string;
}
export const update = async (id: number, data: UpdateProps) => {
  if (!id) {
    throw new Error('Validation error: No ID provided to update');
  }

  const v = joi.object(schema).validate(data, { presence: 'required' });
  if (v.error) {
    throw new Error(`Validation error: ${v.value}`);
  }

  return knex<Item>(table).where({ id }).update(humps.decamelizeKeys(data));
};
