var CLIENT_ID = '831378806747-lok4aolgabs3mpm0gdbsbm7mtonapde1.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
if(!localStorage.important)localStorage.important = 'false';
if(!localStorage.unread)localStorage.unread = 'true';
if(!localStorage.read)localStorage.read = 'true';
if(!localStorage.social)localStorage.social = 'true';
if(!localStorage.promotional)localStorage.promotional = 'true';
if(!localStorage.mails || localStorage.mails.length==0)localStorage.mails = '["paranshu.singhal@gmail.com"]';

function checkAuth() {
        gapi.auth.authorize(
          {'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true}, 
			handleAuthResult);
		return true;	
 }
function handleAuthClick(event) {
        gapi.auth.authorize(
          {'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate':true},
          handleAuthResult);
		return true;
}
function handleAuthResult(authResult) {
		
        
	//	alert(authResult.error);
		if (authResult && !authResult.error) {
	//	   alert('handle1');
          // Hide auth UI, then load client library.
         loadGmailApi();
        } else {
		  alert('handle2');
          // Show auth UI, allowing the user to initiate authorization by clicking authorize button.
          befor_authorize.style.display = 'inline';
        }
}
function loadGmailApi() {
        gapi.client.load('gmail', 'v1', listMessages);
 }	
function listMessages(userId,callback) {

//	alert('list');
	var query='';
	if(localStorage.important=="true") query+='is:important ';
	if(localStorage.unread=="true" && localStorage.read!="true") query+='is:unread ';
	if(localStorage.unread!="true" && localStorage.read=="true") query+='is:read ';
	query+='category:Primary OR category:Updates OR category:Forums ';
	if(localStorage.social!="true") query+='OR category:Social ';
	if(localStorage.promotional!="true") query+='OR category:Promotions ';
//	alert(query);
	
	var mails=JSON.parse(localStorage.mails);
	if(mails.length>1){
	for(i=0;i<mails.length-1;i++){
		query+='from:'+mails[i]+' OR ';
	}
	if(mails.length>0) query+='from:' + mails[mails.length-1];
//	alert(query);
	}

  //  alert(query);
	var getPageOfMessages = function(request, result) {
    request.execute(function(resp) {
		
      result = result.concat(resp.messages);
      var nextPageToken = resp.nextPageToken;

	  if (nextPageToken) {
        request = gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'pageToken': nextPageToken,
		  'q':query,

		});
        getPageOfMessages(request, result);
      } 
	  
	  else {
        for (i = 0; i < result.length; i++) {
			getmessage('me',result[i].id,[]);
            }
      }
    });
  };
  var initialRequest = gapi.client.gmail.users.messages.list({
    'userId': 'me',
	'q':query,
});
  getPageOfMessages(initialRequest, []);
}
function getmessage(userId,msgId,callback){
//alert('getmsg');
var request=gapi.client.gmail.users.messages.get({
'userId':userId,
'id':msgId,
'format':'metadata',
//'metadataHeaders':'Subject',
//'metadataHeaders':'Date',
//'metadataHeaders':'From',
});
request.execute(function(data){
var dat=data.payload.headers;
for(i=0;i<dat.length;i++){
var from,sub,date;
if(dat[i].name=="Subject"){
sub=dat[i].value;
}
else if(dat[i].name=="From"){
	from=dat[i].value;
}
else if(dat[i].name=="Date"){
	date=dat[i].value;
}
}
var ans='{'+'"subject": '+'"'+sub+'",'+'"from": '+'"'+from+'",'+'"date": '+'"'+date+'"}';
var ans2=JSON.parse(ans);
appendPre(ans2,data.id);
});
};
function appendPre(message,msgId) {
document.getElementById('before-load').style.display = 'none';
document.getElementById('after-load').style.display = 'inline';

  var pre = document.getElementById('output');
  
  var l1=document.createElement('span');
  l1.id=msgId;
  var l2=document.createElement('span');
  l2.className="info";
  
  var txtfrom = document.createTextNode('From: '+message.from + '\n');
  var txtdate = document.createTextNode('Date: '+message.date + '\n');
  var txtsub = document.createTextNode('Subject: '+message.subject + '\n');
  var a=document.createElement('a');
  a.href="#";a.id="Delete";
  a.appendChild(document.createTextNode('Delete'));
  l1.appendChild(a);
  l2.appendChild(txtfrom);
  l2.appendChild(txtdate);
  l2.appendChild(document.createElement('br'));
  l2.appendChild(txtsub);
 // l1.appendChild(document.createElement('br'));
  l1.appendChild(l2);
  l1.appendChild(document.createElement('hr'));
  pre.appendChild(l1);
}
$(document).ready(function(){	
	
 $("body").on('click','#Delete', function(event){
 event.preventDefault();
 var node = $(this).parent();
 var msgid= node.attr("id");
 
var request = gapi.client.gmail.users.messages.delete({
    'userId': 'me',
    'id': msgid,
  });
  request.execute(
    function(resp) {
		if(resp.code==200){
		 document.getElementById('output').removeChild(document.getElementById(msgid)); }
		else{
			alert(resp.message);
			}
	});
});
 $("body").on('click',"#options", function(){
//	alert('saadsa');
    chrome.tabs.create({ url: "options.html" });
  });
 $("body").on('click',"#refresh", function(){
	$('#after-load').hide();
	$('#before-load').show();
	var node=document.getElementById('output');
	var fc=node.firstChild;
	while(fc){
	node.removeChild(fc);
	fc=node.firstChild;
	}
listMessages();
});
 $("body").on('click',".info", function(){
	var id=this.id;
	chrome.tabs.create({ url:("https://mail.google.com/mail/u/0/#inbox/"+id) });
 });
$("body").on('click',"#code", function(){
//alert('code');	
chrome.tabs.create({ url:"https://github.com/paranshu-singhal/Mail-Filter-Chrome-app" });
});
 });


