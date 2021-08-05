const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '522608370026-qufh6u45n97l5on56mvbu59nu246dnjp.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const PORT = process.env.PORT || 5000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res)=>{
    token = req.body.token;
    // console.log(token);

    verify()
    .then(()=>{
        res.cookie('session-token', token);
        res.send('success');
    }).
    catch(console.error);
});

app.get('/dashboard', checkAuthenticated, (req, res)=>{
    let user = req.user;
    res.render('dashboard', {user});
});

app.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/login');
});

function checkAuthenticated(req, res, next){
    token = req.cookies['session-token'];

    verify()
    .then(()=>{
        req.user = user;
        next();
    }).
    catch(err =>{
        res.redirect('/login');
    });
}

let user = {};
async function verify(){
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID // Specify client_id
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    user.name = payload.name;
    user.email = payload.email;
    user.picture = payload.picture;
    console.log(payload);
}

app.listen(PORT, () => {
    console.log(`Server running on post ${PORT}`);
});