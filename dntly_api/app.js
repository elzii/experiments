var dntly = new DNTLY();


dntly.makeAPIRequest({
  endpoint  : 'accounts',
  type      : 'GET',
  body      : null
}, function (data, status) {
  console.log('data: ', data);
  console.log('status: ', status);
})