import { APP_NAME } from '@shared/constants';
import { app } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import { startNotificationCron } from './modules/notifications/notificationCron';

const notificationCron = startNotificationCron();

const server = app.listen(env.PORT, () => {
  console.log(`${APP_NAME} server listening on http://localhost:${env.PORT}`);
});

const shutdown = () => {
  notificationCron.stop();
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
