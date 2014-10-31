BOOSTERMEDIA_START_GAME = function() {
    globalInit();
    console.log("BOOSTERMEDIA_START_GAME called.")
};
BOOSTERMEDIA_MORE_GAMES = function() {
    console.log("BOOSTERMEDIA_MORE_GAMES called.");
    document.location = "http://www.dotgears.com"
};
BOOSTERMEDIA_MAINMENU = function() {
    console.log("BOOSTERMEDIA_MAINMENU called.")
};
BOOSTERMEDIA_GAMEPLAY = function() {
    console.log("BOOSTERMEDIA_GAMEPLAY called.")
};
BOOSTERMEDIA_LEVELCOMPLETE = function() {};
BOOSTERMEDIA_LEVELFAILED = function() {};
BOOSTERMEDIA_GAMECOMPLETE = function() {
    console.log("BOOSTERMEDIA_GAMECOMPLETE called.")
};
BOOSTERMEDIA_SUBMITSCORE = function(a) {
    console.log("BOOSTERMEDIA_SUBMITSCORE called. " + a)
};
window.onload = function() {
    BOOSTERMEDIA_START_GAME()
};