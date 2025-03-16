const prisma = require("../utils/prisma");
const { ResponseHandler } = require("../utils/responseHandler");
const { matching } = require("../utils/geosyncUtil");

const updateOrderedProfiles = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { matches } = req.body;

    const user = await prisma.profile.update({
      where: { id: profileId },
      data: { matches: { set: matches } },
    });
    console.log("user", user);
    const userMatches = await matching(user);

    ResponseHandler.success(
      res,
      { userMatches },
      200,
      "Ordered profiles updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

const getMatches = async (req, res, next) => {
  try {
    const { profileId } = req.params;

    const matches = await prisma.match.findMany({
      where: { OR: [{ profile1Id: profileId }, { profile2Id: profileId }] },
      select: {
        user1: {
          select: {
            user: { select: { firstName: true, lastName: true } },
            profilePicture: true,
            dateOfBirth: true,
          },
        },
        user2: {
          select: {
            user: { select: { firstName: true, lastName: true } },
            profilePicture: true,
            dateOfBirth: true,
          },
        },
      },
    });
    console.log("matches", matches);

    const formattedMatches = matches.map((match) => {
      const user1 = {
        firstName: match.user1.user.firstName,
        lastName: match.user1.user.lastName,
        profilePicture: match.user1.profilePicture,
        age: calculateAge(match.user1.dateOfBirth),
      };
      const user2 = {
        firstName: match.user2.user.firstName,
        lastName: match.user2.user.lastName,
        profilePicture: match.user2.profilePicture,
        age: calculateAge(match.user2.dateOfBirth),
      };
      return { user1, user2 };
    });

    ResponseHandler.success(
      res,
      { formattedMatches },
      200,
      "Matches retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

function calculateAge(dob) {
  const currentDate = new Date();
  const birthDate = new Date(dob);
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

module.exports = {
  updateOrderedProfiles,
  getMatches,
};
