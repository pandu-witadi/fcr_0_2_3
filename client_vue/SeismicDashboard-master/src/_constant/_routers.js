import Vue from 'vue'
import Router from 'vue-router'

import store from './_store';
import VarRouter from "./_var-routers";

const varRouter = new VarRouter();
Vue.use(Router);

//frontpage
const Page404 = () => import('MyLibVue/src/views/Page404');
const Page500 = () => import('MyLibVue/src/views/Page500');
const PageLogin = () => import('../views/frontpage/PageLogin');
const DefaultContainer = () => import('../views/containers/DefaultContainer');

export default new Router({

  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({y: 0}),
  routes: [
    // // ---------------------------------------------------------------
    // // RESEARCH PAGE
    // // ---------------------------------------------------------------
    // {
    //   path: "/overlay",
    //   name: "overlay",
    //   component: () => import('../views/research/DemoOverlay')
    // },

    // ---------------------------------------------------------------
    // TESTING PAGE
    // ---------------------------------------------------------------
    {
      path: "/test-table",
      name: "test-table",
      component: () => import('../views/testing/testTable')
    },
    {
      path: "/multiview",
      name: "multiview",
      component: () => import('../views/testing/MultiSeismicViewer')
    },
    {
      path: "/test1",
      name: "test1",
      component: () => import('../views/testing/testHeatMap')
    },
    {
      path: "/test2",
      name: "test2",
      component: () => import('../views/testing/testHeatMapMesh')
    },
    {
      path: "/prob3dview",
      name: "prob3dview",
      component: () => import('../views/v0/View3dProb')
    },
    {
      path: "/ava3dview",
      name: "ava3dview",
      component: () => import('../views/v0/View3dAva')
    },
    // {
    //   path: "/3dview",
    //   name: "3dview",
    //   component: () => import('../views/testing/Test3DScatterView')
    // },
    {
      path: "/test-apex",
      name: "test-apex",
      component: () => import('../views/testing/testApexChart')
    },
    // ---------------------------------------------------------------
    // FRONT PAGE
    // ---------------------------------------------------------------
    {
      path: varRouter.getRoute("404", 1),
      name: varRouter.getRoute("404", 2),
      component: Page404
    },
    {
      path: varRouter.getRoute("500", 1),
      name: varRouter.getRoute("500", 2),
      component: Page500
    },
    {
      path: varRouter.getRoute("*", 0),
      component: Page404
    },
    {
      path: varRouter.getRoute("login", 1),
      name: varRouter.getRoute("login", 2),
      component: PageLogin
    },
    {
      path: varRouter.getRoute("dashboard-login", 1),
      name: varRouter.getRoute("dashboard-login", 2),
      component: () => import('../views/frontpage/DashboardLogin')
    },
    {
      path: varRouter.getRoute('forgot-password', 1),
      name: varRouter.getRoute('forgot-password', 2),
      component: () => import('../views/frontpage/PageForgotPassword') //PageForgotPassword
    },
    {
      path: "/",
      redirect: "",
      name: "",
      component: PageLogin
    },
    {
      path: varRouter.getRoute("dashboard", 1),
      redirect: varRouter.getRoute("dashboard", 1),
      name: varRouter.getRoute("dashboard", 2),
      component: DefaultContainer,
      beforeEnter(to, from, next) {
        // if (!store.getters.isAuthenticated)
        // {
        //   next(varRouter.getRoute("login", 1))
        // }
        // else
        // {
        next();
        // }
      },

      children: [
        {
          path: '',
          meta: {label: ''},
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            // --------------------- Management Data ----------------------------------
            {
              path: varRouter.getRoute("start", 1),
              name: varRouter.getRoute("start", 2),
              component: () => import('../views/v1/LandingPage')
            },
            {
              path: varRouter.getRoute("start", 1),
              meta: {label: varRouter.getRoute("start", 2)},
              component: {
                render(c) {
                  return c('router-view')
                }
              },
              children: [
                {
                  path: varRouter.getRoute("start-data-management", 1),
                  name: varRouter.getRoute("start-data-management", 2),
                  component: () => import('../views/v1/LandingPageDataManagement'),
                },
                {
                  path: varRouter.getRoute("start-data-management", 1),
                  meta: {label: varRouter.getRoute("start-data-management", 2)},
                  component: {
                    render(c) {
                      return c('router-view')
                    }
                  },
                  children: [
                    {
                      path: varRouter.getRoute("dm-probability-map", 1),
                      name: varRouter.getRoute("dm-probability-map", 2),
                      component: () => import('../views/v1/dataManagementProbabilityMap')
                    },
                    {
                      path: varRouter.getRoute("dm-area", 1),
                      name: varRouter.getRoute("dm-area", 2),
                      component: () => import('../views/v1/dataManagementArea')
                    },
                    {
                      path: varRouter.getRoute("dm-wells", 1),
                      name: varRouter.getRoute("dm-wells", 2),
                      component: () => import('../views/v1/dataManagementWells')
                    },
                    {
                      path: varRouter.getRoute("dm-users", 1),
                      name: varRouter.getRoute("dm-users", 2),
                      component: () => import('../views/v1/dataManagementUsers')
                    },
                  ]
                },

                // --------------------- Prospect Management ----------------------------------
                {
                  path: varRouter.getRoute("prospect-management", 1),
                  name: varRouter.getRoute("prospect-management", 2),
                  component: () => import('../views/v1/ProspectManagement')
                },
                {
                  path: varRouter.getRoute("edit-prospect-analysis", 1),
                  name: varRouter.getRoute("edit-prospect-analysis", 2),
                  component: () => import('../views/v1/EditProspectAnalysis')
                },
                {
                  path: varRouter.getRoute("new-prospect-wizard", 1),
                  name: varRouter.getRoute("new-prospect-wizard", 2),
                  component: () => import('../views/v1/NewProspectWizard')
                },
                {
                  path: varRouter.getRoute("seismic-viewer-by-xy", 1),
                  name: varRouter.getRoute("seismic-viewer-by-xy", 2),
                  component: () => import('../views/v1/SeismicViewerByXY')
                },
                {
                  path: varRouter.getRoute("view-well-analogy", 1),
                  name: varRouter.getRoute("view-well-analogy", 2),
                  component: () => import('../views/v1/ViewerWellAnalogy')
                },
              ]
            },



            // ---------------------------------------------------------
            //                    Dashboard
            // ---------------------------------------------------------
            {
              path: varRouter.getRoute("admin-area-list", 1),
              name: varRouter.getRoute("admin-area-list", 2),
              component: () => import('../views/v1/AdminAreaList')
            },
            {
              path: varRouter.getRoute("admin-segy-list", 1),
              name: varRouter.getRoute("admin-segy-list", 2),
              component: () => import('../views/v1/AdminSegyList')
            },
            {
              path: varRouter.getRoute("admin-geobody-list", 1),
              name: varRouter.getRoute("admin-geobody-list", 2),
              component: () => import('../views/v1/AdminGeobodyList')
            },
            {
              path: varRouter.getRoute("admin-mlmodel-list", 1),
              name: varRouter.getRoute("admin-mlmodel-list", 2),
              component: () => import('../views/v1/AdminModelList')
            },
            {
              path: varRouter.getRoute("admin-well-list", 1),
              name: varRouter.getRoute("admin-well-list", 2),
              component: () => import('../views/v1/AdminWellList')
            },
            {
              path: varRouter.getRoute("dashboard-user-list", 1),
              name: varRouter.getRoute("dashboard-user-list", 2),
              component: () => import('../views/v1/AdminUsersList')
            },

            // ---------------------------------------------------------
            //                    Processing
            // ---------------------------------------------------------
            // {
            //   path: varRouter.getRoute("processwizard1", 1),
            //   name: varRouter.getRoute("processwizard1", 2),
            //   component: () => import('../views/v1/ProcessWizardStep1')
            // },
            // {
            //   path: varRouter.getRoute("prospect-management", 1),
            //   name: varRouter.getRoute("prospect-management", 2),
            //   component: () => import('../views/v1/ProspectManagement')
            // },
            // {
            //   path: varRouter.getRoute("new-prospect-wizard", 1),
            //   name: varRouter.getRoute("new-prospect-wizard", 2),
            //   component: () => import('../views/v1/NewProspectWizard')
            // },
            // {
            //   path: varRouter.getRoute("seismic-viewer-by-xy", 1),
            //   name: varRouter.getRoute("seismic-viewer-by-xy", 2),
            //   component: () => import('../views/v1/SeismicViewerByXY')
            // },
            {
              path: varRouter.getRoute("prospect-edit", 1),
              name: varRouter.getRoute("prospect-edit", 2),
              component: () => import('../views/v1/ProspectEdit')
            },
            {
              path: varRouter.getRoute("plot-ava-gather", 1),
              name: varRouter.getRoute("plot-ava-gather", 2),
              component: () => import('../views/v1/PlotAvaGather')
            },
            {
              path: varRouter.getRoute("plot-ava-gather-section", 1),
              name: varRouter.getRoute("plot-ava-gather-section", 2),
              component: () => import('../views/v1/ViewerGatherSection')
            },
            {
              path: varRouter.getRoute("prospect-analysis", 1),
              name: varRouter.getRoute("prospect-analysis", 2),
              component: () => import('../views/v1/ProspectAnalysis')
            },
            // {
            //   path: varRouter.getRoute("edit-prospect-analysis", 1),
            //   name: varRouter.getRoute("edit-prospect-analysis", 2),
            //   component: () => import('../views/v1/EditProspectAnalysis')
            // },
            // {
            //   path: varRouter.getRoute("view-well-analogy", 1),
            //   name: varRouter.getRoute("view-well-analogy", 2),
            //   component: () => import('../views/v1/ViewerWellAnalogy')
            // },


          ]
        }
      ]

      // {
      //   path: '/',
      //   name: '',
      //   component: PageLogin
      //   // component: () => import('../views/v1/ProcessWizardStep1')
      //   // component: () => import('../views/Dashboard') //Dashboard
      //   // component: () => import('../views/pages/WellTable') //Dashboard
      //   // component: () => import('../views/pages/GeobodyTable') //Dashboard
      //   // component: () => import('../views/pages/AreaTable') //Dashboard
      // },

      // {
      //   path: varRouter.getRoute("admin-dashboard", 1),
      //   name: varRouter.getRoute("admin-dashboard", 2),
      //   component: () => import('../views/v0/AdminDashboard')
      // },

      // {
      //   path: '/',
      //   name: '',
      //   // component: () => import('../views/Dashboard') //Dashboard
      //   // component: () => import('../views/pages/WellTable') //Dashboard
      //   // component: () => import('../views/pages/GeobodyTable') //Dashboard
      //   component: () => import('../views/pages/AreaTable') //Dashboard
      // },
      // {
      //   path: '',
      //   meta: {label: ''},
      //   component: {
      //     render(c) {
      //       return c('router-view')
      //     }
      //   },
      // children: [
      // {
      //   path: varRouter.getRoute("processwizard1", 1),
      //   name: varRouter.getRoute("processwizard1", 2),
      //   component: () => import('../views/v1/ProcessWizardStep1')
      // },
      // {
      //   path: varRouter.getRoute("seismic-viewer-by-xy", 1),
      //   name: varRouter.getRoute("seismic-viewer-by-xy", 2),
      //   component: () => import('../views/v1/SeismicViewerByXY')
      // },
      // {
      //   path: varRouter.getRoute("prospect-edit", 1),
      //   name: varRouter.getRoute("prospect-edit", 2),
      //   component: () => import('../views/v1/ProspectEdit')
      // },

      // // ---------------------------------------------------------
      // //                    ADMIN
      // // ---------------------------------------------------------
      // {
      //   path: varRouter.getRoute("admin-area-list", 1),
      //   name: varRouter.getRoute("admin-area-list", 2),
      //   component: () => import('../views/v0/AdminAreaList')
      // },
      // {
      //   path: varRouter.getRoute("admin-segy-list", 1),
      //   name: varRouter.getRoute("admin-segy-list", 2),
      //   component: () => import('../views/v0/AdminSegyList')
      // },
      // {
      //   path: varRouter.getRoute("admin-geobody-list", 1),
      //   name: varRouter.getRoute("admin-geobody-list", 2),
      //   component: () => import('../views/v0/AdminGeobodyList')
      // },
      // {
      //   path: varRouter.getRoute("admin-mlmodel-list", 1),
      //   name: varRouter.getRoute("admin-mlmodel-list", 2),
      //   component: () => import('../views/v0/AdminModelList')
      // },
      // {
      //   path: varRouter.getRoute("admin-well-list", 1),
      //   name: varRouter.getRoute("admin-well-list", 2),
      //   component: () => import('../views/v0/AdminWellList')
      // },

      // ---------------------------------------------------------
      //                    USER
      // ---------------------------------------------------------
      // {
      //   path: varRouter.getRoute("segy-list", 1),
      //   name: varRouter.getRoute("segy-list", 2),
      //   component: () => import('../views/pages/SegyTable')
      // },
      // {
      //   path: varRouter.getRoute("home", 1),
      //   name: varRouter.getRoute("home", 2),
      //   component: () => import('../views/testing/SeismicView')
      // },
      // {
      //   path: varRouter.getRoute("processwizard1", 1),
      //   name: varRouter.getRoute("processwizard1", 2),
      //   component: () => import('../views/v1/ProcessWizardStep1')
      // },
      // {
      //   path: varRouter.getRoute("processwizard2-0", 1),
      //   name: varRouter.getRoute("processwizard2-0", 2),
      //   component: () => import('../views/v0/ProcessWizardStep2_0')
      // },
      // {
      //   path: varRouter.getRoute("processwizard2-1", 1),
      //   name: varRouter.getRoute("processwizard2-1", 2),
      //   component: () => import('../views/v0/ProcessWizardStep2_1')
      // },
      // {
      //   path: varRouter.getRoute("processwizard2-2", 1),
      //   name: varRouter.getRoute("processwizard2-2", 2),
      //   component: () => import('../views/v0/ProcessWizardStep2_2')
      // },
      // {
      //   path: varRouter.getRoute("processwizard3", 1),
      //   name: varRouter.getRoute("processwizard3", 2),
      //   component: () => import('../views/testing/ProcessWizardStep3')
      // },
      // {
      //   path: varRouter.getRoute("processwizard3-1", 1),
      //   name: varRouter.getRoute("processwizard3-1", 2),
      //   component: () => import('../views/testing/ProcessWizardStep3_1')
      // },
      // {
      //   path: varRouter.getRoute("processwizard3-1-pick", 1),
      //   name: varRouter.getRoute("processwizard3-1-pick", 2),
      //   component: () => import('../views/testing/ProcessWizardStep3_1_Pick')
      // },
      // {
      //   path: varRouter.getRoute("processwizard3-2", 1),
      //   name: varRouter.getRoute("processwizard3-2", 2),
      //   component: () => import('../views/testing/ProcessWizardStep3_2')
      // },
      // {
      //   path: varRouter.getRoute("processwizard3-3", 1),
      //   name: varRouter.getRoute("processwizard3-3", 2),
      //   component: () => import('../views/testing/ProcessWizardStep3_3')
      // },
      // {
      //   path: varRouter.getRoute("processwizard3-3", 1),
      //   name: varRouter.getRoute("processwizard3-3", 2),
      //   component: () => import('../views/testing/ProcessWizardStep3_3_WithILZ')
      // },
      // {
      //   path: varRouter.getRoute("processwizard3-3-ilz", 1),
      //   name: varRouter.getRoute("processwizard3-3-ilz", 2),
      //   component: () => import('../views/testing/ProcessWizardStep3_3_WithILZ')
      // },
      // {
      //   path: varRouter.getRoute("processwizard4", 1),
      //   name: varRouter.getRoute("processwizard4", 2),
      //   component: () => import('../views/testing/ProcessWizardStep4')
      // },
      // {
      //   path: varRouter.getRoute("processwizard5", 1),
      //   name: varRouter.getRoute("processwizard5", 2),
      //   component: () => import('../views/testing/ProcessWizardStep5')
      // },
      // {
      //   path: varRouter.getRoute("processwizard6", 1),
      //   name: varRouter.getRoute("processwizard6", 2),
      //   component: () => import('../views/testing/ProcessWizardStep6')
      // },

      // ---------------------------------------------------
      // ---------------------- geobody -----------------------
      // ---------------------------------------------------
      // {
      //   path: varRouter.getRoute("geobody", 1),
      //   name: varRouter.getRoute("geobody", 2),
      //   component: () => import('../views/pages/GeobodyTable')
      // },
      // {
      //   path: varRouter.getRoute("geobody", 1),
      //   meta: {label: varRouter.getRoute("geobody", 2)},
      //   component: {
      //     render(c) {
      //       return c('router-view')
      //     }
      //   },
      //   children: [
      //     {
      //       path: varRouter.getRoute("geobody-info", 1),
      //       name: varRouter.getRoute("geobody-info", 2),
      //       component: () => import('../views/pages/GeobodyTableContents')
      //     },
      //   ]
      // },

      // ---------------------------------------------------
      // ---------------------- WELL -----------------------
      // ---------------------------------------------------
      // {
      //   path: varRouter.getRoute("well", 1),
      //   name: varRouter.getRoute("well", 2),
      //   component: () => import('../views/pages/WellTable')
      // },
      // {
      //   path: varRouter.getRoute("well", 1),
      //   meta: {label: varRouter.getRoute("well", 2)},
      //   component: {
      //     render(c) {
      //       return c('router-view')
      //     }
      //   },
      //   children: [
      //     {
      //       path: varRouter.getRoute("inline-crossline", 1),
      //       name: varRouter.getRoute("inline-crossline", 2),
      //       component: () => import('../views/pages/InlineTable')
      //     },
      //   ]
      // },

      // {
      //   path: varRouter.getRoute("inline-crossline", 1),
      //   meta: {label: varRouter.getRoute("inline-crossline", 2)},
      //   component: {
      //     render(c) {
      //       return c('router-view')
      //     }
      //   },
      //   children: [
      //     {
      //       path: varRouter.getRoute("seismicviewer", 1),
      //       name: varRouter.getRoute("seismicviewer", 2),
      //       component: () => import('../views/pages/SeismicViewer')
      //     },
      //   ]
      // },
      // ]
    },


    // {
    //   path: varRouter.getRoute("inline-crossline", 1),
    //   meta: {label: varRouter.getRoute("inline-crossline", 2)},
    //   component: {
    //     render(c) {
    //       return c('router-view')
    //     }
    //   },
    //   children: [
    //     {
    //       path: varRouter.getRoute("seismicviewer", 1),
    //       name: varRouter.getRoute("seismicviewer", 2),
    //       component: () => import('../views/pages/SeismicViewer')
    //     },
    //   ]
    // },

    // ---------------------------------------------------------------
    // RESEARCH PAGE
    // ---------------------------------------------------------------
    //     {
    //       path: "/overlay",
    //       name: "overlay",
    //       component: () => import('../views/research/DemoOverlay')
    //     },
    //   ]
    // },
  ]
})
