const UserRepository=require('../repository/user-repository');
const jwt=require('jsonwebtoken');
const {JWT_KEY}= require('../config/serverConfig');
const bcrypt=require('bcrypt');
class UserService{
    constructor(){
        this.userRespository=new UserRepository();
    }
    async create(data){
       try {
             const result=await this.userRespository.create(data);
              return result;
       } catch (error) {
        console.log("something went wrong in service layer");
        throw error;
       }
    }
    async destroy(userId){
        try {
            const result =await this.userRespository.destroy(userId);
            return result;
        } catch (error) {
         console.log("something went wrong in service layer");
         throw error;
        }
    }
    async signIn(email,plainPassword){
        try {
             const user=await this.userRespository.getByEmail(email);
             const passwordMatch=this.checkPassword(plainPassword,user.password);
             if(!passwordMatch)
             {
                console.log("Password doesn't match");
                throw{error:"Incorrect password"};
             }
             const newJwt= this.createToken({email:user.email,id:user.id});
             return newJwt;
        } catch (error) {
            console.log("something went wrong in service layer");
            throw error; 
        }
    }
    async isAuthenticated(token){
        try {
              const response=this.verifyToken(token);
              if(!response){
                throw{error:'Invalid token'}
              }
              const user=await this.userRespository.getById(response.id);
              if(!user){
                throw{error:'No user with the corresponding token exists'};
              }
              return user.id;
        } catch (error) {
            console.log("something went wrong in service layer");
            throw error; 
        }
    }
    createToken(user){
        try {
            const result=jwt.sign(user,JWT_KEY,{expiresIn:'1h'});
            return result;
        } catch (error) {
            console.log("something went wrong in service layer");
            throw error;
        }
    }
    verifyToken(token){
        try {
            const response=jwt.verify(token,JWT_KEY);
            return response;
        } catch (error) {
            console.log("something went wrong in service layer");
            throw error;
        }
    }
    checkPassword(userInputPlainPassword,encryptedPassword){
        try {
            return bcrypt.compareSync(userInputPlainPassword,encryptedPassword);

        } catch (error) {
            console.log("something went wrong in service layer");
            throw error;
        }
    }

}

module.exports=UserService;