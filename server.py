from flask import Flask, request, render_template, jsonify, send_from_directory, config
import os
import base64
import json
from datetime import datetime
import scipy.io

app = Flask(__name__)

dirname = os.path.dirname("/media/matt/2-Samsung-Files/Documents/Immersio/chat_code/web-audio-example/record-audio/record-server-example/")



def rpath(path):
    return  os.path.join(dirname, path)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/messages', methods=['GET'])
def get_messages():
    print(os.listdir('./static/messages'))
    filenames = os.listdir('./static/messages')

    return jsonify({'messageFilenames': filenames})

@app.route('/messages', methods=['POST'])
def post_messages():
    now = datetime.now()
    dt_string = now.strftime("user-%d-%m-%Y-%H-%M-%S")
    f = open(f'./static/messages/{dt_string}.wav', 'wb')
    raw_data = json.loads(request.data)['message']
    bytes = base64.b64decode(raw_data)
    f.write(bytes)
    f.close()
    return jsonify({'message': 'Saved message'})

@app.route('/userMessages', methods=['POST'])
def post_user_messages():
    print(json.loads(request.data))
    return jsonify({'userMessage': json.loads(request.data)['Data']})

@app.route('/serverMessages', methods=['POST'])
def post_server_messages():
    print(json.loads(request.data))
    b = 'i am data'
    scipy.io.wavfile.write("static/messages", 22050, b)
    return jsonify({'serverMessage': json.loads(request.data)['Data']})


if __name__ == "__main__":
    app.run(debug=True)