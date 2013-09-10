//object with Flurry metric data
function ApplicationMetric(data) 
{
  this.name = data["@metric"];
  this.version = data["@version"];  
  this.items  = [ ];
  
  this.startDate = dateFromFlurry(data["@startDate"]);
  this.endDate = dateFromFlurry(data["@endDate"]);
  
  var timeItems = data["day"];  
  var count = timeItems.length;
  for(var i=0; i<count; ++i)
  {    
    this.items.push( [timeItems[i]["@date"], parseInt(timeItems[i]["@value"], 10) ]  );
  }      
}

//Service wich make Flurry metrica request and parse it to ApplicationMetric instance
function MetricsService(apiAccessCode, apiKey, startDate, endDate) 
{  
 this.apiAccessCode=apiAccessCode;
 this.apiKey=apiKey;
 this.startDate= startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate();
 this.endDate= endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate();
  
  MetricsService.prototype.url = function (metricName)  
  {
    return "http://api.flurry.com/appMetrics/"
    +metricName+
    "?apiAccessCode="+this.apiAccessCode+
    "&apiKey="+this.apiKey+
    "&startDate="+this.startDate+
    "&endDate="+this.endDate;
  }
    
  MetricsService.prototype.applicationMetrics = function () 
  {  
    var metrics = FlurryMetrics.metrics;
    var applicationMetrics = new Array();    
       
    var url, response, metrica, responseObject;    
    for(var i=0; i<metrics.length; ++i)
    {
      try
      {
        url = this.url(metrics[i]);
        Logger.log(url);
        response  = UrlFetchApp.fetch(url);        
        var metric = new ApplicationMetric( Utilities.jsonParse(response.getContentText()) )
        if(metric)
        {
          applicationMetrics.push(metric) ;                               
        }
      }
      catch(error)
      {
        Logger.log(Utilities.jsonStringify(error));  
        Logger.log(response.getContentText());  
      }
      Utilities.sleep(Config.timeout);//flurry reqied pause between API requests
    }    
    return applicationMetrics;
  }  
}

//Create sheet in existed spread sheet with name _metricsTitleSheet
//and fill it with charts and date for their
var _metricsTitleSheet = 'Flurry App Metrics';
function MetricsReporter(app, spreadSheet, metrics) {  
  this.app = app;
  this.spreadSheet = spreadSheet;
  this.metrics = metrics;
  
  MetricsReporter.prototype.report = function (){  
    //delete sheet if it exist when we update existed ducument
    var newSheet = this.spreadSheet.getSheetByName(_metricsTitleSheet+":"+this.app);    
    if(newSheet) {
      this.spreadSheet.deleteSheet(newSheet);
      newSheet = null;
    } 
    newSheet = this.spreadSheet.insertSheet(_metricsTitleSheet+":"+this.app);
    
    var metrica;      
    var count = this.metrics.length;
    for (var i=0; i<count; ++i)
    {
      metrica = this.metrics[i];
      showMetrica(newSheet, metrica, i);
    }  
  }
  
  var sessionStartedColorInx = 0; userInfoColorInx = 1;
  var row=2, colorColumn=1, column=2, numRows=0, numColumns=2, sortColumn=2, minimumRowsShift = 20, minimumColumnsChartWidth = 7;  
 
  var showMetrica = function (metricsSheet, metrica, colorIndex)
  {  
    if(!metrica.items.length)
      return;
        
    var color = ChartSettings.colors[colorIndex];
    
    //set title
    var titles = [[metrica.name , toFlurryDate(metrica.startDate)+" - "+toFlurryDate(metrica.endDate)]];      
    var titleRange = metricsSheet.getRange(row-1, column,1,2);
    titleRange.setValues(titles);
    titleRange.setFontWeight("bold");

    //set colors    
    var colorsRange = metricsSheet.getRange(row, colorColumn, metrica.items.length, 1);                    
    colorsRange.setBackground( color );
    metricsSheet.setColumnWidth(colorColumn, metricsSheet.getColumnWidth(colorColumn)*0.8);                
    
    //set data    
    var range = metricsSheet.getRange(row, column, metrica.items.length, numColumns);    
    range.setValues(metrica.items);      
    range.sort(column);     
    
    for(var index=column; index<(column+numColumns); ++index)
    {
      metricsSheet.autoResizeColumn(index);      
    }        
    numRows = metrica.items.length>minimumRowsShift? metrica.items.length: minimumRowsShift;
        
    var chartHeight=0, chartWidth=0;
    for(var i=1; i<numRows+1; ++i)
    {      
      chartHeight+=metricsSheet.getRowHeight(i);
    }
    chartWidth = minimumColumnsChartWidth*metricsSheet.getColumnWidth(100);
    
    //add chart
    var chart = metricsSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)      
    .addRange(range)
    .setPosition( row-1, column+numColumns, 0, 0)
    .setOption("title", metrica.name)
    .setOption('legend', {position: 'top', textStyle: {color: 'blue', fontSize: 16}})     
    .setOption('width',  chartWidth)
    .setOption('height', chartHeight)     
    .setOption('useFirstColumnAsDomain', true)           
    .setOption('colors', [color])          
    .build();
    metricsSheet.insertChart(chart);
    row+=numRows+1;            
  }
}

//method for testing without spread sheet
function getFlurryMetrics() 
{
  var curDate = new Date();
  var beforeDate = new Date(curDate.getTime()-(1000*60*60*24*30));  
  var mtrSrv = new MetricsService(FlurryCredentials.AccessCode, FlurryCredentials.ApiKies["iPad"], beforeDate, curDate);
  var metrics = mtrSrv.applicationMetrics();  
  Logger.log(JSON.stringify(metrics));  
}