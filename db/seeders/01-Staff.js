const moment = require('moment');
require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT);
const defaultPwd = process.env.DEFAULT_PASSWORD;

'use strict';

const PARAMS = {
  seedArray:[
    'Felix','Lilly','Fluffy',
    'Abby','Maggie','Dusty',
    'Charlie','George','Sammy',
    'Daisy','Whiskers','Bandit',
    'Tinkerbell','Pepper','Oreo',
    'Bella','Peanut','Cuddles',
    'Zoe','Milo','Rascal',
    'Nala','Muffin','Boots',
    'Bella','Chloe','Salem',
    'Ginger','Trouble','Buddy'
  ],
  name:[
    "zineb aakirich", "cléa batisse", "ines sire", 
    "margot dupouy", "samira touenti", "rachka ankidine", 
    "corine davis", "sarah landreau", "bastien royer", 
    "mathias brouzes", "léa goncalves", "julie massol dieu",
    "shanice bompard", "nathan boulingui", "dylan bussaglia",
    "antoine cailliette", "lilly castellot", "louis chouc",
    "emma combes", "melvine deolivera", "mathieu durancet",
    "yoann fernandez", "florian ferraris", "noah garcia",
    "anfouza hatime", "severinne jennebauffe", "kaddour-guettaoui",
    "celia pastor", "mickael pavadé", "lucas pierrot", "claire prevot",
    "maxime rault", "emerick robert", "mathieu robert",
    "hassani said", "nicolas sansouert", "zakarya sidibe",
    "lucas staller", "stephanie zephir",
    "mickael le floch"
  ],
  category:["Comptoir", "Cuisine", "Nettoyage"],

  subCat:["Equipier", "Responsable", "Leader","Manager"],
  userLevel: ["super admin", "Admin", "utilisateur"],
  contract:[5, 10, 15, 20, 24, 30, 35],
}

function chooseCat(){
  const n = Math.random() * 100

  switch (true) {
    case n < 10:
      return "Nettoyage"
    case n >= 10 && n < 45:
      return "Comptoir"
    case n >= 45 && n <=100:
      return "Cuisine"
    default:
      return "Cuisine"
  }
}

function chooseContractType(age){
  // const n = Math.random() * 100

  switch (true) {
    case age < 18:
      return [5, 10, 15]

    case age >= 18 && age  < 30:

      return [20,24]

    case  age >= 30:
      return [30, 35]
    default:
      return [5, 10, 15,20, 24, 30, 35]
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const staffArray = []
      const { seedArray, subCat, userLevel, name } = PARAMS;
      const minDate = new Date(1984, 1, 1)
      const maxDate = new Date(2008, 1, 1)

      const saltPwd = await bcrypt.hash(defaultPwd, saltRounds);
      name.forEach((name)=>{

        var choosenLevel = userLevel[2]
        const url = `https://api.dicebear.com/7.x/adventurer/png?seed=${seedArray[Math.round(Math.random()*seedArray.length-1)]}`
        // const contractHours = contract[Math.round(Math.random()*(contract.length-1))]
        const subCategory = subCat[Math.round(Math.random()*(subCat.length-1))]
        const birthdate = moment(new Date(minDate.getTime() + Math.random()*(maxDate.getTime() - minDate.getTime()))).format('YYYY-MM-DD')
        const age = moment(moment().format()).diff(birthdate, 'years')

        const contractArray = chooseContractType(age)
        const contractType = contractArray[Math.round(Math.random()*(contractArray.length - 1))]

        if(subCategory === "Manager"){
          choosenLevel = userLevel[Math.round(Math.random()*1)]
        }

        if(name === "maxime rault"){
          choosenLevel = "super admin"
        }
        const choosenCat = chooseCat()
        const words = name.split(" ")
        staffArray.push({
          avatar: url,
          mail: `${words[0]}.${words[1]}1@hotmail.fr`,
          password: saltPwd,
          phone:"+33695983812",
          birthdate: birthdate,
          contractType: contractType ,
          name: name,
          category: choosenCat, 
          subCategory: subCategory,
          usagePrivileges: choosenLevel,
      
        })
      })
      await queryInterface.bulkInsert('Staffs', staffArray)
      
    } catch (error) {
      console.log('error: ', error)
      
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
