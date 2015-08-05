var bodyLength = 3;//url, position, ghost id

var numGhosts = 10;

var xMin = -200;
var xMax = 200;

var yMin = -50;
var yMax = 150;

function verifyQuery(query){

  var errors = "";

  if(Object.keys(query).length !== bodyLength)
    errors += "Invalid POST body\n";

  if(!query.position)
    errors += "No position defined\n";
  else if(Object.keys(query.position).length !== 2)
    errors += "Invalid position object\n";
  else {

    var x = parseFloat(query.position.x);
    var y = parseFloat(query.position.y);

    if(isNaN(x) || x < xMin || x > xMax)
      errors += "Invalid X\n";
    if(isNaN(y) || y < yMin || y > yMax)
      errors += "Invalid Y\n";
  }

  if(query.ghostSrc === undefined)
    errors += "No ghost ID defined\n";


  if(!query.url)
    errors += "No URL defined\n";

  if(typeof query.url != "string")
    errors += "Invalid URL\n"

  //todo - url validation

  if(errors == "")
    return {status: true, errors: null};

  return {status: false, errors: errors};

}

Router.route('/getspooked/:url', function(){

    var url = this.params.url;

    var req = this.request;
    var res = this.response;

    var ghostResponse = {ghosts: undefined}

    var boorl = BooRLs.findOne({url: url});


    var ghostArray = boorl && boorl.ghosts || [];

    ghostResponse.ghosts = ghostArray;

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(ghostResponse));
    res.end();

  }, {
    where: 'server'
  }
)

Router.route('/ghostpost/', function(){//or postergeist?


    var req = this.request;
    var res = this.response;
    var body = req.body;

    if(req.method !== "POST"){
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write("Bad request");
      return res.end();
    }

    var verification = verifyQuery(body);

    if(verification.status === false){
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write("Bad request");
      res.write("Errors:");
      res.write(verification.error);
      return res.end();
    }


    var query = {};

    query["ghostSrc"] = body.ghostSrc;

    query["position"] = body.position;

    query["timestamp"] = Date.now();


    var search = BooRLs.findOne({url: body.url});

    var id = search && search._id;

    if(id === undefined){
      id = BooRLs.insert({url: body.url, ghosts: []})
    }

    var updateId = BooRLs.update({_id: id}, {
      $push: {
        ghosts: {
          $each: [query],
          $sort: {timestamp: 1},
          $slice: -1 * numGhosts
        }
      }
    });

    if(updateId === undefined){
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write("Database write error");
      return res.end();
    }

    /*
      Ideal contents of POST's body

      {
        url: (string url),
        ghostSrc: (int ghostSrc),
        position: {
          x: (int xPercentage),
          y: (int yPercentage)
        }
      }

    */

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("Great success! http://media.giphy.com/media/xGyOYkLvq8pTa/giphy.gif");
    res.end();
  }, {
    where: 'server'
  }
);


