<?php include 'partials/header.php'; ?>

<div id="wrapper" style="padding-top:75px;">

<?php include 'partials/nav.php'; ?>

  <div class="container">
    

    <style>
      #map { position:relative; width:100%; height:600px; background-color: #e5e3df; }
      .media-list .media { margin-top: 30px; }
    </style> 

    <div class="page-header">
      <h4 id="geolocate">Getting Latitude and Longitude and generating map...</h4>
    </div>
  
    <div id="map">
      <div id="loading" class="loading"><i></i><i></i><i></i></div>
    </div>

    <div id="comments">
      
      <div class="page-header">
        <h4>Comments</h4>
      </div>
      <ul class="media-list">
        <li class="media">
          <a class="pull-left" href="#">
            <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMzIiIHk9IjMyIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NjR4NjQ8L3RleHQ+PC9zdmc+" style="width: 64px; height: 64px;">
          </a>
          <div class="media-body">
            <h4 class="media-heading">Alexander Zizzo</h4>
            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
            <!-- Nested media object -->
            <div class="media">
              <a class="pull-left" href="#">
                <img class="media-object" data-src="holder.js/64x64" alt="64x64" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iMzIiIHk9IjMyIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NjR4NjQ8L3RleHQ+PC9zdmc+" style="width: 64px; height: 64px;">
              </a>
              <div class="media-body">
                <h4 class="media-heading">Zach McKay</h4>
                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
              </div>
            </div>
          </div>
        </li>
      </ul>

    </div>

    <hr>
    

  </div>

</div><!-- #wrapper -->

<?php include 'partials/footer.php'; ?>