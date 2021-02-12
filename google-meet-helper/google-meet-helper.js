// ==UserScript==
// @name        Google Meet helper
// @namespace   Violentmonkey Scripts
// @match       https://meet.google.com/*
// @grant       none
// @version     1.2.5
// @author      Vanshaj Girotra
// @description  disable video, Auto mute and auto join in that order. Also switches account (defaults to primary)
// @run-at       document-idle
// ==/UserScript==


// change the default values here
const DISABLE_VIDEO = true;
const DISABLE_AUDIO = true;
const AUTO_JOIN = true;
/**
 * if your work email is not the first account (authuser = 0) change the authuser below
 */
const ACCOUNT_SWITCH = {
  enable: false,
  authuser: 0
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


const init_screen_main = () => {
  const button_list = getButtonList();
  const button_map = {
    video: null,
    audio: null,
    join: null
  }
  button_list.forEach(button => {
    const aria_label = button.getAttribute('aria-label')
    if (button.innerText === 'Join now')
      button_map.join = button;
    else if (aria_label && ~aria_label.indexOf('microphone'))
      button_map.audio = button;
    else if (aria_label && ~aria_label.indexOf('camera'))
      button_map.video = button;
  })
  
  
  if (DISABLE_VIDEO)
    button_map.video.click()

  if (DISABLE_AUDIO)
    button_map.audio.click()

  if (AUTO_JOIN && button_map.audio && button_map.video)   // join iff audio and video buttons have been clicked
    button_map.join && button_map.join.click();
  
};


const checkLoad = () => {
  const divs = document.getElementsByTagName('div')
  let loaded = true
  for (let i=0;i<divs.length; i+=1) {
    if (divs[i].getAttribute('data-loadingmessage') === 'Loading...') { // :/
      loaded = false
    }
  }
  return loaded
}



const checkButtonLoad = () => {
  let clear_interval = false
  const interval_check = setInterval(() => {
    const button_list = getButtonList()
    if (checkLoad()) {
      //  hackerman
        clearInterval(interval_check)
      setTimeout(() => init_screen_main(),500)
      
    }
  }, 100)
}

const main = () => {
  window.removeEventListener('load', main);
  const params = new URLSearchParams(location.search);
  const authuser = params.get('authuser') || '0'
  if (ACCOUNT_SWITCH.enable && authuser != ACCOUNT_SWITCH.authuser) {
    params.set('authuser', ACCOUNT_SWITCH.authuser)
    window.location.search = params.toString()
  } else {
    checkButtonLoad()
  }
}

window.addEventListener('load', main);
