const prisma = require("../utils/prisma");
const { ResponseHandler } = require("../utils/responseHandler");

const createBasicInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      height,
      language,
      relationshipStatus,
      children,
      religion,
      zodiac,
      alcohol,
      PersonalityType,
    } = req.body;

    const basicInfo = await prisma.basicInfo.create({
      data: {
        userId,
        height,
        language,
        relationshipStatus,
        children,
        religion,
        zodiac,
        alcohol,
        PersonalityType,
      },
    });

    ResponseHandler.success(
      res,
      basicInfo,
      201,
      "Basic Info created successfully"
    );
  } catch (error) {
    next(error);
  }
};

const getBasicInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const basicInfo = await prisma.basicInfo.findUnique({
      where: { userId },
    });

    ResponseHandler.success(
      res,
      basicInfo,
      200,
      "Basic Info retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

const updateBasicInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      height,
      language,
      relationshipStatus,
      children,
      religion,
      zodiac,
      alcohol,
      personalityType,
    } = req.body;

    const updatedBasicInfo = await prisma.basicInfo.update({
      where: { userId },
      data: {
        height,
        language,
        relationshipStatus,
        children,
        religion,
        zodiac,
        alcohol,
        personalityType,
      },
    });

    ResponseHandler.success(
      res,
      updatedBasicInfo,
      200,
      "Basic Info updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

const deleteBasicInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await prisma.basicInfo.delete({
      where: { userId },
    });

    res.json({ success: true, message: "Basic info deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBasicInfo,
  getBasicInfo,
  updateBasicInfo,
  deleteBasicInfo,
};
