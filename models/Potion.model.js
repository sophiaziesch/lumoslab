const { Schema, model } = require("mongoose");

const potionSchema = new Schema(
   {
      name: {
         type: String,
         unique : true,
         trim: true,
         required: true,
      },
      ingredients: [
         {
            type : String,
            trim: true
         }
      ],
      difficulty: {
         type: String
      },
      characteristics: String,
      time: Number,
      effects: String,
      sideEffects: String,
      inventor: String,
      img_url: {
         type : String,
         default: "/images/default_pot.png"
      }
   },
   {
      // this second object adds extra properties: `createdAt` and `updatedAt`    
      timestamps: true
   }
);

const Potion = model("Potion", potionSchema);

module.exports = Potion;
