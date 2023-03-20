import { notFound, unexpected } from '../error-handler';

describe('error-handler', () => {
  describe('notFound', () => {
    it('sets status 404 and correct error message', () => {
      const sendMock = jest.fn();
      const respMock = {
        status: jest.fn(() => ({ send: sendMock })),
      };

      notFound({} as any, respMock as any);

      expect(respMock.status).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith({ error: 'Unknown URL' });
    });
  });

  describe('unexpected', () => {
    let resMock: any;
    let statusMock: any;
    let sendMock: any;
    let nextMock: any;

    beforeEach(() => {
      sendMock = jest.fn();
      statusMock = jest.fn(() => ({
        send: sendMock,
      }));
      resMock = {
        headersSent: false,
        status: statusMock,
      };
      nextMock = jest.fn();
    });

    it('calls next if headersSent == true', () => {
      resMock.headersSent = true;
      const error = { status: 500 };
      unexpected(error, {} as any, resMock, nextMock);

      expect(nextMock).toHaveBeenCalledWith(error);
    });
    it('calls send with error message', () => {
      const error = { status: 400, message: 'Oops' };
      unexpected(error, {} as any, resMock, nextMock);

      expect(sendMock).toHaveBeenCalledWith({ error: 'Oops' });
    });
    it('calls status with correct status code', () => {
      const error = { status: 400, message: 'Oops' };
      unexpected(error, {} as any, resMock, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
    });
    it('calls send with error System Error message', () => {
      const error = { status: 500 };
      unexpected(error, {} as any, resMock, nextMock);

      expect(sendMock).toHaveBeenCalledWith({ error: 'System Error' });
    });
  });
});
