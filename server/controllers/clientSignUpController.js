const Client = require('../models/client');
const bcrypt = require('bcryptjs');

exports.showClientForm = (req, res) => {
    res.render('register');
};

exports.handleRegister = async (req, res) => {
    const { name, email, contact_number, address, password, confirm_password } = req.body;

    if(!name || !email || !contact_number || !address || !country_name || !orgnization_name || !password || !confirm_password){
        return res.status(404).json({ error: "All filed are required"});
    }

    if(password !== confirm_password) {
        return res.status(400).json({ error:'Password do not match' });
    }

    try{
        const existingClient = await Client.findOne({ email });
        if(existingClient) {
            return res.status(400).json({ error: 'Email already exist'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const client = new Client ({
            name,
            email,
            contact_number,
            address,
            country_name,
            orgnization_name,
            password:hashedPassword,
        });
        await client.save();
        res.json({ sucess: true, message:'Registration successful'})
    } catch( err){
        res.status(500).json({ error:'server error'});
    }




}