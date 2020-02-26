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

  function mapArrayToTree(arr, root) {
    let parent = root;
    //for each string in array
    arr.forEach(txt => {
      //check if the string exists in the tree
      let node = parent.children.find(child => {
        return child.data === txt;
      });
      if (node) {
        parent = node;
      }
    });
  }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.debugResponseTree = this.debugResponseTree.bind(this);
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.debugResponseTree}>Print the tree!</button>
        </header>
      </div>
    );
  }
}

export default App;
