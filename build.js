const fs = require('fs');
const Paperify = require('./paperify.js');

// Get the command line arguments, omitting 'node' and 'build.js'
const args = process.argv.slice(2);

// Check for expected length
if (!args || args.length != 3 || args[0].match('-h')) {
    console.log('Usage: build [world data file] [visited file] [output script file]');
    return;
}

// The world data file and visited file must exist
[args[0], args[1]].forEach((arg) => {
    if (!fs.statSync(arg).isFile()) {
        console.error(`${arg} is not a file.`);
        return;
    }
});

// Get the country codes for the visited places
console.debug(`Reading visited countries (ISO 3166-1 alpha-3) from ${args[1]}`);
let inputStr = fs.readFileSync(args[1]).toString();
let input = inputStr.split(' '); // space delimited

console.log(`Generating PaperScript using relevant geometry data from ${args[0]}`);
let worldData = JSON.parse(fs.readFileSync(args[0]).toString()).features;
let paperified = worldData
    .filter((cur) => {
        // Filter the full world data set using the visited list  
        return input.includes(cur.properties.su_a3);
    }).map((cur) => {
        // Discard all the unnessary data
        return {
            code: cur.properties.su_a3,
            type: cur.geometry.type,
            coordinates: cur.geometry.coordinates
        };
    }).reduce((acc, cur) => {
        // Add the polygons for the visited countries PaperScriptBuilder
        cur.coordinates
            .map((polygon) => (polygon.length == 1) ? polygon[0] : polygon)
            .forEach((polygon) => {
                acc.addPolygon(polygon, cur.code);
            });
        return acc;
    }, Paperify.newPaperScriptBuilder())
    .wrapInFunction('initMap')
    .build();

// Save the generated PaperScript to the output file
console.log(`Saving generated PaperScript to ${args[2]}`);
fs.writeFileSync(args[2], paperified);

console.log('DONE');