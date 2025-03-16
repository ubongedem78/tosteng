const prisma = require("./prisma");
const GeoSync = require("../utils/geosync");

async function findUsersInRangeKdTree(centerLat, centerLon, maxDistance) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profile: {
        select: {
          location: {
            select: {
              latitude: true,
              longitude: true,
            },
          },
          dateOfBirth: true,
          profilePicture: true,
          hobbies: true,
        },
      },
    },
  });

  const userCoordinates = users.map((user) => [
    parseFloat(user?.profile?.location?.latitude),
    parseFloat(user?.profile?.location?.longitude),
  ]);

  const userKdTree = new GeoSync(users.length);

  for (const [index, userCoordinate] of userCoordinates.entries()) {
    userKdTree.add(...userCoordinate, index);
  }

  userKdTree.finish();

  const centerCoordinates = [centerLat, centerLon];
  const usersWithinRangeIndices = userKdTree.within(
    centerLat,
    centerLon,
    maxDistance
  );

  const usersWithinRange = usersWithinRangeIndices.map((index) => users[index]);

  const usersWithAge = usersWithinRange.map((user) => ({
    ...user,
    profile: {
      ...user.profile,
      age: calculateAge(user.profile.dateOfBirth),
    },
  }));

  return usersWithAge;
}

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

module.exports = { findUsersInRangeKdTree };
