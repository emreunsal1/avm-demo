import 'dotenv/config';
import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      url: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/keystone',
    },
    lists,
    session,
    server:{
      port: 4000,
      cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
      },
    },
    storage: {
      local: {
        kind: 'local',
        type: 'file',
        storagePath: 'public/files',
        serverRoute: {
          path: '/files',
        },
        generateUrl: path => `/files/${path}`,
      },
    },
  })
); 