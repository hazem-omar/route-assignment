import { User } from "../../DB/models/User.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      age,
    });

    return res.status(201).json({
      message: "User added successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, age, password } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Password cannot be updated
    if (password) {
      return res.status(400).json({
        message: "Password cannot be updated",
      });
    }

    // Check email only if user wants to change it
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }

      user.email = email;
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (age !== undefined) {
      user.age = age;
    }

    await user.save();

    return res.status(200).json({
      message: "User updated",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "user deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getUser = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findById(id);

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
      message: error.message,
    });
  }
};
