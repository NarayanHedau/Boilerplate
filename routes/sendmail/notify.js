const log = require('../../helper/logger');
var nodemailer = require('nodemailer');
let config = require('../../config.json');
var fs = require('fs');

// router.post('/', (req, res) => {
module.exports = {
    sendMail: (data) => {
        return new Promise((resolve, reject) => {
            log.debug('/api/sendnotification/', data);
            console.log(config.auth.user, config.auth.pass);
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.auth.user,
                    pass: config.auth.pass
                }
            });
            var mailOptions = {
                from: data.from,
                to: data.email,
                subject: data.subject,
                html: data.out,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(info.response)
                }
            });
        })
    }
}
// });
// module.exports = router;
// {
//     out: "body",
//     subject: "subject",
//     email: "email",
//     from: ""
// }