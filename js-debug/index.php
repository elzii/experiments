<?php include 'partials/header.php'; ?>

<div id="wrapper" style="padding-top:75px;">

<?php include 'partials/nav.php'; ?>


<!-- Begin page content -->
<div class="container">

  <!-- <div id="loading" class="loading"><i></i><i></i><i></i></div> -->


  <script id="img"></script>

</div>

<script>

  var before = (new Date()).getTime();

  for ( var x=0; x < 12000; x++ ) {
    // counting
    console.log('Doing maths')
  }

  function pageload()
  {
    var after = (new Date()).getTime();
    var sec = (after-before)/1000;
    
    var secRounded = Math.ceil(sec);

    var progressArray = [];

    var progressStr = '[';

    console.log(secRounded)

    for ( var i=0; i < secRounded; i++ ) {
      progressStr += '=='
    }

    progressStr += ']';

    console.log(progressStr);
  }


  window.onload = function() {
    pageload();
  }


</script>


</div><!-- #wrapper -->

<?php include 'partials/footer.php'; ?>