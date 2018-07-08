import { request } from 'graphql-request';

import { User } from '../../entity/User';
import { 
  duplicateEmail,
  emailNotLongEnough, 
  invalidEmail, 
  passwordNotLongEnough,
} from './errorMessages';
import { createTypeormConn } from '../../utils/createTypeormConn';
import { Connection } from '../../../node_modules/typeorm';
  
const email = 'ivan@huya.com';
const password = 'jiqirenbinbgi';

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password:"${p}") {
    path
    message
  }
}
`;

let conn: Connection;
beforeAll(async () => {
  conn = await createTypeormConn();
});

afterAll(async () => {
  conn.close();
}); 

describe("Register user", async () => {
  it('check for duplicate emails', async () => {
    // make sure we can register a user
    const res = await request(
      process.env.TEST_HOST as string,
      mutation(email, password),
    );
    expect(res).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const res2: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, password),
    );
    expect(res2.register).toHaveLength(1);
    expect(res2.register[0]).toEqual({
      path: 'email',
      message: duplicateEmail,
    });
  });

  it('check bad email', async () => {
    const res3: any = await request(
      process.env.TEST_HOST as string,
      mutation('b', password)
    );
    expect(res3).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnough,
        },
        {
          path: 'email',
          message: invalidEmail,
        },
      ],
    });
  });
  
  it('check bad password', async () => {
    const res4: any = await request(process.env.TEST_HOST as string, mutation(email, 'ad'));
    expect(res4).toEqual({
      register: [
        {
          path: 'password',
          message: passwordNotLongEnough,
        },
      ],
    });
  });

  it('check bad email and bad password', async () => {
    // catch bad email and bad email
    const res5: any = await request(process.env.TEST_HOST as string, mutation('em', 'ad'));
    expect(res5).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnough,
        },
        {
          path: 'email',
          message: invalidEmail,
        },
        {
          path: 'password',
          message: passwordNotLongEnough,
        },
      ],
    });
  });
});
