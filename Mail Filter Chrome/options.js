$(document).ready(function(){
	
	if(!localStorage.important)localStorage.important = 'false';
	if(!localStorage.unread)localStorage.unread = 'true';
	if(!localStorage.read)localStorage.read = 'true';
	if(!localStorage.social)localStorage.social = 'true';
	if(!localStorage.promotional)localStorage.promotional = 'true';
	if(!localStorage.mails || localStorage.mails.length==0)localStorage.mails = '["paranshu.singhal@gmail.com"]';
	
	$('#important')[0].checked 	 = ( localStorage.important=="true" );
	$('#unread')[0].checked      = ( localStorage.unread=="true" );
	$('#read')[0].checked 		 = ( localStorage.read=="true" );
	$('#social')[0].checked 	 = ( localStorage.social=="true" );
	$('#promotional')[0].checked = ( localStorage.promotional=="true" );
	
	var mails=JSON.parse(localStorage.mails);
	
	var obj=document.getElementById('followed-senders');
	for(i=0;i<mails.length;i++){
	var div=document.createElement('div');
	div.className="followed-mail";
	var txt=document.createTextNode(mails[i]);
	$(div).attr('data',mails[i]);
	div.appendChild(txt);
	if(i>0){
	var gly=document.createElement('span');
	gly.className="glyphicon glyphicon-remove remove";
	div.appendChild(gly);
	}
	obj.appendChild(div);
//	obj.appendChild(document.createTextNode(mails[i]))
 
	}
	
  $("#add").click(function(){
	var gly=document.createElement('span');
	gly.className="glyphicon glyphicon-remove remove";
	var div=document.createElement('div');
	div.className="followed-mail";
	var txt=document.createTextNode($('#add-mail').val());
	$(div).attr('data',$('#add-mail').val());
	div.appendChild(txt);
	div.appendChild(gly);
	var div2=document.getElementById("followed-senders");
	div2.appendChild(div);
	mails.push($('#add-mail').val());
	$('#add-mail').val('');
	localStorage.mails=JSON.stringify(mails);
	mails=JSON.parse(mails);
	
  });
$("body").on('click','.remove',function(){
	var tr=$(this).parent();
//	alert(tr.attr('data'));
	tr.remove();
	mails.splice(mails.indexOf(tr.attr('data')),1);
	localStorage.mails=JSON.stringify(mails);
	mails=JSON.parse(mails);
});
$(':checkbox').change( function(){
localStorage.important   = $('#important')[0].checked;
localStorage.unread      = $('#unread')[0].checked;
localStorage.read        = $('#read')[0].checked;
localStorage.social      = $('#social')[0].checked;
localStorage.promotional = $('#promotional')[0].checked;
});
});
