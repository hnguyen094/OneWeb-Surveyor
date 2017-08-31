"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tleLine1 = '1 25544U 98067A   13149.87225694  .00009369  00000-0  16828-3 0  9031',
    tleLine2 = '2 25544 051.6485 199.1576 0010128 012.7275 352.5669 15.50581403831869';

require("../../node_modules/satellite.js/", function(satellite) {
  var lookAngles    = satellite.ecfToLookAngles(observerGd, positionEcf);
  var satrec = satellite.twoline2satrec(tleLine1, tleLine2);
  var positionAndVelocity = satellite.propagate(satrec, new Date());
  var positionEci = positionAndVelocity.position;
  var velocityEci = positionAndVelocity.velocity;
  var observerGd = {
      longitude: -122.0308 * deg2rad,
      latitude: 36.9613422 * deg2rad,
      height: 0.370
  };
  var gmst = satellite.gstimeFromDate(new Date());
  var positionEcf   = satellite.eciToEcf(positionEci, gmst);
  var observerEcf   = satellite.geodeticToEcf(observerGd);
  var positionGd    = satellite.eciToGeodetic(positionEci, gmst);
  var dopplerFactor = satellite.dopplerFactor(observerCoordsEcf, positionEcf, velocityEcf);
  exports.lookAngles    = satellite.ecfToLookAngles(observerGd, positionEcf);

  var satelliteX = positionEci.x,
      satelliteY = positionEci.y,
      satelliteZ = positionEci.z;
  var azimuth   = lookAngles.azimuth,
      elevation = lookAngles.elevation,
      rangeSat  = lookAngles.rangeSat;
  console.log(azimuth+ " and " + elevation + " and " + rangeSat);
  var longitude = positionGd.longitude,
      latitude  = positionGd.latitude,
      height    = positionGd.height;
  var longitudeStr = satellite.degreesLong(longitude),
      latitudeStr  = satellite.degreesLat(latitude);
});
