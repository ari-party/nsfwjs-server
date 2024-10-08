import path from 'node:path';

import express from 'express';
import klaw from 'klaw';

import importPath from './utils/importPath';

const app = express();
const port = process.env.PORT || 3000;

const routesDirectory = 'src/routes';
for await (const file of klaw(routesDirectory)) {
  file.path = file.path.replaceAll('\\', '/');

  if (!file.path.endsWith('.ts')) continue;

  const segments = file.path.split(routesDirectory);
  const parent = segments[1] ? path.dirname(segments[1]) : '/';

  const router = await import(importPath(file.path));

  app.use(parent, router.default);
}

app.listen(port, () => console.log(`Listening on port ${port}`));
