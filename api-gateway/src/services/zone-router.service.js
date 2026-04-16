'use strict';

/**
 * Zone Router Service
 *
 * Resolves the correct zone service URL for a request based on pin_code.
 * pin_code is read from (in priority order):
 *   1. req.query.pin_code
 *   2. req.body.pin_code
 *   3. req.headers['x-pin-code']
 *
 * ZONE_SERVICES env var must be a JSON object:
 *   {"700091": "http://zone-east-1:6001", "110001": "http://zone-north-1:6002"}
 */

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

/**
 * Extract pin_code from the request (query > body > header).
 * @param {import('express').Request} req
 * @returns {string|null}
 */
const extractPinCode = (req) => {
  return (
    req.query.pin_code ||
    (req.body && req.body.pin_code) ||
    req.headers['x-pin-code'] ||
    null
  );
};

/**
 * Resolve the zone service base URL for the given request.
 * Returns null if no pin_code or no matching zone.
 *
 * @param {import('express').Request} req
 * @returns {{ url: string, pinCode: string } | null}
 */
const resolveZone = (req) => {
  const pinCode = extractPinCode(req);
  if (!pinCode) return null;

  const zoneMap = getZoneMap();
  const url = zoneMap[String(pinCode).trim()];
  if (!url) return null;

  return { url, pinCode: String(pinCode).trim() };
};

/**
 * Get all registered zone entries (for debugging / admin).
 */
const listZones = () => {
  return getZoneMap();
};

module.exports = { resolveZone, extractPinCode, listZones };
