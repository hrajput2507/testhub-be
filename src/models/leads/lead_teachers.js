export default (sequelize, DataTypes) => {
  const lead_teachers = sequelize.define(
    "lead_teachers",
    {
      lead_teachers_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      academy: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
      },
      exam_speciality: {
        type: DataTypes.STRING,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          unique: false,
          fields: ["mobile_number", "email"],
        },
      ],
    }
  );

  return lead_teachers;
};
