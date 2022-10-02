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
          })
        };
      });

let textInputElementServer = document.getElementById('serverInput');
      let response2 = textInputElementServer.addEventListener('keypress', async function(e){
        if (e.key === 'Enter') {
          
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
          })
        };
      });