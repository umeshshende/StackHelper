
document.addEventListener('DOMContentLoaded', function() {
//Definition	
	var isService;
  var redirectAnswerUrl="";
  var redirectQuetionsCode=0;

//Step one lets check whether isService On Or OFF 
	chrome.storage.sync.get("isServiceOn", function(data) {
	 //If Undefined set On 	
	  if(data.isServiceOn==undefined){
	  	//Set data into Chrome.Storage.set as true (ON)
	  	  isService=true;
	  	  chrome.storage.sync.set({'isServiceOn':isService});
  	  }else{
 		//Get from Chrome.Storage.get 
  	  	 isService=data.isServiceOn;

       }  
  	  	 //lets check is ON or OFF 
		if(isService){		
			//if On Call Services

   			StackHelperService();
   		///	document.getElementById("serviceStatus").checked = true;

		}else{
			  document.getElementById("serviceStatus").checked = false;
		}

  	 
 
    });

// Step Two lets check whether  serviceStatus (toggle) is null or not
	var serviceStatus=document.getElementById("serviceStatus");
	//if not null
	if(serviceStatus){
		// Ready for trigger

  		serviceStatus.addEventListener("click",getServiceStart,false);
	}
	// Will call function on click event (Toggle)
	function getServiceStart(){
    document.getElementById("serviceStatus").checked = isService;
		// Store real time value (on oR Off) into variable
		isService=document.getElementById("serviceStatus").checked;	
		/// setting data into Chrome.Storage.set
		chrome.storage.sync.set({'isServiceOn': isService});
	}

// Business Login For Services
 function StackHelperService(){

			//var questionId=0;

//**********************************************************************	
//setting webrequest for Answerurl

		chrome.webRequest.onBeforeRequest.addListener(
    			function(details) {
         
          if(redirectAnswerUrl=="" || redirectQuetionsCode!=getQutionCode(details.url)){
            redirectQuetionsCode=getQutionCode(details.url);
   					var host="https://api.stackexchange.com/2.2/questions/"+getQutionCode(details.url)+"/answers?order=asc&sort=activity&site=stackoverflow";
    	 			var x = new XMLHttpRequest();
   			 		x.open('GET',host,false);

    				x.onload = function() {
       		 		setRedirectedToAnswer(x.responseText);
    				};    	
    				x.send();
            if(redirectAnswerUrl!=""){
               return {redirectUrl: redirectAnswerUrl}
            }
          }
       
    			},
    			{
    				 //setting url which we gonna match during first load 
       				 urls: [
           				"*://stackoverflow.com/questions/*",
            			"*://www.stackoverflow.com/questions/*"
        			 ]
    			},
    			["blocking"]
			);
    //

}
 
// setting redirect URL
   function setRedirectedToAnswer(data){
        redirectAnswerUrl="";
        result=JSON.parse(data);
      //  redirectAnswerUrl="https://stackoverflow.com/a/4379540";
   		for(var x=0;x<result.items.length;x++){  	
   				if(result.items[x].is_accepted==true){
            redirectAnswerUrl="";
   					redirectAnswerUrl="https://stackoverflow.com/a/"+result.items[x].answer_id;
   					break;
   				}

   		}
   /*   if(redirectAnswerUrl=""){
        var scoreList=new Array();
        for(var x=0;x<result.items.length;x++){ 
            scoreList.push(result.items[x].score);
       }
       if(scoreList.max()!=0)
          redirectAnswerUrl="";
          redirectAnswerUrl="https://stackoverflow.com/a/"+result.items[x].answer_id;
          break;
      }*/
           
   }
 Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

//********************************************************************   

// Getting Quetion Id from URL
   function getQutionCode(tablink) {
      var questionId=0;
   	  if(getParamsValueByName("questions",tablink)!=undefined){
   	  	   questionId=getParamsValueByName("questions",tablink); 
    	}
      return questionId;
   }
   // Get value after quetion parameter 
   function getParamsValueByName(fieldName,URL){
	   var str = URL;
	   var tmp = str.split("/");
	   //alert(tmp);
 	  for(var i=0;i<tmp.length;i++){
 		 if(tmp[i]==fieldName){
 			  return tmp[i+1];
 			  break;
 		 }
 	  }
   }
//************************************************************************

},false);

