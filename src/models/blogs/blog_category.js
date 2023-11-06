export default (sequelize, DataTypes) => {

    const blog_category = sequelize.define("blog_category", {
        blog_category_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        indexes: [
            {
                unique: true,
                fields: ['slug']
            }
        ]
    })

    return blog_category

}