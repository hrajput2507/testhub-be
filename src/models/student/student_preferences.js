export default (sequelize, DataTypes) => {
  const student_preferences = sequelize.define("student_preferences", {
    student_preferences_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exams: {
      type: DataTypes.TEXT("long"),
    },
    whatsapp_notification: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    sms_notification: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    email_notification: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  });

  return student_preferences;
};
