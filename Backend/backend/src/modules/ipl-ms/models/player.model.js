import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Player name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },

    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['batsman', 'bowler', 'allrounder', 'wicket-keeper'],
            message: 'Role must be batsman, bowler, fielder or keeper',
        }
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Team is required'],
    },

}, { timestamps: true });

export default mongoose.model('Player', PlayerSchema);