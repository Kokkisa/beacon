import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

interface ShopifyConfig {
  apiKey: string;
  apiSecret: string;
  redirectUri: string;
  scopes: string[];
}

interface ShopifyTokenResponse {
  access_token: string;
  scope: string;
}

interface ShopifyStore {
  id: string;
  name: string;
  email: string;
  domain: string;
  currency: string;
}

export class ShopifyIntegration {
  private config: ShopifyConfig;
  private apiClient: AxiosInstance;

  constructor(config: ShopifyConfig) {
    this.config = config;
    this.apiClient = axios.create({
      timeout: 10000,
    });
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(shop: string, nonce: string): string {
    const params = new URLSearchParams({
      client_id: this.config.apiKey,
      scope: this.config.scopes.join(','),
      redirect_uri: this.config.redirectUri,
      state: nonce,
    });

    return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
  }

  /**
   * Verify OAuth nonce (state parameter)
   */
  verifyNonce(receivedNonce: string, storedNonce: string): boolean {
    return receivedNonce === storedNonce;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    shop: string,
    code: string
  ): Promise<{ accessToken: string; scope: string }> {
    try {
      const response = await this.apiClient.post<ShopifyTokenResponse>(
        `https://${shop}/admin/oauth/access_token`,
        {
          client_id: this.config.apiKey,
          client_secret: this.config.apiSecret,
          code,
        }
      );

      return {
        accessToken: response.data.access_token,
        scope: response.data.scope,
      };
    } catch (error) {
      throw new Error('Failed to exchange code for token');
    }
  }

  /**
   * Get store information
   */
  async getStore(shop: string, accessToken: string): Promise<ShopifyStore> {
    try {
      const response = await this.apiClient.get(
        `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/shop.json`,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
          },
        }
      );

      const shopData = response.data.shop;

      return {
        id: shopData.id.toString(),
        name: shopData.name,
        email: shopData.email,
        domain: shopData.domain,
        currency: shopData.currency,
      };
    } catch (error) {
      throw new Error('Failed to fetch store information');
    }
  }

  /**
   * Create fulfillment for an order
   */
  async fulfillOrder(
    shop: string,
    accessToken: string,
    orderId: string,
    lineItems: Array<{ id: string; quantity: number }>,
    trackingInfo: {
      number: string;
      company: string;
      url?: string;
    }
  ): Promise<{ fulfillmentId: string }> {
    try {
      const response = await this.apiClient.post(
        `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders/${orderId}/fulfillments.json`,
        {
          fulfillment: {
            line_items_by_fulfillment_order: [
              {
                fulfillment_order_id: orderId,
                fulfillment_order_line_items: lineItems,
              },
            ],
            tracking_info: {
              number: trackingInfo.number,
              carrier: trackingInfo.company.toLowerCase(),
              url: trackingInfo.url,
            },
            notify_customer: true,
          },
        },
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
          },
        }
      );

      return {
        fulfillmentId: response.data.fulfillment.id.toString(),
      };
    } catch (error: any) {
      throw new Error(
        `Failed to create fulfillment: ${error.response?.data?.errors || error.message}`
      );
    }
  }

  /**
   * Get fulfillment orders for an order
   */
  async getFulfillmentOrders(
    shop: string,
    accessToken: string,
    orderId: string
  ) {
    try {
      const response = await this.apiClient.get(
        `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders/${orderId}/fulfillment_orders.json`,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
          },
        }
      );

      return response.data.fulfillment_orders;
    } catch (error) {
      throw new Error('Failed to fetch fulfillment orders');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    requestBody: string,
    hmacHeader: string
  ): boolean {
    const hmac = crypto
      .createHmac('sha256', this.config.apiSecret)
      .update(requestBody, 'utf8')
      .digest('base64');

    return hmac === hmacHeader;
  }
}

// Factory function
export function createShopifyIntegration(redirectUri: string): ShopifyIntegration {
  const config: ShopifyConfig = {
    apiKey: process.env.SHOPIFY_API_KEY || '',
    apiSecret: process.env.SHOPIFY_API_SECRET || '',
    redirectUri,
    scopes: [
      'write_orders',
      'read_orders',
      'write_fulfillments',
      'read_fulfillments',
    ],
  };

  return new ShopifyIntegration(config);
}
