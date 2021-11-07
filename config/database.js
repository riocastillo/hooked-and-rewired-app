// config/database.js
const username  = 'user'
const password  = 'Rio12345'
const dbName    = 'demo-day'

module.exports = {
    'url' : `mongodb+srv://${username}:${password}@cluster0.bgwen.mongodb.net/${dbName}?retryWrites=true&w=majority`
};
