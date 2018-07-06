import * as Redis from 'ioredis';
import fetch from 'node-fetch';

import { createConfirmEmailLink } from './createConfirmEmailLink';
import { createTypeormConn } from './createTypeormConn';
import { User } from '../entity/User';

let userId = '';
const redis = new Redis();

beforeAll(async () => {
  await createTypeormConn();
  const user = await User.create({
    email: 'ivan@huya.com',
    password: 'dwadwajod',
  }).save();
  userId = user.id;
});

describe('test createConfirmEmailLink', () => {
  test('Make sure it confirm user and clears key in redis', async () => {
    const url = await createConfirmEmailLink(
      process.env.TEST_HOST as string,
      userId as string,
      redis,
    ); 
  
    const res = await fetch(url);
    const text = await res.text();
    expect(text).toEqual('ok');
    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();
    const chunks = url.split('/');
    const key = chunks[chunks.length - 1];
    const val = await redis.get(key);
    expect(val).toBeNull();
  });

  test('sends invalid back if bad id sent', async () => {
    const res = await fetch(`${process.env.TEST_HOST}/confirm/12083`);
    const text = await res.text();
    expect(text).toEqual('invalid');
  });
});

