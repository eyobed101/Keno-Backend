import mongoose from "mongoose";

const superadminSchema = new mongoose.Schema({
    superadminID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      NumberOfAdmin :{
        type: Number,
        required: true,
      }
  
});

const Superadmin = mongoose.model('Superadmin', superadminSchema);

export default Superadmin;