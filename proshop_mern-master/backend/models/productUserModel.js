import mongoose from 'mongoose'

const productUserSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        productId: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

const ProductUser = mongoose.model('ProductUser', productUserSchema)

export default ProductUser
