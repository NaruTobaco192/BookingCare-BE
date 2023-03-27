import db from '../models/index';
// import bcrypt from 'bcryptjs';
require('dotenv').config();
import _ from 'lodash';
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
import emailService from '../services/emailService'

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['value_En', 'value_Vi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['value_En', 'value_Vi'] },
                    {
                        model: db.Doctor_Infor, attributes: ['addressClinic', 'note'],
                        include: [
                            { model: db.Specialty, as: 'specialtyData', attributes: ['name'] }
                        ]
                    },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let checkValidateInput = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice',
        'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'selectedSpecialty',
        'selectedClinic'
    ]
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i]
            break;
        }
    }
    return {
        isValid, element
    }
}
let saveDetailInfoDoctors = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkValidateInput(inputData);

            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            } else {
                //upsert to markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                }
                else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }
                //upsert to Doctor_Info table 
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.selectedSpecialty;
                    doctorInfor.clinicId = inputData.selectedClinic;
                    await doctorInfor.save()
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.selectedSpecialty,
                        clinicId: inputData.selectedClinic,
                    })
                }
            }
            resolve({
                errCode: 0,
                errMessage: 'Save info doctor succeed!'
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let getDetailInfoDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['value_En', 'value_Vi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['value_En', 'value_Vi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['value_En', 'value_Vi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['value_En', 'value_Vi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                //convert image
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                //get-all-existing-data
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                //compare-different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType == b.timeType && +a.date === +b.date;
                });

                //create-data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    data: 'OK'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['value_En', 'value_Vi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getExtraInfoDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['value_En', 'value_Vi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['value_En', 'value_Vi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['value_En', 'value_Vi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['value_En', 'value_Vi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                //convert image
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['value_En', 'value_Vi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['value_En', 'value_Vi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['value_En', 'value_Vi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['value_En', 'value_Vi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                //convert image
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let dataPatient = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['firstName', 'lastName', 'email', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['value_En', 'value_Vi'] },
                            ]
                        },
                        { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['value_En', 'value_Vi'] }
                    ],
                    raw: false,
                    nest: true
                })

                if (!dataPatient) dataPatient = [];

                resolve({
                    errCode: 0,
                    data: dataPatient
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let sendPrescription = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType
                || !data.imgBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter`
                })
            } else {
                //update patient status

                let appointment = await db.Booking.findOne({
                    where: {
                        statusId: 'S2',
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType
                    },
                    raw: false
                })
                //send email prescription
                let sendEmail = await emailService.sendAttachment(data);
                if (sendEmail.errCode === 0) {
                    if (appointment) {
                        appointment.statusId = 'S3'
                        await appointment.save()
                    }
                }
            }
            resolve({
                errCode: 0,
                errMessage: 'Succeed!',
                // data: data
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctors: saveDetailInfoDoctors,
    getDetailInfoDoctorById: getDetailInfoDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate, getExtraInfoDoctorById,
    getProfileDoctorById, getListPatientForDoctor,
    sendPrescription
}