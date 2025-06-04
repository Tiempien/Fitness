import { defineNitroPlugin } from "#imports";
import {sequelize } from "../models"; // ✅ Load all models
export default defineNitroPlugin(async () => {
    try {
        console.log("️ℹ Attempting database connection...");

        await sequelize.authenticate();
        console.log("✔ Database connected.");

        console.log("ℹ Checking models...");
        console.log(sequelize.models); // ✅ Log all models

        await sequelize.sync({ alter: true }); // ✅ Sync all models
        //await sequelize.sync({ force: true }); // ✅ Sync all models and delete existing tables
        console.log("✔ Database synced.");
    } catch (error) {
        console.error("❌ Database sync error:", error);
        process.exit(1);
    }
});
