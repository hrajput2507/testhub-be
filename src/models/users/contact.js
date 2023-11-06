export default (sequelize, DataTypes) => {

    const contact = sequelize.define("contact", {
        contact_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        institute_name: {
            type: DataTypes.STRING
        },
        message: {
            type: DataTypes.TEXT('long')
        },
    }, {
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ]
    })

    return contact

}