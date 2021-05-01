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
          let array_Result = [];
          for (let i = 0; i < rows.length; i++) {
            const element = rows[i];
            let json = {
              ID_USUA: element.ID_USUA,
              NO_USUA: element.NO_USUA,
              EMAIL_USUA: element.EMAIL_USUA,
              MOVIL_USUA: element.MOVIL_USUA,
              DIRECCION_USUA: element.DIRECCION_USUA,
              FECHA_NACIMIENTO_USUA: calcularEdad(element.FECHA_NACIMIENTO_USUA),
              ESTADO_USUA: element.ESTADO_USUA
            }
            array_Result.push(json)
          }
          
          // console.log(json)
          res.json(array_Result);

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
