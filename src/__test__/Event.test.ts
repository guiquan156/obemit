import Event from '../index';

test('data in arguments can set in to instance', () => {
  const event = new Event({
    name: 'kitty',
    school: 'SCNU',
  });
  expect(event.name).toBe('kitty');
  expect(event.school).toBe('SCNU');
});

test('add functions by method add~', () => {
  const event = new Event();

  event.on(() => {
    // topest event
  });
  expect(event.callback.__cbs__.length).toBe(1);

  event.on('say', () => {
    // say
  });
  event.on('say', () => {
    // say again
  });
  expect(event.callback.say.__cbs__.length).toBe(2);

  event.on('say.hello', () => {
    // say hello
  });
  expect(event.callback.say.hello.__cbs__.length).toBe(1);
});

test('function added will be exec after emit', () => {
  const event = new Event();
  const globalMock = jest.fn();
  const sayMock = jest.fn();
  const sayHelloMock = jest.fn();

  event.on(globalMock);
  event.on(globalMock);
  event.emit();
  expect(globalMock.mock.calls.length).toBe(2);

  event.on('say', sayMock);
  event.on('say', sayMock);
  event.emit('say');
  expect(sayMock.mock.calls.length).toBe(2);

  event.on('say.hello', sayHelloMock);
  event.on('say.hello', sayHelloMock);
  event.emit('say.hello');
  expect(sayHelloMock.mock.calls.length).toBe(2);

  event.emit('say');
  expect(sayMock.mock.calls.length).toBe(4);
  expect(sayHelloMock.mock.calls.length).toBe(4);
});

test('the callback will be cleared arfter method off exec', () => {
  const event = new Event();

  let sayMock = jest.fn();
  let sayHelloMock = jest.fn();
  let sayWorldMock = jest.fn();
  let sayHelloWorldMock = jest.fn();

  event.on('say', sayMock);
  event.on('say.hello', sayHelloMock);
  event.on('say.world', sayWorldMock);
  event.on('say.hello.world', sayHelloWorldMock);
  event.emit('say');
  event.emit('say.hello');
  event.emit('say.world');
  event.emit('say.hello.world');

  expect(sayMock.mock.calls.length).toBe(1);
  expect(sayHelloMock.mock.calls.length).toBe(2);
  expect(sayWorldMock.mock.calls.length).toBe(2);
  expect(sayHelloWorldMock.mock.calls.length).toBe(3);

  event.off('say.hello');
  event.emit('say');
  event.emit('say.hello');
  event.emit('say.world');
  event.emit('say.hello.world');

  expect(sayMock.mock.calls.length).toBe(2);
  expect(sayHelloMock.mock.calls.length).toBe(2);
  expect(sayWorldMock.mock.calls.length).toBe(4);
  expect(sayHelloWorldMock.mock.calls.length).toBe(3);
});

test('emitSelf', () => {
  const event = new Event();
  const helloMock = jest.fn();
  const helloWorldMock = jest.fn();

  event.on('hello', helloMock);
  event.on('hello', helloMock);
  event.on('hello.world', helloWorldMock);
  event.on('hello.world', helloWorldMock);
  event.emitSelf('hello');

  expect(helloMock.mock.calls.length).toBe(2);
  expect(helloWorldMock.mock.calls.length).toBe(0);
});
