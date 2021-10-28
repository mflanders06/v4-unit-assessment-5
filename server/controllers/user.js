const bcryptjs = require('bcryptjs');

module.exports = {

    register: async (req, res) => {
        const { username, password, profile_pic } = req.body;
        //const profile_pic = `https://robohash.org/${username}.png`;
        const db = req.app.get('db');

        await db.user
            .find_user_by_username(username)
            .then (async (dbUser) => {
                if (dbUser.length > 0) {
                    return res.status(409).json('Email account already in use');
                }
                const salt = bcryptjs.genSaltSync(10)
                const hashPass = bcryptjs.hashSync(password, salt)
                await db.user
                    .create_user(
                        username,
                        hashPass,
                        profile_pic
                    )
                    .then((dbUser) => {
                        delete dbUser.password
                        req.session.user = dbUser[0];
                        res.send(req.session.user);
                    })
                    .catch((err) => {
                    console.log(err)
                    }
                    )
            })
    },
/*
    login: async (req, res) => {
        const { username, password } = req.body;
        const db = req.app.get('db');

        await db.user
            .find_user_by_username(username)
            .then((dbUser) => {
                if(!(dbUser.length > 0)){
                    return res.status(401).json('Username or password do not match our records');
                }
                const isEqual = bcryptjs.compareSync(password, dbUser[0].password);
                if(!isEqual){
                    return res.status(401).json('Username or password do not match our records');
                }
                delete dbUser[0].password;
                req.session.user = dbUser[0];
                res.status(200).json(req.session.user);
            })
            .catch((err) => {
                console.log(err)
            })
    },
*/

login: async (req, res) => {
    try {
        const db = req.app.get('db')
        let { username, password } = req.body

        let users = await db.user.find_user_by_username(username)
        let user = users[0]

        if (!user) {
            return res.status(401).send('username or password incorrect')
        }

        let isAuthenticated = bcryptjs.compareSync(password, user.password)

        if (!isAuthenticated) {
            return res.status(401).send('username or password incorrect')
        }

        delete user.password
        req.session.user = user
        res.send(req.session.user)
        
    } catch (error) {
        console.log('there was an error', error)
        res.status(500).send(error)
    }

},

    logout: (req, res) => {
        req.session.destroy();
        res.status(200).json('logout');
    },

    getUser: async (req, res) => {
        await req.app.get('db').user.find_user_by_username(req.session.username)
        .then(user => res.status(200).send(user[0]))
    }

}