<?php include 'partials/header.php'; ?>

<div id="wrapper" style="padding-top:75px;">

<?php include 'partials/nav.php'; ?>

<div class="reddit-progress progress">
  <div id="reddit-update-interval" class="progress-bar" role="progressbar" style=""></div>
</div>

<!-- Begin page content -->
<div class="container">

  <div class="page-header clearfix" style="margin-top:0px;">
    <div class="pull-left" style="padding-top:10px;">
      <h3 style="margin-top:0px;">
        <span id="reddit-post-count" class="orangered">0</span> posts 
        <small>from</small> 
        <span id="reddit-domain-count" class="orangered">0</span> domains
        <small>with</small>
        <span id="reddit-repost-count" class="orangered">0</span> reposts
      </h3>
    </div>
    <div class="pull-right">
      <img src="../assets/images/ajax-loader.gif" alt="" id="reddit-loading">
      <button id="reddit-stop-stream" type="button" class="btn btn-default btn-lg">
        <span class="glyphicon glyphicon-stop"></span> Stop
      </button>
    </div>
  </div>

  <!-- <div id="loading" class="loading"><i></i><i></i><i></i></div> -->

  <div id="reddit-posts"></div>

</div>


</div><!-- #wrapper -->

<?php include 'partials/footer.php'; ?>