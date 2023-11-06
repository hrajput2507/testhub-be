export default (sequelize, DataTypes) => {

    const user_teacher = sequelize.define("user_teacher", {
        teacher_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password_reset_token: {
            type: DataTypes.STRING
        },
        avatar: {
            type: DataTypes.STRING
        },
        bio: {
            type: DataTypes.TEXT
        },
        roles: {
            type: DataTypes.TEXT
        },
        academy_id: {
            type: DataTypes.INTEGER
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ]
    })

    return user_teacher

}