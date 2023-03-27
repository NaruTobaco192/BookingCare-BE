import clinicService from "../services/clinicService"

let createClinic = async (req, res) => {
    try {
        let info = await clinicService.createClinic(req.body);
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
let getAllClinic = async (req, res) => {
    try {
        let info = await clinicService.getAllClinic();
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
let getDetailClinicById = async (req, res) => {
    try {
        let info = await clinicService.getDetailClinicById(req.query.id);
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
module.exports = {
    createClinic, getAllClinic,
    getDetailClinicById
}