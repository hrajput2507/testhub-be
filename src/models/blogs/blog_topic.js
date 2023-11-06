export default (sequelize, DataTypes) => {

    const blog_topic = sequelize.define("blog_topic", {
        blog_topic_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        topic: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        blog_category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        indexes: [
            {
                unique: true,
                fields: ['slug']
            }
        ]
    })

    return blog_topic

}