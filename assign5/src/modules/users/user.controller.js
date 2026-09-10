import User from "../../DB/models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    // Create a new user instance
    const user = User.build({
      name,
      email,
      password,
      role,
    });

    // Save user to database
    await user.save();

    return res.status(201).json({
      message: "User added successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, age, role } = req.body;

    const user = await User.findByPk(id);

    if (user) {
      // Update existing user
      user.name = name;
      user.email = email;
      user.role = role;

      await user.save({
        validate: false,
      });

      return res.status(200).json({
        message: "User updated successfully.",
      });
    }

    // Create new user if user doesn't exist
    const newUser = User.build({
      id,
      name,
      email,
      role,
    });

    await newUser.save({
      validate: false,
    });

    return res.status(201).json({
      message: "User created successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "no user found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["role"],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "no user found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};