const User = require("../models/User");

const getMembers = async (req, res, next) => {
  try {
    const members = await User.find({
      role: "MEMBER",
    }).select(
      "_id name email role"
    );

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMembers,
};