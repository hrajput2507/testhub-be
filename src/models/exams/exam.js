export default (sequelize, DataTypes) => {

    const exam = sequelize.define("exam", {
        exam_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        exam: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        default_pattern: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['slug']
            }
        ]
    })

    return exam

}