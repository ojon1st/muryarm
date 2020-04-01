module.exports = {

    DATABASE: process.env.NODE_ENV == 'production'
        ? 'mongodb+srv://db_user_for_dev:44fg3PHa@muryarmapp-8uovr.mongodb.net/test?retryWrites=true&w=majority'
        : 'mongodb://localhost:27017,localhost:27018,localhost:27019/muryarmatassa?replicaSet=rs',

    CAS_CONFIRMES: 22,
    CAS_GUERIS: 0,
    CAS_DECEDES: 3


};