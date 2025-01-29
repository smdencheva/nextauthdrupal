import {
  AfterCallbackAppRoute,
  handleAuth,
  handleCallback,
} from '@auth0/nextjs-auth0';
const afterCallback: AfterCallbackAppRoute = async (req, session, state) => {
  if (!state) {
    return session;
  }

  if (!session.accessToken) {
    console.error('Access token missing');
    return;
  }

  state.returnTo = '/';
  return session;
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
});
