const models = require('../models');
// const config = require('../config/index');
const utils = require('../utils');


module.exports = {
    get: (req, res, next) => {
        // const getJWT = async () => {
        //     const {data} = await get('/');
        //     setJwt(data.token)
        // }
        models.Post.find()
            .then((posts) => {
                
                console.log(posts);

                res.send(posts.reverse());
            })
            .catch(next);       
    },

    post: (req, res, next) => {
        const {meta, finalHash, chainHash, drip, bnbValue} = req.body;
        console.log(req.body);
        models.Post.create({meta, finalHash, chainHash, drip, bnbValue}).then((createdTransaction) => {
            console.log(createdTransaction);
            res.send(createdTransaction);

        }).catch(next);
        // let verified = utils.jwt.verifyToken().then((response) => {

        //     if(response.id !== '') {
        //     const  _id  = response.id;
        //     const name = response.name;

        //     console.log(response);
        //     console.log(name);

        //     models.Post.create({ img, title, text, author: _id, date })
        //     .then((createdPost) => {
        //         // console.log(createdPost._id);
        //         // console.log(_id);
        //         console.log(name);

        //         models.User.updateOne({ _id:_id }, { $push: { posts: createdPost } }).then((serverResponse) => {
        //             console.log(serverResponse);
        //         });

        //         models.Post.findOne({ _id: createdPost._id });
        //         res.send({createdPost, name});

        //     }).catch(next);
        //     }
        // });

        // console.log(verified);
        // console.log(_id);
        // console.log(author);
        // let cookieToken = req.cookie.get(config.authCookieName);
        // const token = utils.jwt.verifyToken(cookieToken);
        // console.log(cookieToken);

        
    },

    put: (req, res, next) => {
        // const id = req.params.id;
        // const { description } = req.body;
        // models.Post.updateOne({ _id: id }, { description })
        //     .then((updatedPost) => res.send(updatedPost))
            // .catch(next);
    },

    delete: (req, res, next) => {
        // const id = req.params.id;
        // models.Post.deleteOne({ _id: id })
        //     .then((removedPost) => res.send(removedPost))
        //     .catch(next);
    }
};