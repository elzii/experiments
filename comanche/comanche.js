/**
 * Comanche
 */
var xp = 512.;
var yp = 800.;
var hp = -50; 
var vp = -100;
var angle = 0.;
var depth = 400;

var heightmap; // 1024*1024 byte array with height information
var colormap; // 1ß24*1ß24 byte array with color indices
var rgbmap; //corresponding colors to the color indices

var context; //canvas context
var imagedata; //byte array with color data

var bufarray; // color data
var buf8; // the same array but with bytes
var buf32; // the same array but with 32-Bit words

var kforward = false;
var kbackward = false;
var kleft = false;
var kright = false;
var kup = false;
var kdown = false;
var klookup = false;
var klookdown = false;

var updaterunning = false;

function Update()
{
  updaterunning = true;
  var kpressed = false;
  if (kleft)
  {
    angle += 0.1;
    kpressed = true;
  }
  if (kright)
  {
    angle -= 0.1;
    kpressed = true;
  }
  if (kforward)
  {
    xp -= 3. * Math.sin(angle);
    yp -= 3. * Math.cos(angle);
    kpressed = true;
  }
  if (kbackward)
  {
    xp += 3. * Math.sin(angle);
    yp += 3. * Math.cos(angle);
    kpressed = true;
  }
  if (kup)
  {
    hp += 2;
    kpressed = true;
  }
  if (kdown)
  {
    hp -= 2;
    kpressed = true;
  }
  if (klookup)
  {
    vp += 2;
    kpressed = true;
  }
  if (klookdown)
  {
    vp -= 2;
    kpressed = true;
  }

  var size = imagedata.width * imagedata.height*4;
  for (var i = 0; i < buf32.length; i++) buf32[i] = 0x0;
  
  for (var i = 0; i < imagedata.width; i++) 
  {
    var y3d = -depth*1.5;
    var x3d = (i - imagedata.width / 2) * 1.5*1.5;
    var rotx = Math.cos(angle) * x3d + Math.sin(angle) * y3d;
    var roty = -Math.sin(angle) * x3d + Math.cos(angle) * y3d;
    Raycast(i, xp, yp, rotx + xp, roty + yp, y3d / Math.sqrt(x3d * x3d + y3d * y3d));
  }

  //imagedata.data.set(buf8); // This is the fast variant, but unfortunately it does not work with the Internet Explorer.
  // so lets do the slow variant
  var size = imagedata.width * imagedata.height*4;
  for (var i = 0; i < size; i++) imagedata.data[i] = buf8[i];

  context.putImageData(imagedata, 0, 0);

  if (!kpressed) 
  {
    updaterunning = false;
    return;
  }
  //update();
  window.setTimeout(Update, 0);
}

// line: vertical line to compute
// x1, y1: initial points on map for ray
// x2, y2: final points on map for ray
// d: correction parameter for the perspective
function Raycast(line, x1, y1, x2, y2, d) 
{
  var dx = x2 - x1;
  var dy = y2 - y1;
  var hmap = heightmap; 
  var cmap = colormap; 
  var palmap = rgbmap; 
  var image = imagedata;

  var r = Math.floor(Math.sqrt(dx * dx + dy * dy));
  dx = dx / r;
  dy = dy / r;

  var ymin = 256;
  for (var i = 0; i < r - 20; i++) 
  {
    x1 += dx;
    y1 += dy;
    var mapoffset = ((Math.floor(y1) & 1023) << 10) + (Math.floor(x1) & 1023);
    var h = hmap[mapoffset];
    var ci = cmap[mapoffset];
    
    h = 256 - h;
    h = h - 128 + hp;
    var y3 = Math.abs(d) * i;
    var z3 = h / y3 * 100 - vp;

    if (z3 < 0) z3 = 0;
    if (z3 < imagedata.height - 1) 
    {
      var offset = ((Math.floor(z3) * image.width) + line);
      var col = 0xFF000000 | ((palmap[ci*3+2])<<16) | ((palmap[ci*3+1])<<8) | (palmap[ci*3+0]);
      for (var k = Math.floor(z3); k < ymin; k++) 
      {
        buf32[offset] = col;
        offset += image.width;
      }
    }
    if (ymin > z3) ymin = Math.floor(z3);
  }
}

function DetectKeysDown(e)
{
  //alert(e.charCode);
  //alert(e.keyCode);

  switch(e.keyCode)
  {
  case 37:  // left cursor
  case 65:  // a
    kleft = true;
    break;

  case 39:  // right cursor
  case 68:  // d
    kright = true;
    break;

  case 38:  // cursor up
  case 87:  // w
    kforward = true;
    break;
  case 40:  // cursor down
  case 83:  // s
    kbackward = true;
    break;
  case 82:  // r
    kup = true;
    break;
  case 70:  // f
    kdown = true;
    break;
  case 69:  // e
    klookup = true;
    break;

  case 81:  //q
    klookdown = true;
    break;
  default:
    return;
    break;
  }

  if (!updaterunning) Update();
  return false;
}

function DetectKeysUp(e)
{
  switch(e.keyCode)
  {
  case 37:  // left cursor
  case 65:  // a
    kleft = false;
    break;

  case 39:  // right cursor
  case 68:  // d
    kright = false;
    break;
  case 38:  // cursor up
  case 87:  // w
    kforward = false;
    break;
  case 40:  // cursor down
  case 83:  // s
    kbackward = false;
    break;
  case 82:  // r
    kup = false;
    break;
  case 70:  // f
    kdown = false;
    break;
  case 69:  // e
    klookup = false;
    break;
  case 81:  //q
    klookdown = false;
    break;

  default:
    return;
    break;
  }

  //  Update();
  return false;
}

function load_binary_resource(url, type) 
{  
  var req = new XMLHttpRequest();  
  req.open('GET', url, true);
  req.responseType = "arraybuffer";   
  req.onload = function(e) 
  {  
    var arrayBuffer = req.response;   
    if (arrayBuffer)
    {
      //alert(url);
      //terrible solution
      if (type == 1) {heightmap = new Uint8Array(arrayBuffer);}
      if (type == 2) {colormap = new Uint8Array(arrayBuffer);}
      if (type == 3) {rgbmap = new Uint8Array(arrayBuffer);}
      if (!updaterunning) Update();
      //buffer =  new Uint8Array(arrayBuffer); 
    }
  }  
  req.send(null);
}  


function LoadMap(index)
{
  load_binary_resource('map' + index + '.palette', 3);
  load_binary_resource('map' + index + '.height', 1);
  load_binary_resource('map' + index + '.color', 2);
}


function Init()
{
  heightmap = new Uint8Array(1024*1024);
  colormap  = new Uint8Array(1024*1024);
  rgbmap    = new Uint8Array(3*256);

  LoadMap(0);
  var canvas = document.getElementById('testcanvas1');
  if (canvas.getContext)
  {
    context = canvas.getContext('2d');    
    imagedata = context.createImageData(canvas.width, canvas.height);   
  } 

  bufarray = new ArrayBuffer(imagedata.width*imagedata.height*4);
  buf8 = new Uint8Array(bufarray);
  buf32 = new Uint32Array(bufarray);

  document.onkeydown = DetectKeysDown;  
  document.onkeyup = DetectKeysUp;  
  Update();
}