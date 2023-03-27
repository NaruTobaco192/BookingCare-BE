import doctorService from "../services/doctorService"
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 16;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from Sever..."
        })
    }
}
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever...'
        })
    }
}
let postInfoDoctors = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctors(req.body);
        return res.status(200).json(response);
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever...'
        })
    }
}
let getDetailInfoDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailInfoDoctorById(req.query.id);
        return res.status(200).json(info)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(info)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(info)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
let getExtraInfoDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getExtraInfoDoctorById(req.query.id);
        return res.status(200).json(info)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
let getProfileDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getProfileDoctorById(req.query.id);
        return res.status(200).json(info)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
let getListPatientForDoctor = async (req, res) => {
    try {
        let info = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(
            info
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
let sendPrescription = async (req, res) => {
    try {
        let info = await doctorService.sendPrescription(req.body);
        return res.status(200).json(info);
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever...'
        })
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctors: postInfoDoctors,
    getDetailInfoDoctorById: getDetailInfoDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate, getExtraInfoDoctorById,
    getProfileDoctorById, getListPatientForDoctor,
    sendPrescription
}