const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const potionSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        ingredients: [{
            type: String,
            trim: true
        }],
        descriptions: String,
        effects: String,
        creator: String,
        img_url: String
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
    }
);

const Potion = model("Potion", potionSchema);

module.exports = Potion;
