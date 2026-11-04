// src/server.ts

import { app } from './app.ts';
import { config } from './lib/config.ts';
import { logger } from './lib/logger.ts';

const PORT = config.PORT;

app.listen(PORT, () => {
  logger.info({
    event: 'server:started',
    port: PORT,
    environment: config.NODE_ENV,
  });
});
