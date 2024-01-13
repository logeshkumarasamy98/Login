const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongodb");
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../templates'); // Corrected the typo in the variable name
const publicPath = path.join(__dirname, '../public');
const imagePath = path.join(__dirname, '../image');

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));
app.use('/image', express.static(imagePath));



app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    try {
        // Check if the user already exists
        const existingUser = await LogInCollection.findOne({ name: req.body.name });
        const file = await LogInCollection.findOne({ file: req.body.file });

        if (existingUser) {
            // If user already exists, redirect to login page with a notification
            res.status(200).render("login", {
                
                notification: 'User already exists. Please log in.' + file ,

            });
        } else {
            // If user doesn't exist, create a new user
            const newUser = new LogInCollection({
                name: req.body.name,
                password: req.body.password,
                file: req.body.file,
            });

            // Save the new user to the database
            await newUser.save();

            // Redirect to the login page with a success notification
            res.status(201).render("login", {
                notification: 'Signup successful! Please log in.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (check && check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` });
        } else {
            res.send("Incorrect password or user not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log('Server connected on port:', port);
});
