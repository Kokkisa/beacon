/**
 * Carrier Detection Engine
 * Auto-detects carrier from tracking number format
 */

export enum CarrierType {
  USPS = 'USPS',
  UPS = 'UPS',
  FEDEX = 'FedEx',
  DHL = 'DHL',
  ONTRAC = 'OnTrac',
  LASER_SHIP = 'LaserShip',
  PRESTIGE = 'Prestige',
  AMAZON = 'Amazon',
  UNKNOWN = 'Unknown',
}

interface CarrierMatch {
  carrier: CarrierType;
  confidence: number; // 0-100
  url?: string;
}

export class CarrierDetectionEngine {
  /**
   * Detect carrier from tracking number
   */
  static detect(trackingNumber: string): CarrierMatch {
    if (!trackingNumber || trackingNumber.length < 4) {
      return {
        carrier: CarrierType.UNKNOWN,
        confidence: 0,
      };
    }

    const cleaned = trackingNumber.trim().toUpperCase();

    // USPS Patterns
    if (this.isUSPS(cleaned)) {
      return {
        carrier: CarrierType.USPS,
        confidence: 95,
        url: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${cleaned}`,
      };
    }

    // UPS Patterns
    if (this.isUPS(cleaned)) {
      return {
        carrier: CarrierType.UPS,
        confidence: 95,
        url: `https://www.ups.com/track?tracknum=${cleaned}`,
      };
    }

    // FedEx Patterns
    if (this.isFedEx(cleaned)) {
      return {
        carrier: CarrierType.FEDEX,
        confidence: 95,
        url: `https://tracking.fedex.com/en/tracking/${cleaned}`,
      };
    }

    // DHL Patterns
    if (this.isDHL(cleaned)) {
      return {
        carrier: CarrierType.DHL,
        confidence: 95,
        url: `https://www.dhl.com/en/en/express/tracking.html?AWB=${cleaned}`,
      };
    }

    // OnTrac Patterns
    if (this.isOnTrac(cleaned)) {
      return {
        carrier: CarrierType.ONTRAC,
        confidence: 95,
        url: `https://www.ontrac.com/tracking/${cleaned}`,
      };
    }

    // LaserShip Patterns
    if (this.isLaserShip(cleaned)) {
      return {
        carrier: CarrierType.LASER_SHIP,
        confidence: 95,
        url: `https://www.lasership.com/track/?track=${cleaned}`,
      };
    }

    // Amazon Patterns
    if (this.isAmazon(cleaned)) {
      return {
        carrier: CarrierType.AMAZON,
        confidence: 90,
        url: `https://www.amazon.com/gp/your-account/order-history/`,
      };
    }

    return {
      carrier: CarrierType.UNKNOWN,
      confidence: 0,
    };
  }

  /**
   * Get tracking URL for carrier
   */
  static getTrackingUrl(carrier: CarrierType, trackingNumber: string): string | null {
    const match = this.detect(trackingNumber);
    return match.url || null;
  }

  // USPS Detection
  private static isUSPS(tracking: string): boolean {
    // USPS formats:
    // - 20-digit format: 1234567890123456789012
    // - 13-digit format with 9400 prefix
    // - 13-digit format with 9200, 9300, 9100, 9000
    const patterns = [
      /^\d{20}$/, // 20-digit
      /^(9400|9200|9300|9100|9000)\d{9}$/, // 13-digit with prefix
      /^94\d{20}$/, // 94 + 20 digits
    ];

    return patterns.some((p) => p.test(tracking));
  }

  // UPS Detection
  private static isUPS(tracking: string): boolean {
    // UPS formats:
    // - 1Z followed by 16 alphanumeric: 1Z999AA10123456784
    // - Z + 18 digits
    const patterns = [
      /^1Z[A-Z0-9]{16}$/, // Standard UPS
      /^[A-Z0-9]{18}$/, // Alternative format
    ];

    return patterns.some((p) => p.test(tracking));
  }

  // FedEx Detection
  private static isFedEx(tracking: string): boolean {
    // FedEx formats:
    // - 12 or 14 digits
    // - 48-character alphanumeric (SSCC barcode)
    const patterns = [
      /^\d{12}$/, // 12-digit
      /^\d{14}$/, // 14-digit
      /^\d{48}$/, // 48-digit SSCC
      /^[0-9A-Z]{32}$/, // 32-character
    ];

    return patterns.some((p) => p.test(tracking));
  }

  // DHL Detection
  private static isDHL(tracking: string): boolean {
    // DHL AWB format: typically 10-11 digits
    return /^\d{10,11}$/.test(tracking);
  }

  // OnTrac Detection
  private static isOnTrac(tracking: string): boolean {
    // OnTrac: starts with 1 + 8 or 9 digits
    return /^1\d{8,9}$/.test(tracking);
  }

  // LaserShip Detection
  private static isLaserShip(tracking: string): boolean {
    // LaserShip: typically 8-12 digits
    return /^\d{8,12}$/.test(tracking) && tracking.length <= 12;
  }

  // Amazon Detection
  private static isAmazon(tracking: string): boolean {
    // Amazon often uses carrier tracking numbers, but can also be:
    // - TBA + 18 digits
    // - AMZ + random
    return /^(TBA|AMZ)\d+/.test(tracking);
  }

  /**
   * Get display name for carrier
   */
  static getDisplayName(carrier: CarrierType): string {
    const names: Record<CarrierType, string> = {
      [CarrierType.USPS]: '📮 USPS',
      [CarrierType.UPS]: '📦 UPS',
      [CarrierType.FEDEX]: '📫 FedEx',
      [CarrierType.DHL]: '📪 DHL',
      [CarrierType.ONTRAC]: '📬 OnTrac',
      [CarrierType.LASER_SHIP]: '📭 LaserShip',
      [CarrierType.PRESTIGE]: '📮 Prestige',
      [CarrierType.AMAZON]: '📦 Amazon',
      [CarrierType.UNKNOWN]: '❓ Unknown',
    };
    return names[carrier];
  }
}

// Test the detection engine
export function testCarrierDetection() {
  const testCases = [
    { tracking: '1234567890123456789012', expected: CarrierType.USPS },
    { tracking: '9400111899223456789012', expected: CarrierType.USPS },
    { tracking: '1Z999AA10123456784', expected: CarrierType.UPS },
    { tracking: '794618519287', expected: CarrierType.FEDEX },
    { tracking: '1234567890', expected: CarrierType.DHL },
    { tracking: '123456789', expected: CarrierType.ONTRAC },
  ];

  return testCases.map((test) => {
    const result = CarrierDetectionEngine.detect(test.tracking);
    return {
      tracking: test.tracking,
      detected: result.carrier,
      expected: test.expected,
      pass: result.carrier === test.expected,
      confidence: result.confidence,
    };
  });
}
