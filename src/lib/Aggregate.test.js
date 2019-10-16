jest.mock('./Repository');
jest.mock('uuid');
const { query, add, create } = require('./Repository');
const IllegalEventNumberError = require('./IllegalEventNumberError');
const Aggregate = require('./Aggregate');
const table = 'TestTable';
const id = 'TestID';

class TestAggregate extends Aggregate {
  constructor(options) {
    super(options);
    this.count = 0;
  }
  onTestEvent(event) {
    this.count += event.increment;
  }
}
let SUT;

describe('Aggregate', () => {
  beforeEach(() => {
    SUT = new TestAggregate({
      table,
      id
    });
    query.mockReset();
  });
  test('up', () => {
    expect(SUT.events).toBeInstanceOf(Function);
    expect(SUT.hydrate).toBeInstanceOf(Function);
    expect(SUT.commit).toBeInstanceOf(Function);
    expect(SUT.apply).toBeInstanceOf(Function);
  });

  describe('events', () => {
    test('calls query on repository', async () => {
      query.mockReturnValue();
      await SUT.events();
      expect(query).toHaveBeenCalledTimes(1);
      expect(query).toBeCalledWith(table, id);
    });
  });

  describe('hydrate', () => {
    test('calls query (via events()) if no fromEvents are passed in, then apply', async () => {
      query.mockReturnValue([
        {
          type: 'TestEvent',
          increment: 1,
          number: 1
        },
        {
          type: 'TestEvent',
          increment: 2,
          number: 2
        }
      ]);
      await SUT.hydrate();
      expect(query).toHaveBeenCalledTimes(1);
      expect(SUT.count).toBe(3);
    });
    test('uses fromEvents if passed in', async () => {
      await SUT.hydrate([
        {
          type: 'TestEvent',
          increment: 21,
          number: 1
        },
        {
          type: 'TestEvent',
          increment: 5,
          number: 2
        }
      ]);
      expect(SUT.count).toBe(26);
    });
  });

  describe('commit', () => {
    test('creates version 1 of event if no event history', async () => {
      query.mockReturnValue([]);
      await SUT.commit({
        type: 'TestEvent',
        increment: 51,
        number: 1
      });
      expect(create).toHaveBeenCalledTimes(1);
      expect(SUT.count).toBe(51);
    });
    test('adds event if is the correct next event number', async () => {
      query.mockReturnValue([
        {
          type: 'TestEvent',
          increment: 1,
          number: 1
        },
        {
          type: 'TestEvent',
          increment: 2,
          number: 2
        }
      ]);
      await SUT.commit({
        type: 'TestEvent',
        increment: 51,
        number: 3
      });
      expect(add).toHaveBeenCalledTimes(1);
      expect(SUT.count).toBe(54);
    });
    test('throws IllegalEventNumberError if next number is incorrect', async () => {
      query.mockReturnValue([
        {
          type: 'TestEvent',
          increment: 1,
          number: 1
        },
        {
          type: 'TestEvent',
          increment: 2,
          number: 2
        }
      ]);
      await expect(
        SUT.commit({
          type: 'TestEvent',
          increment: 51,
          number: 5
        })
      ).rejects.toEqual(new IllegalEventNumberError());
    });
  });
});
