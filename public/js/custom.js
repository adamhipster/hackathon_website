function serverMessage (msg) {
	$svm = $(".server_msg");
	$svm.empty();
	if (msg) {
		var tag = $("<p>", { html : msg, class: "flow-text", css: {display: "none"}});
		setTimeout(function(){$svm.append(tag).children('p').slideDown(300).delay(8000).slideUp(300)}, 1000);
	} 
}

// msg = "Hey this is a message that is a lot longer than normal. I hope this is okay. We'll see :)"
				// + " Alrighty, this about the maximum text that we can manage";
serverMessage(msg);