Config = (function()
{
  var obj = {};

  //Script will update it if you fill it. If yhis Id invalid or empty script will create new document every time  
  obj.mainStatisticDocID = '?????';//you recive this id in email after document will created

  //statistic result folder name
  obj.documentsDir = 'Statistic';

  //statistic report name
  obj.documentName = 'Statistic_yourapplication_';

  //emails wich will added as editors for new document
  obj.emails = ["?????email1", "?????email2", "?????email3"];  

  //Flurry requied timeout for every API call
  obj.timeout = 1200;  
  return obj;    
}) ();

ChartSettings = (function()
{
  var colors = ['#8a56e2','#cf56e2','#e256ae','#e25668',
                '#e28956','#e2cf56','#aee256','#68e256',
                '#56e289','#56e2cf','#56aee2','#5668e2',
                '#2e65a8','#2e65fc','#ea652e','#86652e',
                '#65982e','#65fc2e','#652eea','#652e86',
                '#982e65','#fc2e65','#2eea65','#2e8665'];
  var obj = {};
  obj.colors = colors;
  obj.randomColor = function(){ return colors[Math.round(Math.random()*colors.length)]; };  

  return obj;
}) ();

//Flurry return date in  "YYYY-MM-DD" format where MM in [1...12] but javascript use [0...11] for MM
function dateFromFlurry(dateString) {
    var dateArray = dateString.split("-");
    return  new Date(parseInt(dateArray[0],10), parseInt(dateArray[1],10)-1, parseInt(dateArray[2],10)); 
}
function toFlurryDate(date) {
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}

//all Flurry metric names
FlurryMetrics = (function()
{
  var obj = {};
  obj.metrics = ["ActiveUsers", "ActiveUsersByWeek", "ActiveUsersByMonth", "NewUsers", "MedianSessionLength", "AvgSessionLength", "Sessions",     "RetainedUsers","PageViews","AvgPageViewsPerSession"];  
//for debug use one or two metrics
//	obj.metrics = ["ActiveUsers", "ActiveUsersByWeek"];    
  return obj;
}) ();

//store Flurry credentials
FlurryCredentials = (function()
{
  var obj = {};
  obj.AccessCode = '?????';  
  obj.ApiKies = {
			iPad: '????',//key which used in mobile application
  };    
  return obj;
})();