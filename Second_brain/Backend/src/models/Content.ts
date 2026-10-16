import { model } from "mongoose";

const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["link", "note", "videos"],
    },

    tags: {
      type: [String],
      default: [],
    },

    metadata: {
      source: String,
      thumbnail: String,
      author: String,
      duration: Number,
      description: String,
    },

    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ContentModel = model("content", contentSchema);

export default ContentModel;