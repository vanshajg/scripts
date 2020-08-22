// ==UserScript==
// @name        Google Meet helper
// @namespace   Violentmonkey Scripts
// @match       https://meet.google.com/*
// @grant       none
// @version     1.2
// @author      Vanshaj Girotra
// @description  disable video, Auto mute and auto join in that order. Also shortcut to message window <~
// @run-at       document-idle
// ==/UserScript==


// change the default values here
const DISABLE_VIDEO = true;
const DISABLE_AUDIO = true;
const AUTO_JOIN = true;
const TOGGLE_MESSAGE_WINDOW = true;

const KEY_BINDINGS =  {
  'message_window': { 
    key : 'm',
  }
}
// ------------------------------



const getButtonList = () => {
  const node_list = document.getElementsByTagName('div');
  const button_list = [];
  for (var i=0;i<node_list.length; i=i+1) {
    if (node_list[i].getAttribute('role') === 'button')
      button_list.push(node_list[i]);
  }
  return button_list;
}



const toggle_message = () =>  {
  
  console.log("toggle message");
    const button_list = getButtonList();
    button_list.filter(button => button.ariaLabel ==='Chat with everyone')[0].click();
}


const meetingMain = () => {
  document.addEventListener('keyup', (e) => {
    
    switch(e.key) {
      case KEY_BINDINGS.message_window.key: 
        toggle_message();
      break;
    }
  });
}


const init_screen_main = () => {
  const button_list = getButtonList();
  
  if (DISABLE_VIDEO) 
    button_list[0].click();
  
  if (DISABLE_AUDIO) 
    button_list[1].click();
  
  if (AUTO_JOIN) {
    if (button_list.length === 7)
      button_list[3].click();
    else 
      button_list[4].click();
  }

  if (TOGGLE_MESSAGE_WINDOW) {
    meetingMain();
  }
  
};

const checkButtonLoad = () => {
    const button_list = getButtonList();
    if (button_list.length > 7) {
      clearInterval(button_check_interval);
      init_screen_main();
    }
}

const button_check_interval = setInterval(checkButtonLoad, 250);



