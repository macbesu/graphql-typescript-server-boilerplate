import { request } from "graphql-request";

import { User } from "../../entity/User";
import { runServer } from '../../runServer';

let getHost = () => '';

beforeAll(async () => {
  const app = await runServer();
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});
  
const email = "ivan2@huya.com";
const password = "matt10801";

const mutation = `
mutation {
  register(email: "${email}", password:"${password}")
}
`;

test("Register", async () => {
  const res = await request(getHost(), mutation);
  expect(res).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
