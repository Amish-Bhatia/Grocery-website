require("dotenv").config();
const mongoose = require("mongoose");
const Users = require("./Models/userModel");

const migrateStaffToUsers = async () => {
    await mongoose.connection.asPromise();

    const database = mongoose.connection.db;
    const legacyCollectionExists = await database.listCollections({ name: "staffs" }).hasNext();

    if (!legacyCollectionExists) {
        console.log("No legacy staffs collection found. Nothing to migrate.");
        return;
    }

    const legacyStaff = await database.collection("staffs").find({}).toArray();
    const conflicts = [];

    for (const staff of legacyStaff) {
        const existingById = await Users.findById(staff._id).lean();
        const existingByEmail = await Users.findOne({ email: staff.email }).lean();

        if (existingById) {
            if (existingById.email !== staff.email || existingById.role !== "staff") {
                conflicts.push(`${staff.email} (user ID conflict)`);
            }
            continue;
        }

        if (existingByEmail) {
            conflicts.push(`${staff.email} (email already belongs to ${existingByEmail.role})`);
        }
    }

    if (conflicts.length > 0) {
        throw new Error(`Migration stopped due to conflicts: ${conflicts.join(", ")}`);
    }

    const usersCollection = database.collection("users");
    let inserted = 0;
    let alreadyMigrated = 0;

    for (const staff of legacyStaff) {
        const existing = await Users.findById(staff._id).lean();

        if (existing) {
            alreadyMigrated += 1;
            continue;
        }

        await usersCollection.insertOne({
            ...staff,
            role: "staff"
        });
        inserted += 1;
    }

    const migratedCount = await Users.countDocuments({
        _id: { $in: legacyStaff.map((staff) => staff._id) },
        role: "staff"
    });

    if (migratedCount !== legacyStaff.length) {
        throw new Error(`Verification failed: expected ${legacyStaff.length} staff users, found ${migratedCount}`);
    }

    await database.collection("staffs").drop();
    console.log(`Migration complete. Inserted: ${inserted}, already migrated: ${alreadyMigrated}. Legacy staffs collection removed.`);
};

migrateStaffToUsers()
    .catch((error) => {
        console.error(`Staff migration failed: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });