# LIAC-SOCCER

Version 1.0.0

Liac-soccer is being developed by the Connectionist Artificial Intelligence Laboratory (LIAC), which takes place at Federal University of Rio Grande do Sul (UFRGS), Brazil. This software was designed to be used in didactic activities for neural network and fuzzy systems classes. The goal of Liac-soccer is to provide a soccer sandbox so students can test their algorithms.

Documentation: http://inf.ufrgs.br/~rppereira/docs/liac-soccer/


## Requirements (for developers)

- NodeJS
- Node-Webkit
- Bower

### Running liac-soccer (in development mode)

After downloading the source, run:

    npm install

and:

    bower install

The former installs a bunch of NodeJS modules, which are used on the building system and some dependences of the desktop application. The last installs the javascript vendor libraries, such as Bootstrap and JQuery.

During development you can run this app in a web browser, which makes things easier to test (but notice that most features won't work). To do this, you need to run:

    gulp serve

which will run a web server hosted on `http://127.0.0.1:8000`.

To run the desktop version (with all features enabled):

    gulp nw

### Building the final application

Just run:

    gulp build
