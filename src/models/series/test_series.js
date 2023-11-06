export default (sequelize, DataTypes) => {
  const test_series = sequelize.define(
    "test_series",
    {
      test_series_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      academy_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "en",
      },
      hash: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      description: {
        type: DataTypes.TEXT,
      },
      cover_photo: {
        type: DataTypes.TEXT,
      },
      total_tests: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      free_tests: {
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.INTEGER,
      },
      discount: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      is_deleted: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["hash"],
        },
        {
          unique: false,
          fields: ["title", "exam_id", "academy_id"],
        },
      ],
    }
  );

  return test_series;
};
