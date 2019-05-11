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
  let globalCount = 0;
  let sayCount = 0;
  let sayHelloCount = 0;

  event.on(() => {
    ++globalCount;
  });
  event.on(() => {
    ++globalCount;
  });
  event.emit();
  expect(globalCount).toBe(2);

  event.on('say', () => {
    ++sayCount;
  });
  event.on('say', () => {
    ++sayCount;
  });
  event.emit('say');
  expect(sayCount).toBe(2);

  event.on('say.hello', () => {
    ++sayHelloCount;
  });
  event.on('say.hello', () => {
    ++sayHelloCount;
  });
  event.emit('say.hello');
  expect(sayHelloCount).toBe(2);

  event.emit('say');
  expect(sayCount).toBe(4);
  expect(sayHelloCount).toBe(4);
});

test('the callback will be cleared arfter method off exec', () => {
  const event = new Event();
  let sayCount = 0;
  let sayHelloCount = 0;
  let sayWorldCount = 0;
  let sayHelloWorldCount = 0;

  event.on('say', () => {
    ++sayCount;
  });
  event.on('say.hello', () => {
    ++sayHelloCount;
  });
  event.on('say.world', () => {
    ++sayWorldCount;
  });
  event.on('say.hello.world', () => {
    ++sayHelloWorldCount;
  });
  event.emit('say');
  event.emit('say.hello');
  event.emit('say.world');
  event.emit('say.hello.world');

  expect(sayCount).toBe(1);
  expect(sayHelloCount).toBe(2);
  expect(sayWorldCount).toBe(2);
  expect(sayHelloWorldCount).toBe(3);

  event.off('say.hello');
  event.emit('say');
  event.emit('say.hello');
  event.emit('say.world');
  event.emit('say.hello.world');

  expect(sayCount).toBe(2);
  expect(sayHelloCount).toBe(2);
  expect(sayWorldCount).toBe(4);
  expect(sayHelloWorldCount).toBe(3);
});
