import React from 'react';
import { readString } from 'react-papaparse'
import './App.css';

class TreeNode {
  constructor(data) {
    this.data = data;
    this.children = [];
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
  let spaces = "";
  for (let i = 0; i < level; i++)
  {
    spaces += ".";
  }
  console.log(spaces + node.data);
  node.children.forEach(child => {
    PrintTreeRecursive(child, level+1);
  });
}

  function Map(arr, root) {
    let outputset = [];
    root.children.forEach(child => {
      outputset.push(...recursiveMap(arr, child));
    });
    return outputset;
  }

  // recursive helper method for Map
  function recursiveMap(arr, node) {
    let outputset = [];
    //if node is a leaf return node.data to output set
    if (isLeaf(node)) {
      outputset.push(node.data);
    //if node is not a leaf proceed to mapping
    } else {
      //find if node.data matches a value in the array
      let match = arr.find(txt => {
        return txt === node.data;
      });
      //if a match is found recursively map from each child of node
      if (match) {
        //for each child of node
        node.children.forEach(child => {
          outputset.push(...recursiveMap(arr, child));
        });
      }
    }
    return outputset;
  }

  function isLeaf(node) {
    if (!node.children.length) {
      return true;
    }
  }

  //randomly choose an element of an array
  function randomElement(arr) {
    let rand = Math.floor(Math.random()*arr.length)
    return arr[rand];
  }

  function stringToArray(txt) {
    let natural = require('natural');
    let tokenizer = new natural.WordTokenizer();
    let arr = tokenizer.tokenize(txt);
    return arr;
  }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      useroutput: '',
      botoutput: ''
  };
    this.debugResponseTree = this.debugResponseTree.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // read the CSV file containing the canned responses and generate the response tree
    fetch('input.csv')
    .then(r => r.text())
    .then(text => {
      this.tree = GenerateTree(text);
    });
  }

  debugResponseTree() {
    PrintTree(this.tree);
  }

  handleChange(event) {
      this.setState({input: event.target.value});
    }

  handleSubmit(event) {
    //on form submission display what the user typed and the result of mapping that input on the tree
    event.preventDefault();
    let arr = stringToArray(this.state.input);
    this.setState({
      input: '',
      useroutput: this.state.input
    }, () =>
      console.log("User: " + this.state.useroutput)
    );
    this.setState({
      botoutput: randomElement(Map(arr, this.tree))
    }, () =>
      console.log("Trump: " + this.state.botoutput)
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.debugResponseTree}>Print the tree!</button>
          <form onSubmit={this.handleSubmit}>
            <label>
              Say something:
              <input type="text" value={this.state.input} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <p>{"Input: " + this.state.useroutput}</p>
          <p>{"Output: " + this.state.botoutput}</p>
        </header>
      </div>
    );
  }
}

export default App;
