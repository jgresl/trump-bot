import React from 'react'
import wendyPicture from "../images/wendy.png";

function UserMessage(props) {
    return (
        <div>
            <article className="userRow">
                <img className="userPicture" src={wendyPicture} alt="user"/>
                <p className="userMessage">{props.message.text}</p>
            </article>
        </div>
    )
}

export default UserMessage
