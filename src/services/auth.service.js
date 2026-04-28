import tokenModel from "../models/token.model";
import User from "../models/user.model";
import { generateAccessToken,generateRefreshToken, verifyRefreshToken} from "../utils/jwt";


const userLogin = async (githubUser) => {
    let user  = await User.findOne({ github_id: githubUser.id });
    if (!user) {
        user = new User({
            github_id: githubUser.id,
            username: githubUser.login,
            email: githubUser.email,
            avatar_url: githubUser.avatar_url
        })
        user.last_login_at = new Date();
        await user.save();
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const tokenDoc = new tokenModel({
        userId: user._id,
        refreshToken: refreshToken,
        expires_at: Date.now() + 5 * 60 * 1000,
        is_revoked: false
    })
    await tokenDoc.save();
    return ({
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken  
    })
}


const refreshToken = async (oldRefreshToken) => {
    const verified = verifyRefreshToken(oldRefreshToken);
    const tokenDoc = await tokenModel.findOne({ refreshToken: oldRefreshToken, is_revoked: false });
    if (!tokenDoc) {
        throw new Error("Invalid refresh token");
    }
    tokenDoc.is_revoked = true;
    await tokenDoc.save();
    const user = await User.findById(verified.userId);
    if (!user) {
        throw new Error("User not found");
    }
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const newTokenDoc = new tokenModel({
        userId: user._id,
        refreshToken: newRefreshToken,
        expires_at: Date.now() + 5 * 60 * 1000,
    })
    await newTokenDoc.save();
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

const logout = async (refreshToken) => {
    const tokenDoc = await tokenModel.findOne({ refreshToken: refreshToken, is_revoked: false });
    if (tokenDoc) {
        tokenDoc.is_revoked = true;
        await tokenDoc.save();
    }
}


export { userLogin, refreshToken, logout };