import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res)=>{
    try {
        const userId = req.userId;
        const {address} = req.body;
        await Address.create({...address, userId})
        res.json({success:true, message:"Address added successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({
            success:false,
            message:error.message
        })
    }
}


//get address : /api/address/get
export const getAddress = async (req, res)=>{
    try {
        const userId = req.userId;
        const addresses = await Address.find({userId})
        res.json({success:true, addresses})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}