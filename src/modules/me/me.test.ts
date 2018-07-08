import axios from 'axios';
import { createTypeormConn } from '../../utils/createTypeormConn';
import { User } from '../../entity/User';
import { Connection } from '../../../node_modules/typeorm';

let userId: string;
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
  userId = user.id;
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

describe('me', async () => {
  // test('can\'t get user if not logged in', async () => {
  //   // later
  // });

  test('get current user', async () => {
    await axios.post(
      process.env.TEST_HOST as string,
      {
        query: loginMutation(email, password)
      },
      {
        withCredentials: true
      }
    );

    const res = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery
      },
      {
        withCredentials: true
      }
    );

    console.log(res.data.data);
    expect(res.data.data).toEqual({
      me: {
        id: userId,
        email,
      }
    });
  });
});