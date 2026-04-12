import ApiError from "../../../common/utils/api-error.js";
import Team from "../models/team.model.js";
import Sponsor from "../models/sponsor.model.js";
import TeamSponsor from "../models/team-sponsor.model.js";

const attachSponsor = async ({ teamId, sponsorId }) => {
    const team = await Team.findById(teamId)
    if (!team) throw ApiError.notFound("Team not found")

    const sponsor = await Sponsor.findById(sponsorId)
    if (!sponsor) throw ApiError.notFound("Sponsor not found")

    const existingTeamSponsor = await TeamSponsor.findOne({ teamId, sponsorId })
    if (existingTeamSponsor) throw ApiError.conflict("Team already has a sponsor")

    const teamSponsor = await TeamSponsor.create({ teamId, sponsorId })
    return teamSponsor

}


const detachSponsor = async ({ teamId, sponsorId }) => {
    const team = await Team.findById(teamId)
    if (!team) throw ApiError.notFound("Team not found")

    const sponsor = await Sponsor.findById(sponsorId)
    if (!sponsor) throw ApiError.notFound("Sponsor not found")

    const teamSponsor = await TeamSponsor.findOne({ teamId, sponsorId })
    if (!teamSponsor) throw ApiError.notFound("Team does not have a sponsor")

    await TeamSponsor.findByIdAndDelete(teamSponsor._id)
    return teamSponsor
}

export { attachSponsor, detachSponsor }