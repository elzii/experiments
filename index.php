<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>CSS Playground</title>

    <link href="assets/css/font-awesome.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">

</head>

<body>


<div id="wrapper" style="padding-top:100px;">


<!-- Fixed navbar -->
<div class="navbar navbar-default navbar-fixed-top" role="navigation" style="margin-top:3px;">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">CSS Playground</a>
    </div>
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li class="character-nav dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Experiments <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">
            <li><a href="/reddit/">Reddit Live Stream</a></li>
            <li><a href="/characters/">CSS Characters</a></li>
          </ul>
        </li>
      </ul>
    </div><!--/.nav-collapse -->
  </div>
</div>




<!-- Begin page content -->
<div class="container">


  <div class="jumbotron">
    <h1>Playground</h1>
    <p>A collection of CSS/JS experiments and small applications</p>
    <p><a class="btn btn-primary btn-lg" role="button">Check one out</a></p>
  </div>

  <!-- <div id="loading" class="loading"><i></i><i></i><i></i></div> -->


  <div class="page-header clearfix" style="margin-top:0px;">
    <h2>List</h2>
  </div>

  <div class="row">
    <div class="col-sm-6 col-md-4">
      <div class="thumbnail">
        <img src="http://placehold.it/350x250" alt="...">
        <div class="caption">
          <h3>8-Bit CSS Characters</h3>
          <p>8-Bit video game character sprites in single css elements</p>
          <p><a href="/characters/" class="btn btn-primary" role="button">View</a> <a href="#" class="btn btn-default" role="button">Share</a></p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="thumbnail">
        <img src="http://placehold.it/350x250" alt="...">
        <div class="caption">
          <h3>Reddit Live Stream</h3>
          <p>Live stream of Reddit.com's r/all feed with some fun data visualization features.</p>
          <p><a href="/reddit/" class="btn btn-primary" role="button">View</a> <a href="#" class="btn btn-default" role="button">Share</a></p>
        </div>
      </div>
    </div>
  </div>


</div>


</div><!-- #wrapper -->



    <!-- JavaScript -->
    <script src="assets/js/jquery-1.11.1.min.js"></script>
    <script src="assets/js/bootstrap.js"></script>
    <script src="assets/js/angular.min.js"></script>
    <script src="assets/js/jquery.cookie.js"></script>
    <script src="assets/js/app.js"></script>


    
    

    <!-- Custom JavaScript for the Menu Toggle -->
    <script>
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("active");
    });
    </script>

</body>
</html>