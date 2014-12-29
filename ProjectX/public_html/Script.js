/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Game Asset loading system 
//http://www.html5rocks.com/en/tutorials/games/assetmanager/?redirect_from_locale=de

function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = {};
    this.downloadQueue = [];
    this.nLoaded = 0;

    this.prototype.queueDownload = function (path) {
        this.downloadQueue.push(path);
    };

    //argument is callback function, which calls the remaining code
    this.prototype.downloadAll = function (downloadCallback) {
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

    this.prototype.isDone = function () {
        return (this.downloadQueue.length === this.successCount + this.errorCount);
    };

    this.prototype.getAsset = function (path) {
        return this.cache[path];
    };

    this.getProgress = function ()
    {
        return (1 - (this.errorCount + this.successCount) / this.downloadQueue.length);
    };
}





Game = {};

/*
 * Initialize
 */
Game.Launch = function ()
{
    Game.version = 0.01;
    Game.fps = 30;

    Game.ready = false;

    Game.Load = function ()
    {

        //Create AssetManager
        Game.assManager = new AssetManager();

        //assetManager.queueDownload('img/'); add if pictures are available
        Game.assManager.downloadAll(Game.init());
    };
    Game.init = function (){
        Game.Account = 0;
        Game.ready = true;
        
        /*
         * Add Game variables here
         */
        
        //--------------------------------------------------------------------- 
        /*
         * Call functions Here
         */
    }
    ;

    /*
     * Insert functions here
     */


};



/*
 * Launch
 */
Game.Launch();

window.onload = function ()
{

    if (!Game.ready)
    {
        Game.Load();
    }

};