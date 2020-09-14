jest.mock('./repository');
jest.mock('uuid');

import { query, add, create } from './repository';
import { IllegalEventNumberError } from './errors';
import Aggregate from './Aggregate';
import Event from './Event';

const table = 'TestTable';
const id = 'TestID';

type CustomEvent = { increment: number }

class TestAggregate extends Aggregate {
  count: number;

  constructor(options?: { id: string, table: string }) {
    super(options);
    this.count = 0;
  }

  onTestEvent(event: Event & CustomEvent) {
    this.count += event.increment;
  }
}

let SUT;

// @ts-ignore
const mockedQuery = query as jest.Mock<query>;

describe('Aggregate', () => {
  beforeEach(() => {
    SUT = new TestAggregate({
      table,
      id
    });



    mockedQuery.mockReset();
  });
  test('up', () => {
    expect(SUT.events).toBeInstanceOf(Function);
    expect(SUT.hydrate).toBeInstanceOf(Function);
    expect(SUT.commit).toBeInstanceOf(Function);
    expect(SUT.apply).toBeInstanceOf(Function);
  });

  describe('events', () => {
    test('calls query on repository', async () => {
      mockedQuery.mockReturnValue([]);
      await SUT.events();
      expect(query).toHaveBeenCalledTimes(1);
      expect(query).toBeCalledWith(table, id);
    });
  });

  describe('hydrate', () => {
    test('calls query (via events()) if no fromEvents are passed in, then apply', async () => {
      mockedQuery.mockReturnValue([
        {
          type: 'TestEvent',
          increment: 1,
          number: 1,
          created: '',
        },
        {
          type: 'TestEvent',
          increment: 2,
          number: 2,
          created: '',
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
      mockedQuery.mockReturnValue([]);
      await SUT.commit({
        type: 'TestEvent',
        increment: 51,
        number: 1,
        created: '',
      });
      expect(create).toHaveBeenCalledTimes(1);
      expect(SUT.count).toBe(51);
    });
    test('adds event if is the correct next event number', async () => {
      mockedQuery.mockReturnValue([
        {
          type: 'TestEvent',
          increment: 1,
          number: 1,
          created: '',
        },
        {
          type: 'TestEvent',
          increment: 2,
          number: 2,
          created: '',
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
      mockedQuery.mockReturnValue([
        {
          type: 'TestEvent',
          increment: 1,
          number: 1,
          created: '',
        },
        {
          type: 'TestEvent',
          increment: 2,
          number: 2,
          created: '',
        }
      ]);
      await expect(
        SUT.commit({
          type: 'TestEvent',
          increment: 51,
          number: 5
        })
      ).rejects.toEqual(new IllegalEventNumberError('', ''));
    });
  });
});
