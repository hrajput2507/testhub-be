export default (sequelize, DataTypes) => {
  const exam_content = sequelize.define("exam_content", {
    exam_content_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    logo: {
      type: DataTypes.TEXT,
    },
    short_description: {
      type: DataTypes.TEXT,
    },
    sections: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    faqs: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    popular_series: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    meta_title: {
      type: DataTypes.TEXT,
    },
    meta_description: {
      type: DataTypes.TEXT,
    },
    meta_keywords: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  return exam_content;
};
