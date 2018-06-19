import { request } from 'graphql-request';

import { runServer } from '..';
import { host } from './constants';
  
const email = 'iveon.cc@gmail.com';
const password = 'matt10801';

const mutation = `
mutation {
  register(email: '${email}', password:'${password}')
}
`

test('Register', async () => {
  await runServer;
  const res = await request(host, mutation);
  expect(res).toEqual({ register: true });
});