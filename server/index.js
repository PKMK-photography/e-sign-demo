require('dotenv').config();
const express = require('express'),
      nodemailer = require('nodemailer'),
      app = express();

app.use(express.json({type: ['application/json', 'image/png'], limit: '500kb'}));

app.post('/api/email', async function(req, res){
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
            from: `E-sign Test`,
            to: process.env.EMAIL,
            subject: 'Test',
            text: 'This is a test',
            html: `<div>
                    <p>This is a test</p>
                   </div>`,
            attachments: [{
                href: image,
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
})

app.listen(3333, () => console.log('Server running'))