export default (sequelize, DataTypes) => {
  const user_student = sequelize.define(
    "user_student",
    {
      student_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password_reset_token: {
        type: DataTypes.STRING,
      },
      is_verified: {
        type: DataTypes.STRING,
        defaultValue: "1",
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
    }
  );

  return user_student;
};
