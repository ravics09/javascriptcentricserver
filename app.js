const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');

// Use Middlewares in our app.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// import routers
app.use('/user', require('./routers/userRouter'));
app.use('/feed', require('./routers/feedRouter'));
app.use('/other', require('./routers/contactUsRouter'));

//Create Express web server
const port = process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 9090;
app.listen(port, () => {
    console.log('JavaScript Centric Server running on port ' + port);
});