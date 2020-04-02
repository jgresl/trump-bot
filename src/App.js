import React from 'react';
import './App.css';
import MessageList from './components/MessageList';
import { animateScroll } from "react-scroll";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      history: []
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Scrolls to the bottom of messages
  scrollToBottom(duration, delay = 0) {
    animateScroll.scrollToBottom({
      containerId: "Chat-content",
      smooth: true,
      duration: duration,
      delay: delay
    });
  }

  handleInputChange(event) {
    this.setState({
      input: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    // Clear input and update history with the user's input
    this.setState(state => {
      return {
        input: '',
        history: state.history.concat({
          name: 'user',
          text: state.input
        })
      };
    }, () => {
      this.scrollToBottom(200, 200);
    });

    // Get the last response used
    let lastResponse = undefined;
    if (this.state.history.length > 0) {
      lastResponse = this.state.history[this.state.history.length - 1].text;
    }

    // Get the bot's response from the server
    fetch(`http://' + window.location.hostname + ':17000?input=${this.state.input}&lastResponse=${lastResponse}`)
    .then(response => {
      return response.text();
    })
    .then(output => {
      // Imitate a delay on receiving a response
      setTimeout(() => {
        // Update history with the bot's response
        this.setState(state => {
          return {
            history: state.history.concat({
              name: 'bot',
              text: output
            })
          };
        }, () => {
          this.scrollToBottom(300);
        });
      }, 1200);
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
            <MessageList history={this.state.history}/>
          </div>

          <div id="Chat-footer">
            <form onSubmit={this.handleSubmit}>
              <input type="text" id="messageField" placeholder="What do you want to say?" autoComplete="off" value={this.state.input} onChange={this.handleInputChange}/>
              <input type="submit" id="messageButton" value="Send"/>
            </form>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
