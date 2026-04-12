import mongoose from 'mongoose';

const   TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: [true, 'Owner is required'],
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    }],
}, { timestamps: true });

export default mongoose.model('Team', TeamSchema);