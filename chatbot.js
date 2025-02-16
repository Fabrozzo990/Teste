const apiKey = 'AIzaSyAuHO_-ijh0XbhMmdqaz6tV7JszvwQLJfY';

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    displayMessage(userInput, 'user');

    const initialPrompt = "Olá, sou o Gênio Escolar, em que posso ajudar?";
    const fullPrompt = `Você se chama Gênio Escolar, sua função é ajudar ou responder os deveres escolares de alunos.

Sua primeira mensagem deve ser: " ${initialPrompt}"

Após o usuário mandar o problema você deve perguntar se ele quer uma resposta detalhada ou somente a resposta.

Caso ele queira uma resposta detalhada você deve dizer passo a passo a resposta. Com palavras comuns, com o objetivo de que todos possam entender. Após isso você deve pesquisar, e incluir dois vídeos do YouTube que expliquem o assunto da questão.

Caso ele queira somente a resposta você deve simplesmente enviar a resposta, de uma forma explicada, por escrito, mas de uma forma resumida, com palavras simples, para que todos entendam.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: fullPrompt + '\n' + userInput,
            max_tokens: 500
        })
    });

    const data = await response.json();
    const botMessage = data.choices[0].text;

    displayMessage(botMessage, 'bot');
}

function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = sender;
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
