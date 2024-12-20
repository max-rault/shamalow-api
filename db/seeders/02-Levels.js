'use strict';
const db = require('../models')
const Staff = db.Staff

/** @type {import('sequelize-cli').Migration} */
const PARAMS = {
  LevelsData:[
    {
      label: 'Open Cuisine',
      category: 'Kitchen',
    },
    {
      label:'Close cuisine',
      category: 'Kitchen'
    },
    {
      label:'Board Whopper',
      category:'Kitchen'
    },
    {
      label: 'Board Steakhouse',
      category:'Kitchen',
    },
    {
      label:'Board Spé',
      category:'Kitchen',
    },
    {
      label:'Board Petit burger',
      category: 'Kitchen'
    },
    {
      label:'Board DCB/BigKIng/XXL',
      category:'Kitchen'
    },
    {
      label:'Broiler',
      category:'Kitchen'
    },
    {
      label:'frites',
      category:'Kitchen'
    },
    {
      label:'Snacks',
      category:'Kitchen'
    },
    {
      label:'open comptoir',
      category:'Counter'
    },
    {
      label:'close comptoire',
      category:'Counter'
    },
    {
      label:'caisses',
      category:'Counter'
    },
    {
      label:'Bornes',
      category:'counter'
    },
    {
      label:'Drive',
      category:'counter'
    },
    {
      label:'Hote(sse)',
      category:'lobby'
    },
    {
      label:'open lobby',
      category:'lobby',
    },
    {
      label:'close lobby',
      category:'lobby'
    },
    {
      label:'preparation',
      category:'Kitchen',
    },
    {
      label:'Plonge',
      category:'Cleaning'
    },
    {
      label:'Nettoyage broiler',
      category:'Cleaning'
    },
    {
      label:'Livraison',
      category:'Delivery'
    }
  ]
}
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const staffMembers = await Staff.findAll()
      const Levels = []
      const { LevelsData } = PARAMS
      if(staffMembers){
        await staffMembers.forEach(member => {
          LevelsData.forEach((level)=>{

            Levels.push({
              label: level.label,
              category:level.category,
              value:(Math.random()),
              StaffId:member.id
            })

          })
        });
        await queryInterface.bulkInsert('Levels', Levels)
      }
    } catch (error) {
      console.log(error)
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
