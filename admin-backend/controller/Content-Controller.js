const Content = require("../Models/Content-Model");

const getContent = async (req, res) => {
    try {
        let content = await Content.findOne();

        if (!content) {
            content = await Content.create({});
        }

        return res.status(200).json({ content });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateContent = async (req, res) => {
    try {
        const { section, body } = req.body;
        const allowedSections = ["termsAndConditions", "privacyPolicy"];

        if (!allowedSections.includes(section) || typeof body !== "string" || !body.trim()) {
            return res.status(400).json({ message: "A valid content section and body are required" });
        }

        let content = await Content.findOne();

        if (!content) {
            content = await Content.create({});
        }

        content[section].body = body;
        await content.save();

        return res.status(200).json({ message: "Content updated successfully", content });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getContent, updateContent };