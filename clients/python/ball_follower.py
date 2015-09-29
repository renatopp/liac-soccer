import base
import math

class MyBot(base.BaseBot):
    # The bot name
    name = 'Ball follower'

    def act(self, state):
        # Get angle between robot and ball
        x = state['ball']['x'] - state['player']['position']['x']
        y = -state['ball']['y'] + state['player']['position']['y']
        th = state['player']['angle']
        angle = math.degrees(math.atan2(x, y)) - th
        
        # Normalize angle to keep it between -180 and 180
        while angle <= -180:
            angle += 360

        while angle > 180:
            angle -= 360

        # Compute the force and steer of the robot
        force = 1
        steer = math.tanh(4*angle/180) # uses a sigmoid to smooth the steer

        # Return the command movement
        return (force, steer)

## Run the robot
MyBot().run()