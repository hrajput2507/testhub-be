export default (sequelize, DataTypes) => {

    const question = sequelize.define("question", {
        question_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        test_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        question: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        options: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        solution: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        difficulty_level: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        },
        topic: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        },
        sub_topic: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        },
        index: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        indexes: [
            {
                unique: false,
                fields: ['test_id', 'question_id']
            }
        ]
    })

    return question

}