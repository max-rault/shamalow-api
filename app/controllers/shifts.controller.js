const db = require("../../db/models");
const moment = require("moment");
const Shifts = db.Shifts;
const Staff = db.Staff;
const Periods = db.Periods
const Op = db.Sequelize.Op;

const PARAMS = {
  statusArray:[
    {label: 'Actif', value: 'Active', color:undefined, probability: 10},

    {label: 'Repos', value: 'Rest', color: '#00f', probability: 90},
    // {label: 'Formation', value:'educational_training', color:'#0f0'},
    // {label: 'Congés payés', value:'Paid_holidays', color: '#0af'},
    // {label: 'Absence Autorisée', value:'Absence_authorised', color:'#f0a'}
  ]
}

function getWeekday (numberWeek){
  moment.locale('fr')
  const weekStart =  moment().week(numberWeek)

  const weekArray = [
    moment(weekStart).weekday(0),
    moment(weekStart).weekday(1),
    moment(weekStart).weekday(2),
    moment(weekStart).weekday(3),
    moment(weekStart).weekday(4),
    moment(weekStart).weekday(5),
    moment(weekStart).weekday(6),
  ] 
  return weekArray
}

async function setRests(staffMembers, weekDates){

  const statusData = []
  const { statusArray } = PARAMS;
  await staffMembers.forEach((member)=>{
    let status = undefined
    let fisrtRest = weekDates[Math.round(Math.random()*(weekDates.length - 2))]
    let secondRest = moment(fisrtRest).add(1, 'day')

    weekDates.forEach((weekDate, index)=>{

      if(member.contractType < 20 && index < 5){

        status = statusArray[1]

      } else if(member.contractType === 15 && index === 2){

        status = statusArray[0]
        
      }else{
        status = statusArray[0]
      }

      if(member.contractType > 15){

        if(moment(fisrtRest).isSame(weekDate)){
          status = statusArray[1]

        } else if(moment(secondRest).isSame(weekDate)){
          status = statusArray[1]

        }else{
          status = statusArray[0]
        }

        statusData.push({
          member: member,
          date: moment(weekDate).format('YYYY-MM-DD'),
          status: status,
          period: undefined,
          periodCounter: 0,
          nextPeriod:  undefined
        })
      }
    })
  })
  return statusData
}

async function setTeams(statustMember, Periods, weekDates){

  try {
 
    const selectedTeams = []
    let staff = statustMember
    await weekDates.forEach(async (weekDate, weekIndex) =>{

      let date = moment(weekDate).format('YYYY-MM-DD');

      await Periods.forEach(async (period, periodIndex)=>{

        const kitchensStaff = staff.filter((data, index) => data.member.category === 'Cuisine' | data.member.category === 'Nettoyage' && data.status.value === 'Active' && data.date === date);
        const waiterStaff = staff.filter((data, index) => data.member.category === 'Comptoir' && data.status.value === 'Active' && data.date === date);  
      
        var filterWaiter = waiterStaff.filter((data, index) => index < (period.minWaiter - 1) && data.periodCounter < 2)
        var filterKitchen = kitchensStaff.filter((data, index) => index < (period.minKitchen -1)  && data.periodCounter < 2)

        if(periodIndex < 2){
          filterWaiter = waiterStaff.filter((data, index) => data.period === undefined && index < (period.minWaiter - 1))
          filterKitchen = kitchensStaff.filter((data, index) => data.period === undefined  && index < (period.minWaiter - 1))
        } else if(periodIndex >= 2){
          filterWaiter = waiterStaff.filter((data, index) => data.nextPeriod === periodIndex && data.periodCounter < 2)
          filterKitchen = kitchensStaff.filter((data, index) => data.nextPeriod === periodIndex  && data.periodCounter < 2)
        }
        let filterStaff = filterKitchen.concat(filterWaiter)

        await filterStaff.forEach((member) =>{

          const data = {
            member: member.member,
            date: date,
            period: period,
            status: member.status,
            periodCounter: member.periodCounter+1,
            nextPeriod: periodIndex > 2 ? 4:(periodIndex + 2),
            periodId: period.id
          }
          const name = member.member.name

          var condition = (data) => data.member.name === name && data.date === date && data.periodCounter === 0

          if(member.periodCounter > 0){

            condition = (data) => data.member.name === name && data.date === date && data.periodCounter < 2

          }

          const indexToReplace = staff.findIndex(condition)

          if(indexToReplace !== -1){
        
            staff[indexToReplace] = data
            if(periodIndex < 2 && member.periodCounter === 0){
              selectedTeams.push(data)
            } else {
              if(periodIndex === member.nextPeriod && member.periodCounter < 2){
                
                selectedTeams.push(data)
  
              }
            }
          }
        })
      })

      const restMembers = statustMember.filter((data) => data.status.value === 'Rest' && data.date === date)
      await restMembers.forEach(restMember => {

        const data = {
          member: restMember.member,
          date: date,
          period: undefined,
          status: restMember.status,
          periodCounter: 0,
          nextPeriod: undefined
        }
        selectedTeams.push(data)

      });

    }) 

    return selectedTeams
  } catch (error) {
    console.log('error in setTeams: ', error)
  }
}

async function setShifts(selectedTeams, staffMembers, weekDates){

  const shiftsData = []
  const shifts = []
  const chartData = []
  const minutes = [0, 15, 30, 45]

  try {
    await staffMembers.forEach((member)=>{
      const teamFilter = selectedTeams.filter((selection)=> selection.member.name === member.name)
      let hoursPerDay = Math.round((member.contractType/5))

      if(member.contractType < 15){

        hoursPerDay = Math.round(member.contractType/2)

      } else if(member.contractType === 15){
        hoursPerDay = Math.round(member.contractType/3)
      }

      let excedent = 0
      let totalHoursPerDay = 0
      // console.log('team filter ', teamFilter)
  
      weekDates.forEach((weekDate) =>{
  
        let date = moment(weekDate).format('YYYY-MM-DD')
        let numberHours = 0
        const dateFilter = teamFilter.filter((selection) => selection.date === date)

        // console.log(`excedent for ${member.name}: ${excedent} on ${date}`)

        // if(excedent > 0){
        //   excedent = Math.round(excedent /2)
        // }
  
        for (let index = 0; index < dateFilter.length; index++) {

            const status = dateFilter[index].status
           
  
            var start = undefined
            var end = undefined
  
            if(status.value === 'Active'){

              numberHours = (dateFilter[index].period.duration) + numberHours + excedent
              // console.log(`hours for ${member.name} : ${numberHours}/${hoursPerDay} on ${date}`)
              // console.log('period name: ', dateFilter[index].period.name)

              var randomMinutes = minutes[Math.round(Math.random()*(minutes.length-1))]
      
              var startHour = dateFilter[index].period.start
              var endHour = dateFilter[index].period.end
             
              if(dateFilter[index].period.name === 'Soir'){
                randomMinutes = 0

                if(numberHours > hoursPerDay){

                  startHour = startHour - (numberHours - hoursPerDay)

                } else if(numberHours < 0){

                  startHour = startHour + numberHours
                }
                // console.log('start hour: ', startHour)
              } else {

                if(numberHours > hoursPerDay){

                  // endHour = endHour + (numberHours - hoursPerDay)

                  if(endHour === 22){
                    endHour = endHour + (numberHours - hoursPerDay)
                    // console.log('endHour: ', endHour)
                    if(endHour >= 24){
                      randomMinutes = 0
                      excedent = endHour -24
                      endHour = 24

                      // console.log(excedent)
                    }
                  }

                  if((endHour - startHour) >= 6){
                    randomMinutes = 0
                    excedent = (endHour - startHour) - 6

                    // console.log(excedent)

                  }
                  

                } else if(numberHours < 0){

                  endHour = endHour + numberHours
                }
                
              }

              var totalMinutes = (randomMinutes/60)
              var totalShiftHours =  (endHour + totalMinutes) - (startHour + totalMinutes) 
              
              totalHoursPerDay = totalHoursPerDay + totalShiftHours

              // console.log(`${member.name} have ${totalHoursPerDay} h/ ${member.contractType} h on ${date}`)
              start = moment(date).hours(startHour).minutes(randomMinutes);
              end = moment(date).hours(endHour).minutes(randomMinutes);

              chartData.push(
                [member.name,moment(start).format() ,moment(end).format()],
              )
            }
            shifts.push(
              {
                StaffId: member.id,
                start: start, 
                end: end,
                status: status.value,          
                statusLabel: status.label,
                background: status.color,
                weekNumber: moment(date).week(),
                date: date,
                PeriodId: dateFilter[index].periodId
              },
            )
        }
      })
    })
    const data = {
      shiftsData: shiftsData,
      chartData: chartData,
      data: shifts
    }
    return data
  } catch (error) {
    console.log('error in setShifts: ', error)
  }
}

// function chooseRest(shiftVal, restCounts){
//   var { status } = shiftVal
//   const { statusArray } = PARAMS
//   let values = {
//     ...shiftVal,
//     restCounts, restCounts,
//   }

//   if(status.value === 'Rest' && restCounts < 2){

//     values.status = statusArray[1]
//     values.restCounts ++

//   }else if(status.value === 'Active' && restCounts === 1){

//     values.status = statusArray[1]
//     values.restCounts ++

//   } else {
//     values.status = statusArray[0]

//   }
//   return values
// }

// Create and Save a new shifts
exports.create = async (req, res) => {

  try {

    const weekDates = getWeekday(req.body?.weekNumber)
    const staffMembers = await Staff.findAll({
      include:{
        model: Shifts,
        required:false,
        where:{
          weekNumber: {[Op.eq]: req.body?.weekNumber}
        }
      }
    })

    const allPeriods = await Periods.findAll()
 
    // const data = []
    // const shifts = []
    // const chart = []
    let shiftsData = {
      data: [],
      chartData: [],
      shiftsData: []
    }

    const { statusArray } = PARAMS;
    if(staffMembers){

      if(staffMembers[0].Shifts.length === 0){

        const shuffleMembers = staffMembers.sort((a, b) =>0.5 - Math.random())

        const memberStatus = await setRests(shuffleMembers, weekDates)
        const selectedTeams = await setTeams(memberStatus, allPeriods, weekDates)
        shiftsData = await setShifts(selectedTeams, staffMembers, weekDates)
        if(staffMembers[0]?.Shifts.length === 0){
          await Shifts.bulkCreate(shiftsData.data)
         }
      } else {
        await staffMembers.forEach((member) =>{
          shiftsData.data.push({
            StaffId: member.id,
            memberName: member.name,
            memberAvatar: member.avatar,
            shifts: member.Shifts
          })

          member.Shifts.forEach((shift) =>{
            if(shift.status === 'Active'){
  
              shiftsData.chartData.push(
                [member.name,moment(shift.start).format() ,moment(shift.end).format()],
              )
            }
          })
        })
      }
      // console.log('shifts data: ', shiftsData)
      res.status(201).send({
        shiftsData: shiftsData.data,
        chartData: shiftsData.chartData
      })

      //For future: make a function who setPeriods with team and return an array with dates member Name and period data
      //And in second time make function who affinate shifts hours

           

      // await staffMembers.forEach(member => {
      //   let restCounts = 0
      //   let totalHours = 0
      //   let remainingHours = member.contractType
      //   weekDates.forEach((weekDayDate, index)=>{
      //     const shifts = member.Shifts
      //     const minutes = [0,15,30,45]

      //     let date = moment(weekDayDate).format('YYYY-MM-DD')
      //     const randomStatus = chooseStatus()
      //     let status = {}
      //     let shiftParams = {
      //       status: randomStatus,
      //       restCounts: restCounts,
      //       contractType: member.contractType,
      //       period:{},
      //       lastIndex: 0,
      //       hoursPerDay: member.contractType < 20 ? Math.round(member.contractType/2) :Math.round(member.contractType/5),
      //       remainingHours: remainingHours,
      //       shiftNumber: (Math.round(Math.random()*1))+1,
      //       lastPeriodHour: 11,
      //     }

      //     if(member.contractType < 20 && index < 5){

      //       status = statusArray[1]

      //     } else if(member.contractType < 20 && index > 4) {

      //       status = statusArray[0]

      //     } else {

      //       shiftParams = chooseRest(shiftParams, restCounts)
      //       restCounts = shiftParams.restCounts
      //       status = shiftParams.status
      //     }

      //     if(shifts.length === 0){

      //       if(status.value === 'Active'){
      //         for(var index = 0; index < shiftParams.shiftNumber; index ++){
  
      //           shiftParams = choosePeriods(shiftParams, index)
      //           const { period } =  shiftParams
      //           remainingHours = shiftParams.remainingHours
      //           console.log("remaining hours: ", remainingHours)

      //           // if(member.contractType < (totalHours + totalShiftHours) && period.label !== 'Soir'){
      //           //   startHour = period.start + Math.round(timeAdded/2)
      //           //   endHour = period.end - Math.round(timeAdded/2)
      //           //   totalShiftHours = (endHour + totalMinutes) - (startHour + totalMinutes)
      //           // }

      //           totalHours = totalHours + totalShiftHours

                
      //           // console.log('total hours', totalHours)
      //         }
      //       } else {
      //         data.push({
      //           StaffId: member.id,
      //           status: status.value,          
      //           statusLabel: status.label,
      //           background: status.color,
      //           weekNumber: moment(date).week(),
      //           date: date,
      //         })

      //         prevDay = {
      //           StaffId: member.id,
      //           status: status.value,          
      //           statusLabel: status.label,
      //           background: status.color,
      //           weekNumber: moment(date).week(),
      //           date: date,
      //         }
      //       }
      //       shiftsData.push({
      //         StaffId: member.id,
      //         memberName: member.name,
      //         memberAvatar: member.avatar,
      //         shifts:data
      //       })
            
      //     } else {
          
      //   });

      // })
    }
  } catch (error) {
    console.log('err in create shifts: ', error)
    res.status(500).send({
      message:
        error.message || "Une erreur c'est produite en créant les shifts !",
      type: 'danger'
    })
  }
};

// Retrieve all shifts from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Shifts.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Il y a eu une erreur pour retrouver la liste des employé(e)s !!!",
          type:'danger'
      });
    });
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