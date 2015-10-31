//oauth2 auth
chrome.identity.getAuthToken(
	{'interactive': true},
	function(){
	  //load Google's javascript client libraries
		window.gapi_onload = authorize;
		loadScript('https://apis.google.com/js/client.js');
	}
);

function loadScript(url){
  var request = new XMLHttpRequest();

	request.onreadystatechange = function(){
		if(request.readyState !== 4) {
			return;
		}

		if(request.status !== 200){
			return;
		}

    eval(request.responseText);
	};

	request.open('GET', url);
	request.send();
}

function authorize(){
  gapi.auth.authorize(
		{
			client_id: '752876804494-89290mlvi975ls09fp6afhlh5mfgu52g.apps.googleusercontent.com',
			immediate: true,
			scope: 'https://www.googleapis.com/auth/gmail.readonly'
		},
		function(){
		  gapi.client.load('gmail', 'v1', listMessages);
		}
	);
	}

function listMessages(userId,callback) {
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
	var getPageOfMessages = function(request, result) {
    request.execute(function(resp) {
      result = result.concat(resp.messages);
      var nextPageToken = resp.nextPageToken;

	  if (nextPageToken) {
        request = gapi.client.gmail.users.messages.list({
          'userId': userId,
          'pageToken': nextPageToken,
		  'q':query,
//		  'format','metadata',
		});
        getPageOfMessages(request, result);
      } else {
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
$('#before-load').hide();
$('#after-load').show();
appendPre(ans2,data.id);
});
};
function appendPre(message,msgId) {
  var pre = document.getElementById('output');
  var l1=document.createElement('span');
  l1.id=msgId;l1.className="info";
  var txtfrom = document.createTextNode('From: '+message.from + '\n');
  var txtdate = document.createTextNode('Date: '+message.date + '\n');
  var txtsub = document.createTextNode('Subject: '+message.subject + '\n');
  var a=document.createElement('a');
  a.href="#";a.id="Delete";
  a.appendChild(document.createTextNode('Delete'));
  l1.appendChild(a);
  l1.appendChild(txtfrom);
  l1.appendChild(txtdate);
  l1.appendChild(document.createElement('br'));
  l1.appendChild(txtsub);
 // l1.appendChild(document.createElement('br'));
  l1.appendChild(document.createElement('hr'));
  pre.appendChild(l1);
}
$(document).ready(function(){	
	
 $("body").on('click','#Delete', function(){
var msgid=$(this).parent().attr("id");
	var request = gapi.client.gmail.users.messages.delete({
    'userId': 'me',
    'id': msgid,
  });
  request.execute(
    function(resp) {
		alert('msg Deleted');
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


