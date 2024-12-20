const db = require("../../db/models");
const { Sequelize } = require('sequelize')
const moment = require('moment')
const bcrypt = require('bcrypt');
const Staff = db.Staff;
const Shifts = db.Shifts;
const Levels = db.Levels;
const Tasks = db.Tasks;
const Op = db.Sequelize.Op;

function chooseColor(data){
  var color = '#00f'

  if(data >= 0 && data < 0.25){

    color = '#f00'

  } else if(data >= 0.25 && data < 0.50){

    color = '#ff7f00'

  } else if(data >= 0.50 && data < 0.75){

    color = '#ffcf00'

  } else if(data >= 0.75 && data <= 1){

    color = '#0f0'

  }
  return color
}

// Create and Save a new Staff member
exports.create = (req, res) => {

  const { birthDate, contractHours, name, category, subCategory, usagePrivileges, email, phone} = req.body  
  const member = {
    name: name,
    mail: email,
    password: null,
    phone: phone,
    avatar: null,
    birthdate: birthDate,
    category: category,
    subCategory: subCategory,
    contractHours: contractHours,
    usagePrivileges: usagePrivileges
  }
  Staff.create(member)
  .then((data)=>{
    res.status(200).send({
      member: data,
      message: `${name} à bien été enregistré en BDD !`,
      type:'success'
    })
  })
  .catch((err)=>{
    res.status(500).send({
      message:
        err.message || "Une erreur c'est produite un créant l'employé(e) !",
      type: 'danger'
    })
  })
};

// Retrieve all staff members from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;

  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Staff.findAll({ attributes: {exclude: ['password']}, where: condition, include:{all: true} })
    .then(async (data) => {
      await data.forEach(member => {
        const date = moment(member.birthdate).format()
        console.log(`member: ${member.name}  date: ${date}`)
        const birtDateApp = [moment(moment(date)).get('year'), (moment(moment(date)).get('month')+1), moment(moment(date)).get('date')]
        console.log(`member: ${member.name}  date app: ${birtDateApp}`)
        // const birthDateJs = moment(moment(birthDate).format()).toDate()
        // console.log('birth date js : ', birthDateJs)
        member.dataValues.birthdate = birtDateApp
        member.dataValues.connectedStatus = 'disconnected'
      });
      // console.log(data[0])
      res.send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Il y a eu une erreur pour retrouver la liste des employé(e)s !!!",
          type:'danger'
      });
    });
};

// Find a single staff member with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const date = req.params.date
  const memberLevel = []
  try {
    let member = await Staff.findOne({
      where: {id: id},
      include:[{
        model: Shifts,
        require: false,
        where:{
          date:{[Op.eq]: date}
        }
      },{
        model: Levels,
        require: false
      },{
        model: Tasks,
        require: false,
        where:{
          date:{[Op.eq]: date}
        }
      }]
    })

    const kitchenAvg = await Levels.findAll({
      where: {StaffId: id, category: 'Kitchen'},
      attributes: [
        [Sequelize.fn('AVG', Sequelize.cast(Sequelize.col('value'), 'float')), 'avgKitchen']
      ]
    })

    const LobbyAvg = await Levels.findAll({
      where: {StaffId: id, category: 'lobby'},
      attributes: [
        [Sequelize.fn('AVG', Sequelize.cast(Sequelize.col('value'), 'float')), 'avgLobby']
      ]
    })

    const cleaningAvg = await Levels.findAll({
      where: {StaffId: id, category: 'Cleaning'},
      attributes: [
        [Sequelize.fn('AVG', Sequelize.cast(Sequelize.col('value'), 'float')), 'avgCleaning']
      ]
    })

    const deliveryAvg = await Levels.findAll({
      where: {StaffId: id, category: 'Delivery'},
      attributes: [
        [Sequelize.fn('AVG', Sequelize.cast(Sequelize.col('value'), 'float')), 'avgDelivery']
      ]
    })

    const kitchenData = {
      value: ['Cuisine',(kitchenAvg[0].dataValues.avgKitchen*100)],
      itemStyle:{
        color: chooseColor(kitchenAvg[0].dataValues.avgKitchen)
      }
    }

    const lobbyData = {
      value: ['Comptoir', (LobbyAvg[0].dataValues.avgLobby*100)],
      itemStyle:{
        color: chooseColor(LobbyAvg[0].dataValues.avgLobby)
      }
    }

    const cleaningData = {
      value: ['Nettoyage', (cleaningAvg[0].dataValues.avgCleaning*100)],
      itemStyle:{
        color: chooseColor(cleaningAvg[0].dataValues.avgCleaning)
      }
    }

    const deliveryData = {
      value: ['Livraison', (deliveryAvg[0].dataValues.avgDelivery *100)],
      itemStyle:{
        color: chooseColor(deliveryAvg[0].dataValues.avgDelivery)
      }
    }

    memberLevel.push(kitchenData, lobbyData, cleaningData, deliveryData)

    // if(levels.length > 0){

    // }
  
    if(member){
      const birthDate = moment.tz(member.birthDate, 'Europe/Paris').format('DD MM YYYY HH:mm')
      console.log('birth date : ', birthDate)
      const birthDateJs = moment(birthDate).toDate()
      console.log('birth date js : ', birthDateJs)
      member.birthDate = birthDateJs
      res.send({
        member: member,
        memberLevel: memberLevel
      })
    } else {
      res.status(404).send({
        message: `Impossible de retrouver l'employé(e) avec l'id=${id}.`,
        type:'danger'
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Une erreur c'est produite dans la requéte pour trouver l'employé(e) avec l'id=" + id,
      type:'error'
    });
  }
};

// Update a staff member by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Staff.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "La mise à jour c'est déroulé avec succés !",
        type:'success'
      });
    } else {
      res.send({
        message: `maj impossible de l'employé(e) avec l'id=${id} !`,
        type:'error'
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Erreur pendant la mise à jour de l'employé(e) avec l'id=" + id,
      type:'error'
    });
  });
};

// Delete a staff member with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Staff.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "l'employé(e) à été supprimé de la bdd !",
          type:'success'
        });
      } else {
        res.send({
          message: `impossible de supprimer l'employé(e) avec l'id=${id} !`,
          type:'error'
        });
      }
    })
    .catch(err => {
      console.log('err: ', err)
      res.status(500).send({
        message: "impossible de supprimer l'employé(e) avec l'id=" + id,
        type:'danger'
      });
    });
};
