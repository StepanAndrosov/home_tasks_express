import nodemailer from "nodemailer";

type SendAction = 'confirmation' | 'resend' | undefined
const getSendText = (code: string, action: SendAction) => {
    let text = ''
    switch (action) {
        case 'resend':
            text = `
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href='https://somesite.com/confirm-email/confirm-email?code=${code}'>complete registration</a>
                </p>
                `
        case 'confirmation':
            text = `
                <h1>Password recovery</h1>
                <p>To finish password recovery please follow the link below:
                    <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
                </p>
                `
        default:
            text = `
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href='https://somesite.com/confirm-email/confirm-email?code=${code}'>complete registration</a>
                </p>
                `
    }

    return text
}

export const emailAdapter = {
    async sendMail(to: string, code: string, action: SendAction) {
        // send mail with defined transport object
        const transporter = nodemailer.createTransport({
            // service: 'gmail',
            // auth: {
            //     user: "stepan.news@gmail.com", // s37680930@gmail.com"
            //     pass: "usvo lnlv atqa cnyb", // u67447099
            // },
            // transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            ignoreTLS: true,
            auth: {
                user: "stepan.news@gmail.com", // s37680930@gmail.com"
                pass: "usvo lnlv atqa cnyb",
            },
            //   },
        });
        try {
            const info = await transporter.sendMail({
                from: '"Blogs.com 👻" <s37680930@gmail.com>', // sender address
                to, // receiver address
                subject: "Registration confirmation code", // subject line
                html: getSendText(code, action),
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <0fabc72f-0314-8d3c-ae85-5fcd77d35454@gmail.com>
            return true
        } catch (err) {
            return false
        }
    },
}

