import React from 'react'
import user from "../images/wendy.png";

function UserMessage({message}) {
    return (
        <div>
            <article className="userRow">
                <img className="userPicture" src={user} alt="user"/>
                <p className="userMessage">{message.text}</p>
            </article>
        </div>
    )
}

export default UserMessage
