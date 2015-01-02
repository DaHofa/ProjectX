/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//Game Asset loading system 
//http://www.html5rocks.com/en/tutorials/games/assetmanager/?redirect_from_locale=de

function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = {};
    this.downloadQueue = [];
    this.nLoaded = 0;

    AssetManager.prototype.queueDownload = function (path) {
        this.downloadQueue.push(path);
    };

    //argument is callback function, which calls the remaining code
    AssetManager.prototype.downloadAll = function (downloadCallback) {
        if (this.downloadQueue.length === 0) {
            downloadCallback();
        }
        for (var i = 0; i < this.downloadQueue.length; i++) {
            var path = this.downloadQueue[i];
            var img = new Image();
            var that = this;
            img.addEventListener("load", function () {
                that.successCount += 1;
                if (that.isDone()) {
                    downloadCallback();
                }
            }, false);
            img.addEventListener("error", function () {
                that.errorCount += 1;
                if (that.isDone()) {
                    downloadCallback();
                }
            }, false);
            img.src = path;
            this.cache[path] = img;
        }
    };

    AssetManager.prototype.isDone = function () {
        return (this.downloadQueue.length === this.successCount + this.errorCount);
    };

    AssetManager.prototype.getAsset = function (path) {
        return this.cache[path];
    };

    this.getProgress = function ()
    {
        return (1 - (this.errorCount + this.successCount) / this.downloadQueue.length);
    };
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//FPS Controlling class

function FpsController(fps) {

    //private functions and variables
    var that = this;
    var fpsCounter = 0;
    var loop = '';

    function displayFps() {
        getElem("FPS").innerHTML = "fps: " + fpsCounter + "/" + that.fps;
        that.resetCount();
    }

    //public functions and variables
    this.fps = fps;

    /*
     * Call this to reset the counter (is done automatically, but is made public
     * if required
     * @returns {undefined}
     */
    this.resetCount = function () {
        fpsCounter = 0;
    };

    /*
     * Call this in each frame, increases the counter.
     * @returns {undefined}
     */
    this.countFrame = function () {
        fpsCounter++;
    };

    /*
     * Call this to start FPS displaying and updating
     * @returns {undefined}
     */
    this.startCount = function () {
        loop = window.setInterval(displayFps, 1000);
    };

    /*
     * Call this to stop FPS displaying
     * @returns {undefined}
     */
    this.stopCount = function () {
        window.clearInterval(loop);
    };
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//Helper functions

/*
 * Helper function for adding an Event
 * @param {DOM Element} element
 * @param {Handler} handler
 * @param {Function} func
 * @returns {undefined}
 */
addHandler = function (element, handler, func)
{
    if (navigator.userAgent.match(/MSIE/))
    {
        element.attachEvent('on' + handler, func);
    }
    else
    {
        element.addEventListener(handler, func, false);
    }
};

/*
 * Returns the element for a given ID, i.e. shortcut function
 * @param {id} ID
 * @returns {Element} the element with the id ID
 */
getElem = function (ID) {
    return document.getElementById(ID);
};



//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//The main Game class
/*
 * Game class
 * @type type The Game
 */
Game = {};

/*
 * Initialize
 */
Game.launch = function ()
{
    Game.version = 0.01;
    Game.fps = 30;


    Game.ready = false;

    Game.load = function ()
    {
        //Create FPS Controller
        Game.FpsController = new FpsController(Game.fps);

        //Create AssetManager
        Game.assManager = new AssetManager();

        //assetManager.queueDownload('img/'); add if pictures are available
        Game.assManager.downloadAll(Game.init);
    };
    Game.init = function () {
        Game.Account = 0;
        Game.ready = true;

        /*
         * Add Game variables here
         */

        //--------------------------------------------------------------------- 
        /*
         * Call functions Here
         */
        addHandler(getElem("CoreFlower"), "click", Game.clickFlower);

        Game.FpsController.startCount();
        setInterval(Game.loop, 1000 / Game.fps);
    };

    /*
     * Insert functions here
     */

    Game.clickFlower = function (event)
    {
        if (event)
            event.preventDefault();

        Game.Account++;
    };


    Game.loop = function () {

        /*
         * Insert Account update
         */


        //Draw the frame at the end
        Game.draw();
        Game.FpsController.countFrame();
    };

    Game.draw = function () {
        //first draw background
        Game.drawBackground();

        /*
         * Insert Drawing Account, etc.
         */
        getElem("Counter").innerHTML = Game.Account + " X";
        getElem("Version").innerHTML = "v. " + Game.version;

    };

    Game.drawBackground = function () {

        /*
         * redraw the background
         */
    };


};


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//Finished defininiton. Initialize
Game.launch();

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//Finished initiaizaiton. Start the game.
window.onload = function ()
{

    if (!Game.ready)
    {
        Game.load();
    }

};