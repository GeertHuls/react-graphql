import express from 'express';

let app = express();

app.get('/', (req, res) => res.send('Hello express!'));

app.listen(3000);



//http://stackoverflow.com/questions/33624104/how-do-i-setup-babel-6-with-node-js-to-use-es6-in-my-server-side-code
//http://stackoverflow.com/questions/28782656/how-to-run-node-js-app-with-es6-features-enabled/29415291#29415291

