#!/usr/bin/env node
"use strict";

const fs = require('fs');
const path = require('path');

const USAGE =
  'Usage: svgvbdimension [--overwrite] [--scale N] <source-svg-filepath> <destination-filepath>';

function main() {
  const userArgs = process.argv.slice(2);
  const [source, destination, scale] = parseArgs(userArgs);
  const result = processSVG(source, scale);
  fs.writeFileSync(destination, result);
  log(`Process completed: ${source} -> ${destination}`);
  process.exit(0);
}

function parseArgs(args) {
  // Print usage
  if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
    log(USAGE);
    process.exit(0);
  }

  // Parse scale argument
  const scaleIndex = args.indexOf('--scale');
  const scaleText = scaleIndex > -1 ? args[scaleIndex + 1] : 1;
  const scale = parseInt(scaleText, 10);
  if (scale <= 0 || isNaN(scale)) {
    error(`Invalid scale: ${scaleText}`);
    process.exit(1);
  }
  args.splice(scaleIndex, 2);

  // Parse overwrite argument
  const overwriteIndex = args.indexOf('--overwrite');
  const overwrite = args.indexOf('--overwrite') !== -1;
  args.splice(overwriteIndex, 1);

  // Get source and destination filepaths
  const [source, destination] = args;
  if (!checkFileExists(source)) {
    error(`Source: ${source} does not exist.`);
    process.exit(1);
  }
  if (checkFileExists(destination) && !overwrite) {
    error(
      `Destination: ${destination} already exists. Use --overwrite to overwrite to the destination path.`
    );
    process.exit(1);
  }
  return [source, destination, scale];
}

function processSVG(source, scale) {
  // Read SVG and get viewBox attribute
  const svg = fs.readFileSync(source, 'utf-8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
  if (!viewBox) {
    log(`Cannot find viewBox attribute in ${source}. Making no changes.`);
    return svg;
  }

  // Get width and height from viewBox, and calculate the scaled dimensions
  const [width, height] = viewBox.split(' ').slice(2);
  const newWidth = (width * scale).toFixed(0);
  const newHeight = (height * scale).toFixed(0);
  const newDimension = `width="${newWidth}" height="${newHeight}"`;

  // Check if the dimensions are already in the SVG
  const match = svg.match(
    new RegExp(/<svg[^>]+width="([0-9]+)" height="([0-9]+)"/)
  );
  if (match && match[1] === newWidth && match[2] === newHeight) {
    log(
      `Same dimension defined ${newDimension} in ${source}. Making no changes.`
    );
    return svg;
  }

  // Check if the dimensions are already in the SVG but with different value
  if (match && match[1] !== newWidth && match[2] !== newHeight) {
    log(
      `Replacing existing width="${match[1]}", height="${match[2]}" in ${source}. Using new dimension ${newDimension}.`
    );
    let result = svg
      .replace(/width="[0-9]+"/, `width="${newWidth}"`)
      .replace(/height="[0-9]+"/, `height="${newHeight}"`);
    return result;
  }

  // Add new dimension to SVG
  log(`Adding ${newDimension}`);
  const result = svg.replace(
    `viewBox="${viewBox}"`,
    `viewBox="${viewBox}" ${newDimension}`
  );
  return result;
}

// Utilities
function checkFileExists(maybeRelativePath) {
  const absPath = path.resolve(process.cwd(), maybeRelativePath);
  return fs.existsSync(absPath);
}

function log(...args) {
  console.log('>> ', ...args);
}

function error(...args) {
  console.error('>X ', ...args);
}

main();