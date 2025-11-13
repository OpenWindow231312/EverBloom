// ========================================
// 🌸 EverBloom — Address Model
// ========================================
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      address_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      addressType: {
        type: DataTypes.ENUM("Shipping", "Billing", "Both"),
        defaultValue: "Shipping",
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      streetAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        defaultValue: "South Africa",
      },
      phone: {
        type: DataTypes.STRING,
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Addresses",
      timestamps: true,
    }
  );

  return Address;
};
