import socket
import json
import pprint
import random

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('localhost', 50100))


name = 'Bot No=%d'%(random.random()*100000);
s.send(json.dumps({'name':name}))

while True:
    string = s.recv(1024)
    data = json.loads(string)
    # pprint.pprint(data)

    if (data['type'] != 'state'): break

    move = dict(
        turn=data['turn'],
        force=1,
        steer=1
    )
    # print move
    # s.send('sdhfuisad')
    s.send(json.dumps(move))