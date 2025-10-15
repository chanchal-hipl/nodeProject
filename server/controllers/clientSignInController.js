const Client = require('../models/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.showClientForm = (req, res) => {
    res.render('login');
}

exports.handleLogin = async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ error: 'All field required'});
    }

    try{
        const client = await Client.findOne({ email });

        if(!client){
            return res.status(400).json({ error: 'Invalid credentials'})
        }

        const token = jwt.sign({ clientId: client._id}, 'secretkey', {expiresIn: '1h'});
        res.json({ success:true, message: 'Login Sucessful', token})
    }catch(err){
        res.status(500).json({ error:'server error' });
    }
};