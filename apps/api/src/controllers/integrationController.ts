import { Request, Response } from 'express';
import { integrationService } from '../services/integrationService';
import { asyncHandler } from '../middleware/errorHandler';
import crypto from 'crypto';

export const getIntegrations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const integrations = await integrationService.getUserIntegrations(userId);
  res.json(integrations);
});

/**
 * Start Shopify OAuth flow
 * Returns authorization URL for user to visit
 */
export const startShopifyAuth = asyncHandler(async (req: Request, res: Response) => {
  const { shop } = req.body;
  const userId = req.user!.userId;

  if (!shop) {
    return res.status(400).json({ error: 'Shop URL is required' });
  }

  // Generate nonce for CSRF protection
  const nonce = crypto.randomBytes(32).toString('hex');

  // Store nonce in session/cache (TODO: implement session storage)
  // For now, we'll return it to client to store
  const redirectUri = `${process.env.FRONTEND_URL}/integrations/shopify/callback`;

  // Generate the auth URL
  const normalizedShop = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;

  const authUrl = new URL(`https://${normalizedShop}/admin/oauth/authorize`);
  authUrl.searchParams.set('client_id', process.env.SHOPIFY_API_KEY || '');
  authUrl.searchParams.set('scope', 'write_orders,read_orders,write_fulfillments,read_fulfillments');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', nonce);

  res.json({
    authUrl: authUrl.toString(),
    nonce,
    shop: normalizedShop,
  });
});

/**
 * Handle Shopify OAuth callback
 */
export const shopifyCallback = asyncHandler(async (req: Request, res: Response) => {
  const { shop, code, state } = req.query;
  const userId = req.user!.userId;
  const redirectUri = `${process.env.FRONTEND_URL}/integrations/shopify/callback`;

  if (!shop || !code) {
    return res.status(400).json({ error: 'Missing shop or code' });
  }

  // TODO: Verify state matches stored nonce
  // const storedNonce = getStoredNonce(userId); // Implement session storage
  // if (state !== storedNonce) {
  //   return res.status(400).json({ error: 'Invalid state parameter' });
  // }

  const result = await integrationService.handleShopifyCallback(
    userId,
    shop as string,
    code as string,
    redirectUri
  );

  res.json(result);
});

/**
 * Connect Amazon SP-API
 */
export const connectAmazon = asyncHandler(async (req: Request, res: Response) => {
  const { clientId, clientSecret, sellerCentralId, marketplaceId } = req.body;
  const userId = req.user!.userId;

  const result = await integrationService.connectAmazon(
    userId,
    clientId,
    clientSecret,
    sellerCentralId,
    marketplaceId || 'ATVPDKIKX0DER'
  );

  res.json(result);
});

/**
 * Disconnect integration
 */
export const disconnectIntegration = asyncHandler(async (req: Request, res: Response) => {
  const { integrationId } = req.params;
  const userId = req.user!.userId;

  const result = await integrationService.disconnectIntegration(userId, integrationId);
  res.json(result);
});

/**
 * Get integration details
 */
export const getIntegrationDetail = asyncHandler(async (req: Request, res: Response) => {
  const { integrationId } = req.params;
  const userId = req.user!.userId;

  const integration = await integrationService.getIntegration(userId, integrationId);

  // Don't expose sensitive tokens to frontend
  return res.json({
    id: integration.id,
    platform: integration.platform,
    isActive: integration.isActive,
    shopUrl: integration.shopUrl,
    sellerId: integration.sellerId,
    marketplaceId: integration.marketplaceId,
    createdAt: integration.createdAt,
  });
});
