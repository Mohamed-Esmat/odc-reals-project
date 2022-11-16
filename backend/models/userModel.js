import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    
  },
  {
    timestamps: true,
  }
);

// userSchema.methods = {
//   // createToken() {
//   //   return jwt.sign(
//   //     {
//   //       _id: this._id,
//   //     },
//   //     constants.JWT_SECRET
//   //   );
//   // },
//   // toAuthJSON() {
//   //   return {
//   //     _id: this.id,
//   //     username: this.username,
//   //     token: this.createToken(),
//   //   };
//   // },
// };

const User = mongoose.model('User', userSchema);
export default User;
