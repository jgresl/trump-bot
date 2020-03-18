import React, { Component } from 'react';

import trump from "../images/trump.png";
import wendy from "../images/wendy.png";

class Convo extends Component {
    render() {
        return (
        <div id="Chat-content">   
            <article className="userRow">
                <img className="userPicture" src={wendy} alt="wendy"/> 
                <p className="userMessage">Hi</p>
            </article>
            <article className="botRow">
                <img className="botPicture" src={trump} alt="trump"/>
                <p className="botMessage">Hi. My name is Donald Trump. I am the President of the United States.</p>
            </article>
            <article className="userRow">
                <img className="userPicture" src={wendy} alt="wendy"/>
                <p className="userMessage">How are you Donald?! Lorem ipsum Dolor to make the buble larger for wendy</p>
            </article>
            <article className="botRow">
                <img className="botPicture" src={trump} alt="trump"/>
                <p className="botMessage">You can call me Mr. President.</p>
            </article>
            <article className="userRow">
                <img className="userPicture" src={wendy} alt="wendy"/>
                <p className="userMessage">Ok Mr. President</p>
            </article>
            <article className="botRow">
                <img className="botPicture" src={trump} alt="trump"/>
                <p className="botMessage">That's better</p>
            </article>
            <article className="userRow">
                <img className="userPicture" src={wendy} alt="wendy"/>
                <p className="userMessage">Where do you live?</p>
            </article>
            <article className="botRow">
                <img className="botPicture" src={trump} alt="trump"/>
                <p className="botMessage">In the greatest country on Earth, with the greatest economy in the world, so much stronger than China's, the United States of America.</p>
            </article>
        </div>
        );
    }
}

export default Convo; 