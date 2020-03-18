import React from 'react';
import './App.css';

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
        <header className="App-header">
          <p>{"It's your lucky day. Someone really special would like to talk to you."}</p>
          <form onSubmit={this.handleSubmit}>
            <label>
              What would you like to say? 
              <input type="text" value={this.state.input} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <p>{"Your Input: " + this.state.question}</p>
          <p>{this.state.answer}</p>
        </header>
      </div>
    );
  }
}

export default App;
