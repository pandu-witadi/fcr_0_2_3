import {getLocalMapServer} from "../_constant/http_api";

export function getSampleGeoJson() {
  let data = [
    {"type":"Feature","properties":{},
      "geometry":{"type":"Polygon",
        "coordinates":[[[547829.4524432644,9921902.680855785],[552717.8998333141,9918002.664901333],
          [548593.2723479569,9912802.64362873],[540420.3993677162,9914561.474353287],
          [539427.43349161,9917926.194000265],[542482.713110391,9920832.088240836],[547829.4524432644,9921902.680855785]]]}}];
  return(data);
}
export function createAreaDemoData() {
  let data = [
    {"id_area": 1, "name": "CT3D", "bin_area": 156.25,
    "coordinate": {"p1": {"x": 553903, "y": 9896783}, "p2": {"x": 564971.187300455, "y": 9894631.96359927}, "p3": {"x":
          574337.187300455, "y": 9942816.96359927}, "p4": {"x": 563269, "y": 9944968}}
          },
    {"id_area": 2, "name": "TUNU95",
    "bin_area": 625, "coordinate": {"p1": {"x": 546966, "y": 9884923}, "p2": {"x": 573765.500059278, "y": 9911259.5086963},
      "p3": {"x": 555436.500059046, "y": 9929910.50869654}, "p4": {"x": 528636.999999768, "y": 9903574.00000024}}, "substack":
      {"near": {"filename": "TUNU95_substack_near.segy", "headerfile": "TUNU95_substack_near_hdr.csv", "loc":
            "TUNU95/substack"}, "mid": {"filename": "TUNU95_substack_mid.segy", "headerfile": "TUNU95_substack_mid_hdr.csv", "loc":
            "TUNU95/substack"}, "far": {"filename": "TUNU95_substack_far.segy", "headerfile": "TUNU95_substack_far_hdr.csv", "loc":
            "TUNU95/substack"}, "vfar": {"filename": "TUNU95_substack_vfar.segy", "headerfile": "TUNU95_substack_vfar_hdr.csv",
          "loc": "TUNU95/substack"}, "full": {"filename": "TUNU95_substack_full.segy", "headerfile":
            "TUNU95_substack_full_hdr.csv", "loc": "TUNU95/substack"}}, "gather_AVA": {"filename": "TUNU95_gather_AVA.segy",
      "headerfile": "TUNU95_gather_AVA_hdr.csv", "loc": "TUNU95/gather"}
    }];
  return (data);
}

export function addShowKeyToLayer(datas) {
  for(let i=0; i<datas.length; i++)
  {
    datas[i]["show"] = false;
  }
  return(datas);
}
export function createHeatmapDemoData() {
  let datas = [];
  return (datas);
}

export function createAvaDemoData() {
  let ava_data = [];
  return (ava_data);
}

export function createProbDemoData() {
  let prob_data = {};
  return (prob_data);
}

export function createGeobodyDemoData() {
  let data = [];
  return (data);
}

export function createAreaLeafletDemoData() {
  let data = {
    "zoom": 11,
    "minZoom": 8,
    "maxZoom": 16,
    "mapMaxResolution": 2.38865713,
    "url": getLocalMapServer() + "/{z}/{x}/{y}.png",
    "attribution": '',
    "tileExtent": [-20037508.34278924, -20037508.34278924, 20037508.34278924, 20037508.34278924],
    "polygon": [],
    "poly_color": []
  };
  return (data);
}

export function createDemoAvaGeobodyParam() {
  let param = {
    "data": {
      "id_area": 1,
      "gather_file_name": "CT3D_gather_AVA",
      "substack_file_name": "CT3D_substack_far",
      "geobody_id": "220845",
      "rad_x": 50,
      "rad_y": 50,
      "rad_z": 15
    }
  };
  return (param);
}

export function createDemoAvaPointParam() {
  let param = {
    "data": {
      "id_area": 1,
      "gather_file_name": "10_TUN_CT3DTZ_19_KPSTM_GTHR_D_FINAL_ANGLE_SCALED_Big_Endian.segy",
      "substack_file_name": "10_TUN_CT3DTZ_19_KPSTM_FAR_D_ELNWG_ZEROPHASED_Scaled.segy",
      "type": "ilxl",
      "cdp_z": 500,
      "rad_x": 100,
      "rad_y": 50,
      "rad_z": 15,
      "iline": 5583,
      "xline": 2685
    }
  };
  return (param);
}

export function createDemoProbParam() {
  let param = {
    "data": {
      "id_area": 1,
      "mlmodel_label_name": "CT3D_v30_m01_sm30_05_auc_0885",
      "data": [
        {
          "iline": 5579.0,
          "xline": 2681.0,
          "cdp_x": 563000.0,
          "cdp_y": 9899038.0,
          "cdp_z": 484.576
        },
        {
          "iline": 5579.0,
          "xline": 2681.0,
          "cdp_x": 563000.0,
          "cdp_y": 9899038.0,
          "cdp_z": 487.764
        }
      ]
    }
  };
  return (param);
}

export function createDemoWellInRadius() {
  let data = [];
  return (data);
}

export function createDemoGeobodySectionList() {
  let data = [];
  return (data);
}

export function createDemoProposeProspect()
{
  let data = {};
  return(data);
}

export function createDemoProspectProjectList()
{
  let data = [];
  return(data);
}

export function createProspectAnalysisDemoData() {
  let data = {};
  return(data);
}
