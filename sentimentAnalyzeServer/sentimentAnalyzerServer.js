require("dotenv").config()
const express = require('express');
const app = new express();


const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const getNLUInstance = ()=>{
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
        apikey: process.env.API_KEY,
    }),
    serviceUrl: process.env.API_URL,
});
return naturalLanguageUnderstanding;
}


// const analyzeParams = {
//   'url': 'www.ibm.com',
//   'features': {
//     'entities': {
//       'emotion': true,
//       'sentiment': true,
//       'limit': 2,
//     },
//     'keywords': {
//       'emotion': true,
//       'sentiment': true,
//       'limit': 2,
//     },
//   },
// };

// naturalLanguageUnderstanding.analyze(analyzeParams)
//   .then(analysisResults => {
//     console.log(JSON.stringify(analysisResults, null, 2));
//   })
//   .catch(err => {
//     console.log('error:', err);
//   });

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let newInstance = getNLUInstance()

    let analyzeParams={
        'url':req.query.url,
        'features': {
            "emotion":{}
        }
    }
    newInstance.analyze(analyzeParams)
    .then(analysisResults => {
    res.json(analysisResults.result.emotion.document.emotion)
  })
  .catch(err => {
    console.log('error:', err);
  });
});

app.get("/url/sentiment", (req,res) => {
    let newInstance = getNLUInstance()

let analyzeParams = {
  'url': req.query.url,
  'features': {
    'sentiment': {}
  }
};
    newInstance.analyze(analyzeParams)
    .then(analysisResults => {
    console.log(analysisResults.result)
    return res.send("url sentiment for "+req.query.url +" "+ analysisResults.result.sentiment.document.label);
  })
  .catch(err => {
    console.log('error:', err);
    res.status(404)
  });

   
});

app.get("/text/emotion", (req,res) => {
    let newInstance = getNLUInstance()

    let analyzeParams={'text':req.query.text,
    'features': {
    'emotion': {}
    }}
    newInstance.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(analysisResults)
    res.json(analysisResults.result.emotion.document.emotion)
  })
  .catch(err => {
    console.log('error:', err);
  });
  // return res.send({"happy":"10","sad":"90"});

});

    
app.get("/text/sentiment", (req,res) => {
    let newInstance = getNLUInstance()
    let analyzeParams={'text': req.query.text,
    'features': {
        'sentiment':{}
    }}
    newInstance.analyze(analyzeParams)
    .then(analysisResults => {
        return res.send("text sentiment for "+req.query.text +" "+ analysisResults.result.sentiment.document.label);
  })
  .catch(err => {
    console.log('error:', err);
    res.status(404)
  });
    // return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

