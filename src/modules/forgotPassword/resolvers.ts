import { ResolverMap } from "../../types/graphql-utils";
import { forgotPasswordLockAccount } from "../../utils/forgotPasswordLockAccount";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";
import { User } from "../../entity/User";
import { userNotFound } from "./errorMessages";

// 20 minutes
// lock account

export const resolvers: ResolverMap = {
  Query: {
    dummy2: () => "bye"
  },
  Mutation: {
    sendForgotPasswordEmail: async (
      _,
      { email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
      { redis }
    ) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return [{
          path: 'email',
          message: userNotFound,
        }];
      }

      await forgotPasswordLockAccount(user.id, redis);
      // @todo add frontend url
      await createForgotPasswordLink('', user.id, redis);
      // @todo send email with url
      return true;
    },
    forgotPasswordChange: (
      _,
      { newPassword, key }: GQL.IForgotPasswordChangeOnMutationArguments,
      { redis }
    ) => {
      return null;
    }
  }
};
