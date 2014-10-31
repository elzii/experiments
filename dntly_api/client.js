var DNTLY = function() {

  var self = this;

  /**
   * Options
   */
  self.options = {
    url_api : 'https://www.dntly.com/api/v1/',
    oauth : null,
    callback_url : null,
    consumer : {
      key: null,
      secret: null
    }
  }



  /**
   * Sets some required default values, and instantiates the main oauth object
   */
  self.configure = function(details) {
    self.consumer.key    = details.consumer_key;
    self.consumer.secret = details.consumer_secret;
    self.callback_url    = details.callback_url;

  };

  /**
   * Make API Request
   */
  self.makeAPIRequest = function(opts, callback) {

      var url = self.options.url_api + opts.endpoint + '.json';

      return $.ajax({
        url: url,
        type: opts.type,
        dataType: 'json',
        data: opts.body,
      })
      .always(function (data) {
        var success = data.success;

        if ( success ) {
          if (typeof callback === "function") callback(data, 'SUCCESS');
        }
        else if ( !success ) {
          if (typeof callback === "function") callback(data, 'ERROR');
        } 
        else {
          if (typeof callback === "function") callback(data, 'UNKNOWN');
        }

      });
      

  };

};



