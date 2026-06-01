// Token Rotation Transaction Manager
import mongoose from "mongoose";

export const rotateTokenWithTransaction = async (userId, oldRefreshTokenHash, newHashedToken, tokenModel) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Step 1: Verify the old token exists and hasn't been revoked
        const storedToken = await tokenModel.findOne({
            userId: userId,
            refreshTokenHash: oldRefreshTokenHash
        }).session(session);

        if (!storedToken) {
            await session.abortTransaction();
            throw new Error('Token not found');
        }

        if (storedToken.revoked) {
            await session.abortTransaction();
            throw new Error('Token already revoked');
        }

        // Step 2: Update to new token hash atomically
        const updatedToken = await tokenModel.findByIdAndUpdate(
            storedToken._id,
            {
                refreshTokenHash: newHashedToken,
                lastRotatedAt: new Date(),
                rotationCount: (storedToken.rotationCount || 0) + 1
            },
            { new: true, session }
        );

        await session.commitTransaction();
        return updatedToken;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

export const revokeTokenWithTransaction = async (userId, refreshTokenHash, tokenModel) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await tokenModel.findOneAndUpdate(
            {
                userId: userId,
                refreshTokenHash: refreshTokenHash
            },
            {
                revoked: true,
                revokedAt: new Date()
            },
            { session, new: true }
        );

        await session.commitTransaction();
        return result;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};
