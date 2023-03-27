import db from '../models/index';
// import bcrypt from 'bcryptjs';
// require('dotenv').config();

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML
                || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create specialty succeed!'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll({
                // attributes: {
                //     exclude: ['descriptionHTML', 'descriptionMarkdown']
                // },
            })
            if (specialties && specialties.length > 0) {
                specialties.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                data: specialties
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else {
                        //find-by-location
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],

                        })
                    }
                    data.doctorSpecialty = doctorSpecialty;
                } else {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Get getDetailSpecialtyById succeed!',
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
    createSpecialty, getAllSpecialty,
    getDetailSpecialtyById
}