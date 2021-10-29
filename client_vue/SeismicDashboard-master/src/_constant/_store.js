// store/active-user.js

import Vue from 'vue'
import Vuex from 'vuex'

import {EventBus} from 'MyLibVue/src/libs/eventbus'
import {isEmpty, printJson} from "MyLibVue/src/libs/simple_lib";
import VarRouter from "./_var-routers";
import {
  appDebugMode, auto_error_message_parse,
  create_auth_header, create_auth_header_v1,
  getDefaultUserIcon,
  url_http_get_with_header,
  url_http_post, url_http_post_with_header
} from "./http_api";
import {
  isValidUser,
  logOut, readUser, readUserDashboard,
  researchGetProjects,
  researchIsValidUser,
  researchLogOut,
  researchSaveProjects, saveUser, writeData
} from "./active_user";

Vue.use(Vuex);

const state = {
  varRouter : {},
  appSkin:{
    "item" : "",
    "title" : "",
    "icon" : "",
    "text" : "",
    "minimize" : "",
  },

  spinLoader : {
    "spinner":"spinner",
    "color": "#1E90FF",
    "background_color":"rgba(255, 255, 255, .9)",
    "size" : "60"
  },
  myUser : {},
  myProject:{},

  user: {},
  selectedArea : {},
  selectedWell : {},
  selectedGeobody: {},
  selectedInline : {},
  AvaList : [],

  selectedUser : {},
  selected_user: {},
  selected_jukir : []
};

const actions = {
  createVarRouter(){
    state.varRouter = new VarRouter();
    let dash_user = readUserDashboard();
    if(isValidUser(dash_user)) {
      state.user = dash_user;
      return;
    }

    let user = readUser();
    if(isValidUser(user))
      state.user = user;
  },

  createReturnStatus(status, title, msg)
  {
    let R = {};
    R.status = status; //-1 token expired, 0=fail, 1=success
    R.title = title;
    R.message = msg;
    R.data = [];
    return(R);
  },
  // ------------------------------------------------------------------

  //--------------------------------
  //HTTP LOGIN PAGE
  //--------------------------------
  login(context, http_param_)
  {
    printJson("LOGIN --> ", appDebugMode(), http_param_);
    let event_ = http_param_[2];
    let header = create_auth_header();
    return (url_http_post_with_header(http_param_[0], header, http_param_[1]))
      .then(response => {
        const response_ = JSON.parse(JSON.stringify(response));
        let data = response_.data;

        //cek return data dari server
        if (response_.status !== 200)
        {
          EventBus.$emit(event_.fail, data);
          return;
        }

        if(data["state"] === 0)
        {
          EventBus.$emit(event_.fail, data);
          return;
        }

        state.user = {
          loginID: "admin",
          pasfoto: getDefaultUserIcon()
        };
        saveUser(state.user); //save data
        EventBus.$emit(event_.success, data);
        //cek return data dari server
        // if(data.data.length<1)
        // {
        //   EventBus.$emit(event_.fail, data);
        //   return;
        // }
        //
        // let user_info = data.data[0];
        // if((isValidUser(user_info)===false) && (user_info.request !== "success"))
        // {
        //   logOut(); //remove existing data
        //   EventBus.$emit(event_.fail, data.message);
        // }
        // else {
        //   if(user_info.pasfoto.length===0)
        //     user_info.pasfoto = getDefaultUserIcon();
        //   state.user =user_info;
        //   saveUser(state.user); //save data
        //   EventBus.$emit(event_.success, data);
        // }
      })
      .catch(error =>
      {
        //console.log('Error no valid: ', error);
        let str_msg = "Error Network";
        let n = 100;
        if (error !== undefined)
        {
          error = JSON.stringify(error);
          if (error.length > n)
            str_msg = error.substr(0, n);
          else
            str_msg = error;
        }

        EventBus.$emit(event_.fail, {status:0, title:'Fail', message:str_msg});
      })
  },
  logout(context, http_param_)
  {
    return (url_http_post(http_param_))
      .then(response => {
        logOut(); //remove existing data
        state.user = {};
      })
      .catch(error => {
        logOut(); //remove existing data
        state.user = {};
      })
  },

  http_post_no_auth(context, http_param_)
  {
    printJson("IPOST --> ", appDebugMode(), http_param_);
    let event_ = http_param_[2];
    let header = create_auth_header();
    // let header = create_auth_header_v1(state.user["user"]);
    return (url_http_post_with_header(http_param_[0], header, http_param_[1]))
      .then(response => {
        const response_ = JSON.parse(JSON.stringify(response));
        let data = response_.data;

        // printJson("OUTPUT --> ", data);
        //cek return data dari server
        if (response_.status !== 200)
        {
          EventBus.$emit(event_.fail, data);
          return;
        }
        EventBus.$emit(event_.success, data);
      })
      .catch(error =>
      {
        console.log('Error : ', error);
        let str_msg = auto_error_message_parse(error);
        EventBus.$emit(event_.fail, {status: 0, title: 'Fail', message: str_msg});
      })
  },

  http_post(context, http_param_)
  {
    printJson("IPOST --> ", appDebugMode(), http_param_);
    let event_ = http_param_[2];
    // let header = create_auth_header();
    let header = create_auth_header_v1(state.user["user"]);
    return (url_http_post_with_header(http_param_[0], header, http_param_[1]))
      .then(response => {
        const response_ = JSON.parse(JSON.stringify(response));
        let data = response_.data;

        // printJson("OUTPUT --> ", data);
        //cek return data dari server
        if (response_.status !== 200)
        {
          EventBus.$emit(event_.fail, data);
          return;
        }
        EventBus.$emit(event_.success, data);
      })
        .catch(error =>
        {
          console.log('Error : ', error);
          let str_msg = auto_error_message_parse(error);
          EventBus.$emit(event_.fail, {status: 0, title: 'Fail', message: str_msg});
        })
  },

  http_get(context, http_param_)
  {
    printJson("IGET --> ", appDebugMode(), http_param_);
    let event_ = http_param_[2];
    let header = create_auth_header_v1(state.user["user"]);
    return (url_http_get_with_header(http_param_[0], header, http_param_[1]))
      .then(response =>
      {
        const response_ = JSON.parse(JSON.stringify(response));
        let data = response_.data;
        // printJson("OGET --> ", appDebugMode(), data);

        //cek return data dari server
        if (response_.status !== 200)
        {
          EventBus.$emit(event_.fail, data);
          return;
        }
        EventBus.$emit(event_.success, data);
      })
      .catch(error =>
      {
        console.log('', error);
        let str_msg = auto_error_message_parse(error);
        EventBus.$emit(event_.fail, {status: 0, title: 'Fail', message: error});
      })
  },

  researchSelectedProjects(context, payload){
    context.commit("researchSelectedProjects", payload)
  },
  getSelectedProjects(context, payload){
    context.commit("setSelectedProjects", payload)
  },

  actionSaveSelectedUser(context, payload){
    context.commit("saveSelectedUser", payload);
  },

  // logout(context)
  // {
  //   deleteData(key_user);
  //   deleteData(key_survey);
  // },
  write_user_data(context, param)
  {
    writeData(key_active_user, param);
  },

  actionSaveSelectedArea(context, payload){
    context.commit("actionSaveSelectedArea", payload);
  },
  actionSaveAvaList(context, payload){
    context.commit("actionSaveAvaList", payload);
  },
  actionSaveProbList(context, payload){
    context.commit("actionSaveProbList", payload);
  },
    actionSaveSelectedWell(context, payload){
    context.commit("actionSaveSelectedWell", payload);
  },
  actionSaveSelectedGeobody(context, payload){
    context.commit("actionSaveSelectedGeobody", payload);
  },
  actionSaveSelectedInline(context, payload){
    context.commit("actionSaveSelectedInline", payload);
  },

  //--------------------------------
  //HTTP REGISTER PAGE
  //--------------------------------
  // register(context, http_param_) {
  //   return register(http_param_)
  //     .then(response => {
  //       //console.log('register ', JSON.stringify(response))
  //     })
  //     .catch(error => {
  //       console.log('Error Registering: ', error)
  //       EventBus.emit('failedRegistering: ', error)
  //     })
  // },


};

const key_ava_list = "ava_list";
const key_prob_list = "prob_list";
const key_area = "area";
const key_well = "well";
const key_geobody = "geobody";
const key_location = "location";
const key_selected_user = "selected_user";

const mutations = {
  ResearchLogOut(state) {
    researchLogOut();
  },
  researchSelectedProjects(state, value){
    researchSaveProjects(value);
    state.myProject = value;
  },

  logOutUser(state){
    logOut();
  },
  saveSelectedUser(state, value){
    localStorage.setItem(key_selected_user, JSON.stringify(value));
    state.selectedUser = value;
  },

  actionSaveSelectedArea(state, value){
    localStorage.setItem(key_area, JSON.stringify(value)); //save data
    state.selectedArea = value;
  },
  actionSaveAvaList(state, value){
    localStorage.setItem(key_ava_list, JSON.stringify(value)); //save data
    state.AvaList = value;
  },
  actionSaveProbList(state, value){
    localStorage.setItem(key_prob_list, JSON.stringify(value)); //save data
    state.AvaList = value;
  },
  actionSaveSelectedWell(state, value){
    localStorage.setItem(key_well, JSON.stringify(value)); //save data
    state.selectedWell = value;
  },
  actionSaveSelectedGeobody(state, value){
    localStorage.setItem(key_geobody, JSON.stringify(value)); //save data
    state.selectedGeobody = value;
  },
  actionSaveSelectedInline(state, value){
    localStorage.setItem(key_location, JSON.stringify(value)); //save data
    state.selectedInline = value;
  },

  // setSelectedUser(state, value){
  //   saveSelectedUser(value);
  //   state.selected_user = value;
  // },

  SET_LIST_JUKIR: (state, payload) => {
    state.selected_jukir = payload;
  },

};

const getters = {
  researchGetSelectedProject(state){
    state.myProject = researchGetProjects();
    return(state.myProject);
  },

  // reusable data accessors
  isAuthenticated(state)
  {
    state.user = readUser();
    return (isValidUser(state.user));
    // return(true);
  },

  readSelectedUser(state){
    state.selectedUser = JSON.parse(localStorage.getItem(key_selected_user));
    return(state.selectedUser);
  },

  readSelectedArea(state){
    state.selectedArea = JSON.parse(localStorage.getItem(key_area));
    return(state.selectedArea);
  },
  readAvaList(state){
    state.AvaList = JSON.parse(localStorage.getItem(key_ava_list));
    return(state.AvaList);
  },
  readProbList(state){
    state.AvaList = JSON.parse(localStorage.getItem(key_prob_list));
    return(state.AvaList);
  },
  readSelectedWell(state){
    state.selectedWell = JSON.parse(localStorage.getItem(key_well));
    return(state.selectedWell);
  },
  readSelectedGeobody(state){
    state.selectedGeobody = JSON.parse(localStorage.getItem(key_geobody));
    return(state.selectedGeobody);
  },
  readSelectedInline(state){
    state.selectedInline = JSON.parse(localStorage.getItem(key_location));
    return(state.selectedInline);
  },
};

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
});

export default store
