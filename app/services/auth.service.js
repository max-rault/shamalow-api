const { Sequelize } = require('sequelize')
const bcrypt = require('bcrypt');
const db = require("../../db/models");
require('dotenv').config()
const Staff = db.Staff;
const defaultPwd = process.env.DEFAULT_PASSWORD;
const saltRounds = parseInt(process.env.SALT);

const signIn  = async (req, res) =>{
  try {

    const values = req.body;
    const { mail, pwd, minLevel } = values;
    var changePWd = false
    let badLevel = false;
    const user = await Staff.findOne({
      where:{
        mail: mail
      }
    })

    if(!user){

      res.status(401).send({
        message: "Erreur d'adresse mail !!!"
      })

    } else {

      if(user.usagePrivileges !== minLevel){
        badLevel = true
      }
      console.log('pwd: ', pwd)
      const pwdValid = await bcrypt.compare(pwd, user.password)

      if(!pwdValid){

        res.status(401).send({
          message: "Le mots de passe n'est pas valide !!!!"
        })
      } else {
        console.log('default pwd: ', defaultPwd)
        if(pwd === defaultPwd){
          changePWd = true
        }
        res.status(200).send({
          badLevel: badLevel,
          changePWd: changePWd,
          user: user
        })
      }
    }
  } catch (error) {
    console.log('err: ', error)
    res.status(500).send({
      message:
        error.message || "Il y a eu une erreur pendant l'authentification !",
        type:'danger'
    });
  }
}

const getUser = async (req, res) =>{
 try {
  const id = req.params.id;
  const user = await Staff.findOne({
    where:{
      id: id
    }
  })

  res.status(200).send({
    user: user
  })
 } catch (error) {
  console.log('err: ', error)
  res.status(500).send({
    message:
      error.message || "Il y a eu une erreur pour récupérer le compte !",
      type:'danger'
  });
 }
}

const updateAccount = async (req, res) =>{
  try {
    const user  = req.body
    const saltPwd = await bcrypt.hash(user.password, saltRounds);

    user.password = saltPwd
    const updatedUser = await Staff.update(user, {
      where: { id: user.id }
    })
    console.log('updatedUser: ', updatedUser)
    delete user.password
    res.status(200).send({
      user: user
    })
    // .then(num => {
    //   if (num == 1) {
    //     res.send({
    //       message: "La mise à jour c'est déroulé avec succés !",
    //       type:'success'
    //     });
    //   } else {
    //     res.send({
    //       message: `maj impossible de l'employé(e) avec l'id=${id} !`,
    //       type:'error'
    //     });
    //   }
    // })
  } catch (error) {
    console.log('err: ', error)
    res.status(500).send({
      message:
        error.message || "Il y a eu une erreur pour modifier le compte !",
        type:'danger'
    });
   }
}

module.exports = {
  signIn,
  getUser,
  updateAccount
}