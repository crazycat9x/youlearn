function signIn() {
  console.log("Sending message");
  chrome.runtime.sendMessage({type: "googleAuth"}, function(response) {
  });  
}