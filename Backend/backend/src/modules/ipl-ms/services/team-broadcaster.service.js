import ApiError from "../../../common/utils/api-error.js";
import Team from "../models/team.model.js";
import Broadcaster from "../models/broadcaster.model.js";
import TeamBroadcaster from "../models/team-broadcaster.model.js";

const attachBroadcaster = async ({ teamId, broadcasterId }) => {
    const team = await Team.findById(teamId)
    if (!team) throw ApiError.notFound("Team not found")

    const broadcaster = await Broadcaster.findById(broadcasterId)
    if (!broadcaster) throw ApiError.notFound("Broadcaster not found")

    const existingTeamBroadcaster = await TeamBroadcaster.findOne({ teamId, broadcasterId })
    if (existingTeamBroadcaster) throw ApiError.conflict("Team already has a broadcaster")

    const teamBroadcaster = await TeamBroadcaster.create({ teamId, broadcasterId })
    return teamBroadcaster
}


const detachBroadcaster = async ({ teamId, broadcasterId }) => {
    const team = await Team.findById(teamId)
    if (!team) throw ApiError.notFound("Team not found")

    const broadcaster = await Broadcaster.findById(broadcasterId)
    if (!broadcaster) throw ApiError.notFound("Broadcaster not found")

    const teamBroadcaster = await TeamBroadcaster.findOne({ teamId, broadcasterId })
    if (!teamBroadcaster) throw ApiError.notFound("Team does not have a broadcaster")

    await TeamBroadcaster.findByIdAndDelete(teamBroadcaster._id)
    return teamBroadcaster
}

export { attachBroadcaster, detachBroadcaster }