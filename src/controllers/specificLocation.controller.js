const prisma = require("../utils/prisma");
const { ResponseHandler } = require("../utils/responseHandler");
const { findUsersInRangeKdTree } = require("../utils/locationService");
const { NotFoundError } = require("../middlewares/errorhandler.middleware");
const {
  calculateHaversineDistance,
} = require("../utils/calculateGeolocation.util");

async function getNearbyUsers(req, res, next) {
  try {
    const { longitude, latitude } = req.body;

    const updatedRange = 1 / 111.32;
    const users = await findUsersInRangeKdTree(
      latitude,
      longitude,
      updatedRange
    );

    const usersInLocation = users.map((user) => ({
      ...user,
      profile: {
        ...user.profile,
        distance: calculateHaversineDistance(
          latitude,
          longitude,
          user?.profile?.location?.latitude,
          user?.profile?.location?.longitude
        ),
      },
    }));

    ResponseHandler.success(
      res,
      usersInLocation,
      200,
      "Range users retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
}

module.exports = { getNearbyUsers };
