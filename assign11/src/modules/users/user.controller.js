import { User } from "../../DB/models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one image",
      });
    }

    const profilePictures = req.files.map(
      (file) => `/uploads/${file.filename}`,
    );

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $push: {
          profilePictures: {
            $each: profilePictures,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile pictures uploaded successfully",
      profilePictures: user.profilePictures,
    });
  } catch (error) {
    console.error("Upload Profile Pictures Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};