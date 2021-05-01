const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");

routes.get("/getUsuarios", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      return res.send(err);
    } else {
      conn.query("SELECT * FROM TB_USUARIO", (err, rows) => {
        if (err) {
          return res.send(err);
        } else {
          let json = {
            ID_USUA: rows[0].ID_USUA,
            NO_USUA: rows[0].NO_USUA,
            EMAIL_USUA: rows[0].EMAIL_USUA,
            MOVIL_USUA: rows[0].MOVIL_USUA,
            DIRECCION_USUA: rows[0].DIRECCION_USUA,
            FECHA_NACIMIENTO_USUA: calcularEdad(rows[0].FECHA_NACIMIENTO_USUA),
            ESTADO_USUA: rows[0].ESTADO_USUA
          }
          // console.log(json)
          res.json(json);

        }
      });
    }
  });
}); //LISTO

function verificarToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

function calcularEdad(fecha) {
  var hoy = new Date();
  var cumpleanos = new Date(fecha);
  var edad = hoy.getFullYear() - cumpleanos.getFullYear();
  var m = hoy.getMonth() - cumpleanos.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
  }

  return edad;
}

module.exports = routes;
