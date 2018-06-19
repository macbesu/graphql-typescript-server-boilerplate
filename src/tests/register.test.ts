import { request } from "graphql-request";

import { host } from "./constants";
  
const email = "ivan@huya.com";
const password = "matt10801";

const mutation = `
mutation {
  register(email: "${email}", password:"${password}")
}
`

test("Register", async () => {
  const res = await request(host, mutation);
  expect(res).toEqual({ register: true });
});