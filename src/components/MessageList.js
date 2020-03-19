import React from 'react'
import UserMessage from './UserMessage';
import BotMessage from './BotMessage';

function MessageList(props) {
    // Map the message history to a list of UserMessages and BotMessages
    const messageHistory = props.history.map(message => {
        return message.name !== "bot" ? 
            <UserMessage message={message}/> : 
            <BotMessage message={message}/>
    });
    return (
        <div>
            {messageHistory}
        </div>
    );
}

export default MessageList