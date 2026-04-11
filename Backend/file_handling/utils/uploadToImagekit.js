import imagekit from "../config/imagekit.js";

const uploadToImagekit = async (buffer, filename, folder) => {
    const response = await imagekit.upload({
        file: buffer.toString("base64"),
        fileName: filename,
        folder: folder,
    });
    return response;
};

export default uploadToImagekit;