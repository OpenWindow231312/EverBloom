const { User, Role, sequelize } = require("./models");

(async () => {
  try {
    // Make sure DB connection works
    await sequelize.authenticate();
    console.log("✅ DB connection established");

    // Fetch all users with their roles
    const users = await User.findAll({
      include: [Role],
    });

    users.forEach((user) => {
      console.log(
        `User: ${user.fullName} (${user.email}) → Roles: ${user.Roles.map(
          (r) => r.roleName
        ).join(", ")}`
      );
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
