import mongoose from 'mongoose';

const TeamSponsorSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Team is required'],
    },
    sponsorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sponsor',
        required: [true, 'Sponsor is required'],
    },
}, { timestamps: true });

TeamSponsorSchema.index({ teamId: 1, sponsorId: 1 }, { unique: true });

export default mongoose.model('TeamSponsor', TeamSponsorSchema);