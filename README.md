# SVG-Dimension-from-ViewBox
A small node utility that adds/replaces dimension using SVG's ViewBox attribute

## CLI

### Installation

```sh
npm install [-g] @zero41120/svg-dimension-from-viewbox
```

### Usage
Use the command line interface: 

```sh
svgvbdimension [--overwrite] [--scale N] <source-svg-filepath> <destination-filepath>';
    
    --overwrite : optional, if destination filepath exists, use this flag to overwrite file.
    --scale N   : optional, multiply the ViewBox's width/height value by given scale, default to 1.
```

Use in `package.json`, this finds all the `.svg` files in your `./src`, and run the CLI with scale 10 writting to file itself.

```
# package.json
"scripts": {
  "svg-fix": "find ./src -type f -name \"*.svg\" -exec svgvbdimension {} {} --overwrite --scale 10 \\;"
}
```


### Examples:

```sh
# Make a simple SVG using echo
echo '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 10"><path d="M0 0 L5 2 L2 5 Z" fill="#0066cc"/></svg>' > triangle.svg

# Write to file 2
# Output: >> Adding width="10" height="10"
# Result: ...  viewBox="0 0 10 10" width="10" height="10" ...
svgvbdimension triangle.svg triangle2.svg 

# Write to file 2 again, fails
# Output: >X  Destination: triangle2.svg already exists. Use --overwrite to overwrite to the destination path.
svgvbdimension triangle.svg triangle2.svg 

# Write to file 2 with --overwrite
# Output: >> Adding width="10" height="10"
# Result: ...  viewBox="0 0 10 10" width="10" height="10" ...
svgvbdimension triangle.svg triangle2.svg --overwrite

# Write to file 2 with scale x3
# Output: >> Adding width="30" height="30"
# Result: ... viewBox="0 0 10 10" width="30" height="30" ...
svgvbdimension triangle.svg triangle2.svg --overwrite --scale 3

# Write to self with scale x7
# Output: >> Replacing existing width="30", height="30" in triangle2.svg. Using new dimension width="70" height="70".
# Result: ... viewBox="0 0 10 10" width="70" height="70" ...
svgvbdimension triangle2.svg triangle2.svg --overwrite --scale 7

# Write to self again with scale x7
# Output: >> Same dimension defined width="70" height="70" in triangle2.svg. Making no changes.
# Result: ... viewBox="0 0 10 10" width="70" height="70" ...
svgvbdimension triangle2.svg triangle2.svg --overwrite --scale 7

```

## Why?
I'm working on a PixiJS project with SVG with only viewBox specification, and noticed that PixiJS is unable to load the SVG in Firefox.

This is an issue logged in [Mozilla](https://bugzilla.mozilla.org/show_bug.cgi?id=700533) 10 years ago.

I intended to fix this on PixiJS side with this [Pull Request](https://github.com/pixijs/pixijs/pull/7878).
Pixi's decision is not address this with following justification: 
```
This is to workaround a browser specific issue, which is to infer width/height from viewBox on Firefox. 

Firefox already helpfully provides a warning for this case. The easiest fix, that doesn't rely on any code changes, 
is to add width and height to your SVG to prevent the warning. We don't think Pixi should be handling invalid data 
in this case, especially when it adds a lot of complexity to the SVGResource. 

It's better to nudge developers to do the right thing with their assets and make sure they are valid (even if one
browser has more strict requirements).
```

## License

Released under the MIT license

