import { request } from "graphql-request";

import { host } from "./constants";
import { User } from "../entity/User";
import { createTypeormConn } from "../utils/createTypeormConn";

beforeAll(async () => {
  await createTypeormConn();
});
  
const email = "ivan2@huya.com";
const password = "matt10801";

const mutation = `
mutation {
  register(email: "${email}", password:"${password}")
}
`

test("Register", async () => {
  const res = await request(host, mutation);
  expect(res).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
