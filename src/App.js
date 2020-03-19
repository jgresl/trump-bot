import React from 'react';
import './App.css';
import AllMessages from './components/AllMessages';
import bot from "./images/trump.png";
import user from "./images/wendy.png";

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

      // save the question and answer into history
      this.history.push({
        question: this.state.input,
        answer: output
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
            
            <AllMessages/>

            <article className="userRow">
                <img className="userPicture" src={user} alt="user"/> 
                <p className="userMessage">{this.state.question}</p>
            </article>
            <article className="botRow">
                <img className="botPicture" src={bot} alt="bot"/>
                <p className="botMessage">{this.state.answer}</p>
            </article>

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
