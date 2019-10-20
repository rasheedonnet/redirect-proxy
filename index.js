/*This function is stitched in cloudfront and redirect to domain based on the value in "proxy_config.json" */
exports.handler = async (event) => {
    console.info("EVENT\n" + JSON.stringify(event, null, 2))
    var findDomain = event.Records[0].cf.request.origin.custom;
    console.info("Domain to redirect:" + findDomain.domainName);
    // Read proxy config list
    var fs = require("fs");
    var proxyConfig = JSON.parse(fs.readFileSync("/var/task/proxy_config.json"));
    var rta =  proxyConfig.filter(it => it.sourceDomain === findDomain.domainName);
    //console.info(rta);
    if(rta.length === 0){
      console.log("No items found in proxy config");
      return redirect(findDomain.protocol + "://" + findDomain.domainName);
    }
    else{
      console.info("Redirecting to domain:" + rta[0].redirectDomain);
       return redirect(rta[0].redirectDomain);
    }
};

function redirect(url) {
  return {
    status:            '301',
    statusDescription: 'Moved Permanently',
    headers: {
      location: [{
        key:    'Location',
        value:  url
      }]
    }
  };
}