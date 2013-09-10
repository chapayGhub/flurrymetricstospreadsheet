function makeStatisticReport() {  
  var spreadsheet;   
  var currentSheet;
  var isCreated = false;
  try
  {
    //try to open existed document
    spreadsheet = SpreadsheetApp.openById(Config.mainStatisticDocID);  
  }
  catch(err)
  {
    spreadsheet = null;
  }
  
  //create new document 
  if(!spreadsheet)
  {
    isCreated = true;
    spreadsheet =  createNewSpreadSheetDocument();
  }
  
  fillMetricsReport(spreadsheet);
  
  // Get the URL of the document
  var url = spreadsheet.getUrl();
  // Get Id of the document is the  Config.mainStatisticDocID
  var idDoc = spreadsheet.getId();  

  // Get the email address of the active user - that's you
  var emailAddress = Session.getActiveUser().getEmail();

  //add accouts as editors for this document(they will recive notification)
  var fileSprsht = DriveApp.getFileById( idDoc );
  fileSprsht.addEditors(Config.emails);     

  //Send yourself an email with a link to the document    
  GmailApp.sendEmail( emailAddress,
                     'Statistic udated!\n',
                     'Here is a link to a document with' +(isCreated?'created':'updated')+ ' statistic:\n' + url + '\n Document id=' +idDoc);
}

function fillMetricsReport(sheet) 
{
  var curDate = new Date();
  var beforeDate = new Date(curDate.getTime()-(1000*60*60*24*30));  
  
  //iPad  
  mtrSrv = new MetricsService(FlurryCredentials.AccessCode, FlurryCredentials.ApiKies["iPad"], beforeDate, curDate);
  metrics = mtrSrv.applicationMetrics();    
  reporter = new MetricsReporter("iPad", sheet, metrics);
  reporter.report(); 
  
  //iPhone
  ///....
  
  //Android
  //....    
}