# mqtt-to-ir

A node.js programm to send LIRC commands with values of mqtt

----

The program is fully customizable: See `config.example.js` and `src/lib/config.ts` for the syntax.

The program is stable and I am using it in a production environment, so there should be no errors


### Usage

1. download repo to a raspberry pi for example
2. `npm ci` to install packages
3. `npm run build` to build typescript files into javascript files
4. Configure your needs in a `config.js` file
5. `node .` to start the program


### Todo (if somebody needs it - or I have time)

- [ ] Better documentation!
- [ ] Unit tests
- [ ] config validator for `config.js`
- [ ] make lirc connection configurable
- [ ] Docker build


If you need additional features, create an Issue or contact me.

&copy; 2022 Trickfilm400 
