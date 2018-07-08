import * as bcrypt from 'bcryptjs';

import { ResolverMap } from "../../types/graphql-utils";
import { User } from '../../entity/User';
import { invalidLogin, confirmEmailError } from './errorMessages';

const errMsgResponse = [{
  path: 'email',
  message: invalidLogin,
}];

export const resolvers: ResolverMap = {
  Query: {
    bye2: () => 'bye',
  },
  Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session }
    ) => {
      const user = await User.findOne({ where: { email, } });

      if (!user) {
        return errMsgResponse;
      }

      if (!user.confirmed) {
        return [{
          path: 'email',
          message: confirmEmailError,
        }]
      }

      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid) {
        return errMsgResponse;
      }

      // login successful
      session.userId = user.id;

      return null;
    }
  }
};