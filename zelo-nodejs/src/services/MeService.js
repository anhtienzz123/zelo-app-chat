const MyError = require('../exception/MyError');
const User = require('../models/User');
const userValidate = require('../validate/userValidate');
const awsS3Service = require('./AwsS3Service');
const userService = require('./UserSevice');
const authService = require('./AuthService');
const messageValidate = require('../validate/messageValidate');
const commonUtils = require('../utils/commonUtils');

class MeService {
    async getProfile(_id) {
        const user = await User.getById(_id);

        return user;
    }

    async updateProfile(_id, profile) {
        if (!profile) throw new MyError('Profile invalid');

        const profileWasValidate = userValidate.checkProfile(profile);

        // check user
        await User.getById(_id);

        await User.updateOne({ _id }, { ...profileWasValidate });
    }

    async changeAvatar(_id, file) {
        this.checkImage(file);

        const user = await User.getById(_id);
        const { avatar } = user;
        if (avatar) await awsS3Service.deleteFile(avatar);

        const avatarUrl = await awsS3Service.uploadFile(file);
        await User.updateOne({ _id }, { avatar: avatarUrl });

        return avatarUrl;
    }

    async changeCoverImage(_id, file) {
        this.checkImage(file);

        const user = await User.getById(_id);
        const { coverImage } = user;
        if (coverImage) await awsS3Service.deleteFile(coverImage);

        const coverImageUrl = await awsS3Service.uploadFile(file);
        await User.updateOne({ _id }, { coverImage: coverImageUrl });

        return coverImageUrl;
    }

    async changeAvatarWithBase64(_id, fileInfo) {
        messageValidate.validateImageWithBase64(fileInfo);

        const user = await User.getById(_id);
        const { avatar } = user;
        if (avatar) await awsS3Service.deleteFile(avatar);

        const { fileName, fileExtension, fileBase64 } = fileInfo;
        const avatarUrl = await awsS3Service.uploadWithBase64(
            fileBase64,
            fileName,
            fileExtension
        );
        await User.updateOne({ _id }, { avatar: avatarUrl });

        return avatarUrl;
    }

    async changeCoverImageWithBase64(_id, fileInfo) {
        messageValidate.validateImageWithBase64(fileInfo);

        const user = await User.getById(_id);
        const { coverImage } = user;
        if (coverImage) await awsS3Service.deleteFile(coverImage);

        const { fileName, fileExtension, fileBase64 } = fileInfo;
        const coverImageUrl = await awsS3Service.uploadWithBase64(
            fileBase64,
            fileName,
            fileExtension
        );
        await User.updateOne({ _id }, { coverImage: coverImageUrl });

        return coverImageUrl;
    }

    checkImage(file) {
        const { mimetype } = file;

        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png')
            throw new MyError('Image invalid');
    }

    async getPhoneBooks(_id) {
        const user = await User.getById(_id);
        const { phoneBooks } = user;

        const result = [];
        for (const userPhoneBookEle of phoneBooks) {
            const { name, phone } = userPhoneBookEle;

            try {
                const searchUser = await userService.getStatusFriendOfUser(
                    _id,
                    phone
                );

                result.push({ ...searchUser, isExists: true });
            } catch (err) {
                result.push({ name, username: phone, isExists: false });
            }
        }

        return result;
    }

    async syncPhoneBooks(_id, phones) {
        userValidate.validatePhonesList(phones);
        await User.getById(_id);
        await User.updateOne({ _id }, { $set: { phoneBooks: phones } });
    }

    async changePassword(_id, oldPassword, newPassword) {
        userValidate.validateChangePassword(oldPassword, newPassword);
        await userValidate.validateEnterPassword(_id, oldPassword);

        const hashPassword = await commonUtils.hashPassword(newPassword);
        await User.updateOne({ _id }, { $set: { password: hashPassword } });
    }

    async revokeToken(_id, password, source) {
        await userValidate.validateEnterPassword(_id, password);

        await User.updateOne(
            { _id },
            { $set: { timeRevokeToken: new Date(), refreshTokens: [] } }
        );

        return await authService.generateAndUpdateAccessTokenAndRefreshToken(
            _id,
            source
        );
    }
}

module.exports = new MeService();
