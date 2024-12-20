const db = require("../../db/models");
const moment = require('moment');
const { Sequelize } = require('sequelize');
const Staff = db.Staff;
const Requests = db.Request;
const Op = db.Sequelize.Op;

function setStatus(status){
  data = {
    color: null,
    label: ''
  }

  if(status === 'refused' ){

    data.color = '#ff000073'
    data.label = 'refusé'

  } else if(status === 'being processed' ){

    data.color = '#fff60073'
    data.label = 'en cours'

  } else if(status === 'accepted' ){

    data.color = '#43ff6473'
    data.label = 'accepté'

  }
  return data
}

// Create and Save a new Staff member
exports.create = (req, res) => {

  const { } = req.body  
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
  const {status, startPeriod, endPeriod} = JSON.parse(req.params.filter);

  var condition = status !== undefined && startPeriod !== undefined  ? { 
    [Op.and]: [
      { 
        [Op.or] : [
          {startPeriod : {[Op.between]: [startPeriod, endPeriod]}},
          {endPeriod : {[Op.between]: [startPeriod, endPeriod]}}
        ]
      },
      {status: { [Op.like]: status }},
    ]
  } : null;

  Requests.findAll({ where: condition, include:{all: true} })
    .then(async (requests) => {

      console.log('requests: ', requests.length)
      const data = []
      await requests.forEach(request => {
        const status = setStatus(request.status)

        data.push({
          id: request.id,
          creationDate: request.creationDate,
          contents: request.contents,
          title: request.title,
          startPeriod: moment(request.startPeriod).format('DD/MM/YYYY'),
          endPeriod: moment(request.endPeriod).format('DD/MM/YYYY'),
          status: status,
          Staff: request.Staff
        })
      });
      res.send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Il y a eu une erreur pour retrouver la liste des demandes !!!",
          type:'danger'
      });
    });
};

// Find a single staff member with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const request = await Requests.findOne({
      where: {id: id},
      include:[{
        model: Staff,
        require: false,
        where:{
          date:{[Op.eq]: id}
        }
      }]
    })
  
    if(request){
      res.send(request)
    } else {
      res.status(404).send({
        message: `Impossible de retrouver la demande avec l'id=${id}.`,
        type:'danger'
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Une erreur c'est produite dans la requéte pour trouver la demande avec l'id=" + id,
      type:'error'
    });
  }
};

// Update a staff member by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Requests.update(req.body, {
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