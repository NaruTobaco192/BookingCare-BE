import handbookService from "../services/handbookService"

let createHandBook = async (req, res) => {
    try {
        let info = await handbookService.createHandBook(req.body);
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
let getAllHandBook = async (req, res) => {
    try {
        let info = await handbookService.getAllHandBook();
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
let getDetailHandBookById = async (req, res) => {
    try {
        let info = await handbookService.getDetailHandBookById(req.query.id);
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
    createHandBook, getAllHandBook,
    getDetailHandBookById
}