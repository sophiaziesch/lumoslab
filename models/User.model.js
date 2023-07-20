const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    potions: [{
      type: Schema.Types.ObjectId,
      ref: "Potion"
    }],
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: "Potion"
    }],
    img_url: {
      type: String,
      default: "/images/default_sorcerer.png"
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
