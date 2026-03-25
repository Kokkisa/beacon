import { Router, Router as ExpressRouter } from 'express';
import multer from 'multer';
import * as syncController from '../controllers/syncController';
import { authMiddleware } from '../middleware/auth';

const router: ExpressRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// All routes require authentication
router.use(authMiddleware);

// Get sync history
router.get('/', syncController.getSyncs);

// Get sync detail
router.get('/:syncId', syncController.getSyncDetail);

// Upload CSV
router.post('/csv', upload.single('file'), syncController.uploadCSV);

// Create manual sync
router.post('/manual', syncController.createManualSync);

// Process sync batch
router.post('/:syncId/process', syncController.processSyncBatch);

// Retry failed item
router.post('/:syncId/items/:itemId/retry', syncController.retrySyncItem);

// Delete sync batch
router.delete('/:syncId', syncController.deleteSyncBatch);

export default router;
