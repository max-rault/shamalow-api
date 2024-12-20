const db = require("../../db/models");
const moment = require('moment');
const { Sequelize } = require('sequelize')
const Staff = db.Staff;
const Stats = db.Stats;
const Op = db.Sequelize.Op;

// Retrieve all staff members from the database.
const contractArray = [5, 10, 15, 20, 24, 30, 35]
exports.findAll = async (req, res) => {
  try {
    const contractStats = []
    const turnOverStats = {
      join: [],
      leave: []
    }
    const levelsStats = {
      kitchen: [],
      counter: [],
      cleaning: []
    }
    await contractArray.forEach(async (contract) => {
      const sum = await Staff.findAll({
        where: {contractType: contract},
      })
      contractStats.push({
        value: sum.length,
        name: `${contract} h`,
      })
    });
    const allContract = await Staff.findAll()

    const allStats = await Stats.findAll({
      where:{
        date: {
          [Op.between]: [moment().subtract(1,'year').month(1).day(1), moment().subtract(1,'year').month(12).day(31)]
        }
      }
    })

    await allStats.forEach((stat)=>{
      turnOverStats.join.push(stat.staffJoining)
      turnOverStats.leave.push(stat.staffLeaving)

      levelsStats.kitchen.push(stat.avgKitchen)
      levelsStats.counter.push(stat.avgCounter)
      levelsStats.cleaning.push(stat.avgCleaning)
    })

    res.send({
      contractStats: contractStats,
      turnOverStats: turnOverStats,
      levelsStats: levelsStats
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:
        error.message || "Il y a eu une erreur pour générer les stats !!!",
        type:'danger'
    });
  }
};