const router = require('../routes');

module.exports = (app) => {
    
    app.use('/api/add-file', router.post);
    // app.use('/api', router.get);

    // Handle React routing, return all requests to React app
    // app.get('*', function(req, res) {
    //     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    // });
    // app.use('*', (req, res, next) => res.send('<h1>You know, somehting went wrong :thumbsdown: </h1>'));
};
