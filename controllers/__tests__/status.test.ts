import * as controller from '../status';

describe('controllers/status', () => {
  describe('get', () => {
    it('returns an object with a status property and message of ok', async () => {
      const returnedValue = { status: 'ok' };
      const send = jest.fn();
      const status = jest.fn().mockReturnThis();

      expect.assertions(3);
      await controller.get()({} as any, { send, status } as any);
      expect(status.mock.calls.length).toBe(0);
      expect(send.mock.calls.length).toBe(1);
      expect(send.mock.calls[0][0]).toEqual(returnedValue);
    });
  });
});
