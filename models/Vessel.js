const mongoose = require("mongoose");

const VesselSchema = mongoose.Schema({
  img: {
    type: String
  },
  atualizacao: {
    type: String
  },
  area: {
    type: String
  },
  porto: {
    type: String,
    default: ""
  },
  posicao: {
    type: String
  },
  estado: {
    type: String
  },
  velocidadeproa: {
    type: String
  },
  ventokt: {
    type: String
  },
  ventodir: {
    type: String
  },
  temperatura: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("detail", VesselSchema);
