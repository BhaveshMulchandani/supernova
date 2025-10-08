const imagekit = require("imagekit");
const { v4: uuidv4 } = require('uuid')

const imagekit = new imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

const uploadImage = async ({ buffer, filename, folder = '/products' }) => {
    const res = await imagekit.upload({
        file: buffer,
        fileName: uuidv4(),
        folder,
    })

    return {
        url: res.url,
        thumbnail: res.thumbnailUrl || res.url,
        id: res.fileId
    }
}

module.exports = { uploadImage }
