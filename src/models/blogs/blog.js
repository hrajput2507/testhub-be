export default (sequelize, DataTypes) => {
  const blog = sequelize.define(
    "blog",
    {
      blog_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      blog_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      blog_topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      featured_image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      short_description: {
        type: DataTypes.TEXT,
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
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
      is_deleted: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["slug"],
        },
      ],
    }
  );

  return blog;
};
