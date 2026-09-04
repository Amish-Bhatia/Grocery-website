const bcrypt = require("bcryptjs");
const staff = require("../Models/Admin-Staff-Model");

const addStaff = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingStaff = await staff.findOne({ email });

        if (existingStaff) {
            return res.status(400).json({
                message: "Staff already exists"
            });
        }

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStaff = new staff({
            name,
            email,
            password: hashedPassword
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
        const staffs = await staff.find();
        return res.status(200).json({staffs});
    }
    catch(e){
        return res.status(500).json({message:e.message});
    }
};

const getSingleStaff = async (req,res)=>{
    try{
        const staffMember = await staff.findById(req.params.id);
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
        const { name, email, password, status } = req.body;

        const existingStaff = await staff.findOne({email});
        if(existingStaff && existingStaff._id.toString() !== id){
            return res.status(400).json({message:"Email already exists"});
        }

        const updateData = { name, email, status };
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const updatedStaff = await staff.findByIdAndUpdate(
            id,
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

        const deletedStaff = await staff.findByIdAndDelete(id);
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