module.exports = function error__handler(err, req, res, next){
  res.send(err)
}