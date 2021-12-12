const nodemailer = require("nodemailer");
const { MongoClient, MongoRuntimeError } = require("mongodb")
const client = new MongoClient("mongodb+srv://@voiceappproject.ufffs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useUnifiedTopology: true});


async function verifyEmail(Email, Username, code, res){
    
    const user = 
    
    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth:{
            user: user,
            pass: 
        }
    })

    transport.sendMail({
        from: user,
        to: Email,
        subject: "Please verify your email",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${Username}</h2>
        <p>Thank you for joining. Please confirm your email by clicking on the following link</p> 
        <a href=http://localhost:4000/confirm/${code}> Click here</a>`
    }).catch(err => console.log(err));

    res.sendFile('views/verifyemail.html', {root: __dirname })
}

async function confirmUser(req, res){
    try{
        await client.connect();
         
        const database = client.db("users")
        const userInformation = database.collection("userInformation")
        const findExisting = await userInformation.findOne({
            confirmationCode: req.params.confirmationCode
        })
         	
        if(findExisting == null){
            res.sendFile('views/confirmemailfailed.html', {root: __dirname })
        }else{
            await userInformation.updateOne(
                {confirmationCode:req.params.confirmationCode}, 
                { $set:{confirmationCode:"", accountActive:true, creation_date:null}}
            )
            res.sendFile('views/confirmemailsuccess.html', {root: __dirname })
        }
    } catch (e) {
        console.error(e);
    }finally {
        await client.close();
    }
}

module.exports = { verifyEmail , confirmUser}