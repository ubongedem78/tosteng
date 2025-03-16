const prisma = require("../utils/prisma");
const { ResponseHandler } = require("../utils/responseHandler");

const seedUserAndProfile = async () => {
  try {
    for (let i = 0; i < 10; i++) {
      const user = await prisma.user.create({
        data: {
          firstName: `User${i}`,
          lastName: `Last${i}`,
          email: `user${i}@yahoo.com`,
          phone: `+1234569${i}`,
          password: `password${i}`,
        },
      });

      await prisma.profile.create({
        data: {
          userId: user.id,
          hobbies: ["SPORTS", "MUSIC"],
          bio: `Bio for User${i + 1}`,
          gender: "MALE",
          dateOfBirth: new Date(),
        },
      });

      console.log(`User and Profile seeded for user ${user.id}`);
    }

    console.log("User and Profile seeding completed.");
  } catch (error) {
    console.error("Error seeding User and Profile:", error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { seedUserAndProfile };
