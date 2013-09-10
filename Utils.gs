//move file to target dir
function moveFile(fileId, toId) {   
    var file = DriveApp.getFileById(fileId);  
    var folder = DriveApp.getFolderById(toId);
  
    if(!file || !folder)
      return;
  
    folder.addFile(file);
  
    var folders =  file.getParents();
    var rmFrom = [];
    var parentFolder;
  
    while (folders.hasNext()) {
      parentFolder = folders.next();
      if(parentFolder.getId()!=toId)
        rmFrom.push(parentFolder)     
    }
  
  for(var i=0, l=rmFrom.length; i < l; i++){
    rmFrom[i].removeFile(file);
  }
}

function createNewSpreadSheetDocument() {  
    var spreadsheet;
    var folders = DriveApp.getFolders();
    var date = new Date()
    var dateStr = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+"_"+date.getHours()+"."+date.getMinutes()+"."+date.getSeconds();
      
    spreadsheet = SpreadsheetApp.create(Config.documentName+"_"+dateStr);
    var documnetsFolder;
    while(folders.hasNext())
    {
      documnetsFolder = folders.next();
      Logger.log(documnetsFolder.getName());

      if(documnetsFolder.getName() === Config.documentsDir)
        break;      

      documnetsFolder = null;
    }    
    moveFile(spreadsheet.getId(), documnetsFolder.getId());    
    Logger.log(spreadsheet.getId()); 
    return spreadsheet;
}