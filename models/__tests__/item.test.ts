import * as model from '../item';
import { truncate, destroy } from '../../lib/db';

beforeEach(async () => truncate(model.table));
afterAll(async () => destroy());

describe('models/item', () => {
  describe('find', () => {
    it('returns empty array when there are no rows', async () => {
      expect.assertions(1);
      const rows = await model.find();
      expect(rows).toHaveLength(0);
    });

    it('returns all rows when they exist and no limit/offset is specified ', async () => {
      expect.assertions(6);
      await model.create({ name: 'Item name' });
      await model.create({ name: 'Item name 2' });
      const rows = await model.find();
      expect(rows).toHaveLength(2);
      expect(rows[0].name).toBe('Item name');
      expect(rows[0].updatedAt).toEqual(expect.any(Date));
      expect(rows[0].createdAt).toEqual(expect.any(Date));
      expect(rows[0].id).toBeGreaterThan(0);
      expect(rows[1].name).toBe('Item name 2');
    });

    it('returns only as many rows as the limit allows', async () => {
      expect.assertions(2);
      await model.create({ name: 'Item name' });
      await model.create({ name: 'Item name 2' });
      const rows = await model.find(1);
      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('Item name');
    });

    it('properly uses the offset when returning rows', async () => {
      expect.assertions(2);
      await model.create({ name: 'Item name' });
      await model.create({ name: 'Item name 2' });
      const rows = await model.find(1, 1);
      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('Item name 2');
    });

    it('ignores offset when limit is not provided', async () => {
      expect.assertions(3);
      await model.create({ name: 'Item name' });
      await model.create({ name: 'Item name 2' });
      const rows = await model.find(undefined, 1);
      expect(rows).toHaveLength(2);
      expect(rows[0].name).toBe('Item name');
      expect(rows[1].name).toBe('Item name 2');
    });
  });

  describe('findById', () => {
    it('returns data for an ID that exists', async () => {
      expect.assertions(4);
      const id = await model.create({ name: 'Item name' });
      expect(id).toBeGreaterThan(0);
      const result = await model.findById(id);
      expect(result!.name).toBe('Item name');
      expect(result!.updatedAt).toEqual(expect.any(Date));
      expect(result!.createdAt).toEqual(expect.any(Date));
    });

    it('returns falsy for an ID that does not exist', async () => {
      expect.assertions(2);
      const id = await model.create({ name: 'Item name' });
      expect(id).toBeGreaterThan(0);
      const result = await model.findById(id + 1);
      expect(result).toBeFalsy();
    });
  });

  describe('create', () => {
    it('creates a single item and returns the correct ID', async () => {
      expect.assertions(3);
      const id = await model.create({ name: 'Item name' });
      expect(id).toBeGreaterThan(0);
      const rows = await model.find();
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toEqual(id);
    });

    it('creates a item with all properties correct', async () => {
      expect.assertions(5);
      await model.create({ name: 'Item name' });
      const rows = await model.find();
      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('Item name');
      expect(rows[0].updatedAt).toEqual(expect.any(Date));
      expect(rows[0].createdAt).toEqual(expect.any(Date));
      expect(rows[0].createdAt).toEqual(rows[0].updatedAt);
    });
  });

  describe('update', () => {
    it('updates all fields correctly', async () => {
      expect.assertions(8);
      const id = await model.create({ name: 'Item name' });
      expect(id).toBeGreaterThan(0);
      const updateCount = await model.update(id, { name: 'Shoes' });
      expect(updateCount).toEqual(1);
      const rows = await model.find();
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toEqual(id);
      expect(rows[0].name).toBe('Shoes');
      expect(rows[0].updatedAt).toEqual(expect.any(Date));
      expect(rows[0].createdAt).toEqual(expect.any(Date));
      expect(rows[0].createdAt).not.toEqual(rows[0].updatedAt);
    });
    it('returns 0 count when nothing is updated', async () => {
      expect.assertions(1);
      const updateCount = await model.update(1, { name: 'Shoes' });
      expect(updateCount).toEqual(0);
    });
  });
});
