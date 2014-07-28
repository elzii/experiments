<!-- Fixed navbar -->
<div class="navbar navbar-default navbar-fixed-top" role="navigation" style="margin-top:3px;">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Playground</a>
    </div>
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li class="character-nav dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">8-Bit CSS Characters <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">
            <li><a href="/characters.php" data-pjax>Characters</a></li>
            <li><a href="/characters.json" data-pjax>JSON Feed</a></li>
            <li class="divider"></li>
            <li class="dropdown-header">Character List</li>
            <ul class="character-nav"></ul>
          </ul>
        </li>
        <li><a href="/reddit.php" data-pjax>Reddit Live Stream</a></li>
      </ul>
    </div><!--/.nav-collapse -->
  </div>
</div>