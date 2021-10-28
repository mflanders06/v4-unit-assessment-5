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
                    return res.status(500).json('Email account already in use');
                }
                const salt = bcryptjs.genSaltSync(10)
                const hash = bcryptjs.hashSync(password, salt)
                await db.user
                    .createUser(
                        username,
                        hash,
                        profile_pic
                    )
                    .then((dbUser) => {
                        req.session.user = dbUser[0];
                        res.status(200).json('registered');
                    })
                    .catch((err) => {
                    console.log(err)
                    }
                    )
            })
    },

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
                req.session.user = dbUser[0];
                res.status(200).json(req.session.user);
            })

    },

    logout: (req, res) => {
        req.session.destroy();
        res.status(200).json('logout');
    },

    getUser: (req, res) => {
        if(req.session.username){
            res.status(200).json(req.session.user)
        }else{
            res.status(404).json('Session not found');
        }
    }

}