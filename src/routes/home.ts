import { Router } from 'express';
import path from 'path';

import { rootDir } from '../utils/path';

const router = Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'home.html'));
});

export { router as homeRoutes };
