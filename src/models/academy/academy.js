export default (sequelize, DataTypes) => {

    const academy = sequelize.define("academy", {
        academy_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        academy_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        display_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        logo: {
            type: DataTypes.TEXT
        },
        contact_email: {
            type: DataTypes.STRING
        },
        website: {
            type: DataTypes.STRING
        },
        contact_phone: {
            type: DataTypes.STRING
        },
        about: {
            type: DataTypes.STRING
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['slug']
            },
            {
                unique: false,
                fields: ['academy_name', 'display_name']
            }
        ]
    })

    return academy

}