# tt-commander-app

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/TinyTapeout/tt-commander-app)

Tiny Tapeout Commander App let you connect to a [Tiny Tapeout](https://www.tinytapeout.com) Demo Board and control it from your browser. You can select the active design and set the clock frequency.

### Bulk Testing Mode (In Progress - I'm writing this to plan what will be implemented in my fork of this project)

A button has been added to run all the designs in the current tapeout in sequence, executing any predefined testbenches that are present in their repositories. This means that individuals can help gather data for each others designs without needing to manually run each one separately. This also allows those who choose not to purchase a board for their design to still be able to test it on the manufactured hardware.

A button has been added to the page after a board has been connected. 
- A drop down menu with a series of selectable projects listed will appear. This will default to all applicable projects. 
- The button will run all the designs in the selected projects in sequence.

Data gathered through the testing will be stored in a publicly readable data bucket and be accessible through a link on the page. This will allow individuals to see the results of the tests and compare them to their own results, as well as allow individuals to define their own output schemas by changing what is printed to the console in their testbenches.

## Cloud Development

You can hack on the project by opening it on [Gitpod](https://gitpod.io/#https://github.com/TinyTapeout/tt-commander-app). This opens a full development environment in your browser, including a code editor, terminal, and a preview pane where you can see your changes in action.

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later) and npm (usually comes with Node.js)

### Instructions

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Open [http://localhost:5173](http://localhost:5173) in your browser

Enjoy!

## License

SiliWiz is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for more details.
