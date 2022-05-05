const { Router } = require('express');
const nodemailer = require('nodemailer');
const router = Router();
const {body, validationResult} = require('express-validator');

require('dotenv').config();

router.post('/send-email', [
    body('name','Ingrese un nombre y apellido completo')
        .exists()
        .notEmpty(),
    body('name','El nombre debe tener entre 5 y 30 caracteres')
        .isLength({min:5})
        .isLength({max:30}),
    body('email', 'Ingrese un correo Válido')
        .exists()
        .isEmail()
        .normalizeEmail(),
    body('phone', 'El teléfono debe ser un número')
        .isNumeric(),
    body('message','Ingrese un Mensaje')
        .exists()
        .notEmpty(),
    body('message','El mensaje debe contener mas de 5 caracteres') 
        .isEmpty()  
        .isLength({min:5}),
    body('message','El mensaje debe contener menos de 200 caracteres')    
        .isLength({max:200})
],  async (req, res) => {

    //const errors = validationResult(req);
    //if(!errors.isEmpty()){
        //res.status(400).json({errors: errors.array()});
        //console.log(errors)
    //}
    /*const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(req.body)
        const valores = req.body
        const validaciones = errors.array()
        res.render('index', {validaciones:validaciones, valores:valores})
    }*/

    const{ name, email, phone, message } = req.body;

    contentHTML = `
        <h1>Informacion de Usuario</h1>
        <ul>
            <li>Nombre del Usuario: ${name}</li>
            <li>Email del Usuario: ${email}</li>
            <li>Telefono: ${phone}</li>
        </ul>
        <p>Mensaje: ${message}</p>
    `;
    
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT,
        secure: true,
        auth:{
            user:process.env.USER_E,
            pass:process.env.PASSWORD_E
        },
        tls:{
            rejectUnauthorized: false
        }
    }); 

    const info = await transporter.sendMail({
        from: "Somebody<anovasupport@anovaconsultancy.com.co>",
        to: process.env.USER_R,
        subject:'CONTACT FORM USER',
        html: contentHTML
    });
    contentHTML1 = `
    <html><body>
    <table width='100%' bgcolor='#000000' cellpadding='0' cellspacing='0' border='0'>
    <tr><td>
    <table align='center' width='100%' border='0' cellpadding='0' cellspacing='0' style='max-width:650px; background-color:#1F1F1F; font-family:Verdana, Geneva, sans-serif;'>
                
    <thead>
        <tr height='80'>
        <th colspan='4' style='background-color:#1F1F1F; border-bottom:solid 1px #bdbdbd; font-family:Verdana, Geneva, sans-serif; color:#fafa00; font-weight:normal; font-size:34px;' >Sending Email with NodeJS</th>
        </tr>
    </thead>
    <tbody>
        <tr align='center' height='50' style='font-family:Verdana, Geneva, sans-serif; >
        <td style='background-color:#1F1F1F; text-align:center;'><a href='#' style='color:#bfbfbf; text-decoration:none;'>Information</a></td>
        <td style='background-color:#1F1F1F; text-align:center;'><a href='#' style='color:#bfbfbf; text-decoration:none;'>Services</a></td>
        <td style='background-color:#1F1F1F; text-align:center;'><a href='#' style='color:#bfbfbf; text-decoration:none;' >Us</a></td>
        <td style='background-color:#1F1F1F; text-align:center;'><a href='#' style='color:#bfbfbf; text-decoration:none;' >Contact</a></td>
        </tr>

        <tr>
        <td colspan='4' style='padding:15px; border-top:solid 1px #bdbdbd;''>
        <p style='font-size:30px; color:#ffff;'>Hi!  <span style='color:#fafa00;text-decoration:none'>${name} &lt;${email}&gt;</span>,<br>Welcome to our <span style='color:#fafa00; font-weight:normal;'>Web Site</span>.</p>
        <hr />
        <p style='font-size:25px; color:#bfbfbf;'>Your message has been sent successfully! We will contact you soon!</p>
        <p style='font-size:15px; font-family:Verdana, Geneva, sans-serif;color:#bfbfbf;'>Your Phone is: ${phone} <br> You sent the following message: <br>${message}.</p>
        <p style='font-size:20px; color:#bfbfbf;'>Team !&nbsp;</p>
        <p style='font-size:15px; color:#bfbfbf;  text-decoration:none;'>email&nbsp;
        <br>(+00) 0000<br><a style='text-decoration:none;' href='https://sending.com.co/'>sending.com.co</a></p>
        <div>
            <a style='text-decoration:none;' href='https://www.facebook.com/' target='_blank'>
                <figure><img src='https://anovaconsultancy.com.co/assets/img/icon-fb.png' alt='Logo'></figure>
            </a>
            <a  style='text-decoration:none;' href='https://www.instagram.com/' target='_blank'>
                <figure><img src='https://anovaconsultancy.com.co/assets/img/icon-ig.png' alt='Logo'></figure>
            </a>
            <a style='text-decoration:none;' href='https://twitter.com/' target='_blank' >
                <figure><img src='https://anovaconsultancy.com.co/assets/img/icon-tw.png' alt='Logo'></figure>
            </a>
            <a style='text-decoration:none;' href='https://api.whatsapp.com/' target='_blank'>
                <figure><img src='https://anovaconsultancy.com.co/assets/img/icon-wp.png' alt='Logo'></figure>
            </a>
        </div>
        <p><br><br>&nbsp;</p>

        </td>
        </tr>

    </tbody>
    </table>

    </td></tr>
    </table>
        
    </body></html>
    `;
    const info1 = await transporter.sendMail({
        from: "Somebody<anovasupport@anovaconsultancy.com.co>",
        to: email,
        subject:'[CONFIRMATION]: Your messege was sent',
        html: contentHTML1
    });
    console.log('messege was sent', info.messageId);
    console.log('messege was sent', info1.messageId);
    res.send('Your message was sent successfully');
})


module.exports = router;