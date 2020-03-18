import React from 'react'
import bot from "../images/trump.png";

function BotMessage({message}) {
    return (
        <div>
            <article className="botRow">
                <img className="botPicture" src={bot} alt="bot"/>
                <p className="botMessage">{message.text}</p>
            </article>
        </div>
    )
}

export default BotMessage
