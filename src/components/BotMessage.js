import React from 'react'
import trumpPicture from "../images/trump.png";

function BotMessage(props) {
    return (
        <div>
            <article className="botRow">
                <img className="botPicture" src={trumpPicture} alt="bot"/>
                <p className="botMessage">{props.message.text}</p>
            </article>
        </div>
    )
}

export default BotMessage
