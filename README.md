A simple html5 game built using the Phaser game engine.

Game can be built and run by using parcel-bundler & Browser-sync. To install them you will need npm.
installing parcel-bundler globally:
npm i -g parcel-bundler

installing browser-sync globally:
npm i -g browser-sync

To build and run the game run the following commands while in the projects root directory:
parcel watch game.js
browser-sync start --server --files "."

browser-sync should open a new tab in a browser to localhost:3000 by default. If not you can open it manually.
