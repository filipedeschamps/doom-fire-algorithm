# doom-fire-algorithm: new structure using parcel-bundler

This is a version of the doom-fire-algorithm implementation that uses a new file structure to make it easier for users to extend and to implement their versions using this as a template.

There are 2 main differences here from the original approach:

1. We use a bundler called [Parcel bundler](https://parceljs.org) which is a no config bundler that either transpiles newest JS and also compiles other languages to JS, such as Rust, ReasonML, TS and a couple other cool languages.

2. I've split the code into different modules and mainly added a new config.json file that is responsible for the default configurations such as the size of the rendered content and the renderer engine to be used.


## Usage

1. `$ npm install`
2. `$ npm start`

And that's it, this will automatically open your chrome at localhost:1234 serving the file with hot-reload.