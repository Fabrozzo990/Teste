const apiKey = 'AIzaSyAuHO_-ijh0XbhMmdqaz6tV7JszvwQLJfY'; // Substitua pela sua chave de API
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const chat = document.getElementById('chat');
const mensagemInput = document.getElementById('mensagem');
const enviarButton = document.getElementById('enviar');
const anexarInput = document.getElementById('anexar');

enviarButton.addEventListener('click', enviarMensagem);
anexarInput.addEventListener('change', enviarImagem);

async function enviarMensagem() {
  const mensagem = mensagemInput.value.trim();
  if (!mensagem) return;

  exibirMensagem(mensagem, 'usuario');
  mensagemInput.value = '';

  const resposta = await obterRespostaDoChatbot(mensagem);
  exibirMensagem(resposta, 'chatbot');
}

async function enviarImagem(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64Image = reader.result.split(',')[1];
    const resposta = await obterRespostaDoChatbot(null, base64Image, file.type);
    exibirMensagem('Imagem enviada', 'usuario');
    exibirMensagem(resposta, 'chatbot');
  };
  reader.readAsDataURL(file);
}

async function obterRespostaDoChatbot(mensagem, imagemBase64, tipoImagem) {
  let partes = [
    {
      text: `Você se chama Gênio Escolar, sua função é ajudar ou responder os deveres escolares de alunos. Após o usuário mandar o problema você deve entregar duas respostas. Uma resumida, e outra detalhada. Por cima a resumida, e abaixo a detalhada. Na resposta detalhada você deve dizer passo a passo a resposta. Com palavras comuns, com o objetivo de que todos possam entender. Após isso você deve pesquisar, e incluir dois vídeos do YouTube que expliquem o assunto da questão. Na resposta resumida você deve simplesmente enviar a resposta, de uma forma explicada, por escrito, mas de uma forma resumida, com palavras simples, para que todos entendam. O problema do aluno é: ${mensagem || ''}`,
    },
  ];

  if (imagemBase64) {
    partes.push({
      inlineData: {
        mimeType: tipoImagem,
        data: imagemBase64,
      },
    });
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }] }),
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function exibirMensagem(mensagem, remetente) {
  const mensagemElemento = document.createElement('div');
  mensagemElemento.textContent = mensagem;
  mensagemElemento.classList.add(remetente);
  chat.appendChild(mensagemElemento);
  chat.scrollTop = chat.scrollHeight;
}
