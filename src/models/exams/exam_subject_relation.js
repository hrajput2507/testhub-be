export default (sequelize, DataTypes) => {

    const exam_subject_relation = sequelize.define("exam_subject_relation", {
        esr_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exam_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    return exam_subject_relation

}