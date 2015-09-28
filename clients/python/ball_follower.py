
import base

class MyBot(base.BaseBot):
    name = 'Ball follower'

    def act(self, state):
        # my code here
        
        return (1, 1)


MyBot().run(debug=True)