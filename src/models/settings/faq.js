export default (sequelize, DataTypes) => {

    const faq = sequelize.define("faq", {
        faq_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'HOME'
        },
        question: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        answer: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
    }, {
        indexes: [
            {
                unique: false,
                fields: ['faq_id']
            }
        ]
    })

    return faq

}