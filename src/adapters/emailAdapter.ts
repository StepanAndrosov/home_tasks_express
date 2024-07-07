import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendMail(to: string, confirmationCode: string) {
        // send mail with defined transport object
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "stepan.news@gmail.com", // s37680930@gmail.com"
                pass: "usvo lnlv atqa cnyb", // u67447099
            },
        });
        try {
            const info = await transporter.sendMail({
                from: '"Blogs.com 👻" <s37680930@gmail.com>', // sender address
                to, // receiver address
                subject: "Registration confirmation code", // subject line
                html: `
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href='https://somesite.com/confirm-email/confirm-email?code=${confirmationCode}'>complete registration</a>
                </p>
                `,
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <0fabc72f-0314-8d3c-ae85-5fcd77d35454@gmail.com>
            return true
        } catch (err) {
            return false
        }


    }
}

