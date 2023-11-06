export default (sequelize, DataTypes) => {
  const student_tests = sequelize.define("student_tests", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    test_session_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    test_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    test_series_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    response: {
      type: DataTypes.TEXT("long"),
    },
    session_time: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_submitted: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    is_completed: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
  });

  return student_tests;
};
