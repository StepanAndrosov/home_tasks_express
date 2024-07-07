import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "s37680930@gmail.com",
        pass: "u67447099",
    },
});

// async..await is not allowed in global scope, must use a wrapper
export const nodeMailerService = {
    async sendMail(to: string) {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Blogs.com 👻" <s37680930@gmail.com>', // sender address
            to, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }
}

