const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const cloudinary = require('cloudinary')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail');

exports.registerUser = async (req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'baghub/avatar',
        width: 150,
        crop: "scale"
    }, (err, res) => {
        console.log(err, res);
    });
    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        },

        // role,
    })

    // const token = user.getJwtToken();
    if (!user) {
        return res.status(500).json({
            success: false,
            message: 'user not created'
        })
    }
    sendToken(user, 200, res)

}

exports.LoginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' })
    }
    // if (!email || !password) {
    //     return next(new ErrorHandler('Please enter email & password', 400))
    // }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }
    // if (!user) {
    //     return next(new ErrorHandler('Invalid Email or Password', 401));
    // }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    // if (!isPasswordMatched) {
    //     return next(new ErrorHandler('Invalid Email or Password', 401));
    // }
    if (!isPasswordMatched) {
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }
    // const token = user.getJwtToken();

    //  res.status(201).json({
    //  	success:true,

    //  	token
    //  });
    sendToken(user, 200, res)
}

exports.Logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}

exports.ForgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'User not found with this email' })
        // return next(new ErrorHandler('User not found with this email', 404));
    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Baghub Password Recover',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: error.message })
        // return next(new ErrorHandler(error.message, 500))
    }
}

exports.ResetPassword = async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has been expired' })
        // return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'Password does not match' })
        // return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
}
exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('password');
    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return res.status(400).json({ message: 'Old password is incorrect' })
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res)

}

exports.Profile = async (req, res, next) => {
    // console.log(req.header('authorization'))
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
}


exports.UpdateProfile = async (req, res, next) => {
    console.log(req.body)
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    if (req.body.avatar !== '') {
        const user = await User.findById(req.body.id);

        // const image_id = user.avatar.public_id;
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return res.status(401).json({ message: 'User Not Updated' });
    }

    res.status(200).json({
        success: true
    });
};

exports.AllUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
}

exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({ message: `User does not found with id: ${req.params.id}` })
        // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
}

// exports.deleteUser = async (req, res, next) => {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//         return res.status(401).json({ message: `User does not found with id: ${req.params.id}` })
//         // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
//     }

//     // Remove avatar from cloudinary
//     const image_id = user.avatar.public_id;
//     await cloudinary.v2.uploader.destroy(image_id);
//     await User.findByIdAndRemove(req.params.id);
//     return res.status(200).json({
//         success: true,
//     })
// }
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: `User not found with id: ${req.params.id}`,
            });
        }

        // Remove avatar from Cloudinary
        const image_id = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(image_id);

        // Delete the user
        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// exports.updateUser = async (req, res, next) => {
//     const newUserData = {
//         name: req.body.name,
//         email: req.body.email,
//         role: req.body.role
//     }

//     const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
//         new: true,
//         runValidators: true,
//         // useFindAndModify: false
//     })

//     return res.status(200).json({
//         success: true
//     })
// }

exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin, // Ensure boolean value
    };

    try {
        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};
// exports.updateUser = async (req, res) => {
//     try {
//         const { isAdmin } = req.body;

//         // Ensure isAdmin is a Boolean
//         const adminStatus = isAdmin === 'true' || isAdmin === true;

//         const user = await User.findByIdAndUpdate(req.params.id, { 
//             name: req.body.name, 
//             email: req.body.email, 
//             isAdmin: adminStatus 
//         }, { new: true, runValidators: true });

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         res.status(200).json({ success: true, user });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };

