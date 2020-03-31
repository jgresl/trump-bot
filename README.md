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
### Dynamic User Interface
The TrumpBot features a beautiful interactive UI that mimics a messaging application. This includes a complete message history and animated messaging with simulated response delays to make the user feel as if Trump is really taking the time to type out a message.
#### Demonstration
![INSERT GIF HERE]()

### External Web Hosting
TrumpBot is hosted on an external web server for live production use through both the browser client and Slack bot integration. You can access the most recent version of the chatbot hosted here: [http://209.121.94.31:5000/](http://209.121.94.31:5000/)

### CSV Data Pre-processing
In order to allow customizable and efficient data entry for new responses, our chatbot uses a server-side CSV data file which is mapped to a response tree at runtime. By nesting responses in a tree structure, the chatbot can map user input to the appropriate response in a fraction of a second even with a large bank of possible responses.
#### Demonstration
![Imgur](https://imgur.com/0q0dkVQ.png)

### Input Spellchecking
Before any response mapping begins, the user input is first processed through a variety of natural language functions to improve the accuracy and breadth of possible responses. The first step in this input pre-processing is to spellcheck the user's input. The algorithm never *replaces* words in the user's input, in case a word was intentionally mis-spelled or was a proper noun not found in the English dictionary. Instead, it *adds* spelling corrections to the list of comparison words to increase the range of inputs that can be correctly mapped.
#### Demonstration
![INSERT IMAGE HERE]()

### Parts of Speech Analysis
Once the input is spellchecked, the chatbot parses the list of input words and filters out relevant nouns and verbs for use in synonym mapping. This intermediate processing step is done for mapping optimization, to ensure that synonyms are only generated for key words in the sentence and the number of comparisons does not increase exponentially. As with spellchecking, words directly inputted by the user are never removed from the comparison in order to give users better control and avoid accidental mis-pruning.
#### Demonstration
Since this is an intermediate optimization step, it does not have a direct impact on the chatbot output but rather the performance. Check out [http://209.121.94.31:5000/](http://209.121.94.31:5000/) to experience the performance of TrumpBot yourself!

### Synonym Mapping
The final step of input pre-processing is generating a list of synonyms from user input. This uses Parts of Speech and spellchecking to optimize performance and give the highest quality responses as consistently as possible. Each noun and verb and checked against a dictionary and any matched synonyms are added to the list of comparison words for the response mapping algorithm.
#### Demonstration
![INSERT IMAGE HERE]()

### Question vs Statement Checks
The response mapping algorithm first determines if the user's input is a question or a statement based on their use of question marks. It then uses that result to efficiently filter out appropriate responses to the user's input.
#### Demonstration
![INSERT IMAGE HERE]()

### Sentiment Analysis
Once the chatbot has determined whether the user input is a question or a statement, it proceeds to analyze the sentiment of the input. This determination - whether it finds the result to be positive, negative or neutral - influences the response of the chatbot appropriately. TrumpBot doesn't like being insulted!
#### Demonstration
![INSERT IMAGE HERE]()

### Categorized String Matching
The key step of the response mapping algorithm is to take the pre-processed user input and map it to the question-and-sentiment-filtered sub-section of the response tree. In simple terms, the algorithm matches a list of words extended from the original user input to a list of possible responses. A response is then randomly chosen and returned from this list of possible matched responses.
#### Demonstration
![INSERT IMAGE HERE]()

### Over 100 Unique Responses and Dozens of Topics
The TrumpBot offers a vast array of unique responses corresponding to a wide variety of topics relating to Donald Trump. These are carefully mapped to using natural word processing and a pre-generated response tree.
#### Demonstration
![Example](https://i.imgur.com/Ldf14zS.png)

### Generic Response Mapping
TrumpBot is designed to handle a variety of user input and can map a large range of possible inputs to a small set of outputs. However, it can still fail to find a suitable response. In this case, the TrumpBot defaults to a list of generic responses suited to a wide variety of unknown inputs.
#### Demonstration
![INSERT IMAGE HERE]()

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
