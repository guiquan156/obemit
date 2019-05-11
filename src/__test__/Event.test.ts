import Event from '../index';

test('data in arguments can set in to instance', () => {
  let event = new Event({
    name: 'kitty',
    school: 'SCNU',
  })
  expect(event.name).toBe('kitty');
  expect(event.school).toBe('SCNU');
})

test('add functions by method add~', () => {
  let event = new Event();

  event.on(function() {
    // topest event
  });
  expect(event.callback.__cbs__.length).toBe(1);

  event.on('say', function() {
    // say
  });
  event.on('say', function() {});
  expect(event.callback.say.__cbs__.length).toBe(2);

  event.on('say.hello', function() {
    // say hello
  });
  expect(event.callback.say.hello.__cbs__.length).toBe(1);
})

test('function added will be exec after emit', () => {
  let event = new Event()
  let globalCount = 0
  let sayCount = 0
  let sayHelloCount = 0

  event.on(function() {
    ++globalCount
  })
  event.on(function() {
    ++globalCount
  })
  event.emit()
  expect(globalCount).toBe(2)

  event.on('say', function() {
    ++sayCount
  })
  event.on('say', function() {
    ++sayCount
  })
  event.emit('say')
  expect(sayCount).toBe(2)

  event.on('say.hello', function() {
    ++sayHelloCount
  })
  event.on('say.hello', function() {
    ++sayHelloCount
  })
  event.emit('say.hello')
  expect(sayHelloCount).toBe(2)

  event.emit('say')
  expect(sayCount).toBe(4)
  expect(sayHelloCount).toBe(4)
})

test('the callback will be cleared arfter method off exec', () => {
  let event = new Event()
  let sayCount = 0
  let sayHelloCount = 0
  let sayWorldCount = 0
  let sayHelloWorldCount = 0

  event.on('say', function () {
    ++sayCount
  })
  event.on('say.hello', function () {
    ++sayHelloCount
  })
  event.on('say.world', function () {
    ++sayWorldCount
  })
  event.on('say.hello.world', function () {
    ++sayHelloWorldCount
  })
  event.emit('say')
  event.emit('say.hello')
  event.emit('say.world')
  event.emit('say.hello.world')

  expect(sayCount).toBe(1)
  expect(sayHelloCount).toBe(2)
  expect(sayWorldCount).toBe(2)
  expect(sayHelloWorldCount).toBe(3)

  event.off('say.hello')
  event.emit('say')
  event.emit('say.hello')
  event.emit('say.world')
  event.emit('say.hello.world')

  expect(sayCount).toBe(2)
  expect(sayHelloCount).toBe(2)
  expect(sayWorldCount).toBe(4)
  expect(sayHelloWorldCount).toBe(3)

  console.log(sayCount, sayHelloCount, sayWorldCount, sayHelloWorldCount)
})
