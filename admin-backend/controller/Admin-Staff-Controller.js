const bcrypt = require("bcryptjs");
const Users = require("../Models/userModel");

const addStaff = async (req, res) => {
    try {
        const { name, email, phone, password, permissions } = req.body;

        const existingStaff = await Users.findOne({ email });

        if (existingStaff) {
            return res.status(400).json({
            message: "Staff already exists"
            });
        }

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "Name, email, phone and password are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStaff = new Users({
            name,
            email,
            phone,
            permissions,
            password: hashedPassword,
            role: "staff"
        });

        await newStaff.save();

        return res.status(201).json({
            message: "Staff added successfully",
            staff: { id: newStaff._id, name: newStaff.name, email: newStaff.email, role: newStaff.role, status: newStaff.status }
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};

const getAllStaff = async (req,res)=>{
    try{
        const staffs = await Users.find({ role: "staff" });
        return res.status(200).json({staffs});
    }
    catch(e){
        return res.status(500).json({message:e.message});
    }
};

const getSingleStaff = async (req,res)=>{
    try{
        const staffMember = await Users.findOne({ _id: req.params.id, role: "staff" });
        if(!staffMember){
            return res.status(404).json({message:"Staff not found"});
        }           
        return res.status(200).json({staffMember});
    }
    catch(e){
        return res.status(500).json({message:e.message});
    }
};

const updateStaff = async (req,res)=>{
    try{
        const { id } = req.params;
        const { name, email, phone, password, status, permissions } = req.body;

        const existingUser = await Users.findOne({ email });
        if(existingUser && existingUser._id.toString() !== id){
            return res.status(400).json({message:"Email already exists"});
        }

        const updateData = { name, email, phone, status, permissions };
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const updatedStaff = await Users.findOneAndUpdate(
            { _id: id, role: "staff" },
            updateData,
            { new: true }
        );

        if(!updatedStaff){
            return res.status(404).json({message:"Staff not found"});
        }

        return res.status(200).json({message:"Staff updated successfully", updatedStaff});
    }
    catch(e){
        return res.status(500).json({message:e.message});
    }
};

const deleteStaff = async (req,res)=>{
    try{
        const { id } = req.params;

        const deletedStaff = await Users.findOneAndDelete({ _id: id, role: "staff" });
        if(!deletedStaff){
            return res.status(404).json({message:"Staff not found"});
        }

        return res.status(200).json({message:"Staff deleted successfully"});
    }
    catch(e){
        return res.status(500).json({message:e.message});
    }
};

module.exports = { addStaff, getAllStaff, getSingleStaff, updateStaff, deleteStaff };