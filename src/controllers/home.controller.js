const prisma = require("../utils/prisma");
const { ResponseHandler } = require("../utils/responseHandler");
const { findUsersInRangeKdTree } = require("../utils/locationService");
const { NotFoundError } = require("../middlewares/errorhandler.middleware");

async function getUsersInRange(req, res, next) {
  try {
    const userId = req.params.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        profile: {
          select: {
            location: {
              select: {
                latitude: true,
                longitude: true,
                range: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }
    const { latitude, longitude, range } = user.profile.location;

    const updatedRange = range ? range / 111.32 : 1 / 111.32;
    const users = await findUsersInRangeKdTree(
      latitude,
      longitude,
      updatedRange
    );

    ResponseHandler.success(
      res,
      users,
      200,
      "Range users retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsersInRange };
