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
  return (
    req.query.pin_code ||
    (req.body && req.body.pin_code) ||
    req.headers['x-pin-code'] ||
    null
  );
};

const resolveZone = (req) => {
  const pinCode = extractPinCode(req);

  // For routes like /api/v1/demo-admin, /api/v1/zone-lookup
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

  const url = zoneMap[cleanPinCode];

  if (!url) {
    console.error(`[ZoneRouter] No zone found for pin_code: ${cleanPinCode}`);
    return null;
  }

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