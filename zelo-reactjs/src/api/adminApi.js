import axiosClient from './axiosClient';

const adminApi = {
    getListUsersByUserName: (username, page, size) => {
        const url = `/admin/users-manager`;
        return axiosClient.get(url, {
            params: {
                username,
                page,
                size,
            },
        });
    },
    active: (id, isActived) => {
        const url = `/admin/users-manager/${id}/${isActived}`;
        return axiosClient.patch(url);
    },
    delete: (id, isDeleted) => {
        const url = `/admin/users-manager/${id}/${isDeleted}`;
        return axiosClient.patch(url);
    },

    //sticker
    getAllGroupSticker: () => {
        const url = `/stickers`;
        return axiosClient.get(url);
    },
    creatGroupSticker: (name, description) => {
        const url = `/admin/stickers-manager`;

        return axiosClient.post(url, { name, description });
    },
    updateGroupSticker: (_id, name, description) => {
        const url = `/admin/stickers-manager/${_id}`;
        return axiosClient.put(url, { name, description });
    },
    deleteGroupSticker: (_id) => {
        const url = `/admin/stickers-manager/${_id}`;
        return axiosClient.delete(url, { _id });
    },
    deleteSticker: (_id, url) => {
        const url1 = `/admin/stickers-manager/${_id}/sticker`;
        return axiosClient.delete(url1, {
            params: {
                url,
            },
        });
    },
    addSticker: (_id, file) => {
        const url = `/admin/stickers-manager/${_id}`;
        return axiosClient.post(url, file);
    },
};
export default adminApi;
