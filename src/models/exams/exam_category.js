export default (sequelize, DataTypes) => {

    const exam_category = sequelize.define("exam_category", {
        exam_category_id: {
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

    return exam_category

}