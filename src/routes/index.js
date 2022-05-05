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
        from: "ANOVA SERVER<anovasupport@anovaconsultancy.com.co>",
        to: process.env.USER_R,
        subject:'FORMULARIO DE CONTACTO ANOVA WEB',
        html: contentHTML
    });
    contentHTML1 = `
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
        <h1>Bienvenido a <span style="color:rgb(240, 206, 12); font-weight:bold;">ANOVA CONSULTANCY</span></h1>
        <h2>Hola, ${name} <${email}><br>
        Tu mensaje fue enviado con éxito! Pronto nos contactaremos contigo!
        </h2>
        <p>Enviaste el siguiente Mensaje:<br> ${message}</p>
        <h3><br>Equipo Anova Consultancy&nbsp;</h3>
        <p>anovaconsultancy@anovaconsultancy.com.co&nbsp;
            <br>(+57) 3168061123
            <br><a href="https://anovaconsultancy.com.co/">anovaconsultancy.com.co</a>
        </p>
        <div class="home__social">
            <a href="https://www.facebook.com/williamarmando.bautistafarias.5" target="_blank" class="home__social-link fb">
                <img src="https://anovaconsultancy.com.co/assets/img/icon-fb.png" alt="Logo"></figure>
            </a>
            <a href="https://www.instagram.com/williamarmandobautista/" target="_blank" class="home__social-link ig">
                <img src="https://anovaconsultancy.com.co/assets/img/icon-ig.png" alt="Logo"></figure>
            </a>
            <a href="https://twitter.com/" target="_blank" class="home__social-link tw">
                <img src="https://anovaconsultancy.com.co/assets/img/icon-tw.png" alt="Logo"></figure>
            </a>
            <a href="https://api.whatsapp.com/send?phone=573168061123" target="_blank">
                <img src="https://anovaconsultancy.com.co/assets/img/icon-wp.png" alt="Logo"></figure>
            </a>
        </div>
        <p><br><br>&nbsp;</p><figure class="image"><img src="https://anovaconsultancy.com.co/assets/img/ABC.png" alt="Logo"></figure>
    `;
    const info1 = await transporter.sendMail({
        from: "ANOVA SERVER<anovasupport@anovaconsultancy.com.co>",
        to: email,
        subject:'[CONFIRMACIÓN]: Tu mensaje has sido enviado exitosamente',
        html: contentHTML1
    });
    console.log('Mensaje enviado', info.messageId);
    console.log('Mensaje enviado', info1.messageId);
    res.send('Tu Mensaje fue enviado con Éxito');
})


module.exports = router;