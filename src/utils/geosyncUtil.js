const { PrismaClient, MatchType } = require("@prisma/client");
const prisma = require("./prisma");

const matching = async (user) => {
  try {
    const matches = user.matches;
    const autoMatches = [];
    const manualMatches = [];
    const responseList = [];

    const profiles = await prisma.profile.findMany({
      where: {
        id: {
          in: matches.map((match) => match),
        },
      },
    });

    for (const profile of profiles) {
      const correspondingMatch = profiles.find((p) => p.matches[0] === user.id);
      const isNo1MatchForUser = profile.matches[0] === user.id;
      const isUserNo1Match = user.matches[0] === profile.id;

      const isAutoMatch =
        isNo1MatchForUser && isUserNo1Match && correspondingMatch;

      const isManualMatch =
        !isAutoMatch &&
        user.matches.includes(profile.id) &&
        profile.matches.includes(user.id);

      if (isAutoMatch) {
        autoMatches.push({
          profile1Id: profile.id,
          profile2Id: user.id,
          status: "AUTOMATCH",
        });
        responseList.push({
          profile1Id: profile.id,
          profile1picture: profile.profilePicture,
          profile2Id: user.id,
          profile2picture: user.profilePicture,
          status: "AUTOMATCH",
        });
      }

      if (isManualMatch) {
        manualMatches.push({
          profile1Id: profile.id,
          profile2Id: user.id,
          status: "MANUALMATCH",
        });
        responseList.push({
          profile1Id: profile.id,
          profile1picture: profile.profilePicture,
          profile2Id: user.id,
          profile2picture: user.profilePicture,
          status: "MANUALMATCH",
        });
      }
    }

    console.log("Auto Matches:", autoMatches);
    console.log("Manual Matches:", manualMatches);
    await prisma.match.createMany({ data: [...autoMatches, ...manualMatches] });

    return { responseList };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  matching,
};
