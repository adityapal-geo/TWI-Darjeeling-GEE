/// =======================================
// TOPGRAPHIC WETNESS INDEX (TWI) - GEE
// =======================================

var india = ee.FeatureCollection("FAO/GAUL/2015/level2");

var AOI = india
  .filter(ee.Filter.eq('ADM2_NAME', 'Darjiling'))  // spelling in GEE dataset
  .filter(ee.Filter.eq('ADM1_NAME', 'West Bengal'));

Map.centerObject(AOI, 9);
Map.addLayer(AOI, {}, 'Darjeeling AOI');

// STEP 2: Load SRTM DEM
var srtm = ee.Image("USGS/SRTMGL1_003");

// Optional: Clip to AOI
var dem = srtm.clip(AOI);

// STEP 3: Calculate Slope in degrees
var slope = ee.Terrain.slope(dem);

// Convert slope to radians
var slopeRad = slope.multiply(Math.PI).divide(180);

// STEP 4: Calculate Flow Accumulation
// Use the D8 flow direction (approximate)
var filled = dem.focal_min(1, 'square', 'pixels'); // simple depression filling
var flowAccum = filled.reduceNeighborhood({
  reducer: ee.Reducer.sum(),
  kernel: ee.Kernel.square(250, 'meters')
});

// Avoid zero values in accumulation
var flowAccumPositive = flowAccum.where(flowAccum.lte(0), 1);

// STEP 5: Compute TWI
var tanSlope = slopeRad.tan();
var tanSlopePositive = tanSlope.where(tanSlope.lte(0), 0.001);

var twi = (flowAccumPositive.divide(tanSlopePositive)).log();

// STEP 6: Visualization parameters
var twiVis = {
  min: 4,
  max: 12,
  palette: ['lightblue', 'blue', 'darkblue']
};

// Display
Map.addLayer(twi, twiVis, 'Topographic Wetness Index');

// Optional: Display DEM and slope for reference
Map.addLayer(dem, {min:0, max:4000}, 'DEM');
Map.addLayer(slope, {min:0, max:60, palette:['white','brown']}, 'Slope');

// Create legend panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

// Title
legend.add(ui.Label({
  value: 'Topographic Wetness Index (TWI)',
  style: {fontWeight: 'bold', fontSize: '14px', margin: '0 0 8px 0'}
}));

// Helper to create color rows
function makeRow(color, label) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '2px',
      border: '1px solid black'
    }
  });
  
  var description = ui.Label({
    value: label,
    style: {margin: '4px 0 0 6px'}
  });
  
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
}

// Add legend rows matching your TWI palette
legend.add(makeRow('lightblue', 'Low Wetness'));
legend.add(makeRow('blue', 'Moderate Wetness'));
legend.add(makeRow('darkblue', 'High Wetness'));

// Add to map
Map.add(legend);

