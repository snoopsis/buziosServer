const mongoose = require("mongoose");

const WindySchema = mongoose.Schema({
  data: {
    type: String
  },
  onda: {
    type: String
  },
  ondaPeriodo: {
    type: String
  },
  prev: {
    type: String
  },
  tempoBarco: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("condicoes", WindySchema);
