'use strict';

let _zoneMap = null;

const getZoneMap = () => {
  if (_zoneMap) return _zoneMap;

  try {
    _zoneMap = JSON.parse(process.env.ZONE_SERVICES || '{}');
  } catch {
    console.error('[ZoneRouter] ZONE_SERVICES is not valid JSON');
    _zoneMap = {};
  }

  return _zoneMap;
};

const extractPinCode = (req) => {
  console.log(`[ZoneRouter] Extracting pin_code from ${req.originalUrl}`);
  console.log(`[ZoneRouter] Query pin_code:`, req.query.pin_code);
  console.log(`[ZoneRouter] Body pin_code:`, req.body ? req.body.pin_code : 'N/A');
  console.log(`[ZoneRouter] Header x-pin-code:`, req.headers['x-pin-code']);
  return (
    req.query.pin_code ||
    (req.body && req.body.pin_code) ||
    req.headers['x-pin-code'] ||
    null
  );
};

const resolveZone = (req) => {
  const pinCode = extractPinCode(req);

  // For routes like /api/v1/demo-admin, /api/v1/zone-lookup'
  // console.log(`[ZoneRouter] Resolving zone for pin_code: ${pinCode || 'NONE'}`);
  if (!pinCode) {
    const defaultUrl = process.env.DEFAULT_ZONE_SERVICE_URL;

    if (!defaultUrl) {
      console.error('[ZoneRouter] No pin_code and DEFAULT_ZONE_SERVICE_URL missing');
      return null;
    }

    return {
      url: defaultUrl,
      pinCode: null,
      isDefault: true,
    };
  }

  const zoneMap = getZoneMap();
  const cleanPinCode = String(pinCode).trim();
  // console.log(`[ZoneRouter] Resolving zone for clean pin_code: ${cleanPinCode}`);

  const url = zoneMap[cleanPinCode];
  // console.log(`[ZoneRouter] Resolved URL for pin_code ${cleanPinCode}: ${url || 'NOT_FOUND'}`);

  if (!url) {
    console.error(`[ZoneRouter] No zone found for pin_code: ${cleanPinCode}`);
    // console.log(`[ZoneRouter] Available zones:`, Object.keys(zoneMap));
    return null;
  }
  // console.log(`[ZoneRouter] Found zone for pin_code ${cleanPinCode}: ${url}`);

  return {
    url,
    pinCode: cleanPinCode,
    isDefault: false,
  };
};

const listZones = () => {
  return getZoneMap();
};

module.exports = {
  resolveZone,
  extractPinCode,
  listZones,
};