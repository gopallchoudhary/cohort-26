import ApiError from "../../../common/utils/api-error.js";
import Player from "../models/player.model.js";
import Team from "../models/team.model.js";


const transferPlayer = async (playerId, newTeamId) => {
    const team = await Team.findById(newTeamId)
    if (!team) throw ApiError.notFound("Team not found")

    const player = await Player.findByIdAndUpdate(playerId, { teamId: newTeamId }, { new: true, runValidators: true }).populate('teamId', 'name')

    if (!player) throw ApiError.notFound("Player not found")

    return player
}


const updatePlayerRole = async (playerId, newRole) => {
    const player = await Player.findByIdAndUpdate(playerId, { role: newRole }, { new: true, runValidators: true }).populate('teamId', 'name')
    if (!player) throw ApiError.notFound("Player not found")
    return player
}