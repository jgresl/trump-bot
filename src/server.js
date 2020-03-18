const express = require('express');
var cors = require('cors');
var fs = require('fs');
var Papa = require('papaparse');
var { WordTokenizer } = require('natural');

const app = express();
app.use(cors());
app.listen(17000);

app.get('/', function (req, res) {
  res.send(GetResponse(req.query.input, req.query.lastResponse));
});

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

var responseTree = GenerateTree('../public/kidconvo.csv');

// generate the response tree from a CSV-formatted text input
function GenerateTree(fileName) {
  let root = new TreeNode("root");

  // for each line in the csv input, read as array of strings
  ParseCSV(fileName).then(data => {
    data.forEach(row => {
      // don't count empty rows
      if (row[0].trim() === '') {
        return;
      }

      let parent = root;
  
      // for each string in each subarray, add to tree
      row.forEach(txt => {
        // check if the string already exists in the tree
        let node = parent.getSubTree(txt);
  
        // add the string to the tree if needed
        if (!node) {
          node = new TreeNode(txt);
          parent.children.push(node);
        }
  
        parent = node;
      });
    });
  })
  //.then(() => PrintTree(root));

  return root;
}

// a helper function that wraps the Papa.parse function
// and returns a Promise with the CSV array data.
function ParseCSV(fileName) {
  return new Promise(function(resolve, reject) {
    let stream = fs.createReadStream(fileName);
    Papa.parse(stream, { 
      complete: function(results, file) {
        resolve(results.data);
      },
      error: function(error, file) {
        reject(error);
      }
    });
  });
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

// returns a string response from the response tree based on the inputText
function GetResponse(inputText, lastResponse) {
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

// split string into stemmed array of strings, also removes stopwords
function TokenizeAndStem(txt) {
  let natural = require('natural');
  natural.PorterStemmer.attach();
  console.log(txt.tokenizeAndStem());
}

// returns whether an input sentence is a question
// TODO: should be updated to use a library instead
function IsQuestion(txt) {
  return txt.charAt(txt.length - 1) === '?';
}

// spellcheck returns list of 'words' from original word where each item in list has 2 adjacent letters swapped, as well as a stemmed word
function CrudeSpellcheck(word){
  let a = word.split('');
  let list = []
  for (let i = 0; i < word.length-1; i++){
    let temp = a[i];
    a[i] = a[i+1];
    a[i+1] = temp;
    let newWord = a.join('');
    list.push(newWord);
    temp = a[i];
    a[i] = a[i+1];
    a[i+1] = temp;
  }
  let natural = require('natural');
  list.push(natural.PorterStemmer.stem(word));
  return list;
}

//input array of strings, returns range of [-5,5] based on positive/negative sentiment of input (normalized so will likely land between [-1,1] unless explicitly positive/negative)
//can't figure out how to import/use afinn-165 module
/*function Sentiment(tokenizedString) {
  let Analyzer = require('natural').SentimentAnalyzer;
  let stemmer = require('natural').PorterStemmer;
  let analyzer = new Analyzer("English", stemmer, "afinn");
  return analyzer.getSentiment(tokenizedString); 
} */