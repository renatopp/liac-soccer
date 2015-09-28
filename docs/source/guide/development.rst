Building and Packaging
======================


Dependences
-----------

Before running liac-soccer from source, make sure you have the following dependences:

- `NodeJS <https://nodejs.org>`_
- `Node webkit <http://nwjs.io>`_
- `Node webkit builder <https://github.com/nwjs/nw-builder>`_
- `Bower <http://bower.io>`_

After downloading the source code at 

https://github.com/renatopp/liac-soccer

Run the following commands on the terminal (at the liac-soccer folder)::

    $ npm install
    $ bower install

The former installs a bunch of NodeJS modules, which are used on the building system and some dependences of the desktop application. The last installs the javascript vendor libraries, such as Bootstrap and JQuery.


Development environment
-----------------------

During development you can run this app in a web browser, which makes things easier to test (but notice that most features won't work). To do this, you need to run::

    gulp serve

which will run a web server hosted on `http://127.0.0.1:8000`.

To run the desktop version in development (with all features enabled), you can call::

    gulp nw


Building and packaging
----------------------

In order to build and package the liac-soccer final version, you must call::

    gulp dist

which will create a folder called `dist`, containing all binaries of the app. If you want to compile to a specific platform, please change the file `gulpfile.js`.
