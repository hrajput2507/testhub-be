export default (sequelize, DataTypes) => {

    const cart = sequelize.define("cart", {
        cart_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        test_series_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    return cart
}