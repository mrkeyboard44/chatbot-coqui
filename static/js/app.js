

const recordAudio = () =>
        new Promise(async resolve => {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          let audioChunks = [];

          mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
          });

          const start = () => {
            audioChunks = [];
            mediaRecorder.start();
          };

          const stop = () =>
            new Promise(resolve => {
              mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                const play = () => audio.play();
                resolve({ audioChunks, audioBlob, audioUrl, play });
              });

              mediaRecorder.stop();
            });

          resolve({ start, stop });
        });
    


const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const recordButton = document.querySelector('#record');
const stopButton = document.querySelector('#stop');
const playButton = document.querySelector('#play');
const saveButton = document.querySelector('#send');
const savedAudioMessagesContainer = document.querySelector('#saved-audio-messages');

let recorder;
let audio;

recordButton.addEventListener('click', async () => {
recordButton.setAttribute('disabled', true);
stopButton.removeAttribute('disabled');
playButton.setAttribute('disabled', true);
saveButton.setAttribute('disabled', true);
if (!recorder) {
  recorder = await recordAudio();
}
recorder.start();
});

stopButton.addEventListener('click', async () => {
recordButton.removeAttribute('disabled');
stopButton.setAttribute('disabled', true);
playButton.removeAttribute('disabled');
saveButton.removeAttribute('disabled');
audio = await recorder.stop();
});;


playButton.addEventListener('click', () => {
  audio.play();
});

saveButton.addEventListener('click', () => {
  const reader = new FileReader();
  reader.readAsDataURL(audio.audioBlob);
  reader.onload = () => {
    const base64AudioMessage = reader.result.split(',')[1];

    fetch('/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: base64AudioMessage })
    }).then(res => {
      if (res.status === 200) {
        return populateAudioMessages();
      }
      console.log('Invalid status saving audio message: ' + res.status);
    });
  };
});

const populateAudioMessages = async () => {
  return fetch('/messages').then(res => {
    if (res.status === 200) {
      return res.json().then(json => {
      
        console.log(json)
        
        let filenames = json.audioMessages
        filenames.forEach((element, index, array) => {
          let audioElement = document.querySelector(`[data-audio-filename="${element}"]`);
          if (!audioElement) {
            audioElement = document.createElement('audio');
            audioElement.src = `./static/messages/${element}`;
            audioElement.setAttribute('data-audio-filename', element);
            audioElement.setAttribute('class', element);
            if (element.split('-')[0] == 'server' && index == array.length - 1) {
              audioElement.setAttribute('id', 'latest')
            }
            console.log(element)
            audioElement.setAttribute('controls', true);
            textNode = document.createTextNode(element.split('-')[0] + ' ' + element.split('-').slice(4,-1).join(':'))
            savedAudioMessagesContainer.appendChild(textNode)
            let insert_audio_file = async () => {
              await savedAudioMessagesContainer.appendChild(audioElement);
            } 
            insert_audio_file().then(() => {
              document.getElementById('saved-audio-messages').value = ''
            })
          }
        });
        
        console.log('elements populated')
      });
    }
    console.log('Invalid status getting messages: ' + res.status);
  });
};
populateAudioMessages();
let textInputElementServer = document.getElementById('serverInput');
      let response2 = textInputElementServer.addEventListener('keypress', async function(e){
        if (e.key === 'Enter') {
          
          let latest = document.getElementById('latest')
          if (latest) {
            latest.setAttribute('id', 'old')
          }
          let serverText = textInputElementServer.value;
          
          console.log('New message is "' + serverText + '"');
          async function fetchResponse() { 
            return await fetch('/serverMessages', await {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'Data': serverText})
          
          })}
          
          fetchResponse().then(async res => {
            let data = await res.json()
            return data
          }).then(async data => {
            console.log(data)
            textElement = document.createElement('p');
            textElement.setAttribute('id', 'text_message');
            textElement.textContent = "Server Message: " + data.serverMessage
            messages = document.getElementById('saved-audio-messages');
            messages.appendChild(textElement);
            textInputElementServer.value = ''
          }).then(() => {
            let populate = async () => {
              await populateAudioMessages().then(() => {
                console.log('start autoplay')
                let latest_audio_element = document.getElementById('latest')
                var audio = new Audio('./static/messages/' + latest_audio_element.getAttribute('class'));
                audio.play();
              });
            }
            populate()
          })
          
        };
      });
      
      




let textInputElementUser = document.getElementById('userInput');
      let response = textInputElementUser.addEventListener('keypress', async function(e){
        if (e.key === 'Enter') {
          
          let userText = textInputElementUser.value;
          
          console.log('New message is "' + userText + '"');
          async function fetchResponse() { 
            return await fetch('/userMessages',  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'Data': userText})
          
          })}
          
          fetchResponse().then(async res => {
            let data = await res.json()
            return data
          }).then(async data => {
            console.log(data)
            textElement = document.createElement('p');
            textElement.setAttribute('id', 'text_message');
            textElement.textContent = "User Message: " + data.userMessage
            messages = document.getElementById('saved-audio-messages');
            messages.appendChild(textElement)
            textInputElementUser.value = ''
            populateAudioMessages()
          })
        };
      });

