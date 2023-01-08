//import necessary elements
import bot from './assets/bot.svg';
import user from './assets/user.svg';

const from = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

//in this function appears to be designed to display a simple loading animation,
//and adding a series of dots to the textContent of a given element.
function loader(element)
{
    element.textContent ='';

    loadInterval = setInterval(() => {
        element.textContent += '.';
        
        if(element.textContent === '....'){
            element.textContent = '';
        }
    },300) 
}

//This function appears to be designed to type out a 
//given text string one character at a time in a given element
function typetext(element, text){
    let index = 0;

    let interval = setInterval(() => {
        if(index < text.length){
            element.innerHTML += text.charAt(index);
            index++;
        }
        else{
            clearInterval(interval);
        }
    }, 20)
}

//This function generates a unique ID by combining a timestamp and a random hexadecimal string
function generateUniqueId(){
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

//This function appears to be designed to generate an HTML string,
//for a chat stripe that can be inserted into a chat interface
function chatStripe (isAi, value, uniqueId){
    return(
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img
                        src="${isAi ? bot : user}"
                        alt="${isAi ? 'bot' : 'user'}"
                    />
                </div>
                <div class ="message" id=${uniqueId}>${value}</div>
            </div>        
        </div>
        `
    )
}

const handleSubmit = async (e) =>{
    e.preventDefault();

    const data = new FormData(from);

    //user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    from.reset();

    //bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

    //fetch data from the server and get Bot response 
    const response = await fetch ('https://jarvis-chat-bot.onrender.com',   
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    }) 
    
    //for handling the response of an HTTP request made using the fetch function
    clearInterval(loadInterval);
    messageDiv.innerHTML = '';
    
    if (response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();
        
        typetext(messageDiv, parsedData);
    }
    else{
        const err = await response.text();
        messageDiv.innerHTML = "Something went wrong";
        alert(err);
    }

}

//for attaching two event listeners to a form element with 
//the identifier and code allows the form to submit
from.addEventListener('submit', handleSubmit);
from.addEventListener('keyup',(e) => {
    if(e.keyCode === 13){
        handleSubmit(e);
    }

})
