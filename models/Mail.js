const
    path = require('path'),
    nodemailer = require('nodemailer'),
    Config = require(path.join(__dirname, '/../configs/config'))
;

module.exports = {
    server: {
        host: Config.DEFAULT_EMAIL_SERVER_ADRESS,
        port: Config.DEFAULT_EMAIL_SERVER_PORT,
        secure: (Config.DEFAULT_EMAIL_SERVER_PORT * 1 == 465),
        auth: {
            user: Config.DEFAULT_EMAIL_USERNAME,
            pass: Config.DEFAULT_EMAIL_PASSWORD
        }
    },
    init(server) {
        return nodemailer.createTransport(server || this.server);
    },
    async send(mail, server) {
        mail.to = ((typeof (mail.to) == 'string') ? mail.to : mail.to.join(', '));
        mail.pretty ? (mail.text = undefined) : (mail.html = undefined)
        return this.sendStatus(await this.init(server).sendMail(mail));
    },
    sendStatus(status) {
        console.log(status)
        let str = {
            success: false
        };
        if (status.response.substr(0, 3) === '250') {
            str.success = true;
            str.moreInfos = `Un e-mail vous a été envoyé avec des instructions pour réinitialiser votre mot de passe, veuillez le consulter dans votre boîte e-mail pour procéder à la récupération.`;
        } else {
            str.moreInfos = "Une erreur est survenue lors de l'envoi de l'e-mail.";
        }
        return str;
    }
};