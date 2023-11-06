export default (sequelize, DataTypes) => {

    const exam_subject = sequelize.define("exam_subject", {
        subject_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['subject']
            }
        ]
    })

    return exam_subject

}