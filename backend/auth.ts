import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'id name email role',
  initFirstItem: {
    fields: ['name', 'email', 'password', 'role'],
  },
});

const sessionSecret = process.env.SESSION_SECRET || 'this-is-a-secret-key-replace-in-production';

const session = statelessSessions({
  secret: sessionSecret,
  maxAge: 60 * 60 * 24,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
});

export { withAuth, session }; 