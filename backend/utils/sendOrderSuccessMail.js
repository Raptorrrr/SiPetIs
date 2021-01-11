import nodemailer from "nodemailer"
import inlineCss from 'inline-css'
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
const __dirname = path.resolve()

dotenv.config()

export const sendMail = (order) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "testperdanaemail@gmail.com", // generated ethereal user
            pass: 'ryugamine123A', // generated ethereal password
        },
    });


    ejs.renderFile(path.join(__dirname,'backend','email-templates',"success.ejs"), {order}, (err, data) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log('success-template rendered')
            fs.writeFile(`${order._id}.html`, data, (err) => {
                if (err) console.log(err)
                console.log('success-html genered and saved')
                fs.readFile(`${order._id}.html`, (err, data) => {
                    if (err) console.log(err)
                    else {
                        inlineCss(data, {url: './', removeHtmlSelectors: true})
                            .then(function (html) {
                                const options = {
                                    from: process.env.MAIL_ID,
                                    to: order.shippingAddress.email,
                                    subject: "Your Order Payment has been Successful ✔",
                                    html: html
                                }
                                transporter.sendMail(options, function (err, info) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('Message sent: ' + info.response);
                                    }
                                });
                            });
                    }
                })

            })

        }
    })


}