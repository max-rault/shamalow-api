const db = require("../../db/models");
const moment = require("moment");
const Shifts = db.Shifts;
const Staff = db.Staff;
const Tasks = db.Tasks;
const Levels = db.Levels
const Op = db.Sequelize.Op;

const PARAMS = {
  tasksArray:[
    {
      label: 'Encaissement Drive',
      x:228.21316614420084,
      y:375.79937304075247,
    },
    {
      label: 'Prise de commande',
      x:369.7178683385582,
      y:371.15987460815063,
    },
    {
      label: 'verification drive',
      x:309.40438871473384,
      y:1711.9749216300943,
    },
    {
      label: 'froid drive',
      x:309.40438871473384,
      y:2008.9028213166148,
    },
    {
      label: 'chaud drive',
      x:638.8087774294675,
      y:1711.9749216300943,
    },
    {
      label: 'froid borne 1',
      x:822.0689655172416,
      y:1711.9749216300943,
    },
    {
      label: 'froid borne 2',
      x:1003.009404388715,
      y:1711.9749216300943,
    },
    {
      label: 'froid borne 3',
      x:1207.1473354231978,
      y:1711.9749216300943,
    },
    {
      label: 'chaud borne 1',
      x:682.8840125391853,
      y:2008.9028213166148,
    },
    {
      label: 'chaud borne 2',
      x:928.7774294670851,
      y:2008.9028213166148,
    },
    {
      label: 'chaud borne 3',
      x:1179.3103448275867,
      y:2008.9028213166148,
    },
    {
      label: 'lobby 1',
      x:372.03761755485925,
      y:2333.6677115987463,
    },
    {
      label: 'lobby 2',
      x:710.7210031347965,
      y:2333.6677115987463,
    },
    {
      label: 'loby 3',
      x:1128.2758620689658,
      y:2333.6677115987463,
    },
    {
      label: 'frites 1',
      x:309.40438871473384,
      y:1517.1159874608154,
    },
    {
      label: 'frites 2',
      x:309.40438871473384,
      y:1517.1159874608154,
    },
    {
      label: 'snacks 1',
      x:309.40438871473384,
      y:1132.0376175548593,
    },
    {
      label: 'snacks 2',
      x:309.40438871473384,
      y:965.0156739811914,
    },
    {
      label: 'whopper 1',
      x:613.291536050157,
      y:1006.7711598746083,
    },
    {
      label: 'Master 1',
      x:757.1159874608154,
      y:1006.7711598746083,
    },
    {
      label: 'whopper 2',
      x:613.291536050157,
      y:1201.6300940438875,
    },
    {
      label: 'Master 2',
      x:757.1159874608154,
      y:1201.6300940438875,
    },
    {
      label: 'petit burger 1',
      x:613.291536050157,
      y:1377.9310344827588,
    },
    {
      label: 'Spe 1',
      x:757.1159874608154,
      y:1377.9310344827588,
    },
    {
      label: 'petit burger 2',
      x:613.291536050157,
      y:1563.5109717868343,
    },
    {
      label: 'Spe 2',
      x:757.1159874608154,
      y:1563.5109717868343,
    },
    {
      label: 'DCB 1',
      x:1026.2068965517244,
      y:1582.0689655172416,
    },
    {
      label: 'DCB 2',
      x:1216.4263322884015,
      y:1582.0689655172416,
    },
    {
      label: 'broiler 1',
      x:594.7335423197494,
      y:746.959247648903,
    },
    {
      label: 'broiler 2',
      x:808.1504702194359,
      y:746.959247648903,
    },
    {
      label: 'preparation',
      x:1114.35736677116,
      y:1136.677115987461,
    },
    {
      label: 'plonge 1',
      x:1026.2068965517244,
      y:858.3072100313481,
    },
    {
      label: 'plonge 2',
      x:1221.0658307210035,
      y:858.3072100313481,
    },
  ],
}

// Create and Save a new tasks
exports.create = async (req, res) => {

  try {
    const date = new Date(req.body?.date)
    const staffMembers = await Staff.findAll({
      include:{
        model: Shifts,
        required: false,
        where:{
          date: {[Op.eq]: date},
          status: {[Op.eq]: 'Active'}
        }
      }
    })
    const tasksData = []
    const chartData = []
    const data = []
    const { tasksArray } = PARAMS;
    if(staffMembers){
     await staffMembers.forEach(member => {
        // const tasks = member.tasks
        const shifts = member.Shifts
        let tasksCount = 0
        if(shifts){
          shifts.forEach(shift => {
            if(moment(moment(date).format('YYYY-DD-MM')).isSame(moment(shift.date).format('YYYY-DD-MM')) && tasksCount < 2){
              const tasksChart = tasksArray[Math.round(Math.random()*(tasksArray.length-1))]

              if(shift.status === "Active"){
                data.push(
                  {
                    start: shift.start, 
                    end: shift.end,
                    x: tasksChart.x,
                    y: tasksChart.y,
                    label: tasksChart.label,
                    date: date,
                    StaffId: member.id,
                    PeriodId: shift.PeriodId
                  },
                );
                tasksCount ++
                chartData.push(
                  {
                    name:tasksChart?.label,
                    value:[tasksChart?.x, tasksChart.y, `${member.name} de ${moment(tasksChart.start).format('HH:mm')} à ${moment(tasksChart.end).format('HH:mm')}`],
                    symbol:`image://${member.avatar}` ,
                  },
                )
              }
            }
          });
          tasksData.push({
            StaffId: member.id,
            memberName: member.name,
            memberAvatar: member.avatar,
            tasks: data
          })
        }
      });

      Tasks.bulkCreate(data,{ignoreDuplicates: false})
      res.status(201).send({
        tasksData: tasksData,
        chartData: chartData
      })
    }
  } catch (error) {
    console.log('err in create tasks: ', error)
    res.status(500).send({
      message:
        error.message || "Une erreur c'est produite en créant les tâches !",
      type: 'danger'
    })
  }
};

// Retrieve all Tasks by period from the database.
exports.findAll = async (req, res) => {
  const periodId = req.params.period;
  const date = req.params.date;

  try {
    const tasksData = []
    const chartData = []
    const data = []
    const staffMembers = await Staff.findAll({
      include:[{
        model: Shifts,
        require: false,
        where:{
          date:{[Op.eq]: date},
          PeriodId: {[Op.eq]: periodId}
        }
      },{
        model: Levels,
        require: false
      },{
        model: Tasks,
        require: false,
        where:{
          date:{[Op.eq]: date},
          PeriodId: {[Op.eq]: periodId}
        }
      }] 
    })

    await staffMembers.forEach((member) =>{
      member.Tasks.forEach((task) =>{
        data.push(task);
        chartData.push(
          {
            name:task.label,
            value:[task.x, task.y, `${member.name} de ${moment(task.start).format('HH:mm')} à ${moment(task.end).format('HH:mm')}`],
            symbol:`image://${member.avatar}` ,
          },
        )
      })
      tasksData.push({
        StaffId: member.id,
        memberName: member.name,
        memberAvatar: member.avatar,
        tasks: data
      })
    })

    res.status(200).send({
      tasksData: tasksData,
      chartData: chartData
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:
        error.message || "Il y a eu une erreur pour retrouver la liste des tache !!!",
        type:'danger'
    });
    
  }
};

// Find a single shift with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Shifts.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Impossible de retrouver l'employé(e) avec l'id=${id}.`,
          type:'danger'
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Une erreur c'est produite dans la requéte pour trouver l'employé(e) avec l'id=" + id,
        type:'error'
      });
    });
};

// Update a shift by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Shifts.update(req.body, {
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

// Delete a shift with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Shifts.destroy({
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