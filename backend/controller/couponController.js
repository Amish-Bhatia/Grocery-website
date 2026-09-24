const Coupon = require('../Models/couponModel');

const createCoupon = async (req, res) => {
    try {
        let {
            code,
            description,
            discountType,
            discountValue,
            minimumOrderAmount,
            maximumDiscountAmount,
            usageLimit,
            startDate,
            endDate,
            isActive = true,
            usedBy = []
        } = req.body;

        if (!code || !description || !discountType || discountValue === undefined || discountValue === null || discountValue === "") {
            return res.status(400).json({ message: 'Code, description, discount type, and discount value are required.' });
        }

        const formattedCode = String(code).trim().toUpperCase();

        const existing = await Coupon.findOne({ code: { $regex: new RegExp(`^${formattedCode}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ message: `Coupon with code "${formattedCode}" already exists.` });
        }

        const parsedDiscountVal = Number(discountValue);
        if (isNaN(parsedDiscountVal) || parsedDiscountVal <= 0) {
            return res.status(400).json({ message: 'Discount value must be a positive number.' });
        }

        if (discountType === 'percentage' && parsedDiscountVal > 100) {
            return res.status(400).json({ message: 'Percentage discount cannot exceed 100%.' });
        }

        const parsedMinOrder = minimumOrderAmount !== undefined && minimumOrderAmount !== null && minimumOrderAmount !== ""
            ? Number(minimumOrderAmount)
            : 0;

        const parsedMaxDiscount = maximumDiscountAmount !== undefined && maximumDiscountAmount !== null && maximumDiscountAmount !== ""
            ? Number(maximumDiscountAmount)
            : null;

        const parsedUsageLimit = usageLimit !== undefined && usageLimit !== null && usageLimit !== ""
            ? Number(usageLimit)
            : null;

        const parsedStartDate = startDate ? new Date(startDate) : new Date();
        const parsedEndDate = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        if (parsedEndDate <= parsedStartDate) {
            return res.status(400).json({ message: 'End date must be after the start date.' });
        }

        const coupon = await Coupon.create({
            code: formattedCode,
            description: String(description).trim(),
            discountType,
            discountValue: parsedDiscountVal,
            minimumOrderAmount: isNaN(parsedMinOrder) ? 0 : parsedMinOrder,
            maximumDiscountAmount: parsedMaxDiscount && !isNaN(parsedMaxDiscount) ? parsedMaxDiscount : undefined,
            usageLimit: parsedUsageLimit && !isNaN(parsedUsageLimit) ? parsedUsageLimit : undefined,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            isActive: Boolean(isActive),
            usedBy: Array.isArray(usedBy) ? usedBy : []
        });

        res.status(201).json({ message: 'Coupon created successfully', coupon });
    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

const getCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ message: 'Coupons fetched successfully', coupons });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json({ message: 'Coupon fetched successfully', coupon });
    } catch (error) {
        console.error('Error fetching coupon by id:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (updateData.code) {
            updateData.code = String(updateData.code).trim().toUpperCase();
            // Check if code is taken by another coupon
            const existing = await Coupon.findOne({
                _id: { $ne: id },
                code: { $regex: new RegExp(`^${updateData.code}$`, 'i') }
            });
            if (existing) {
                return res.status(400).json({ message: `Coupon with code "${updateData.code}" already exists.` });
            }
        }

        if (updateData.discountValue !== undefined) {
            updateData.discountValue = Number(updateData.discountValue);
            if (isNaN(updateData.discountValue) || updateData.discountValue <= 0) {
                return res.status(400).json({ message: 'Discount value must be a positive number.' });
            }
            if (updateData.discountType === 'percentage' && updateData.discountValue > 100) {
                return res.status(400).json({ message: 'Percentage discount cannot exceed 100%.' });
            }
        }

        if (updateData.minimumOrderAmount !== undefined) {
            updateData.minimumOrderAmount = updateData.minimumOrderAmount === "" ? 0 : Number(updateData.minimumOrderAmount);
        }

        if (updateData.maximumDiscountAmount !== undefined) {
            updateData.maximumDiscountAmount = (updateData.maximumDiscountAmount === "" || updateData.maximumDiscountAmount === null)
                ? null
                : Number(updateData.maximumDiscountAmount);
        }

        if (updateData.usageLimit !== undefined) {
            updateData.usageLimit = (updateData.usageLimit === "" || updateData.usageLimit === null)
                ? null
                : Number(updateData.usageLimit);
        }

        if (updateData.startDate) {
            updateData.startDate = new Date(updateData.startDate);
        }
        if (updateData.endDate) {
            updateData.endDate = new Date(updateData.endDate);
        }

        if (updateData.isActive !== undefined) {
            updateData.isActive = Boolean(updateData.isActive);
        }

        updateData.updatedAt = new Date();

        const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.status(200).json({ message: 'Coupon updated successfully', coupon });
    } catch (error) {
        console.error('Error updating coupon:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json({ message: 'Coupon deleted successfully', coupon });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const verifyCoupon = async (req, res) => {
    try {
        const { code, cartTotal = 0, userId } = req.body;

        if (!code || !String(code).trim()) {
            return res.status(400).json({ message: 'Coupon code is required' });
        }

        const formattedCode = String(code).trim().toUpperCase();
        const coupon = await Coupon.findOne({
            code: { $regex: new RegExp(`^${formattedCode}$`, 'i') }
        });

        if (!coupon) {
            return res.status(400).json({ message: `Coupon code "${formattedCode}" is invalid` });
        }

        if (coupon.isActive === false) {
            return res.status(400).json({ message: 'This coupon is currently inactive' });
        }

        const now = new Date();
        if (coupon.startDate && new Date(coupon.startDate) > now) {
            return res.status(400).json({
                message: `This coupon will be valid starting ${new Date(coupon.startDate).toLocaleDateString()}`
            });
        }

        if (coupon.endDate && new Date(coupon.endDate) < now) {
            return res.status(400).json({ message: 'This coupon has expired' });
        }

        const numCartTotal = Number(cartTotal) || 0;

        if (coupon.minimumOrderAmount && numCartTotal < coupon.minimumOrderAmount) {
            return res.status(400).json({
                message: `Minimum order amount of $${coupon.minimumOrderAmount} required to apply this coupon`
            });
        }

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit has been reached' });
        }

        if (userId && Array.isArray(coupon.usedBy) && coupon.usedBy.map(String).includes(String(userId))) {
            return res.status(400).json({ message: 'You have already used this coupon' });
        }

        let discountAmount = 0;
        let calculatedPercent = 0;

        if (coupon.discountType === 'percentage') {
            discountAmount = (numCartTotal * coupon.discountValue) / 100;
            calculatedPercent = coupon.discountValue;
        } else {
            discountAmount = coupon.discountValue;
            calculatedPercent = numCartTotal > 0 ? Math.min(100, Math.round((discountAmount / numCartTotal) * 100)) : 0;
        }

        if (coupon.maximumDiscountAmount && discountAmount > coupon.maximumDiscountAmount) {
            discountAmount = coupon.maximumDiscountAmount;
        }

        if (discountAmount > numCartTotal) {
            discountAmount = numCartTotal;
        }

        discountAmount = Number(discountAmount.toFixed(2));

        res.status(200).json({
            message: 'Coupon applied successfully',
            coupon,
            discountAmount,
            discountPercent: calculatedPercent
        });
    } catch (error) {
        console.error('Error verifying coupon:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createCoupon,
    getCoupon,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    verifyCoupon
};