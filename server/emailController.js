const nodemailer = require('nodemailer');

module.exports = {
    email: async(req, res) => {
        const {image} = req.body;

        try {
            let transporter = nodemailer.createTransport({
                host: 'stmp.gmail.com',
                port: 587,
                service: 'gmail',
                secure: false,
                requireTLS: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            })

            let info = await transporter.sendMail({
                from: `E-sign Demo`,
                to: process.env.EMAIL,
                subject: 'Test',
                text: 'Test',
                html: `<div>
                        <img src=cid:banner/>
                        <p>This is an e-sign demo</p>
                       </div>`,
                attachments: [{
                    path: URL.createObjectURL(image),
                    cid: 'banner'
                }]
            }, (err, res) => {
                if(err){
                    console.log(err)
                } else {
                    res.status(200).send(info);
                }
            })
        } catch(err){
            res.status(500).send(err);
        }

        res.sendStatus(200);
    }
}