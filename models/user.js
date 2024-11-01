
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true,
    },
    roll_no : {
        type : String,
        required : true
    },
});

userSchema.pre('save', async function(next){
    const user = this;

    // hash the password only if it has been modified (or is new)
    if( !user.isModified('password')) return next();

    try {
        // hash password generation 
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(user.password,salt);

        // override the plain password with the hashed one
        user.password = hashedPassword;
        next();

    } catch (error) {
         next(error);

    }
});

userSchema.methods.comparePassword = async function(userPassword) {
    try {
        return await bcrypt.compare(userPassword, this.password);
    } catch (error) {
        throw new Error('Error while comparing passwords');
    }
};

const User = mongoose.model("User",userSchema);

module.exports = User;