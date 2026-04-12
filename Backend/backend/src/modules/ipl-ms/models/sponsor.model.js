import mongoose from 'mongoose';

const SponsorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Sponsor name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    
}, { timestamps: true });

export default mongoose.model('Sponsor', SponsorSchema);