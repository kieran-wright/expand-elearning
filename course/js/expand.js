/* Configuration
-------------------------------------------------- */

//Change this number to the final page number of the module.
var lastPage = 8;

/* Global variables
-------------------------------------------------- */
var prevPage = 0;
var currentPage = 1;
var nextPage = 2;
var restoredPage = "";
var suspendData = [];

/* Loading initial content
-------------------------------------------------- */

//Loads content
$(document).ready(function(){
    loadContent();
});

function loadContent(){
    $('#header').load('header.html');
    $('#loader').load('loader.html');
    $('#return').load('return.html');
    $('#footer').load('footer.html');
    expand_loadPage();
}

window.onload = function () { 
    init();
}

window.onunload = function (){
    end();
}

/* Navigation
-------------------------------------------------- */

//Shows returnModal
function expand_showReturn(){
    $('#returnModal').modal('show');
}

//Loads next page
function expand_next(page){
    if(page != null){
        currentPage = page;
        prevPage = currentPage-1;
        nextPage = currentPage+1;
        expand_loadPage();
    }else if(currentPage == lastPage){
        $('#next').onclick = null; 
    }else{
        prevPage++;
        currentPage++;
        nextPage++;
        expand_loadPage();
    }
}

//Loads previous page
function expand_back(page){
    if(page != null){
        currentPage = page;
        prevPage = currentPage-1;
        nextPage = currentPage+1;
        expand_loadPage();
    }else if(currentPage < 2){
        $('#back').onclick = null; 
    }else{
    	prevPage--;
    	currentPage--;
    	nextPage--;
        expand_loadPage();
    }
}

function expand_loadPage(){
        set('cmi.core.lesson_location', currentPage);
        expand_showLoader();
        $('#content').load('page'+currentPage+'.html', function() {
            expand_disable();
            expand_hideLoader();
        });
}

//Disables next and back buttons if user is on the first or last page
function expand_disable(){
    if (currentPage < 2) {
        $("#back").addClass("disabled");
    } else{
        $("#back").removeClass("disabled");
    };
    
    if (currentPage == lastPage) {
        $("#next").addClass("disabled");
        complete();
    } else{
        $("#next").removeClass("disabled");
    };
}

function expand_setItem(key, value){
    var exists = false;
    suspendData.forEach(function(item){
        if (item[key] != undefined){
            exists = true;
            item[key] = value;
        }
    })
    if (exists == false){
        var obj = {};
        obj[key] = value;
        suspendData.push(obj);
    };
    set('cmi.suspend_data', JSON.stringify(suspendData));
}

function expand_getItem(key){
    var value = "";
    suspendData.forEach(function(item){
        if (item[key] != undefined){
            value = item[key];
        };
    })
    return value;
}

/* Loader
-------------------------------------------------- */

function expand_showLoader(){
    $('#loader').show();
}

function expand_hideLoader(){
    $('#loader').hide();
}

/* SCORM Functions
-------------------------------------------------- */

//Creates shortcut for shorter code
var expand = pipwerks.SCORM;

//Initialises connection to the LMS and shows the return modal if the connection returns true
function init(){
    expand.version = "1.2";
    var isScorm = expand.init();
    if (isScorm) {
        restoredPage = get('cmi.core.lesson_location');
        suspendData = get('cmi.suspend_data');
        if (suspendData === undefined || suspendData.length == 0) {
            suspendData = [];
        }else{
            suspendData = JSON.parse(get('cmi.suspend_data'));
        }
        if (restoredPage > 1){setTimeout(expand_showReturn, 500);};
    };
}

//Sets course completion as complete
function complete(){
    expand.set("cmi.core.lesson_status", "completed");
}

//Sets the data to be sent to the LMS
function set(param, value){
    expand.set(param, value);
}

//Gets data from the LMS
function get(param){
    var value = expand.get(param);
    return value;
}

//Terminates connection with the LMS and commits changes.
function end(){
    expand.save();
    expand.quit();
}
