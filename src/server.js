const express = require('express');
var cors = require('cors');
var fs = require('fs');
var Papa = require('papaparse');
var { WordTokenizer } = require('natural');
var synonyms = require("synonyms");
var natural = require('natural');
const readline = require('readline');

const app = express();
app.use(cors());
app.listen(17000);

app.get('/', function (req, res) {
  //console.log("I got a message!");
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

var dictionary = [];
LoadDictionary();
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
// TODO: add lowercase
function GetResponse(inputText, lastResponse) {
  let responseList = [];
  let spellChecked = Spellchecker(inputText);
  let synonyms = GetNounAndVerbSyns(spellChecked);
  let inputList = spellChecked.concat(synonyms);
  
  //console.log(Spellchecker(inputText));
  console.log(inputList);

  // determine the type of input (question or statement)
  let category = IsQuestion(inputText) ? "Q" : "S";
  let categoryTree = responseTree.getSubTree(category);

  // determine the sentiment of input (positive or negative)
  let sentiment = GetSentiment(spellChecked) >= 0 ? "P" : "N";
  let sentimentTree = categoryTree.getSubTree(sentiment);

  // get each matched topic in the response tree and
  // add all the possible responses to the response list
  inputList.forEach(input => {
    let topicTree = sentimentTree.getSubTree(input);
    if (topicTree !== undefined) {
      topicTree.children.forEach(topic => {
        responseList.push(topic.data);
      });
    }
  });

  // add generic responses if no topics matched
  if (responseList.length === 0) {
    let topicTree = sentimentTree.getSubTree("");
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
  let tokenArray = tokenizer.tokenize(txt);
  return tokenArray;
}

// split string into stemmed array of strings, also removes stopwords
function TokenizeAndStem(txt) {
  natural.PorterStemmer.attach();
  return txt.tokenizeAndStem();
}

// returns whether an input sentence is a question
// TODO: should be updated to use a library instead
function IsQuestion(txt) {
  return txt.charAt(txt.length - 1) === '?';
}

// spellcheck returns list of corrections sorted in order of decreasing probability
// second parameter in getCorrections is edit distance
function Spellcheck(word){
  var spellcheck = new natural.Spellcheck(dictionary);
  return spellcheck.getCorrections(word,2);
}

// input sentence and return array of words including original words, first match to each word of length 3 that is in dictionary
function Spellchecker(sentence){
  let sent = TokenizeString(sentence);
  let arr = [];
  sent.forEach(e => {
    if (e.length > 3){
      if(!(dictionary.includes(e)))
        arr.push(Spellcheck(e)[0])
    }
    });
  return filtered(sent.concat(arr));
}

//input array of tokens, return JSON with token and POS tag
function POSTagger(tokenizedString){
  const language = "../node_modules/natural/lib/natural/brill_pos_tagger/data/English/lexicon_from_posjs.json"
  const rules = "../node_modules/natural/lib/natural/brill_pos_tagger/data/English/tr_from_posjs.txt"
  const defaultCategory = 'N';
  const defaultCategoryCapitalized = 'NNP';

  let tS = filtered(tokenizedString);

  let lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
  let ruleSet = new natural.RuleSet(rules);
  let tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
  return tagger.tag(tS);
}

//input array of strings, returns range of [-5,5] based on positive/negative sentiment of input (normalized so will likely land between [-1,1] unless explicitly positive/negative)
function GetSentiment(tokenizedString) {
  let Analyzer = require('natural').SentimentAnalyzer;
  let stemmer = require('natural').PorterStemmer;
  let analyzer = new Analyzer("English", stemmer, "afinn");
  return analyzer.getSentiment(tokenizedString); 
}

//input string and output array of bigrams
function Ngrams(sentence) {
  let ngrams = natural.NGrams;
  return ngrams.bigrams(sentence);
}

function GetSyns(word){
  let nSyns = synonyms(word,"n") || [];
  let nSynsMax3 = nSyns.slice(0,3);
  let vSyns = synonyms(word,"v") || [];
  let vSynsMax3 = vSyns.slice(0,3);
  return nSynsMax3.concat(vSynsMax3);
}

function GetNounsAndVerbs(tokenizedString){
  let tagged = POSTagger(tokenizedString);
  let tagArr = ["NN","NNS","NNP","NNPS","VB","VDB","VBN","VBP","VBD","VBZ"];
  let nouns = [];
  (tagged.taggedWords).forEach(e => {
    let test = (e.tag).toString();
    if (tagArr.includes(test)){
      nouns.push(e.token);
    }
  })
  return nouns;
}

//takes inputted sentence and returns array of strings with all original nouns, verbs and synonyms
function GetNounAndVerbSyns(sentence){
  let nouns = GetNounsAndVerbs(sentence); 
  let syns = [];
    nouns.forEach(e=> {
      let list = GetSyns(e);
      list = filtered(list);
      list.forEach(f => syns.push(f));
  })
  return syns;
}

// remove undefined from array
function filtered(array){
  if(array !== undefined){
    let result = array.filter(function(e) {return e})
    return result;
}
  else{
    return []
  }
}

function LoadDictionary(){
  let fileName = "../public/dictionary.dic"
  const readInterface = readline.createInterface({
    input: fs.createReadStream(fileName),
    output: process.stdout,
    console: false
  });
  readInterface.on('line', function(line){
    dictionary.push(line);
  });
}

function examples(){
  const exStr = "This is a sentence about a lovely goat named Billy and his friend named Wendy."
  const exStr2 = "Ugh I hate stupid evil trolls."
  const exStr3 = "donld"
  let tokens = TokenizeString(exStr);
  let tokens2 = TokenizeString(exStr2);
  console.log(`Sentence 1: ${exStr}\nSentence 2: ${exStr2}\nSentence 3: ${exStr3}\nSentiment:`);
  console.log(GetSentiment(tokens)); console.log(GetSentiment(tokens2));
  console.log("Bigrams\n", Ngrams(exStr));
  console.log("POSTagger\n", POSTagger(tokens));
  console.log("Spellcheck sentence 3:\n", Spellcheck(exStr3));
  console.log("TokenizeString:\n", tokens);
  console.log("TokenizeAndStem:\n", TokenizeAndStem(exStr));
}
