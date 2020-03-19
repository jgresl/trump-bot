import React from 'react';
import './App.css';
import MessageList from './components/MessageList';
import { animateScroll } from "react-scroll";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.history = [];
    this.state = {
      input: '',
      question: '',
      answer: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "Chat-content"
    });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
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
    fetch(`http://localhost:17000?input=${this.state.input}&lastResponse=${lastResponse}`)
    .then(response => {
      return response.text();
    })
    .then(output => {
      this.setState({
        input: '',
        question: this.state.input,
        answer: output
      });
      
      // save the user's question into history
      this.history.push({
        name: 'user',
        text: this.state.question
      });

      // save the bot's response into history
      this.history.push({
        name: 'bot',
        text: this.state.answer
      });
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">

          <div id="Chat-header">
            <h2>Trump Bot</h2>
          </div>

          <div id="Chat-content">
            <MessageList history={this.history}/>
          </div>

          <div id="Chat-footer">
            <form onSubmit={this.handleSubmit}>
              <input type="text" id="messageField" placeholder="What do you want to say?" autoComplete="off" value={this.state.input} onChange={this.handleChange}/>
              <input type="submit" id="messageButton" value="Send"/>
            </form>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
