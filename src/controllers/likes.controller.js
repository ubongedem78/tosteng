const prisma = require("../utils/prisma");
const { ResponseHandler } = require("../utils/responseHandler");

const likeProfile = async (req, res, next) => {
  try {
    const { userId, profileId } = req.body;

    const like = await prisma.like.create({
      data: {
        userId,
        profileId,
      },
    });

    res.json({ success: true, like });
  } catch (error) {
    next(error);
  }
};

const unlikeProfile = async (req, res, next) => {
  try {
    const likeId = req.params.likeId;

    const likeToDelete = await prisma.like.findUnique({
      where: {
        id: likeId,
      },
    });

    if (!likeToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Like not found" });
    }

    await prisma.like.delete({
      where: {
        id: likeToDelete.id,
      },
    });

    res.json({ success: true, message: "Profile unliked successfully" });
  } catch (error) {
    next(error);
  }
};

const getLikes = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userLikes = await prisma.like.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                dateOfBirth: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    const formattedUserLikes = userLikes.map((like) => ({
      likedProfile: {
        id: like.id,
        userId: like.userId,
        profileId: like.profileId,
        createdAt: like.createdAt,
        updatedAt: like.updatedAt,
        user: {
          id: like.user.id,
          firstName: like.user.firstName,
          lastName: like.user.lastName,
          profile: {
            dateOfBirth: like.user.profile.dateOfBirth,
            profilePicture: like.user.profile.profilePicture,
            age: calculateAge(like.user.profile.dateOfBirth),
          },
        },
      },
    }));

    res.json({ success: true, userLikes: formattedUserLikes });
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

module.exports = { likeProfile, unlikeProfile, getLikes };
