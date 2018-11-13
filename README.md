# Jigsaw & Conquered
## Description
A node module which generates PaperScript for world maps based on a white list of countries.

## Usage
This project is in an infantile stage of development. It is not yet available via npm. Instead, just clone this repo.

``` node build [world data file] [visited file] [output script file] ```

### World Map Data
For the world map data, this modules expects JSON data as generated from Natural Earth data (http://www.naturalearthdata.com) using the GeoJSON regions package (https://github.com/AshKyd/geojson-regions).

### Country Code White List
This module expects an input file containing a space-delimited list of country codes in _ISO 3166-1 alpha-3 format_.  A full list of the latest supported country codes is available at https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3#Current_codes.