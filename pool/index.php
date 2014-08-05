<?php

include 'db/config.php';
include 'lib/functions.php';
include 'lib/session.php';

?>

<?php include 'partials/header.php'; ?>

<div id="loading" class="loading"><i></i><i></i><i></i></div>


<div id="wrapper" style="padding-top:75px;display:none;">


<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Auth</a>
    </div>
    <div class="navbar-collapse collapse">

      <div class="navbar-form navbar-right">
        <form id="login" class="" role="form" action="">
          <div class="form-group">
            <input type="text" id="username" name="username" placeholder="Username" class="form-control">
          </div>
          <div class="form-group">
            <input type="password" id="password" name="password" placeholder="Password" class="form-control">
          </div>
          <input type="hidden" name="form_token" value="<?php echo $form_token; ?>" />
          <button type="submit" class="btn btn-primary">Login</button>
        </form>

        <button id="logout" class="btn btn-danger">Logout</button>
      </div>
      
      
    </div><!--/.navbar-collapse -->
  </div>
</div>

  <div class="container" class="row">
    
    <div class="row">
      <div class="col-lg-12">
        <div id="message" class="alert alert-warning" style="display:none;"></div>
      </div>
    </div>



    <div class="row">
      
      <div class="col-lg-4">

          <form id="signup" class="" role="form" action="">
            <h3>Sign Up</h3>
            <div class="form-group">
              <input type="text" id="username" name="username" placeholder="Username" class="form-control">
            </div>
            <div class="form-group">
              <input type="password" id="password" name="password" placeholder="Password" class="form-control">
            </div>
            <input type="hidden" name="form_token" value="<?php echo $form_token; ?>" />
            <button type="submit" class="btn btn-success">Register</button>
          </form>

        
          
      </div>
      <div class="col-lg-8">


        <h4>Message</h4>
        <pre><?php echo $data['message']; ?></pre>

        <hr>
        
        <h4>$_SESSION</h4>
        <pre><?php var_dump($_SESSION); ?></pre>

        <hr>


        <h4>DB Connect Test</h4>
        <div class="panel panel-default">
          <div class="panel-heading">DB Settings</div>
          <ul class="list-group">
            <li class="list-group-item"><strong>Host</strong>: <?php echo $mysql_hostname; ?></li>
            <li class="list-group-item"><strong>Username</strong>: <?php echo $mysql_username; ?></li>
            <li class="list-group-item"><strong>Password</strong>: <?php echo $mysql_password; ?></li>
            <li class="list-group-item"><strong>Database</strong>: <?php echo $mysql_dbname; ?></li>
          </ul>
        </div>
        <?php
          $server   = "localhost";
          $database = "officepool";
          $username = "admin";
          $password = "password";

          $mysqlConnection = mysql_connect($server, $username, $password);

          if (!$mysqlConnection) {
            $db_message = "Please try later.";
          } else {
            $db_message = "Connected to DB successfully";
          }
        ?>
        <pre><?php echo $db_message; ?></pre>

        <hr>

        <h4>DB CREATE Query</h4>
<pre>
CREATE TABLE phpro_users (
  user_id int(11) NOT NULL auto_increment,
  username varchar(20) NOT NULL,
  password char(40) NOT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY username (username)
);
</pre>

      </div>
    </div>

  
    

    

  </div>

</div><!-- #wrapper -->

<?php include 'partials/footer.php'; ?>