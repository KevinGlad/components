const express = require('express');
const router = express.Router();
const db = require('../../../db/mongoose')
const bcrypt = require('bcrypt')
const { makeToken, verifyToken } = require('../../../bin/jwt')
const passport = require('passport')
const {uriServer} = require("../../../bin/consts")

/* GET  all users listing. */
router.get('/', function (req, res, next) {
    let readObj = {
        usersCollection: req.app.locals.usersCollection
    }

    db.readAll(readObj)
        .then(response => {
            res.json(response)
        })
        .catch(error => {
            console.log(error)
            res.json(500)
        })
});

// GET a user
router.get('/:id', function (req, res, next) {

    let readObj = {
        id: req.params.id,
        usersCollection: req.app.locals.usersCollection
    }

    db.readOne(readObj)
        .then(response => {
            res.json(response)
        })
        .catch(error => {
            res.status(500).json(error)
        })

});

// create a user
router.post('/signup', async function (req, res, next) {

    let newUser = { ...req.body }
    delete newUser.password
    let passwordHash = await bcrypt.hash(req.body.password, 13)

    newUser.passwordHash = passwordHash

    console.log({ newUser })

    let createObj = {
        doc: newUser,
        usersCollection: req.app.locals.usersCollection
    }
    db.create(createObj)
        .then(response => {
            res.json(response)
        })
        .catch(error => {
            res.status(500).json(error)
        })

});

// update a user
router.put('/:id', function (req, res, next) {

    let putObj = {
        id: req.params.id,
        doc: req.body,
        usersCollection: req.app.locals.usersCollection
    }

    db.readOne(putObj)
        .then(response => {

            if (response == null) {
                // add if not found
                db.create(putObj)

            } else {
                // update if found
                db.replace(putObj)
            }

        })
        .then(response => {
               res.json(response)
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

// login
router.post('/login', function (req, res, next) {

    console.log(req.body)
    db.findOne({ query: { email: req.body.email } })
        .then((user) => {

            bcrypt.compare(req.body.password, user.passwordHash)
                .then(match => {

                    if (match) {

                        makeToken(user)
                            .then(token => {
                                console.log("TOKEN")
                                console.log(token)
                                res.json({ token })

                            })


                    } else {

                        throw new Error("Bad Login")
                    }
                })
        })
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/googlelogin',
    passport.authenticate('google', { scope: ['profile', 'email'] })
    //passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/googlecallback',
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    function (req, res) {

        console.log("TOKEN", req.user)

        // google returns an array of emails, use the first one
        makeToken({ email: req.user.emails[0].value }) 
            .then(token => {
                res.redirect(`${uriServer}?token=${token}`);
            })
            .catch(error => {

                console.log(error)
                res.status(500)

            })

    });

router.post('/auth/verifytoken', verifyToken, function (req, res, next) {

    db.findOne({ query: { email: req.email } })

        .then((user) => {

            makeToken(user)
                .then(token => {
                    console.log("TOKEN")
                    console.log(token)
                    res.json({ token })

                })

        })
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})



// update a user
router.patch('/:id', async function (req, res, next) {

    let patchObj = {
        id: req.params.id,
        doc: req.body,
        usersCollection: req.app.locals.usersCollection
    }

    // check to see if we have an object with this id
    try {

        // see if we have one to update
        let response = await db.readOne(patchObj)

        // if we didn't find a record
        if (response == null) {

            throw new Error("Not Found")

        } else {

            // update the one we found
            await db.update(patchObj)

            // responde with the result from the db
            res.json(await db.readOne(patchObj))

        } // if not found

    } catch (error) {
        console.log(error)
        res.status(500).json(error)

    }
});

// delete a user
router.delete('/:id', verifyToken, function (req, res, next) {

    console.log("BODY")
    console.log(req.params)

    let deleteObj = {
        id: req.params.id,
        usersCollection: req.app.locals.usersCollection
    }

    db.del(deleteObj)
        .then(response => {

            console.log(response)
            // ToDo see if we throw the error
            // after res.json({})
            if (response.deletedCount == 1) {
                res.json({})
            } else {
                throw new Error("Not Deleted")
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500)
        })
});

module.exports = router;
