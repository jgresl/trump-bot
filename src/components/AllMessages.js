import React from 'react'
import UserMessage from './UserMessage';
import BotMessage from './BotMessage';

function AllMessages({history}) {
    const messageHistory = history.map(message => message.name != "bot" ? <UserMessage message={message}/> : <BotMessage message={message}/>)
    return (
        <div>
            {messageHistory}
        </div>
    )
}

export default AllMessages