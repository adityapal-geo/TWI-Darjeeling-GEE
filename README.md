![TWI Map](twi_map.png)

# TWI-Darjeeling-GEE
Topographic Wetness Index (TWI) analysis using Google Earth Engine


# Topographic Wetness Index (TWI) - Darjeeling

## Study Area
Darjeeling, West Bengal, India

## Overview
This project calculates the Topographic Wetness Index (TWI) using SRTM DEM in Google Earth Engine.

## Methodology
- DEM: SRTM (30m resolution)
- Slope derived from DEM
- Flow accumulation (neighborhood method)
- TWI formula:
  TWI = ln(Flow Accumulation / tan(Slope))

## Applications
- Soil moisture estimation
- Flood risk analysis
- Hydrological modeling

## Tools
- Google Earth Engine (JavaScript)

## Author
Aditya Pal
