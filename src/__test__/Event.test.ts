import Event from '../index';

test('data in arguments can set in to instance', () => {
  let event = new Event({
    name: 'kitty',
    school: 'SCNU',
  });
  expect(event.name).toBe('kitty');
  expect(event.school).toBe('SCNU');
});

test('Event#on()', () => {
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
});
