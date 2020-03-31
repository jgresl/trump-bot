# COSC 310: Software Engineering - Project 2

### Table of Contents
- [Description](#description)
- [Features](#features)
- [Design Choices](#design-choices)
- [Build Instructions](#build-instructions)
- [Sample Output](#sample-output)
- [Contributors](#contributors)

## Description
An interactive conversational agent that responds to user input. The agent can "understand" sentences typed in by the user.
In this application, the user can "communicate" with the US president, Donald Trump.

## Features
- [x] Hosted on an external web server `http://209.121.94.31:5000/`
- [x] Basic user interface that accepts input and displays output in the web browser
- [x] Generates a response tree from a prefabricated CSV file
- [x] Determines if the input is a question or a statement
- [x] Adds all possible responses to the response list
- [x] Adds generic responses to the repsonse list when no topics are matched
- [x] Returns a random response from the response list
- [x] Can handle a conversation with up to 30 unique repsonses

## Design Choices
We used the React framework to build our appication because it is a powerful tool for creating interactive user interfaces. The framework permits third-party npm libraries. Further, the project is easily optimized into a build file for production. These benefits make React an optimal choice for a chatbot application.

## Class Organization
Given that React is a heavily component-based architecture, our code does not follow a standard object oriented flow. Instead, we have a main App class which is a ReactComponent that we use to encapsulate our webpage design and event functionality. In addition, we have several functions in the main App.js file which serve to generate the response tree and determine the appropriate output of the chatbot. The App class calls these functions from event methods such as when the user enters a line of text. We also use a simple TreeNode class for our tree datastructure which simply contains a list of child nodes and its data. This is initialized at runtime with data from a specified CSV file which contains our hand-written responses mapped to certain keywords.

## Build instructions

  1. Clone the project to a local repository: `git clone https://github.com/jgresl/cosc310.git`
  2. Navigate to the project directory: `cd cosc310`
  3. Ensure node.js is installed: https://nodejs.org/en/
  4. Ensure the required npm libraries are installed: `npm install`
  5. Start the client: `npm start`
  6. Navigate to the source directory: `cd src`
  7. Start the server locally: `node server.js`
  8. Build the program for production: `npm run build`

## Sample Output
Check out [this example file](testedoutput.txt) for sample output.

## Contributors
- **Jaden Balogh**
  - Created base application with react.js
  - Generated wiki page for react.js
  - Implemented text pre-processing
  - Tested and reviewed code changes
- **Jonathan Gresl**
  - Setup GitHub repository and invited group members
  - Created README template in GitHub
  - Setup Gantt chart to manage product and sprint backlogs
  - Setup web server to host production site
  - Added description and features to the project document
  - Added SDLC choice and rational to project document
  - Added SDLC phases and tasks to the project document
  - Added final WBS / Gantt chart to project document
- **Michael Crouse**
  - Researched chatbot algorithms
  - Created the sample conversation to build on
  - Created the initial text file for the output tree
  - Tested and prepared for the 30 turn conversation
  - Added GitHub commits by user to project document
- **Shamus Boulianne**
  - Researched chatbot algorithms
  - Implemented the text input processing
  - Implemented the text mapping algorithm
  - Built a basic text input and output
  - Implemented text output generation

[Back to The Top](#cosc-310-software-engineering---project-2)
