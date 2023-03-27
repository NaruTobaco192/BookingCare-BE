import db from '../models/index';
// import bcrypt from 'bcryptjs';
// require('dotenv').config();

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    address: data.address
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create clinic succeed!'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinics = await db.Clinic.findAll()
            if (clinics && clinics.length > 0) {
                clinics.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                data: clinics
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })
                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId'],
                    })
                    data.doctorClinic = doctorClinic;
                } else {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Get getDetailClinicById succeed!',
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
    createClinic, getAllClinic,
    getDetailClinicById,
}