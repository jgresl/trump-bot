import React from 'react'
import UserMessage from './UserMessage';
import BotMessage from './BotMessage';

function AllMessages() {
    const messages = [
        {
            name: 'user',
            text: 'Hi'    
        },
        {
            name: 'bot',
            text: 'Hi. My name is Donald Trump. I am the President of the United States.'    
        },
        {
            name: 'user',
            text: 'How are you Donald?!'    
        },
        {
            name: 'bot',
            text: 'You can call me Mr. President.'    
        },
        {
            name: 'user',
            text: 'Ok Mr. President'    
        },
        {
            name: 'bot',
            text: 'That\'s better'    
        },
        {
            name: 'user',
            text: 'Where do you live?'    
        },
        {
            name: 'bot',
            text: 'In the greatest country on Earth, with the greatest economy in the world, so much stronger than China\'s, the United States of America.'    
        }
    ];
    const messageHistory = messages.map(message => message.name != "bot" ? <UserMessage message={message}/> : <BotMessage message={message}/>)
    return (
        <div>
            {messageHistory}
        </div>
    )
}

export default AllMessages