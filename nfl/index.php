<?php include 'partials/header.php'; ?>

<div id="wrapper" style="padding-top:75px;">

<?php include 'partials/nav.php'; ?>

  <div class="container" class="row">
    
    <style>
      .third { width: 33.333333333337%; float:left; }
        
      .panel-heading {
        background-color: #162754 !important;
        border-color: #0a1027 !important;
        color: #fff !important;
        height:75px;
      }

      .nfl-home, .nfl-vs, .nfl-away {
        padding:0;
        width: 33.333333333337%; float:left;
      }
      
      .nfl-away { text-align:left; }
      .nfl-away img, .nfl-home img { 
        border:1px solid #999;
        border-radius: 5px;
      }
      .nfl-vs { text-align:center; }
      .nfl-home { text-align:right; }

      .nfl-img-stadium { 
        height:220px; 
        width:100%; 
      }
      .nfl-stadium {
        position:absolute;
        left:0;
        bottom:0;
        width:100%;
        padding: 15px;
        background-color: rgba(0,0,0, 0.5);
        color: #fff;
        margin:0;
      }

      .nfl-week-filter.active {
        background-color:#a40e1c;
        color: #fff;
      }
    </style>
    
    <div id="nfl-week-filter"></div>
    <div id="content"></div>
    

  </div>

</div><!-- #wrapper -->

<?php include 'partials/footer.php'; ?>