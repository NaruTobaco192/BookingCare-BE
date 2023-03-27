import db from '../models/index';
// import bcrypt from 'bcryptjs';
// require('dotenv').config();

let createHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML
                || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.HandBook.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create handbook succeed!'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let handbooks = await db.HandBook.findAll()
            if (handbooks && handbooks.length > 0) {
                handbooks.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                data: handbooks
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let getDetailHandBookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.HandBook.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Get getDetailHandBookById succeed!',
                    data
                })
            }

        }
        catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createHandBook, getAllHandBook,
    getDetailHandBookById,
}