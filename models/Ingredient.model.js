const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const ingredientSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        descriptions: String
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
    }
);

const Ingredients = model("Ingredients", ingredientSchema);

module.exports = Ingredients;
