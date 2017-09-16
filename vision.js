// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

// Instantiates a client
const vision = Vision();

// The name of the image file to annotate
const fileName = 'puppy-1.jpg';

// Prepare the request object
const request = {
  source: {
    filename: fileName
  }
};

// Performs label detection on the image file
vision.labelDetection(request)
  .then((results) => {
    const labels = results[0].labelAnnotations;

    console.log('Labels:');
    labels.forEach((label) => console.log(label.description));
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });


// const vision = require('node-cloud-vision-api');

// /* Helper function */
// function labelPhoto(base64){
//   return new Promise((resolve, reject) =>{
//     vision.init({auth: process.env.GOOGLE_API_KEY})
//     // construct parameters
//     const req = new vision.Request({
//       image: new vision.Image({base64}),
//       //image: new vision.Image({url: fileUri}),
//       features: [
//         new vision.Feature('LABEL_DETECTION', 10),
//       ]
//     })

//     // send single request

//       vision.annotate(req)
//       .then(res => {
//         var itemMatches = (res.responses[0].labelAnnotations)
//         var destination = sortPhoto(itemMatches)
//         // device number: 200025001847343438323536
//         // access token: 83488e0ae4449156570ffe3b9c0774c826ea6166
//         axios.post('https://api.particle.io/v1/devices/280020001247343438323536/led?access_token=83488e0ae4449156570ffe3b9c0774c826ea6166',
//           {value: destination});
//           resolve(destination);
//       })
//       .catch(e => {
//         console.log('Error: ', e)
//         reject(e);
//       })
//   })
// }

// function sortPhoto(itemLabelsArray){
//   console.log(itemLabelsArray);
//  // const compost = ['fruit','napkin', 'produce', 'food', 'vegetable', 'local food', 'vegetarian food', 'paper']
//  // const recycle = ['cola','product','aluminum', 'glass', 'laundry supply', 'household supply', 'water bottle', 'plastic bottle', 'bottle', 'bottled water', 'glass bottle']
//  // let destination = 'Trash'
//  // itemLabelsArray.forEach((label) => {
//  //   if(compost.indexOf(label.description) !== -1 && label.score >= 0.5){
//  //     destination = 'Compost'
//  //   }
//  //   else if(recycle.indexOf(label.description) !== -1 && label.score >= 0.5){
//  //     destination = 'Recycle'
//  //   }
//  }




