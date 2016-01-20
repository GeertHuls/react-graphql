import express from 'express';

let app = express();

app.get('/', (req, res) => res.send('Hello express!'));

app.listen(3000);
