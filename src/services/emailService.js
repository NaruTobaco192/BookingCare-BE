require('dotenv').config();
import nodemailer from 'nodemailer'

let sendEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Long Nguyen 👻" <oneforallntl1902@gmail.com>', // sender address
        to: dataSend.receiversEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend), // html body
    });
}
let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đă đăt lịch khám bệnh online trên BookingCare</p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu chính bạn là người đặt lịch, vui lòng nhấn vào đường link bên dưỡi để xác nhận
        và hoàn tất thủ tục
        </p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click Here</a>
        </div>
        <div>Xin chân thành cảm ơn</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.patientName}!</h3>
         <p>You received this email because you booked an online medical appointment on BookingCare</p>
         <p>Information for appointment booking</p>
         <div><b>Time: ${dataSend.time}</b></div>
         <div><b>Doctor: ${dataSend.doctorName}</b></div>
         <p>If you are the one who booked the appointment, please click the link below to confirm
         and complete the procedure
         </p>
         <div>
         <a href=${dataSend.redirectLink} target="_blank">Click Here</a>
         </div>
         <div>Thank you very much</div>
        `
    }
    return result;
}
let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Long Nguyen 👻" <oneforallntl1902@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả đặt lịch khám bệnh", // Subject line
                html: getBodyHTMLEmailPrescription(dataSend), // html body
                attachments: [
                    {
                        filename: `${dataSend.patientId}-${dataSend.name}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    },
                ],
            });
            resolve({
                errCode: 0
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getBodyHTMLEmailPrescription = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.name}!</h3>
        <p>Bạn nhận được email này vì đă đăt lịch khám bệnh online thành công trên BookingCare</p>
        <p>Thông tin chi tiết đơn thuốc/hóa đơn được gửi trong file đính kèm</p>
        </div>
        <div>Xin chân thành cảm ơn</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Hello ${dataSend.name}!</h3>
         <p>You received this email because you booked an online medical appointment on BookingCare</p>
         <p>Information for appointment booking</p>
         </div>
         <div>Thank you very much</div>
        `
    }
    return result;
}
module.exports = {
    sendEmail, sendAttachment
}