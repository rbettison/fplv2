import User from "../db/entities/User";
import connectToDatabase from "../db/mongoConn"

async function createUser(user: 
        {
            name: String, 
            email: String, 
            password: String
        }) {

    try {
        connectToDatabase();
        return User.create(user);
    } catch (err) {
        console.log(err);
    }
}

async function userExists(email: String) {
    try {
        connectToDatabase();
        const user = await User.findOne({email}).select("_id");
        console.log('User found in db: ' + user);
        return user;
    } catch (err) {
        console.log(err);
    }
}

async function userLeagues(email: String) {
    try {
        connectToDatabase();
        console.log('email: ' + email);
        const leagues = await User.findOne({email}).select("leagues");

        return leagues;
    } catch (err) {
        console.log(err);
    }
}


export {createUser, userExists, userLeagues}