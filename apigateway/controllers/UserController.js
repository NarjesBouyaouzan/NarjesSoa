const User = require('../models/user');
exports.getUsers = async () => {
  try {
    return await User.find().select('-password');
  } catch (err) {
    throw new ErrorResponse('Server error', 500);
  }
};

// @desc    Get single user
// @route   Not directly exposed (used by GraphQL resolvers)
exports.getUser = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }
    
    return user;
  } catch (err) {
    throw new ErrorResponse('Server error', 500);
  }
};
exports.createUser = async (userData) => {
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ErrorResponse('User already exists', 400);
    }

    // Create user
    const user = await User.create(userData);
    
    // Return token
    return {
      ...user._doc,
      id: user._id,
      token: user.getSignedJwtToken()
    };
  } catch (err) {
    throw new ErrorResponse('Server error', 500);
  }
};
exports.updateUser = async (userId, updateData) => {
  try {
    // Exclude password from update
    if (updateData.password) {
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    return user;
  } catch (err) {
    throw new ErrorResponse('Server error', 500);
  }
};
exports.deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    return { success: true, data: {} };
  } catch (err) {
    throw new ErrorResponse('Server error', 500);
  }
};