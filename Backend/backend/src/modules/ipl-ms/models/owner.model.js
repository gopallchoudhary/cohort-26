import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    company: {
        type: String,
        required: [true, 'Company is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },

}, { timestamps: true });


export default mongoose.model('Owner', OwnerSchema);