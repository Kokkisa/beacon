import { Router, Router as ExpressRouter } from 'express';
import * as integrationController from '../controllers/integrationController';
import { authMiddleware } from '../middleware/auth';

const router: ExpressRouter = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all integrations
router.get('/', integrationController.getIntegrations);

// Get integration details
router.get('/:integrationId', integrationController.getIntegrationDetail);

// Shopify OAuth
router.post('/shopify/auth', integrationController.startShopifyAuth);
router.post('/shopify/callback', integrationController.shopifyCallback);

// Amazon
router.post('/amazon/connect', integrationController.connectAmazon);

// Disconnect
router.delete('/:integrationId', integrationController.disconnectIntegration);

export default router;
