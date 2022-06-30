var express = require('express');
var router = express.Router();
var request = require('sync-request');

var journeyModel = require('../models/journey');
var userModel = require('../models/users')



/* GET tickets page */
router.get('/', async function(req, res, next){

   

    if (req.session._id == null) {
      res.redirect('/')
    } else {

      req.session.bouton = null
      username = req.session.username
      req.session.list = []

      var aggregate = journeyModel.aggregate();
      aggregate.group( { _id : "$departure", depCount: { $sum: 1 } });

      req.session.data = await aggregate.exec();

      var aggregate2 = journeyModel.aggregate();
      aggregate2.group( { _id : "$arrival", arrCount: { $sum: 1 } });

      req.session.data2 = await aggregate2.exec();



      
  res.render('tickets', {title: 'Ticketac', journeyList: req.session.list, bouton : req.session.bouton, data: req.session.data, data2: req.session.data2})

    }
  
})



router.get('/ticket-finder', function(req, res, next){
  
    res.redirect('/tickets')

})

router.post('/ticket-finder', async function(req, res, next){
  if (req.session._id == null) {
    res.redirect('/')
  } else {
  //requete mongo
  req.session.bouton = true

  console.log(req.body.arrival)
  
  var aggregate = journeyModel.aggregate();
  aggregate.match({"departure": req.body.departure})
  
  var journeyArr = await aggregate.exec()

  req.session.list = journeyArr.filter(x=>x.arrival == req.body.arrival)

  res.render('tickets', {title: 'Ticketac', journeyList: req.session.list, username: req.session.username, bouton: req.session.bouton, data: req.session.data, data2: req.session.data2})

}
})


router.get('/addJourney', async function(req, res, next){


  if (req.session._id == null) {
    res.redirect('/')
  } else {

    req.session.bouton = null

    if(req.session.myJourneys == undefined) {

      req.session.myJourneys = []
      
      var temp = req.session.list.filter(x=>x._id == req.query.id)

      req.session.myJourneys.push(...temp)
    } else {

    var temp = req.session.list.filter(x=>x._id == req.query.id)

    req.session.myJourneys.push(...temp)

    }


    
res.render('mytickets', {title: 'Ticketac', journeyList: req.session.list, bouton : req.session.bouton, myJourneys: req.session.myJourneys})

  }

})

router.get('/voyages', async function(req, res, next){


  if (req.session._id == null) {
    res.redirect('/')
  } else {

    req.session.bouton = null

      /* await userModel.updateOne(
        { _id: req.session._id},
        { journeyHistory: [req.session.myJourneys] }
     );

     var currentUser = await userModel.findById(req.session._id)
     .populate('journeyHistory')
      req.session.journeyHistory = currentUser.journeyHistory */
      

        if(req.session.voyages == undefined){
      req.session.voyages = []
      
      var temp = req.session.myJourneys

      req.session.voyages.push(...temp)

      req.session.myJourneys = []
    } else {

      var temp = req.session.myJourneys

      req.session.voyages.push(...temp)

      req.session.myJourneys = []

    }
/* 
    var currentUser = await userModel.findById(req.session._id)
      req.session.journeyHistory = currentUser.journeyHistory */
    

    
res.render('voyages', {title: 'Ticketac', journeyList: req.session.list, bouton : req.session.bouton, myJourneys: req.session.voyages, Journeys: req.session.journeyHistory})

  }

})




/* router.get('/notrain', async function(req, res, next){

  res.render('notrain', {title: 'Ticketac', username: req.session.username})    
  
}) */


//---------------------------------------------------------------------------------------------------------------------------

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('tickets', { title: 'Ticketac' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('tickets', { title: 'Ticketac' });
});

module.exports = router;