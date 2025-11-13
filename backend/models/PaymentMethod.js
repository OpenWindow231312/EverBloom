// ========================================
// 🌸 EverBloom — PaymentMethod Model
// ========================================
module.exports = (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define(
    "PaymentMethod",
    {
      payment_id: {
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
      cardholderName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cardType: {
        type: DataTypes.ENUM("Visa", "Mastercard", "American Express", "Other"),
        defaultValue: "Visa",
      },
      lastFourDigits: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      expiryMonth: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiryYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "PaymentMethods",
      timestamps: true,
    }
  );

  return PaymentMethod;
};
