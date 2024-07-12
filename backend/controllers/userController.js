const User = require("../models/userModel");

const saveUserData = async (req, res) => {
  const { auth0Id, name, email, picture } = req.body;

  try {
    let user = await User.findOne({ auth0Id });

    if (user) {
      // Update existing user data if necessary
      user.name = name;
      user.email = email;
      user.picture = picture;
    } else {
      // Create a new user if not found
      user = new User({
        auth0Id,
        name,
        email,
        picture,
      });
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res
      .status(500)
      .json({ success: false, message: "Error saving user data." });
  }
};

module.exports = {
  saveUserData,
};
