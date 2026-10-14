const bcrypt = require('bcrypt');

const hashpassword = async(password)=>{
    return await bcrypt.hash(password,10);
}

const matchpassword = async(password, savedpassword)=>{
    return await bcrypt.compare(password, savedpassword);
}

module.exports= {hashpassword, matchpassword};