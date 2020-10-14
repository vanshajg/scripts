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

const KEY_BINDINGS = {
  'message_window': {
    key: 'm',
  }
}
// ------------------------------



const getButtonList = () => {
  const node_list = document.getElementsByTagName('div');
  const button_list = [];
  for (let i = 0; i < node_list.length; i = i + 1) {
    if (node_list[i].getAttribute('role') === 'button')
      button_list.push(node_list[i]);
  }
  return button_list;
}



const toggle_message = () => {

  const button_list = getButtonList();
  button_list.filter(button => button.ariaLabel === 'Chat with everyone')[0].click();
}


const meetingMain = () => {
  document.addEventListener('keyup', (e) => {

    switch (e.key) {
      case KEY_BINDINGS.message_window.key:
        toggle_message();
        break;
    }
  });
}


const init_screen_main = () => {
  const button_list = getButtonList();
  const button_map = {
    video: null,
    audio: null,
    join: null
  }
  button_list.forEach(button => {
    if (button.innerText === 'Join now')
      button_map.join = button;
    else if (button.ariaLabel && ~button.ariaLabel.indexOf('microphone'))
      button_map.audio = button;
    else if (button.ariaLabel && ~button.ariaLabel.indexOf('camera'))
      button_map.video = button;
  })

  if (DISABLE_VIDEO)
    button_map.video && button_map.video.click();

  if (DISABLE_AUDIO)
    button_map.audio && button_map.audio.click();

  if (AUTO_JOIN)
    button_map.join && button_map.join.click();


  if (TOGGLE_MESSAGE_WINDOW) {
    meetingMain();
  }

};

const checkButtonLoad = () => {
  init_screen_main();
  window.removeEventListener('load', checkButtonLoad);
}

window.addEventListener('load', checkButtonLoad);


