const path = require('path');
const APIController = require(path.join(__dirname, '../controllers/api'));

module.exports.populate = (Router) => {

    Router.post('/userAdded',  [
        APIController.userAdded
    ]);

    Router.post('/pageVisited',  [
        APIController.pageVisited
    ]);
    
};