import Customer from "../models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from 'bcryptjs';


export const profileUpdate = asyncHandler( async (req, res) => {

    const customerId = req.customer._id;
    const { name, avatar, addresses } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (addresses && Array.isArray(addresses)) {
        updateData.addresses = addresses.map((addr) => ({
            label: addr.label,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            location: {
                type: "Point",
                coordinates: [addr.coordinates[0], addr.coordinates[1]]
            }
        }));
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
        throw new ApiError(404, "Customer not found");
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
            id: updatedCustomer._id,
            name: updatedCustomer.name,
            email: updatedCustomer.email,
            avatar: updatedCustomer.avatar,
            addresses: updatedCustomer.addresses
        }
    });
});

export const changePassword = asyncHandler( async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const customerId = req.customer._id;

    const customer = await Customer.findById(customerId).select('+password');
    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, customer.password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password cannot be same as the old password");
    }

    customer.password = await bcrypt.hash(newPassword, 10);
    await customer.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
});

export const getProfile = asyncHandler( async (req, res) => {

    if (req.customer.isActive === false) {
        throw new ApiError(403, "Your account is deactivated. Please log in again to reactivate.");
    }
    
    res.status(200).json({
        success: true,
        message: "Customer profile fetched successfully",
        data: req.customer,
    });
});

export const deleteAccount = asyncHandler( async (req, res) => {
    const customerId = req.customer._id;

    await Customer.findByIdAndUpdate(customerId, {
        $set: { isActive: false }
    });

    const options = {
        httpOnly: true, 
        secure: true, 
        sameSite: "strict" 
    };

    res.status(200)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            message: "Account deleted/deactivated successfully. All sessions cleared."
        });
});
