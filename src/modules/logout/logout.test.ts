import axios from 'axios';
import { createTypeormConn } from '../../utils/createTypeormConn';
import { User } from '../../entity/User';
import { Connection } from '../../../node_modules/typeorm';
import { loginAndQueryMeTest } from '../me/me.test';

let conn: Connection;
const email = 'ivan@gmail.com';
const password = 'jiqirenbinbgi';

beforeAll(async () => {
  conn = await createTypeormConn();
  const user = await User.create({
    email,
    password,
    confirmed: true,
  }).save();
});

afterAll(async () => {
  conn.close();
});

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password:"${p}") {
    path
    message
  }
}
`; 

const meQuery = `
{
  me {
    id
    email
  }
}
`;

const logoutMutation = `
  mutation {
    logout
  }
`;

describe('logout', async () => {
  test('test logging out a user', async () => {
    await loginAndQueryMeTest();

    axios.post(process.env.TEST_HOST as string, {
      query: logoutMutation,
    }, {
      withCredentials: true,
    });

    const res = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery
      },
      {
        withCredentials: true,
      },
    );
  
    expect(res.data.data.me).toBeNull();
  });
});