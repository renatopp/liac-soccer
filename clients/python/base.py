import socket
import json
import random

__all__ = ['BaseBot']

random_names = ['Dee Dee', 'Dexter', 'Johnny Bravo', 'Ed', 'Edd', 'Eddy',
                'Courage', 'Mordecai', 'Bloo', 'Steven', 'Finn', 'Marceline',
                'Billy', 'Mandy', 'Bubblegum']

class BaseBot(object):
    '''Base class for liac-soccer bots.
    
    Usage:

        class MyBot(base.BaseBot):
            name = '<my bot name>'

            def act(self, state):
                # my code here
                
                force = ... # compute robot force
                steer = ... # computer robot steer

                return (force, steer)


        MyBot().run()

    '''
    name = None

    def act(self, state):
        '''Override this to play.

        Arguments:
            state (dict): the game state (comes from the server).

        Returns:
            move (tuple): a tuple in the following format `(force, steer)`:
                force (float): number between -1 and 1 with the force to apply
                               to the robot. Positive goes forward, negative 
                               goes backward.
                steer (float): number between -1 and 1 with the steer of the 
                               robot. Positive goes to the right, negative goes
                               to the left.
        '''
        raise NotImplementedError('please implement method "act" of the bot.')

    def run(self, host='127.0.0.1', port=50100, debug=False):
        '''Run the bot.

        Arguments:
            host (string): liac-soccer host address, default to '127.0.0.1'.
            port (int): liac-soccer port address, default to 50100.
            debug (bool): if True then shows debug messages, default to False.
        '''
        
        print '[INFO]: Starting bot. Use CTRL+C (or CTRL+Z, or CTRL+D, '+\
              'depending on the platform) to interrupt the execution.'

        # set a random name for the bot if not provided by the developer
        name = self.name
        if name is None:
            name = random.choice(random_names)

        if debug:
            print '[DEBUG]: A random name were defined for this bot: '+\
                  '"%s".'%name

        # create connection
        if debug: '[DEBUG]: Connect to server at <%s:%d>.'%(host, port)
        conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        conn.connect((host, port))
        if debug: '[DEBUG]: Connection established.'
        
        conn.send(json.dumps({'name':name}))
        if debug: '[DEBUG]: Server now knows this bot as "%s".'%name

        while True:
            # receives data from server
            data = json.loads(conn.recv(4096))
            if debug:
                print '[DEBUG]: Received the state:'
                print '        ', data

            # if server returns a bad move, stops the bot
            if (data['type'] != 'state'):
                raise ValueError('Server just sent an error: '+\
                                 '"%s"'%data['message'])
            
            # grab the bot movement
            pack = self.act(data)

            # if the bot returns an invalid object
            if not isinstance(pack, (tuple, list)) or len(pack) != 2:
                raise ValueError('Please return a tuple with (force, steer) '+\
                                 'from the "act" method.')

            # send movement
            move = dict(turn=data['turn'], force=pack[0], steer=pack[1])
            if debug:
                print '[DEBUG]: Sending move:'
                print '        ', move
            conn.send(json.dumps(move))














# import pprint
# import random

# s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# s.connect(('localhost', 50100))


# name = 'Bot No=%d'%(random.random()*100000);
# s.send(json.dumps({'name':name}))

# while True:
#     string = s.recv(1024)
#     data = json.loads(string)
#     # pprint.pprint(data)

#     if (data['type'] != 'state'): break

#     move = dict(
#         turn=data['turn'],
#         force=1,
#         steer=1
#     )
#     # print move
#     # s.send('sdhfuisad')
#     s.send(json.dumps(move))