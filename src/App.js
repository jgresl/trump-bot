import React from 'react';
import { readString } from 'react-papaparse';
import { WordTokenizer } from 'natural';
import './App.css';
import trump from "./images/trump.jpg";
import wendy from "./images/wendy.png";

class TreeNode {
  constructor(data) {
    this.data = data;
    this.children = [];
    this.getSubTree = this.getSubTree.bind(this);
  }

  // returns the first child with matching data
  getSubTree(data) {
    return this.children.find(child => {
      return child.data === data;
    });
  }
}

// generate the response tree from a CSV-formatted text input
function GenerateTree(inputText) {
  let root = new TreeNode("root");

  // for each line in the csv input, read as array of strings
  readString(inputText).data.forEach(arr => {
    let parent = root;

    // for each string in each subarray, add to tree
    arr.forEach(txt => {
      // check if the string already exists in the tree
      let node = parent.children.find(child => {
        return child.data === txt;
      });

      // add the string to the tree if needed
      if (!node) {
        node = new TreeNode(txt);
        parent.children.push(node);
      }

      parent = node;
    });
  });

  return root;
}

// a DFS recursive printing function for the response tree
function PrintTree(root) {
  console.log(root.data);
  root.children.forEach(child => {
    PrintTreeRecursive(child, 1);
  });
}

// recursive helper method for PrintTree
function PrintTreeRecursive(node, level) {
  let indent = "";
  for (let i = 0; i < level; i++) {
    indent += ".";
  }
  console.log(indent + node.data);
  node.children.forEach(child => {
    PrintTreeRecursive(child, level + 1);
  });
}

function GetResponse(inputText, responseTree, lastResponse) {
  let responseList = [];

  // determine the type of input (question or statement)
  let category = IsQuestion(inputText) ? "Q" : "S";
  let categoryTree = responseTree.getSubTree(category);

  // get each matched topic in the response tree and
  // add all the possible responses to the response list
  let inputArray = TokenizeString(inputText);
  inputArray.forEach(input => {
    let topicTree = categoryTree.getSubTree(input);
    if (topicTree !== undefined) {
      topicTree.children.forEach(topic => {
        responseList.push(topic.data);
      });
    }
  });

  // add generic responses if no topics matched
  if (responseList.length === 0) {
    let topicTree = categoryTree.getSubTree("");
    topicTree.children.forEach(topic => {
      responseList.push(topic.data);
    });
  }

  // prevent repeating the last response we used if possible
  if (responseList.length > 1 && lastResponse !== undefined) {
    let idx = responseList.findIndex(data => {
      return data === lastResponse;
    });
    if (idx !== -1) {
      responseList.splice(idx, 1);
    }
  }

  // return a random response from the possible responses
  return GetRandomElement(responseList);
}

// returns a random element from an array
function GetRandomElement(arr) {
  let rand = Math.floor(Math.random() * arr.length)
  return arr[rand];
}

// split string into a tokenized array of strings
function TokenizeString(txt) {
  // currently uses 'natural' library
  let tokenizer = new WordTokenizer();
  let tokenArray = tokenizer.tokenize(txt.toLowerCase());
  return tokenArray;
}

// returns whether an input sentence is a question
// TODO: should be updated to use a library instead
function IsQuestion(txt) {
  return txt.charAt(txt.length - 1) === '?';
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.history = [];
    this.state = {
      input: '',
      question: '',
      answer: ''
    };
    this.debugResponseTree = this.debugResponseTree.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // read the CSV file containing the canned responses and generate the response tree
    fetch('kidconvo.csv')
      .then(r => r.text())
      .then(text => {
        this.tree = GenerateTree(text);
      });
  }

  debugResponseTree() {
    PrintTree(this.tree);
  }

  handleChange(event) {
    this.setState({
      input: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    // get the last response used
    let lastResponse = undefined;
    if (this.history.length > 0) {
      lastResponse = this.history[this.history.length - 1].answer;
    }

    // display the user input and the bot response
    let output = GetResponse(this.state.input, this.tree, lastResponse);
    this.setState({
      input: '',
      question: this.state.input,
      answer: output
    });
    
    // save the question and answer into history
    this.history.push({
      question: this.state.input,
      answer: output
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="Chat-header">
            <h2>Trump Bot</h2>
          </div>
          <div id="Chat-content">
            <article className="botRow">
              <img className="botPicture" src={trump} alt="trump"/>
              <div className="botMessage">What is your name?</div>
            </article>
            <article className="userRow">
              <div className="userMessage">My name is Wendy</div>
              <img className="userPicture" src={wendy} alt="wendy"/>
            </article>
            <article className="botRow">
              <img className="botPicture" src={trump} alt="trump"/>
              <div className="botMessage">How old are you?</div>
            </article>
            <article className="userRow">
              <div className="userMessage">I'm 14, duh!</div>
              <img className="userPicture" src={wendy} alt="wendy"/>
            </article>
            <p>{"Your Input: " + this.state.question}</p>
            <p>{this.state.answer}</p>
          </div>
          <div id="Chat-footer">
          <form onSubmit={this.handleSubmit}>
            <input type="text" id="messageField" placeholder="What do you want to say?" value={this.state.input} onChange={this.handleChange}/>
            <input type="submit" id="messageButton"/>
          </form>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
