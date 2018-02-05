module.exports = function(response, data){
    response.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
    response.end(JSON.stringify(data));
}