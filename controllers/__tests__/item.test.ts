import * as controller from '../item';

describe('controllers/item', () => {
  describe('list', () => {
    it('returns the rows it gets from model', async () => {
      const returnedValue = [{ name: 'Item name' }, { name: 'Item name 2' }];
      const find = jest.fn().mockResolvedValue(returnedValue);
      const send = jest.fn();

      expect.assertions(2);
      await controller.list({ find } as any)({} as any, { send } as any);
      expect(send.mock.calls.length).toBe(1);
      expect(send.mock.calls[0][0].results).toBe(returnedValue);
    });
  });
  describe('get', () => {
    it('returns a row when it gets one', async () => {
      const returnedValue = { name: 'Item name' };
      const findById = jest.fn().mockResolvedValue(returnedValue);
      const send = jest.fn();
      const status = jest.fn().mockReturnThis();

      expect.assertions(3);
      await controller.get({ findById } as any)({ params: { id: '123' } } as any, { send, status } as any);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(1);
      expect(send.mock.calls[0][0]).toBe(returnedValue);
    });

    it('returns 404 when it gets nothing', async () => {
      const findById = jest.fn().mockResolvedValue(null);
      const send = jest.fn();
      const status = jest.fn().mockReturnThis();

      expect.assertions(4);
      await controller.get({ findById } as any)({ params: { id: '123' } } as any, { send, status } as any);
      expect(status.mock.calls.length).toBe(1);
      expect(status.mock.calls[0][0]).toBe(404);
      expect(send.mock.calls.length).toBe(1);
      expect(send.mock.calls[0][0]).toEqual({ message: 'No item with that ID' });
    });
  });
  describe('create', () => {
    it('should return ID after creation', async () => {
      const create = jest.fn().mockResolvedValue(123);
      const send = jest.fn();

      expect.assertions(2);
      await controller.create({ create } as any)({ body: { name: 'Item name' } } as any, { send } as any);
      expect(send.mock.calls.length).toBe(1);
      expect(send.mock.calls[0][0]).toEqual({ id: 123 });
    });
  });
  describe('update', () => {
    it('should return ID after update', async () => {
      const update = jest.fn().mockResolvedValue(1);
      const send = jest.fn();

      expect.assertions(2);
      await controller.update({ update } as any)(
        { params: { id: 123 }, body: { name: 'Item name' } } as any,
        { send } as any,
      );
      expect(send.mock.calls.length).toBe(1);
      expect(send.mock.calls[0][0]).toEqual({ id: 123 });
    });

    it('should return 404 if no update is done', async () => {
      const update = jest.fn().mockResolvedValue(0);
      const send = jest.fn();
      const status = jest.fn().mockReturnThis();

      expect.assertions(4);
      await controller.update({ update } as any)(
        { params: { id: 123 }, body: { name: 'Item name' } } as any,
        { send, status } as any,
      );
      expect(status.mock.calls.length).toBe(1);
      expect(status.mock.calls[0][0]).toBe(404);
      expect(send.mock.calls.length).toBe(1);
      expect(send.mock.calls[0][0]).toEqual({ message: 'No item with that ID' });
    });
  });
});
