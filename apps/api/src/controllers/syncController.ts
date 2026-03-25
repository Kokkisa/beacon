import { Request, Response } from 'express';
import { syncService } from '../services/syncService';
import { asyncHandler } from '../middleware/errorHandler';
import { Platform } from '@prisma/client';
import csv from 'csv-parser';
import { Readable } from 'stream';

/**
 * Get user's sync history
 */
export const getSyncs = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;

  const result = await syncService.getUserSyncs(userId, limit, offset);
  res.json(result);
});

/**
 * Get sync batch details
 */
export const getSyncDetail = asyncHandler(async (req: Request, res: Response) => {
  const { syncId } = req.params;
  const userId = req.user!.userId;

  const batch = await syncService.getSyncBatch(userId, syncId);
  res.json(batch);
});

/**
 * Upload and parse CSV file
 */
export const uploadCSV = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { platform } = req.body;

  if (!platform || !['SHOPIFY', 'AMAZON'].includes(platform)) {
    return res.status(400).json({ error: 'Valid platform is required (SHOPIFY or AMAZON)' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'CSV file is required' });
  }

  try {
    // Parse CSV from buffer
    const items: any[] = [];
    const errors: string[] = [];

    await new Promise<void>((resolve, reject) => {
      Readable.from([req.file!.buffer])
        .pipe(csv())
        .on('data', (row: any, index: number) => {
          try {
            // Expected columns: orderId, trackingNumber, carrier (optional)
            const orderId = row.orderId || row['Order ID'] || row['order_id'];
            const trackingNumber = row.trackingNumber || row['Tracking Number'] || row['tracking_number'];
            const carrier = row.carrier || row['Carrier'];

            if (!orderId || !trackingNumber) {
              errors.push(`Row ${index + 2}: Missing orderId or trackingNumber`);
              return;
            }

            items.push({
              orderId: orderId.trim(),
              trackingNumber: trackingNumber.trim(),
              carrier: carrier ? carrier.trim() : undefined,
            });
          } catch (error) {
            errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Parse error'}`);
          }
        })
        .on('error', reject)
        .on('end', resolve);
    });

    if (items.length === 0) {
      return res.status(400).json({
        error: 'No valid items found in CSV',
        details: errors,
      });
    }

    // Create batch
    const batch = await syncService.createSyncBatch(
      userId,
      platform as Platform,
      'CSV',
      items,
      req.file.originalname
    );

    res.status(201).json({
      batchId: batch.id,
      fileName: batch.fileName,
      total: batch.total,
      items: batch.items.map((item) => ({
        orderId: item.orderId,
        trackingNumber: item.trackingNumber,
        carrier: item.carrier,
      })),
      warnings: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Failed to parse CSV',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Create manual sync entry
 */
export const createManualSync = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { platform, orderId, trackingNumber, carrier } = req.body;

  if (!platform || !orderId || !trackingNumber) {
    return res.status(400).json({
      error: 'platform, orderId, and trackingNumber are required',
    });
  }

  const batch = await syncService.createSyncBatch(
    userId,
    platform as Platform,
    'MANUAL',
    [{ orderId, trackingNumber, carrier }]
  );

  res.status(201).json({
    batchId: batch.id,
    items: batch.items,
  });
});

/**
 * Process sync batch
 */
export const processSyncBatch = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { syncId } = req.params;

  const result = await syncService.processSyncBatch(userId, syncId);
  res.json(result);
});

/**
 * Retry failed item
 */
export const retrySyncItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { syncId, itemId } = req.params;

  const result = await syncService.retrySyncItem(userId, syncId, itemId);
  res.json(result);
});

/**
 * Delete sync batch
 */
export const deleteSyncBatch = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { syncId } = req.params;

  const result = await syncService.deleteSyncBatch(userId, syncId);
  res.json(result);
});
