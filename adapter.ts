import type { Adapter } from "next-auth/adapters";
import { getAdminSDK } from "./api";

export function HasuraAdapter({
  endpoint,
  adminSecret,
}: {
  endpoint: string;
  adminSecret: string;
}): Adapter {
  const adminSdk = getAdminSDK({
    endpoint,
    adminSecret,
  });

  return {
    createUser: async (data) => {
      const resp = await adminSdk.CreateUser({
        data,
      });
      return {
        id: resp.insert_users_one?.id,
        emailVerified: resp.insert_users_one?.emailVerified,
      };
    },
    getUser: async (id) => {
      const resp = await adminSdk.GetUser({
        id,
      });
      return {
        id: resp.users_by_pk?.id,
        emailVerified: resp.users_by_pk?.emailVerified,
      };
    },
    getUserByEmail: async (email) => {
      const resp = await adminSdk.QueryUser({
        where: {
          email: {
            _eq: email,
          },
        },
      });
      const user = resp?.users?.[0];
      if (!user) return null;

      return {
        id: user.id,
        emailVerified: user.emailVerified,
      };
    },
    getUserByAccount: async ({ providerAccountId, provider }) => {
      const resp = await adminSdk.QueryUser({
        where: {
          accounts: {
            providerAccountId: {
              _eq: providerAccountId,
            },
            provider: {
              _eq: provider,
            },
          },
        },
      });

      const user = resp?.users?.[0];
      if (!user) return null;
      return {
        id: user.id,
        emailVerified: user.emailVerified,
      };
    },
    updateUser: async (data) => {
      const resp = await adminSdk.UpdateUser({
        id: data.id,
        data,
      });
      const user = resp.update_users_by_pk;
      return {
        id: user?.id,
        emailVerified: user?.emailVerified,
      };
    },

    deleteUser: async (id) => {
      //TODO
    },
    linkAccount: async (account) => {
      const resp = await adminSdk.LinkAccount({
        data: account,
      });
      return resp.insert_accounts_one as any;
    },
    unlinkAccount: async ({ providerAccountId, provider }) => {
      const resp = await adminSdk.UnlinkAccount({
        provider,
        providerAccountId,
      });
      const account = resp.delete_accounts?.returning?.[0];
      if (!account) return null;

      return account as any;
    },

    getSessionAndUser: async (sessionToken) => {
      const resp = await adminSdk.GetSessionAndUser({
        sessionToken,
      });
      const sessionUser = resp?.sessions?.[0];
      if (!sessionUser) return null;

      return {
        session: {
          id: sessionUser.id,
          userId: sessionUser.userId,
          sessionToken: sessionUser.sessionToken,
          expires: sessionUser.expires,
        },
        user: {
          id: sessionUser.user.id,
          emailVerified: sessionUser.user.emailVerified,
        },
      };
    },
    createSession: async (data) => {
      const resp = await adminSdk.CreateSession({
        data,
      });

      const session = resp.insert_sessions_one!;
      return {
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: session.expires,
      };
    },
    updateSession: async (data) => {
      const resp = await adminSdk.UpdateSession({
        sessionToken: data.sessionToken,
        data: data,
      });

      const session = resp.update_sessions?.returning?.[0];
      if (!session) return null;

      return {
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: session.expires,
      };
    },
    deleteSession: async (sessionToken) => {
      const resp = await adminSdk.DeleteSession({
        sessionToken,
      });

      const session = resp.delete_sessions?.returning?.[0];
      if (!session) return null;

      return {
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: new Date(session.expires),
      };
    },

    createVerificationToken: async (data) => {
      const resp = await adminSdk.CreateVerificationToken({
        data,
      });
      const token = resp.insert_verification_tokens_one;

      if (!token) return null;

      return {
        identifier: token.identifier,
        expires: token.expires,
        token: token.token,
      };
    },
    async useVerificationToken({ identifier, token }) {
      try {
        const resp = await adminSdk.UseVerificationToken({
          token,
          identifier,
        });

        const deletedToken = resp.delete_verification_tokens?.returning?.[0];

        if (!deletedToken) return null;

        return {
          identifier: deletedToken.identifier,
          expires: deletedToken.expires,
          token: deletedToken.token,
        };
      } catch (error) {
        return null;
      }
    },
  };
}
