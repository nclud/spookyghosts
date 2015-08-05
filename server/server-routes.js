var bodyLength = 3;//url, position, ghost id

var numGhosts = 10;

function verifyQuery(query){

  var errors = "";

  if(Object.keys(query).length !== bodyLength)
    errors += "Invalid POST body\n";

  if(!query.position)
    errors += "No position defined\n";
  else if(Object.keys(query.position).length !== 2)
    errors += "Invalid position object\n";
  else {

    var x = parseFloat(position.x);
    var y = parseFloat(position.y);

    if(isNaN(x) || x < 0 || x > 100)
      errors += "Invalid X\n";
    if(isNaN(y) || y < 0 || y > 100)
      errors += "Invalid Y\n";
  }

  if(query.ghostId === undefined)
    errors += "No ghost ID defined\n";

  if(isNaN(parseInt(query.ghostId)))
    errors += "Invalid ghost ID\n"



  if(!query.url)
    errors += "No URL defined\n";

  if(typeof query.url != "string")
    errors += "Invalid URL\n"

  //todo - url validation

  if(errors == "")
    return {status: true, errors: null};

  return {status: false, errors: errors};

}

Router.route('/spook/', function(){


    var req = this.request;
    var res = this.response;

    if(req.method !== "POST"){
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write("Bad request");
      return res.end();
    }

    var verification = verifyQuery(req.body);

    if(verification.status === false){
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.write("Bad request");
      res.write("Errors:");
      res.write(verification.error);
      return res.end();
    }


    var query = {};

    query["ghostId"] = parseInt(req.body.ghostId);

    query["position"] = req.body.position;

    query["timestamp"] = Date.now();


    var search = BooRLs.findOne({url: req.body.url});

    var id = search && search._id;

    if(id === undefined){
      id = BooRLs.insert({url: req.body.url, ghosts: []})
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
        ghostId: (int ghostId),
        position: {
          x: (int xPercentage),
          y: (int yPercentage)
        }
      }

    */

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("Great success! http://media.giphy.com/media/xGyOYkLvq8pTa/giphy.gif")
  },
  {
    where: 'server'
  }
);


