export default (sequelize, DataTypes) => {

    const test = sequelize.define("test", {
        test_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        test_series_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        academy_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.STRING
        },
        subjects: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        },
        is_deleted: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        }
    }, {
        indexes: [
            {
                unique: false,
                fields: ['title', 'test_series_id']
            }
        ]
    })

    return test

}