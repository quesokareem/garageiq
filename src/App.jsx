import { useState, useRef, useEffect } from "react";

const DARK_THEME = {
  bg:"#0C0C0E",surface:"#141417",border:"#222228",
  accent:"#C8F135",accentDim:"#C8F13520",
  red:"#FF4D4D",redDim:"#FF4D4D18",
  orange:"#FF9A3C",orangeDim:"#FF9A3C18",
  blue:"#4FC3F7",blueDim:"#4FC3F718",
  green:"#4ADE80",greenDim:"#4ADE8018",
  purple:"#C084FC",purpleDim:"#C084FC18",
  gold:"#F59E0B",goldDim:"#F59E0B18",
  text:"#F0F0F0",muted:"#666670",faint:"#1E1E24",
  isDark:true,
};
const LIGHT_THEME = {
  bg:"#F4F4F6",surface:"#FFFFFF",border:"#E0E0E6",
  accent:"#5B9E00",accentDim:"#5B9E0015",
  red:"#E03535",redDim:"#E0353510",
  orange:"#D4760A",orangeDim:"#D4760A10",
  blue:"#0284C7",blueDim:"#0284C710",
  green:"#16A34A",greenDim:"#16A34A10",
  purple:"#9333EA",purpleDim:"#9333EA10",
  gold:"#D97706",goldDim:"#D9770610",
  text:"#111118",muted:"#888890",faint:"#EDEDF2",
  isDark:false,
};
// C will be set dynamically based on theme - initialize to dark
let C = {...DARK_THEME};
const LEVEL_COLOR={critical:C.red,warning:C.orange,info:C.blue};
const getRoleColor=(role)=>role==="dealership"?"#F59E0B":role==="mechanic"||role==="admin"?C.green:C.blue;
const getRoleLabel=(role)=>role==="dealership"?"🏢 DEALER":role==="mechanic"||role==="admin"?"🔧 MECHANIC":"USER";

const INIT_USERS=[
  {id:"m1",role:"mechanic",name:"Jake Torres",email:"jake@garageiq.com",password:"mechanic123",shop:"Torres Auto",specialty:"Engine & Transmission",rating:4.9,reviews:47,available:true,isOnline:true,workingHours:{mon:"8:00 AM",monEnd:"6:00 PM",tue:"8:00 AM",tueEnd:"6:00 PM",wed:"8:00 AM",wedEnd:"6:00 PM",thu:"8:00 AM",thuEnd:"6:00 PM",fri:"8:00 AM",friEnd:"5:00 PM",sat:"9:00 AM",satEnd:"3:00 PM",sun:"Closed",sunEnd:""},showOnline:true,bio:"ASE certified, 12 years exp.",photo:"🧑‍🔧",logo:"🔧",signature:"Jake Torres",city:"Miami, FL",lat:25.7617,lng:-80.1918},
  {id:"m2",role:"admin",name:"Sandra Lee",email:"admin@garageiq.com",password:"admin123",shop:"Lee's Auto Care",specialty:"Full Service",rating:4.7,reviews:83,available:true,isOnline:true,workingHours:{mon:"9:00 AM",monEnd:"5:00 PM",tue:"9:00 AM",tueEnd:"5:00 PM",wed:"9:00 AM",wedEnd:"5:00 PM",thu:"9:00 AM",thuEnd:"5:00 PM",fri:"9:00 AM",friEnd:"4:00 PM",sat:"Closed",satEnd:"",sun:"Closed",sunEnd:""},showOnline:true,bio:"Family owned since 2005.",photo:"👩‍🔧",logo:"⭐",signature:"Sandra Lee",city:"Miami, FL",lat:25.7745,lng:-80.2100},
  {id:"m3",role:"mechanic",name:"Carlos Mendez",email:"carlos@garageiq.com",password:"mechanic123",shop:"Mendez Motors",specialty:"Electrical & AC",rating:4.6,reviews:31,available:false,bio:"Electrical & AC specialist.",photo:"👨‍🔧",logo:"⚡",signature:"Carlos Mendez",city:"Hialeah, FL",lat:25.8576,lng:-80.2781},
  {id:"c1",role:"customer",name:"Marcus Johnson",email:"marcus@email.com",password:"customer123",vehicleIds:[1],bio:"Car enthusiast.",photo:"😎",city:"Miami, FL",lat:25.7617,lng:-80.1918},
  {id:"c2",role:"customer",name:"Tanya Rivera",email:"tanya@email.com",password:"customer123",vehicleIds:[2],bio:"Just need reliable wheels.",photo:"👩",city:"Miami Beach, FL",lat:25.7907,lng:-80.1300},
  {id:"c3",role:"customer",name:"Derek Williams",email:"derek@email.com",password:"customer123",vehicleIds:[3],bio:"Weekend driver.",photo:"🧑",city:"Coral Gables, FL",lat:25.7215,lng:-80.2684},
  {id:"d1",role:"dealership",name:"Miami Auto Group",email:"miami@autodealer.com",password:"dealer123",shop:"Miami Auto Group",specialty:"New & Pre-Owned Vehicles",rating:4.3,reviews:124,available:true,bio:"South Florida's premier auto dealership. Over 500 vehicles in stock. Financing available for all credit types.",photo:"🏢",logo:"🚘",city:"Miami, FL",lat:25.7800,lng:-80.2100,verified:true,dealerLicense:"FL-DLR-2024-1892",established:"2008",website:"miamiautogroup.com"},
  {id:"d2",role:"dealership",name:"Sunshine Motors",email:"sunshine@motors.com",password:"dealer123",shop:"Sunshine Motors",specialty:"Certified Pre-Owned Specialists",rating:4.6,reviews:89,available:true,bio:"Specializing in certified pre-owned vehicles with full inspection reports. Trade-ins welcome.",photo:"☀️",logo:"🏅",city:"Coral Gables, FL",lat:25.7300,lng:-80.2600,verified:true,dealerLicense:"FL-DLR-2024-0445",established:"2015",website:"sunshinemotors.com"},
];

const INIT_VEHICLES=[
  {id:1,customerId:"c1",name:"Marcus Johnson",phone:"555-214-8801",vin:"1HGBH41JXMN109186",vehicle:"2021 Honda Civic",year:2021,make:"Honda",model:"Civic",mileage:42000,lastVisit:"2024-11-10",carPhoto:null,forSale:false,
   services:[{type:"Oil Change",date:"2024-11-10",mileage:42000,notes:"",status:"confirmed"},{type:"Tire Rotation",date:"2024-09-05",mileage:39500,notes:"",status:"confirmed"}],
   alerts:[{text:"Brake inspection due",level:"warning"},{text:"Air filter recommended",level:"info"}],pendingServices:[]},
  {id:2,customerId:"c2",name:"Tanya Rivera",phone:"555-987-3320",vin:"2T1BURHE0JC041234",vehicle:"2018 Toyota Corolla",year:2018,make:"Toyota",model:"Corolla",mileage:67800,lastVisit:"2024-10-22",carPhoto:null,forSale:false,
   services:[{type:"Oil Change",date:"2024-10-22",mileage:67800,notes:"",status:"confirmed"}],
   alerts:[{text:"Oil change due in 1,200 miles",level:"warning"}],pendingServices:[]},
  {id:3,customerId:"c3",name:"Derek Williams",phone:"555-441-0092",vin:"3VWF17AT4FM123456",vehicle:"2015 Volkswagen Jetta",year:2015,make:"Volkswagen",model:"Jetta",mileage:91200,lastVisit:"2024-08-30",carPhoto:null,forSale:false,
   services:[{type:"Transmission Service",date:"2024-08-30",mileage:91200,notes:"",status:"confirmed"}],
   alerts:[{text:"Brake pads critical",level:"critical"},{text:"Coolant flush overdue",level:"warning"}],
   pendingServices:[{id:99,type:"Brake Pad Replacement",date:"2024-11-15",mileage:91500,notes:"Replaced all four brake pads.",mechanicName:"Jake Torres",mechanicShop:"Torres Auto"}]},
];

const INIT_LISTINGS=[
  {id:1,sellerId:"m1",sellerName:"Jake Torres",sellerPhoto:"🧑‍🔧",verified:true,
   year:2019,make:"Ford",model:"Mustang",trim:"GT",color:"Race Red",mileage:38000,price:32500,
   titleStatus:"Clean Title",condition:"Excellent",description:"Well maintained Mustang GT. Recent full service, new tires, no accidents.",
   photos:["🚗"],city:"Miami, FL",lat:25.7617,lng:-80.1918,
   features:["V8 Engine","6-Speed Manual","Leather Seats","Backup Camera"],offers:[],listed:"2024-11-10"},
  {id:2,sellerId:"c2",sellerName:"Tanya Rivera",sellerPhoto:"👩",verified:false,
   year:2017,make:"Honda",model:"Accord",trim:"EX",color:"Lunar Silver",mileage:62000,price:16900,
   titleStatus:"Clean Title",condition:"Good",description:"Reliable Accord, regularly serviced. One owner, clean title.",
   photos:["🚙"],city:"Miami Beach, FL",lat:25.7907,lng:-80.1300,
   features:["Honda Sensing","Sunroof","Apple CarPlay"],offers:[],listed:"2024-11-08"},
  {id:3,sellerId:"c3",sellerName:"Derek Williams",sellerPhoto:"🧑",verified:false,
   year:2015,make:"Volkswagen",model:"Jetta",trim:"SE",color:"Platinum Gray",mileage:91200,price:9500,
   titleStatus:"Rebuilt",condition:"Fair",description:"Solid commuter. Needs some TLC but runs great. Priced to sell.",
   photos:["🚘"],city:"Coral Gables, FL",lat:25.7215,lng:-80.2684,
   features:["Turbocharged","Bluetooth","Heated Seats"],offers:[],listed:"2024-11-05"},
  {id:4,sellerId:"m2",sellerName:"Sandra Lee",sellerPhoto:"👩‍🔧",verified:true,
   year:2020,make:"Toyota",model:"Camry",trim:"XSE",color:"Midnight Black",mileage:29000,price:26800,
   condition:"Excellent",description:"One owner, garage kept. Full service history. Mechanic owned.",
   photos:["🚗"],city:"Miami, FL",lat:25.7745,lng:-80.2100,
   features:["V6 Engine","Sport Package","JBL Audio"],offers:[],listed:"2024-11-12"},
  {id:5,sellerId:"d1",sellerName:"Miami Auto Group",sellerPhoto:"🏢",verified:true,isDealer:true,
   year:2023,make:"Honda",model:"Accord",trim:"Sport",color:"Sonic Gray",mileage:8200,price:28900,
   condition:"Excellent",description:"One owner rental return. Like new condition. Full warranty available. Financing from 4.9% APR.",
   photos:["🚗"],city:"Miami, FL",lat:25.7800,lng:-80.2100,
   features:["Honda Sensing","Wireless CarPlay","Heated Seats","Blind Spot Monitor"],offers:[],listed:"2024-11-13"},
  {id:6,sellerId:"d1",sellerName:"Miami Auto Group",sellerPhoto:"🏢",verified:true,isDealer:true,
   year:2022,make:"Toyota",model:"RAV4",trim:"XLE Premium",color:"Blueprint Blue",mileage:19500,price:34500,
   condition:"Excellent",description:"Certified Pre-Owned with Toyota 7yr/100k warranty. One owner, no accidents.",
   photos:["🚙"],city:"Miami, FL",lat:25.7800,lng:-80.2100,
   features:["CPO Warranty","AWD","Sunroof","Power Liftgate","JBL Premium Audio"],offers:[],listed:"2024-11-11"},
  {id:7,sellerId:"d2",sellerName:"Sunshine Motors",sellerPhoto:"☀️",verified:true,isDealer:true,
   year:2021,make:"Ford",model:"F-150",trim:"XLT SuperCrew",color:"Iconic Silver",mileage:31000,price:38900,
   condition:"Good",description:"Clean CARFAX. Well maintained. All service records available. Trade-ins welcome.",
   photos:["🚘"],city:"Coral Gables, FL",lat:25.7300,lng:-80.2600,
   features:["4x4","Tow Package","FordPass Connect","Backup Camera"],offers:[],listed:"2024-11-10"},
];

const INIT_SHOPS=[
  {id:"shop1",ownerId:"m2",name:"Lee's Auto Care",workers:["m1","m3"],seniorMechanics:["m1"]},
];

const INIT_WORKERS=[
  {id:"w1",userId:"m1",shopId:"shop1",name:"Jake Torres",role:"senior",photo:"🧑‍🔧",specialty:"Engine & Transmission",available:true},
  {id:"w2",userId:"m3",shopId:"shop1",name:"Carlos Mendez",role:"worker",photo:"👨‍🔧",specialty:"Electrical & AC",available:true},
];

const JOB_STATUSES=["To-do","In Progress","Waiting on Parts","Done","Paid"];
const JOB_STATUS_COLORS={"To-do":C.blue,"In Progress":C.orange,"Waiting on Parts":C.purple,"Done":C.green,"Paid":C.accent};

const INIT_JOBS=[
  {id:1,shopId:"shop1",assignedTo:"w1",assignedBy:"m2",customerId:"c1",vehicleName:"2021 Honda Civic",customerName:"Marcus Johnson",customerPhone:"555-214-8801",service:"Brake Pad Replacement",status:"In Progress",priority:"Urgent",notes:"Front brakes worn. Customer waiting on call.",parts:["Brake Pads (Front)","Brake Rotors (Front)"],estimatedHours:2,createdAt:"2024-11-12",updatedAt:"2024-11-12"},
  {id:2,shopId:"shop1",assignedTo:"w2",assignedBy:"m1",customerId:"c3",vehicleName:"2015 Volkswagen Jetta",customerName:"Derek Williams",customerPhone:"555-441-0092",service:"Alternator Replacement",status:"Waiting on Parts",priority:"Normal",notes:"Alternator ordered. ETA tomorrow.",parts:["Alternator","Serpentine Belt"],estimatedHours:3,createdAt:"2024-11-11",updatedAt:"2024-11-12"},
  {id:3,shopId:"shop1",assignedTo:"w1",assignedBy:"m2",customerId:"c2",vehicleName:"2018 Toyota Corolla",customerName:"Tanya Rivera",customerPhone:"555-987-3320",service:"Oil Change + Tire Rotation",status:"To-do",priority:"Normal",notes:"Full synthetic. Check tire pressure.",parts:["5W-30 Synthetic Oil","Oil Filter"],estimatedHours:1,createdAt:"2024-11-12",updatedAt:"2024-11-12"},
  {id:4,shopId:"shop1",assignedTo:"w2",assignedBy:"m2",customerId:null,vehicleName:"2019 Ford F-150",customerName:"Walk-in Customer",customerPhone:"",service:"AC Recharge",status:"Done",priority:"Normal",notes:"Recharged and tested. Ready for pickup.",parts:["R-134a Refrigerant"],estimatedHours:1.5,createdAt:"2024-11-11",updatedAt:"2024-11-12"},
];

const INIT_MESSAGES=[
  {id:1,from:"m1",to:"c1",text:"Hi Marcus! Your Civic is ready.",time:"10:30 AM",date:"Today"},
  {id:2,from:"c1",to:"m1",text:"Thanks Jake! I'll swing by around 3pm.",time:"10:45 AM",date:"Today"},
];
const INIT_QUOTES=[
  {id:1,mechanicId:"m1",customerId:"c1",vehicleId:1,status:"pending",date:"2024-11-12",vehicle:"2021 Honda Civic",
   mechanicName:"Jake Torres",mechanicShop:"Torres Auto",mechanicSig:"Jake Torres",
   items:[{description:"Brake Pads (Front)",parts:89,labor:120},{description:"Brake Rotors",parts:145,labor:60}],
   notes:"Recommended replacing front brakes asap.",counterOffer:null},
];
const INIT_POSTS=[
  {id:1,authorId:"c1",authorName:"Marcus Johnson",authorRole:"customer",time:"2h ago",text:"Need my alternator replaced this weekend. Anyone local?",tag:"Alternator",replies:[{id:1,authorId:"m1",authorName:"Jake Torres",authorRole:"mechanic",text:"I can come by Saturday morning!",time:"1h ago"}]},
  {id:2,authorId:"m2",authorName:"Sandra Lee",authorRole:"mechanic",time:"5h ago",text:"Offering mobile oil changes this weekend — $45 full synthetic.",tag:"Oil Change",replies:[]},
];
const INIT_REVIEWS=[
  {id:1,mechanicId:"m1",authorName:"Tanya Rivera",rating:5,text:"Jake fixed my alternator in 2 hours. Super professional.",time:"2 weeks ago",verified:true},
  {id:2,mechanicId:"m2",authorName:"Marcus Johnson",rating:5,text:"Sandra's shop is spotless.",time:"3 weeks ago",verified:true},
];

const SERVICE_TYPES=["Oil Change","Tire Rotation","Brake Pad Replacement","Air Filter","Transmission Service","Coolant Flush","Battery Replacement","Wheel Alignment","Spark Plugs","Full Inspection"];
const JOB_TAGS=["Oil Change","Brakes","Alternator","AC","Transmission","Electrical","Tires","Engine","Battery","Other"];
const CAR_MAKES=["Any","Ford","Chevrolet","Toyota","Honda","Nissan","Hyundai","Kia","Jeep","Ram","GMC","Subaru","Tesla","BMW","Mercedes-Benz","Lexus","Acura","Audi","Volkswagen","Mazda","Volvo","Dodge","Chrysler","Buick","Cadillac","Infiniti","Lincoln","Mitsubishi","Mini","Land Rover","Jaguar","Porsche","Genesis","Other"];

const CAR_MODELS={
  Ford:["F-150","F-150 Lightning","F-250 Super Duty","F-350 Super Duty","F-450 Super Duty","Ranger","Maverick","Bronco","Bronco Sport","Escape","Edge","Explorer","Expedition","Expedition MAX","Mustang","Mustang Mach-E","Transit Cargo Van","Transit Passenger Van","Transit Connect","Fusion","Focus","Fiesta","Taurus","Flex"],
  Chevrolet:["Silverado 1500","Silverado 1500 LTD","Silverado 2500HD","Silverado 3500HD","Colorado","Blazer","Trailblazer","Equinox","Traverse","Tahoe","Suburban","Trax","Malibu","Impala","Camaro","Corvette","Bolt EV","Bolt EUV","Spark","Sonic","Cruze","Volt","Express Cargo Van","Express Passenger Van"],
  Toyota:["Camry","Corolla","Corolla Hatchback","Corolla Cross","RAV4","RAV4 Hybrid","Highlander","Grand Highlander","Tacoma","Tundra","4Runner","Sequoia","Sienna","Prius","Prius Prime","Venza","Crown","GR86","Supra","Land Cruiser","Avalon","bZ4X","C-HR","Matrix","Yaris"],
  Honda:["Civic","Civic Si","Civic Type R","Accord","CR-V","HR-V","Pilot","Passport","Odyssey","Ridgeline","Insight","Fit","CR-Z","Crosstour","Element","Prelude"],
  Nissan:["Altima","Sentra","Versa","Maxima","Rogue","Rogue Sport","Murano","Pathfinder","Armada","Frontier","Titan","Titan XD","Kicks","Juke","Leaf","Ariya","Z","GT-R","NV Cargo","NV Passenger","Quest"],
  Hyundai:["Elantra","Sonata","Accent","Venue","Kona","Kona Electric","Tucson","Santa Fe","Palisade","Santa Cruz","Ioniq","Ioniq Hybrid","Ioniq Plug-in","Ioniq 5","Ioniq 6","Azera","Veloster"],
  Kia:["Forte","K4","K5","Rio","Soul","Seltos","Sportage","Sorento","Telluride","Carnival","Niro","Niro EV","EV6","EV9","Stinger","Cadenza","Amanti"],
  Jeep:["Wrangler","Wrangler Unlimited","Gladiator","Cherokee","Grand Cherokee","Grand Cherokee L","Compass","Renegade","Wagoneer","Grand Wagoneer","Patriot","Liberty"],
  Ram:["1500","1500 Classic","2500","3500","ProMaster Cargo Van","ProMaster City","ProMaster Window Van","Chassis Cab 3500","Chassis Cab 4500","Chassis Cab 5500"],
  GMC:["Sierra 1500","Sierra 2500HD","Sierra 3500HD","Canyon","Terrain","Acadia","Yukon","Yukon XL","Hummer EV Pickup","Hummer EV SUV","Savana Cargo","Savana Passenger"],
  Subaru:["Impreza","Legacy","WRX","BRZ","Crosstrek","Forester","Outback","Ascent","Solterra","Baja"],
  Tesla:["Model 3","Model Y","Model S","Model X","Cybertruck","Roadster"],
  BMW:["2 Series","3 Series","4 Series","5 Series","7 Series","8 Series","X1","X2","X3","X4","X5","X6","X7","XM","Z4","i3","i4","i5","i7","i8","iX"],
  "Mercedes-Benz":["A-Class","C-Class","CLA","CLS","E-Class","S-Class","GLA","GLB","GLC","GLE","GLS","G-Class","EQB","EQE","EQS","SL","AMG GT","Metris"],
  Lexus:["IS","ES","GS","LS","RC","LC","UX","NX","RX","TX","GX","LX","RZ"],
  Acura:["ILX","Integra","TLX","RLX","RDX","MDX","NSX"],
  Audi:["A3","A4","A5","A6","A7","A8","Q3","Q4 e-tron","Q5","Q7","Q8","e-tron","TT","R8","S4","RS5"],
  Volkswagen:["Jetta","Passat","Golf","Golf GTI","Golf R","Tiguan","Taos","Atlas","Atlas Cross Sport","ID.4","Arteon","Beetle","CC"],
  Mazda:["Mazda2","Mazda3","Mazda6","CX-3","CX-30","CX-5","CX-50","CX-7","CX-9","CX-90","MX-5 Miata","RX-8"],
  Volvo:["S60","S90","V60","V90","XC40","XC60","XC90","C40 Recharge"],
  Dodge:["Charger","Challenger","Durango","Hornet","Dart","Journey","Magnum","Caliber","Neon","Viper"],
  Chrysler:["300","Pacifica","Voyager","Town & Country","Sebring"],
  Buick:["Encore","Encore GX","Envision","Enclave","Regal","LaCrosse","Verano"],
  Cadillac:["CT4","CT5","CT6","ATS","CTS","Escalade","Escalade ESV","XT4","XT5","XT6","Lyriq","XTS"],
  Infiniti:["Q50","Q60","Q70","QX30","QX50","QX55","QX60","QX80"],
  Lincoln:["Corsair","Nautilus","Aviator","Navigator","MKC","MKX","MKZ","Continental"],
  Mitsubishi:["Mirage","Mirage G4","Lancer","Outlander","Outlander Sport","Eclipse Cross","Galant","Endeavor"],
  Mini:["Cooper","Cooper S","Clubman","Countryman","Convertible"],
  "Land Rover":["Range Rover","Range Rover Sport","Range Rover Velar","Range Rover Evoque","Defender","Discovery","Discovery Sport"],
  Jaguar:["XE","XF","XJ","F-Type","F-Pace","E-Pace","I-Pace"],
  Porsche:["911","Cayenne","Macan","Panamera","Taycan","718 Boxster","718 Cayman"],
  Genesis:["G70","G80","G90","GV60","GV70","GV80"],
  Other:[],
};

const MODEL_TYPES={
  // Sedans
  "Camry":"Sedan","Corolla":"Sedan","Civic":"Sedan","Civic Si":"Sedan","Accord":"Sedan","Altima":"Sedan","Sentra":"Sedan","Maxima":"Sedan","Versa":"Sedan","Elantra":"Sedan","Sonata":"Sedan","Accent":"Sedan","Malibu":"Sedan","Fusion":"Sedan","Taurus":"Sedan","Passat":"Sedan","Jetta":"Sedan","A3":"Sedan","A4":"Sedan","A6":"Sedan","A7":"Sedan","A8":"Sedan","3 Series":"Sedan","5 Series":"Sedan","7 Series":"Sedan","C-Class":"Sedan","E-Class":"Sedan","S-Class":"Sedan","A-Class":"Sedan","CLS":"Sedan","ES":"Sedan","IS":"Sedan","GS":"Sedan","LS":"Sedan","ILX":"Sedan","TLX":"Sedan","RLX":"Sedan","Integra":"Sedan","G70":"Sedan","G80":"Sedan","G90":"Sedan","S60":"Sedan","S90":"Sedan","Mazda3":"Sedan","Mazda6":"Sedan","Q50":"Sedan","Q60":"Sedan","Q70":"Sedan","Stinger":"Sedan","Cadenza":"Sedan","Amanti":"Sedan","K5":"Sedan","K4":"Sedan","Forte":"Sedan","Rio":"Sedan","300":"Sedan","Sebring":"Sedan","CT4":"Sedan","CT5":"Sedan","CT6":"Sedan","ATS":"Sedan","CTS":"Sedan","XTS":"Sedan","Regal":"Sedan","LaCrosse":"Sedan","Verano":"Sedan","MKZ":"Sedan","Continental":"Sedan","Lancer":"Sedan","Galant":"Sedan","Mirage G4":"Sedan","Crown":"Sedan","Avalon":"Sedan","Impala":"Sedan","Cruze":"Sedan","Dart":"Sedan","Neon":"Sedan","Caliber":"Sedan","Azera":"Sedan","XE":"Sedan","XF":"Sedan","XJ":"Sedan","Panamera":"Sedan","CC":"Sedan","Arteon":"Sedan","Mazda2":"Sedan",
  // Hatchbacks
  "Corolla Hatchback":"Hatchback","Civic Type R":"Hatchback","Golf":"Hatchback","Golf GTI":"Hatchback","Golf R":"Hatchback","Fit":"Hatchback","Yaris":"Hatchback","Bolt EV":"Hatchback","Bolt EUV":"Hatchback","Spark":"Hatchback","Sonic":"Hatchback","Focus":"Hatchback","Fiesta":"Hatchback","Prius":"Hatchback","Prius Prime":"Hatchback","Matrix":"Hatchback","Veloster":"Hatchback","Ioniq":"Hatchback","Ioniq Hybrid":"Hatchback","Ioniq Plug-in":"Hatchback","i3":"Hatchback","Leaf":"Hatchback","Mazda2":"Hatchback","Beetle":"Hatchback","Cooper":"Hatchback","Cooper S":"Hatchback","CR-Z":"Hatchback","Insight":"Hatchback","Volt":"Hatchback","Clubman":"Hatchback","Impreza":"Hatchback","WRX":"Hatchback",
  // SUVs / Crossovers
  "CR-V":"SUV","RAV4":"SUV","RAV4 Hybrid":"SUV","Rogue":"SUV","Rogue Sport":"SUV","Equinox":"SUV","Explorer":"SUV","Escape":"SUV","Tiguan":"SUV","Taos":"SUV","Atlas":"SUV","Atlas Cross Sport":"SUV","ID.4":"SUV","Tucson":"SUV","Santa Fe":"SUV","Sorento":"SUV","Sportage":"SUV","Outlander":"SUV","Outlander Sport":"SUV","Eclipse Cross":"SUV","Forester":"SUV","Outback":"SUV","Crosstrek":"SUV","Ascent":"SUV","Solterra":"SUV","CX-3":"SUV","CX-30":"SUV","CX-5":"SUV","CX-50":"SUV","CX-7":"SUV","CX-9":"SUV","CX-90":"SUV","Pilot":"SUV","HR-V":"SUV","Passport":"SUV","Crosstour":"SUV","Element":"SUV","Kona":"SUV","Kona Electric":"SUV","Venue":"SUV","Palisade":"SUV","Santa Cruz":"SUV","Soul":"SUV","Seltos":"SUV","Niro":"SUV","Niro EV":"SUV","Kicks":"SUV","Juke":"SUV","Murano":"SUV","Pathfinder":"SUV","Armada":"SUV","Ariya":"SUV","Ioniq 5":"SUV","Ioniq 6":"SUV","EV6":"SUV","EV9":"SUV","Highlander":"SUV","Grand Highlander":"SUV","4Runner":"SUV","Sequoia":"SUV","Land Cruiser":"SUV","Venza":"SUV","bZ4X":"SUV","C-HR":"SUV","Edge":"SUV","Bronco Sport":"SUV","Expedition":"SUV","Expedition MAX":"SUV","Mustang Mach-E":"SUV","Blazer":"SUV","Trailblazer":"SUV","Traverse":"SUV","Tahoe":"SUV","Suburban":"SUV","Trax":"SUV","Terrain":"SUV","Acadia":"SUV","Yukon":"SUV","Yukon XL":"SUV","Hummer EV SUV":"SUV","Escalade":"SUV","Escalade ESV":"SUV","XT4":"SUV","XT5":"SUV","XT6":"SUV","Lyriq":"SUV","Cherokee":"SUV","Grand Cherokee":"SUV","Grand Cherokee L":"SUV","Compass":"SUV","Renegade":"SUV","Wagoneer":"SUV","Grand Wagoneer":"SUV","Patriot":"SUV","Liberty":"SUV","GX":"SUV","NX":"SUV","UX":"SUV","LX":"SUV","RX":"SUV","TX":"SUV","RZ":"SUV","LC":"SUV","Q3":"SUV","Q4 e-tron":"SUV","Q5":"SUV","Q7":"SUV","Q8":"SUV","e-tron":"SUV","X1":"SUV","X2":"SUV","X3":"SUV","X4":"SUV","X5":"SUV","X6":"SUV","X7":"SUV","XM":"SUV","iX":"SUV","GLA":"SUV","GLB":"SUV","GLC":"SUV","GLE":"SUV","GLS":"SUV","G-Class":"SUV","EQB":"SUV","EQE":"SUV","EQS":"SUV","MDX":"SUV","RDX":"SUV","Enclave":"SUV","Encore":"SUV","Encore GX":"SUV","Envision":"SUV","QX30":"SUV","QX50":"SUV","QX55":"SUV","QX60":"SUV","QX80":"SUV","Corsair":"SUV","Nautilus":"SUV","Aviator":"SUV","Navigator":"SUV","MKC":"SUV","MKX":"SUV","Countryman":"SUV","Range Rover":"SUV","Range Rover Sport":"SUV","Range Rover Velar":"SUV","Range Rover Evoque":"SUV","Defender":"SUV","Discovery":"SUV","Discovery Sport":"SUV","F-Pace":"SUV","E-Pace":"SUV","I-Pace":"SUV","Cayenne":"SUV","Macan":"SUV","GV60":"SUV","GV70":"SUV","GV80":"SUV","XC40":"SUV","XC60":"SUV","XC90":"SUV","C40 Recharge":"SUV","Model X":"SUV","Model Y":"SUV","Durango":"SUV","Hornet":"SUV","Journey":"SUV","Voyager":"SUV","Pacifica":"SUV","Endeavor":"SUV","Corolla Cross":"SUV",
  // Trucks
  "F-150":"Truck","F-150 Lightning":"Truck","F-250 Super Duty":"Truck","F-350 Super Duty":"Truck","F-450 Super Duty":"Truck","Ranger":"Truck","Maverick":"Truck","Silverado 1500":"Truck","Silverado 1500 LTD":"Truck","Silverado 2500HD":"Truck","Silverado 3500HD":"Truck","Colorado":"Truck","Sierra 1500":"Truck","Sierra 2500HD":"Truck","Sierra 3500HD":"Truck","Canyon":"Truck","Hummer EV Pickup":"Truck","Tacoma":"Truck","Tundra":"Truck","Frontier":"Truck","Titan":"Truck","Titan XD":"Truck","Ridgeline":"Truck","Gladiator":"Truck","1500":"Truck","1500 Classic":"Truck","2500":"Truck","3500":"Truck","Chassis Cab 3500":"Truck","Chassis Cab 4500":"Truck","Chassis Cab 5500":"Truck","Cybertruck":"Truck","Baja":"Truck","Santa Cruz":"Truck",
  // Minivans
  "Odyssey":"Minivan","Sienna":"Minivan","Carnival":"Minivan","Quest":"Minivan","Town & Country":"Minivan","Pacifica":"Minivan","Voyager":"Minivan","Savana Passenger":"Van","Metris":"Van",
  // Vans
  "Transit Cargo Van":"Van","Transit Passenger Van":"Van","Transit Connect":"Van","Express Cargo Van":"Van","Express Passenger Van":"Van","NV Cargo":"Van","NV Passenger":"Van","ProMaster Cargo Van":"Van","ProMaster Window Van":"Van","ProMaster City":"Van","Savana Cargo":"Van",
  // Sports/Coupes
  "Mustang":"Coupe","Camaro":"Coupe","Challenger":"Coupe","Charger":"Coupe","Corvette":"Coupe","Supra":"Coupe","GR86":"Coupe","BRZ":"Coupe","Z":"Coupe","GT-R":"Coupe","Magnum":"Coupe","4 Series":"Coupe","2 Series":"Coupe","8 Series":"Coupe","AMG GT":"Coupe","RC":"Coupe","LC":"Coupe","TT":"Coupe","R8":"Coupe","RS5":"Coupe","A5":"Coupe","S4":"Coupe","NSX":"Coupe","CLA":"Coupe","911":"Coupe","718 Cayman":"Coupe","Taycan":"Coupe","Roadster":"Coupe","i8":"Coupe","F-Type":"Coupe","XE":"Coupe","Viper":"Coupe",
  // Convertibles
  "MX-5 Miata":"Convertible","Z4":"Convertible","718 Boxster":"Convertible","SL":"Convertible","Convertible":"Convertible","RX-8":"Coupe","CLA":"Sedan",
};

const BODY_TYPES=["Any","Sedan","SUV","Truck","Minivan","Van","Coupe","Convertible","Hatchback"];
const CAR_COLORS=["Any","Black","White","Silver","Gray","Red","Blue","Green","Orange","Yellow","Brown","Beige","Gold","Purple","Other"];

function Av({name,size=36,color=C.accent,emoji=null}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:color+"22",color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:emoji?size*0.55:size*0.46,flexShrink:0}}>{emoji||name?.[0]?.toUpperCase()}</div>;
}
function Stars({rating,size=14}){return <span style={{fontSize:size,color:C.accent}}>{"★".repeat(Math.round(rating))}{"☆".repeat(5-Math.round(rating))}</span>;}
function Pill({level}){const col=LEVEL_COLOR[level]||C.blue;return <span style={{background:col+"18",color:col,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 9px"}}>{level?.toUpperCase()}</span>;}
function Badge({count}){if(!count)return null;return <span style={{background:C.red,color:"#000",borderRadius:99,fontSize:10,fontWeight:800,padding:"1px 6px",minWidth:18,textAlign:"center"}}>{count}</span>;}

function distanceMiles(lat1,lng1,lat2,lng2){
  const R=3958.8,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function LocationBar({location,onUpdate}){
  const [editing,setEditing]=useState(false);
  const [input,setInput]=useState(location?.city||"");
  const [detecting,setDetecting]=useState(false);
  const detect=()=>{setDetecting(true);navigator.geolocation.getCurrentPosition(pos=>{onUpdate({lat:pos.coords.latitude,lng:pos.coords.longitude,city:"Current Location"});setDetecting(false);setEditing(false);},()=>{setDetecting(false);alert("Location denied. Please type your city.");},{timeout:8000});};
  const zipCoords={
    "33101":{lat:25.7617,lng:-80.1918,city:"Miami, FL 33101"},"33125":{lat:25.7753,lng:-80.2210,city:"Miami, FL 33125"},
    "33139":{lat:25.7907,lng:-80.1300,city:"Miami Beach, FL 33139"},"33140":{lat:25.8011,lng:-80.1289,city:"Miami Beach, FL 33140"},
    "33134":{lat:25.7215,lng:-80.2684,city:"Coral Gables, FL 33134"},"33010":{lat:25.8576,lng:-80.2781,city:"Hialeah, FL 33010"},
    "10001":{lat:40.7484,lng:-73.9967,city:"New York, NY 10001"},"10002":{lat:40.7157,lng:-73.9863,city:"New York, NY 10002"},
    "90001":{lat:33.9731,lng:-118.2479,city:"Los Angeles, CA 90001"},"90210":{lat:34.0901,lng:-118.4065,city:"Beverly Hills, CA 90210"},
    "60601":{lat:41.8858,lng:-87.6181,city:"Chicago, IL 60601"},"77001":{lat:29.7490,lng:-95.3677,city:"Houston, TX 77001"},
    "30301":{lat:33.7490,lng:-84.3880,city:"Atlanta, GA 30301"},"85001":{lat:33.4484,lng:-112.0740,city:"Phoenix, AZ 85001"},
    "78201":{lat:29.4241,lng:-98.4936,city:"San Antonio, TX 78201"},"75201":{lat:32.7767,lng:-96.7970,city:"Dallas, TX 75201"},
    "92101":{lat:32.7157,lng:-117.1611,city:"San Diego, CA 92101"},"95101":{lat:37.3382,lng:-121.8863,city:"San Jose, CA 95101"},
    "32801":{lat:28.5383,lng:-81.3792,city:"Orlando, FL 32801"},"33602":{lat:27.9506,lng:-82.4572,city:"Tampa, FL 33602"},
  };
  const cityCoords={"miami":{lat:25.7617,lng:-80.1918,city:"Miami, FL"},"miami fl":{lat:25.7617,lng:-80.1918,city:"Miami, FL"},"miami beach":{lat:25.7907,lng:-80.1300,city:"Miami Beach, FL"},"coral gables":{lat:25.7215,lng:-80.2684,city:"Coral Gables, FL"},"hialeah":{lat:25.8576,lng:-80.2781,city:"Hialeah, FL"},"new york":{lat:40.7128,lng:-74.0060,city:"New York, NY"},"los angeles":{lat:34.0522,lng:-118.2437,city:"Los Angeles, CA"},"chicago":{lat:41.8781,lng:-87.6298,city:"Chicago, IL"},"houston":{lat:29.7604,lng:-95.3698,city:"Houston, TX"},"atlanta":{lat:33.7490,lng:-84.3880,city:"Atlanta, GA"},"orlando":{lat:28.5383,lng:-81.3792,city:"Orlando, FL"},"tampa":{lat:27.9506,lng:-82.4572,city:"Tampa, FL"},"dallas":{lat:32.7767,lng:-96.7970,city:"Dallas, TX"},"phoenix":{lat:33.4484,lng:-112.0740,city:"Phoenix, AZ"},"san diego":{lat:32.7157,lng:-117.1611,city:"San Diego, CA"}};
  const save=()=>{
    const key=input.toLowerCase().trim();
    const found=zipCoords[key]||cityCoords[key];
    if(found){onUpdate(found);}
    else if(/^[0-9]{5}$/.test(key)){
      // Unknown zip - use as label with default coords
      onUpdate({lat:25.7617,lng:-80.1918,city:`ZIP ${key}`});
    } else {
      onUpdate({lat:25.7617,lng:-80.1918,city:input||"Miami, FL"});
    }
    setEditing(false);
  };
  if(editing)return(<div style={{display:"flex",gap:8,alignItems:"center",padding:"8px 14px",background:C.faint,borderBottom:`1px solid ${C.border}`}}>
    <input style={{...S.input,margin:0,flex:1,padding:"6px 10px",fontSize:12}} placeholder="City or ZIP code (e.g. 33101)" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} autoFocus/>
    <button style={{...S.btnSecondary,padding:"6px 10px",fontSize:12}} onClick={detect} disabled={detecting}>{detecting?"...":"📍 Auto"}</button>
    <button style={{...S.btnPrimary,padding:"6px 12px",fontSize:12}} onClick={save}>Set</button>
    <button onClick={()=>setEditing(false)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>✕</button>
  </div>);
  return(<div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 14px",background:C.faint,borderBottom:`1px solid ${C.border}`,cursor:"pointer"}} onClick={()=>setEditing(true)}>
    <span style={{fontSize:13}}>📍</span>
    <span style={{fontSize:12,color:C.muted}}>{location?.city||"Set your location"}</span>
    <span style={{fontSize:11,color:C.accent,marginLeft:4}}>Change</span>
  </div>);
}

function SignaturePad({onChange}){
  const canvasRef=useRef();const drawing=useRef(false);
  const gp=(e,r)=>({x:(e.touches?.[0]?.clientX||e.clientX)-r.left,y:(e.touches?.[0]?.clientY||e.clientY)-r.top});
  const start=(e)=>{drawing.current=true;const ctx=canvasRef.current.getContext("2d");const p=gp(e,canvasRef.current.getBoundingClientRect());ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.strokeStyle=C.accent;ctx.lineWidth=2;ctx.lineCap="round";};
  const draw=(e)=>{if(!drawing.current)return;const ctx=canvasRef.current.getContext("2d");const p=gp(e,canvasRef.current.getBoundingClientRect());ctx.lineTo(p.x,p.y);ctx.stroke();};
  const stop=()=>{drawing.current=false;onChange(canvasRef.current.toDataURL());};
  const clear=()=>{canvasRef.current.getContext("2d").clearRect(0,0,300,80);onChange("");};
  return(<div><canvas ref={canvasRef} width={300} height={80} style={{background:"#080808",border:`1px solid ${C.border}`,borderRadius:8,cursor:"crosshair",touchAction:"none",display:"block",maxWidth:"100%"}} onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}/><button onClick={clear} style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",marginTop:4}}>Clear</button></div>);
}

function CarPhotoPicker({current,onSave,onClose}){
  const [preview,setPreview]=useState(current||null);const [mode,setMode]=useState("choose");
  const fileRef=useRef();const videoRef=useRef();const streamRef=useRef();
  const handleFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setPreview(ev.target.result);r.readAsDataURL(f);};
  const startCam=async()=>{setMode("camera");try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});streamRef.current=s;if(videoRef.current)videoRef.current.srcObject=s;}catch{alert("Camera denied.");setMode("choose");}};
  const takePhoto=()=>{const c=document.createElement("canvas");c.width=videoRef.current.videoWidth;c.height=videoRef.current.videoHeight;c.getContext("2d").drawImage(videoRef.current,0,0);setPreview(c.toDataURL("image/jpeg",0.8));streamRef.current?.getTracks().forEach(t=>t.stop());setMode("choose");};
  useEffect(()=>()=>streamRef.current?.getTracks().forEach(t=>t.stop()),[]);
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:420}}>
    <div style={S.modalHead}><span style={S.modalTitle}>Car Photo</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    {mode==="camera"
      ?<div><video ref={videoRef} autoPlay playsInline style={{width:"100%",borderRadius:10,marginBottom:10,background:"#000"}}/><div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>{streamRef.current?.getTracks().forEach(t=>t.stop());setMode("choose");}}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={takePhoto}>📸 Take Photo</button></div></div>
      :<>{preview?<div style={{marginBottom:10,borderRadius:10,overflow:"hidden",height:160}}><img src={preview} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>:<div style={{height:120,background:C.faint,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,border:`1px dashed ${C.border}`,color:C.muted,fontSize:13}}>No photo yet</div>}
      <div style={{display:"flex",gap:8,marginBottom:10}}><button style={{...S.btnSecondary,flex:1}} onClick={()=>fileRef.current.click()}>📁 Upload</button><button style={{...S.btnSecondary,flex:1}} onClick={startCam}>📷 Camera</button></div>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
      <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={onClose}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={()=>{onSave(preview);onClose();}}>Save</button></div></>}
  </div></div>);
}

function Corner({pos}){
  const m={tl:{top:10,left:10},tr:{top:10,right:10},bl:{bottom:10,left:10},br:{bottom:10,right:10}};
  const b={tl:{borderTop:`2px solid ${C.accent}`,borderLeft:`2px solid ${C.accent}`},tr:{borderTop:`2px solid ${C.accent}`,borderRight:`2px solid ${C.accent}`},bl:{borderBottom:`2px solid ${C.accent}`,borderLeft:`2px solid ${C.accent}`},br:{borderBottom:`2px solid ${C.accent}`,borderRight:`2px solid ${C.accent}`}};
  return <div style={{position:"absolute",width:18,height:18,...m[pos],...b[pos]}}/>;
}

function VINModal({onClose,onAdd}){
  const [vin,setVin]=useState("");const [name,setName]=useState("");const [phone,setPhone]=useState("");
  const [vehicleInfo,setVehicleInfo]=useState(null);const [scanning,setScanning]=useState(false);
  const [loading,setLoading]=useState(false);const [step,setStep]=useState(1);const [error,setError]=useState("");
  const videoRef=useRef();const streamRef=useRef();
  const lookupVIN=async(v)=>{if(v.length<11){setError("VIN must be at least 11 characters.");return;}setLoading(true);setError("");
    try{const res=await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${v}?format=json`);const data=await res.json();
      const get=variable=>data.Results?.find(r=>r.Variable===variable)?.Value||"";
      const make=get("Make");const model=get("Model");const year=get("Model Year");
      if(!make||make==="null"){setError("VIN not found.");setLoading(false);return;}
      setVehicleInfo({vin:v.toUpperCase(),make,model,year,engine:get("Engine Configuration"),trim:get("Trim"),vehicle:`${year} ${make} ${model}`});setStep(2);
    }catch{setError("Lookup failed.");}setLoading(false);};
  const startCam=async()=>{setScanning(true);try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});streamRef.current=s;if(videoRef.current)videoRef.current.srcObject=s;}catch{setError("Camera denied.");setScanning(false);}};
  const stopCam=()=>{streamRef.current?.getTracks().forEach(t=>t.stop());setScanning(false);};
  useEffect(()=>()=>stopCam(),[]);
  const save=()=>{if(!name||!phone||!vehicleInfo)return;onAdd({name,phone,...vehicleInfo});onClose();};
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:440}}>
    <div style={S.modalHead}><span style={S.modalTitle}>New Client — VIN</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    {step===1&&<>{!scanning
      ?<div style={{height:120,background:"#080808",borderRadius:10,marginBottom:12,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,position:"relative"}}>
         {["tl","tr","bl","br"].map(p=><Corner key={p} pos={p}/>)}
         <div style={{color:C.muted,fontSize:11,fontWeight:700,letterSpacing:2}}>CAMERA INACTIVE</div>
         <button style={{...S.btnPrimary,fontSize:12,padding:"6px 14px"}} onClick={startCam}>📷 Start Camera</button>
       </div>
      :<div style={{position:"relative",height:150,background:"#000",borderRadius:10,marginBottom:12,overflow:"hidden",border:`1px solid ${C.accent}`}}>
         <video ref={videoRef} autoPlay playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}/>
         {["tl","tr","bl","br"].map(p=><Corner key={p} pos={p}/>)}
         <div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:7}}>
           <button style={{...S.btnSecondary,fontSize:11,padding:"4px 9px"}} onClick={stopCam}>Stop</button>
           <button style={{...S.btnPrimary,fontSize:11,padding:"4px 9px"}} onClick={()=>{stopCam();setVin("1HGBH41JXMN109186");}}>Simulate</button>
         </div>
       </div>}
    <label style={S.label}>VIN</label>
    <input style={S.input} placeholder="17-char VIN" value={vin} onChange={e=>setVin(e.target.value.toUpperCase())} maxLength={17}/>
    {error&&<div style={{color:C.red,fontSize:12,marginBottom:10}}>{error}</div>}
    <button style={{...S.btnPrimary,width:"100%"}} onClick={()=>lookupVIN(vin)} disabled={loading}>{loading?"Looking up…":"🔍 Look Up VIN"}</button></>}
    {step===2&&vehicleInfo&&<>
      <div style={{background:C.accentDim,border:`1px solid ${C.accent}30`,borderRadius:8,padding:"10px 12px",marginBottom:12}}>
        <div style={{color:C.accent,fontSize:11,fontWeight:700,marginBottom:4}}>✓ VEHICLE IDENTIFIED</div>
        {[["Vehicle",vehicleInfo.vehicle],["VIN",vehicleInfo.vin],["Engine",vehicleInfo.engine]].filter(([,v])=>v&&v!=="null"&&v!=="Not Applicable").map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.muted,fontSize:11}}>{l}</span><span style={{color:C.text,fontSize:12,fontFamily:l==="VIN"?"monospace":"inherit"}}>{v}</span></div>
        ))}
      </div>
      <label style={S.label}>Customer Name</label><input style={S.input} placeholder="Full name" value={name} onChange={e=>setName(e.target.value)}/>
      <label style={S.label}>Phone</label><input style={S.input} placeholder="555-000-0000" value={phone} onChange={e=>setPhone(e.target.value)}/>
      <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>{setStep(1);setVehicleInfo(null);}}>← Back</button><button style={{...S.btnPrimary,flex:1}} onClick={save} disabled={!name||!phone}>Create Client</button></div>
    </>}
  </div></div>);
}

function QuoteBuilder({mechanic,vehicle,onClose,onSend}){
  const [items,setItems]=useState([{id:1,description:"",parts:0,labor:0}]);
  const [notes,setNotes]=useState("");const [sig,setSig]=useState(mechanic.signature||"");const [sigMode,setSigMode]=useState("text");
  const addItem=()=>setItems(p=>[...p,{id:Date.now(),description:"",parts:0,labor:0}]);
  const updateItem=(id,field,val)=>setItems(p=>p.map(i=>i.id===id?{...i,[field]:val}:i));
  const removeItem=(id)=>setItems(p=>p.filter(i=>i.id!==id));
  const totalParts=items.reduce((a,i)=>a+Number(i.parts),0);
  const totalLabor=items.reduce((a,i)=>a+Number(i.labor),0);
  const total=totalParts+totalLabor;
  const send=()=>{onSend({items,notes,totalParts,totalLabor,total,vehicle:vehicle.vehicle,vehicleId:vehicle.id,customerId:vehicle.customerId,mechanicName:mechanic.name,mechanicShop:mechanic.shop,mechanicSig:sig,date:new Date().toLocaleDateString(),status:"pending"});onClose();};
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:500}}>
    <div style={S.modalHead}><span style={S.modalTitle}>Build Quote</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    <div style={{background:C.faint,borderRadius:8,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:600,fontSize:14}}>{vehicle.vehicle}</div><div style={{color:C.muted,fontSize:12}}>{vehicle.name}</div></div><div style={{textAlign:"right",color:C.muted,fontSize:11}}>{mechanic.shop}<br/>{new Date().toLocaleDateString()}</div></div>
    <div style={{marginBottom:10}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 75px 75px 26px",gap:5,marginBottom:5}}>{["Description","Parts","Labor",""].map(h=><div key={h} style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>
      {items.map(item=><div key={item.id} style={{display:"grid",gridTemplateColumns:"1fr 75px 75px 26px",gap:5,marginBottom:5}}>
        <input style={{...S.input,margin:0,fontSize:12}} placeholder="e.g. Brake Pads" value={item.description} onChange={e=>updateItem(item.id,"description",e.target.value)}/>
        <input style={{...S.input,margin:0,fontSize:12}} type="number" placeholder="0" value={item.parts||""} onChange={e=>updateItem(item.id,"parts",e.target.value)}/>
        <input style={{...S.input,margin:0,fontSize:12}} type="number" placeholder="0" value={item.labor||""} onChange={e=>updateItem(item.id,"labor",e.target.value)}/>
        <button onClick={()=>removeItem(item.id)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.red,cursor:"pointer",fontSize:14}}>×</button>
      </div>)}
      <button style={{...S.btnSecondary,fontSize:11,padding:"5px 10px"}} onClick={addItem}>+ Add Line</button>
    </div>
    <div style={{background:C.faint,borderRadius:8,padding:"8px 12px",marginBottom:10}}>
      {[["Parts Total",`$${totalParts.toFixed(2)}`],["Labor Total",`$${totalLabor.toFixed(2)}`]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.muted,fontSize:12}}>{l}</span><span style={{fontSize:12}}>{v}</span></div>)}
      <div style={{display:"flex",justifyContent:"space-between",borderTop:`1px solid ${C.border}`,paddingTop:5,marginTop:3}}><span style={{fontWeight:700,fontSize:13}}>Total</span><span style={{fontWeight:700,fontSize:13,color:C.accent}}>${total.toFixed(2)}</span></div>
    </div>
    <label style={S.label}>Notes</label><textarea style={{...S.input,height:48,resize:"none"}} value={notes} onChange={e=>setNotes(e.target.value)}/>
    <label style={S.label}>Signature</label>
    <div style={{display:"flex",gap:7,marginBottom:8}}>{["text","draw"].map(m=><button key={m} onClick={()=>setSigMode(m)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${sigMode===m?C.accent:C.border}`,background:sigMode===m?C.accentDim:"transparent",color:sigMode===m?C.accent:C.muted,fontSize:11,cursor:"pointer"}}>{m==="text"?"Text":"Draw"}</button>)}</div>
    {sigMode==="text"?<input style={{...S.input,fontFamily:"cursive",fontSize:18,color:C.accent}} value={sig} onChange={e=>setSig(e.target.value)}/>:<SignaturePad onChange={setSig}/>}
    <div style={{display:"flex",gap:8,marginTop:10}}><button style={S.btnSecondary} onClick={onClose}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={send} disabled={items.every(i=>!i.description)}>Send Quote</button></div>
  </div></div>);
}

function LogCompletedService({mechanic,vehicle,onClose,onSend}){
  const [type,setType]=useState(SERVICE_TYPES[0]);const [date,setDate]=useState(new Date().toISOString().split("T")[0]);const [mileage,setMileage]=useState(vehicle.mileage||"");const [notes,setNotes]=useState("");
  const send=()=>{if(!mileage)return;onSend(vehicle.id,{id:Date.now(),type,date,mileage:Number(mileage),notes,mechanicName:mechanic.name,mechanicShop:mechanic.shop});onClose();};
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:390}}>
    <div style={S.modalHead}><span style={S.modalTitle}>Log Completed Service</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    <div style={{background:C.accentDim,border:`1px solid ${C.accent}22`,borderRadius:8,padding:"8px 12px",marginBottom:10,color:C.muted,fontSize:12}}>ℹ️ Sent to <strong style={{color:C.text}}>{vehicle.name}</strong> for approval.</div>
    <label style={S.label}>Service Type</label><select style={S.input} value={type} onChange={e=>setType(e.target.value)}>{SERVICE_TYPES.map(t=><option key={t}>{t}</option>)}</select>
    <label style={S.label}>Date</label><input style={S.input} type="date" value={date} onChange={e=>setDate(e.target.value)}/>
    <label style={S.label}>Mileage</label><input style={S.input} type="number" value={mileage} onChange={e=>setMileage(e.target.value)}/>
    <label style={S.label}>Notes</label><textarea style={{...S.input,height:60,resize:"none"}} value={notes} onChange={e=>setNotes(e.target.value)}/>
    <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={onClose}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={send} disabled={!mileage}>📤 Send for Approval</button></div>
  </div></div>);
}

function QuoteCard({quote,isCustomer,onRespond}){
  const [showCounter,setShowCounter]=useState(false);const [counterNote,setCounterNote]=useState("");
  const statusColors={pending:C.orange,accepted:C.green,declined:C.red,countered:C.blue};
  const col=statusColors[quote.status]||C.muted;
  return(<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:10}}>
    <div style={{padding:"10px 13px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontWeight:700,fontSize:13}}>{quote.vehicle}</div><div style={{color:C.muted,fontSize:12}}>{isCustomer?`From ${quote.mechanicShop}`:`For ${quote.name||"Customer"}`} · {quote.date}</div></div>
      <span style={{background:col+"18",color:col,borderRadius:99,fontSize:11,fontWeight:700,padding:"2px 8px"}}>{quote.status?.toUpperCase()}</span>
    </div>
    <div style={{padding:"10px 13px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 70px 70px",gap:5,marginBottom:5}}>{["Service","Parts","Labor"].map(h=><div key={h} style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}</div>
      {quote.items?.map((item,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 70px 70px",gap:5,marginBottom:4}}><span style={{fontSize:12}}>{item.description}</span><span style={{fontSize:12}}>${Number(item.parts).toFixed(2)}</span><span style={{fontSize:12}}>${Number(item.labor).toFixed(2)}</span></div>)}
      <div style={{borderTop:`1px solid ${C.border}`,marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted,fontSize:11}}>Parts: ${quote.totalParts?.toFixed(2)} · Labor: ${quote.totalLabor?.toFixed(2)}</span><span style={{fontWeight:700,fontSize:13,color:C.accent}}>Total: ${quote.total?.toFixed(2)}</span></div>
      {quote.notes&&<div style={{color:C.muted,fontSize:11,marginTop:4,fontStyle:"italic"}}>{quote.notes}</div>}
      {quote.mechanicSig&&<div style={{marginTop:7,borderTop:`1px solid ${C.border}`,paddingTop:6}}><div style={{color:C.muted,fontSize:10,marginBottom:2}}>SIGNED BY</div><div style={{fontFamily:"cursive",fontSize:17,color:C.accent}}>{quote.mechanicSig}</div></div>}
      {quote.counterOffer&&<div style={{background:C.blueDim,border:`1px solid ${C.blue}30`,borderRadius:6,padding:"5px 9px",marginTop:6}}><div style={{color:C.blue,fontSize:10,fontWeight:700,marginBottom:1}}>COUNTER</div><div style={{fontSize:12}}>{quote.counterOffer}</div></div>}
    </div>
    {isCustomer&&quote.status==="pending"&&<div style={{padding:"8px 13px",borderTop:`1px solid ${C.border}`,display:"flex",gap:6,flexWrap:"wrap"}}>
      <button style={{...S.btnSecondary,borderColor:C.green+"40",color:C.green,fontSize:12,padding:"5px 11px"}} onClick={()=>onRespond(quote.id,"accepted","")}>✓ Accept</button>
      <button style={{...S.btnSecondary,borderColor:C.red+"40",color:C.red,fontSize:12,padding:"5px 11px"}} onClick={()=>onRespond(quote.id,"declined","")}>✕ Decline</button>
      <button style={{...S.btnSecondary,borderColor:C.blue+"40",color:C.blue,fontSize:12,padding:"5px 11px"}} onClick={()=>setShowCounter(!showCounter)}>↔ Counter</button>
    </div>}
    {showCounter&&<div style={{padding:"0 13px 10px"}}><textarea style={{...S.input,height:48,resize:"none",fontSize:12}} placeholder="Suggest different terms…" value={counterNote} onChange={e=>setCounterNote(e.target.value)}/><button style={{...S.btnPrimary,fontSize:12}} onClick={()=>{onRespond(quote.id,"countered",counterNote);setShowCounter(false);}}>Send Counter</button></div>}
  </div>);
}

function PendingServiceCard({service,onAccept,onDecline}){
  return(<div style={{background:C.surface,border:`2px solid ${C.orange}44`,borderRadius:10,overflow:"hidden",marginBottom:9}}>
    <div style={{background:C.orangeDim,padding:"6px 11px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>🔔</span><span style={{color:C.orange,fontSize:11,fontWeight:700}}>MECHANIC COMPLETED — CONFIRM TO ADD TO HISTORY</span></div>
    <div style={{padding:"10px 13px"}}>
      <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{service.type}</div>
      <div style={{color:C.muted,fontSize:12}}>{service.date} · {Number(service.mileage).toLocaleString()} mi · By {service.mechanicName}</div>
      {service.notes&&<div style={{color:C.text,fontSize:12,marginTop:5,padding:"6px 9px",background:C.faint,borderRadius:5,fontStyle:"italic"}}>"{service.notes}"</div>}
      <div style={{display:"flex",gap:7,marginTop:9}}>
        <button style={{...S.btnSecondary,flex:1,borderColor:C.red+"40",color:C.red,fontSize:12}} onClick={onDecline}>✕ Decline</button>
        <button style={{...S.btnPrimary,flex:1,background:C.green,color:"#000",fontSize:12}} onClick={onAccept}>✓ Add to History</button>
      </div>
    </div>
  </div>);
}

function ProfilePage({user,users,setUsers,onClose}){
  const [editing,setEditing]=useState(false);const [form,setForm]=useState({bio:user.bio||"",photo:user.photo||"",logo:user.logo||"",signature:user.signature||""});const [sigMode,setSigMode]=useState("text");
  const isMech=user.role==="mechanic"||user.role==="admin";
  const emojis=["😎","👩","🧑","👨","👩‍🔧","🧑‍🔧","👨‍🔧","🙂","😊","🤙"];const logoEmojis=["🔧","⭐","⚡","🚗","🏎","🔩","🛞","🛠","🔑","🏆"];
  const save=()=>{setUsers(prev=>prev.map(u=>u.id===user.id?{...u,...form}:u));setEditing(false);};
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:440}}>
    <div style={S.modalHead}><span style={S.modalTitle}>{editing?"Edit Profile":"My Profile"}</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    {!editing?<>
      <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:14}}><div style={{fontSize:48}}>{user.photo||"😎"}</div><div><div style={{fontWeight:700,fontSize:16}}>{user.name}</div><div style={{color:C.muted,fontSize:12,textTransform:"capitalize"}}>{user.role}</div>{isMech&&<div style={{color:C.muted,fontSize:12}}>{user.shop} · {user.specialty}</div>}</div></div>
      {isMech&&user.logo&&<div style={{fontSize:28,marginBottom:7}}>{user.logo} <span style={{color:C.muted,fontSize:12}}>Shop Logo</span></div>}
      <div style={{color:C.text,fontSize:13,lineHeight:1.6,marginBottom:11}}>{user.bio||"No bio yet."}</div>
      {isMech&&user.signature&&<div style={{background:C.faint,borderRadius:7,padding:"6px 11px",marginBottom:11}}><div style={{color:C.muted,fontSize:10,marginBottom:2}}>SIGNATURE</div><div style={{fontFamily:"cursive",fontSize:19,color:C.accent}}>{user.signature}</div></div>}
      {isMech&&<div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}><Stars rating={user.rating}/><span style={{fontSize:12}}>{user.rating} ({user.reviews} reviews)</span></div>}
      <button style={S.btnPrimary} onClick={()=>setEditing(true)}>Edit Profile</button>
    </>:<>
      <label style={S.label}>Profile Photo</label>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>{emojis.map(e=><button key={e} onClick={()=>setForm(p=>({...p,photo:e}))} style={{fontSize:20,background:form.photo===e?C.accentDim:"none",border:`1px solid ${form.photo===e?C.accent:C.border}`,borderRadius:7,padding:"3px 6px",cursor:"pointer"}}>{e}</button>)}</div>
      {isMech&&<><label style={S.label}>Shop Logo</label><div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>{logoEmojis.map(e=><button key={e} onClick={()=>setForm(p=>({...p,logo:e}))} style={{fontSize:20,background:form.logo===e?C.accentDim:"none",border:`1px solid ${form.logo===e?C.accent:C.border}`,borderRadius:7,padding:"3px 6px",cursor:"pointer"}}>{e}</button>)}</div></>}
      <label style={S.label}>Bio</label><textarea style={{...S.input,height:58,resize:"none"}} value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))}/>
      {isMech&&<><label style={S.label}>Signature</label>
        <div style={{display:"flex",gap:7,marginBottom:7}}>{["text","draw"].map(m=><button key={m} onClick={()=>setSigMode(m)} style={{padding:"3px 9px",borderRadius:6,border:`1px solid ${sigMode===m?C.accent:C.border}`,background:sigMode===m?C.accentDim:"transparent",color:sigMode===m?C.accent:C.muted,fontSize:11,cursor:"pointer"}}>{m==="text"?"Text":"Draw"}</button>)}</div>
        {sigMode==="text"?<input style={{...S.input,fontFamily:"cursive",fontSize:17,color:C.accent}} value={form.signature} onChange={e=>setForm(p=>({...p,signature:e.target.value}))}/>:<SignaturePad onChange={v=>setForm(p=>({...p,signature:v}))}/>}
      </>}
      <div style={{display:"flex",gap:8,marginTop:9}}><button style={S.btnSecondary} onClick={()=>setEditing(false)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={save}>Save</button></div>
    </>}
  </div></div>);
}

// ── QR CODE (simple visual) ──────────────────────────────────────────────
function QRCode({value,size=120}){
  // Generate a deterministic pattern from the value string
  const hash=(s)=>{let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return Math.abs(h);};
  const h=hash(value);
  const cells=[];const N=11;
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    // Finder patterns (corners)
    const inFinder=(r<3&&c<3)||(r<3&&c>N-4)||(r>N-4&&c<3);
    // Data cells based on hash
    const bit=inFinder?1:((h>>(r*N+c)%31)&1);
    cells.push({r,c,v:bit});
  }
  const cell=size/N;
  return(<svg width={size} height={size} style={{borderRadius:6,background:"#fff",padding:4}}>
    {cells.map(({r,c,v})=>v?<rect key={`${r}-${c}`} x={c*cell+2} y={r*cell+2} width={cell-1} height={cell-1} fill="#000"/>:null)}
    <text x={size/2} y={size-2} textAnchor="middle" fontSize="5" fill="#666">GarageIQ</text>
  </svg>);
}

// ── VEHICLE DETAIL PAGE ───────────────────────────────────────────────────
function VehicleDetailPage({vehicle,user,users,vehicles,setVehicles,listings,setListings,userLocation,onBack,onDMSeller}){
  const [tab,setTab]=useState("overview");
  const [showQR,setShowQR]=useState(false);
  const [showSellForm,setShowSellForm]=useState(false);
  const [sellPhotos,setSellPhotos]=useState([]);
  const [sellForm,setSellForm]=useState({price:"",condition:"Good",mileage:vehicle.mileage,description:"",features:"",includeHistory:true});
  const [showSaleConfirm,setShowSaleConfirm]=useState(false);
  const [buyerSearch,setBuyerSearch]=useState("");
  const [saleTarget,setSaleTarget]=useState(null);
  const [saleAccepted,setSaleAccepted]=useState(false);
  const photoRef=useRef();
  const qrValue=`garageiq://vehicle/${vehicle.id}/${vehicle.vin}`;

  const handleSellPhotos=(e)=>{
    const files=Array.from(e.target.files||[]);
    files.slice(0,15-sellPhotos.length).forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>setSellPhotos(p=>[...p,ev.target.result].slice(0,15));
      reader.readAsDataURL(file);
    });
  };

  const publishToMarket=()=>{
    if(!sellForm.price)return;
    const listing={
      id:Date.now(),sellerId:user.id,sellerName:user.name,sellerPhoto:user.photo||"😎",
      verified:user.role==="mechanic"||user.role==="admin",
      year:vehicle.year||Number((vehicle.vehicle.match(/[0-9]{4}/)||[])[0]||2020),
      make:vehicle.make||vehicle.vehicle.split(" ")[1]||"Unknown",
      model:vehicle.model||vehicle.vehicle.split(" ").slice(2).join(" ")||"Unknown",
      trim:"",color:"",mileage:Number(sellForm.mileage),price:Number(sellForm.price),
      condition:sellForm.condition,description:sellForm.description,
      features:sellForm.features.split(",").map(f=>f.trim()).filter(Boolean),
      serviceHistory:sellForm.includeHistory?vehicle.services:[],
      photos:sellPhotos.length>0?sellPhotos:vehicle.carPhoto?[vehicle.carPhoto]:["🚗"],
      city:userLocation?.city||user.city||"Miami, FL",
      lat:userLocation?.lat||user.lat||25.7617,lng:userLocation?.lng||user.lng||-80.1918,
      offers:[],listed:new Date().toLocaleDateString(),
      vehicleId:vehicle.id,ownerId:user.id,
    };
    setListings(p=>[listing,...p]);
    setVehicles(prev=>prev.map(v=>v.id===vehicle.id?{...v,forSale:true,listingId:listing.id}:v));
    setShowSellForm(false);
  };

  const confirmSale=(buyerId)=>{
    // Mark listing as sold, add car to buyer's garage
    setListings(prev=>prev.map(l=>l.vehicleId===vehicle.id?{...l,status:"sold",buyerId}:l));
    setVehicles(prev=>prev.map(v=>{
      if(v.id!==vehicle.id)return v;
      return{...v,forSale:false,soldTo:buyerId};
    }));
    setSaleAccepted(true);
  };

  const potentialBuyers=users.filter(u=>
    u.id!==user.id&&(u.name.toLowerCase().includes(buyerSearch.toLowerCase())||u.email.toLowerCase().includes(buyerSearch.toLowerCase()))
  );

  const tabs=[{id:"overview",label:"Overview"},{id:"history",label:"Service History"},{id:"qr",label:"QR Code"},{id:"sell",label:"Sell Car"}];

  return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',sans-serif"}}>
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:22}}>←</button>
      <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{vehicle.vehicle}</div><div style={{color:C.muted,fontSize:11}}>{vehicle.vin}</div></div>
      {vehicle.forSale&&<span style={{background:C.greenDim,color:C.green,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 8px"}}>FOR SALE</span>}
    </div>

    {/* Hero photo */}
    <div style={{height:180,background:C.faint,overflow:"hidden",position:"relative"}}>
      {vehicle.carPhoto?<img src={vehicle.carPhoto} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:60}}>🚗</div>}
    </div>

    {/* Tabs */}
    <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.surface,overflow:"auto"}}>
      {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 16px",border:"none",background:"transparent",color:tab===t.id?C.accent:C.muted,fontSize:12,fontWeight:600,cursor:"pointer",borderBottom:`2px solid ${tab===t.id?C.accent:"transparent"}`,whiteSpace:"nowrap"}}>{t.label}</button>)}
    </div>

    <div style={{padding:"16px 16px",maxWidth:600,margin:"0 auto"}}>

      {/* OVERVIEW */}
      {tab==="overview"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {[["Vehicle",vehicle.vehicle],["Mileage",vehicle.mileage.toLocaleString()+" mi"],["VIN",vehicle.vin],["Last Service",vehicle.lastVisit]].map(([l,v])=>(
            <div key={l} style={{background:C.surface,borderRadius:8,padding:"10px 12px",border:`1px solid ${C.border}`}}>
              <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{l}</div>
              <div style={{fontSize:12,fontFamily:l==="VIN"?"monospace":"inherit",wordBreak:"break-all"}}>{v}</div>
            </div>
          ))}
        </div>
        {vehicle.alerts.length>0&&<>
          <div style={S.sectionTitle}>Alerts</div>
          {vehicle.alerts.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",borderRadius:6,background:LEVEL_COLOR[a.level]+"0D",marginBottom:5,border:`1px solid ${LEVEL_COLOR[a.level]}22`}}><span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span><span style={{fontSize:12}}>{a.text}</span><Pill level={a.level}/></div>)}
        </>}
      </>}

      {/* SERVICE HISTORY */}
      {tab==="history"&&<>
        <div style={S.sectionTitle}>Service History ({vehicle.services.length})</div>
        {vehicle.services.length===0&&<div style={{color:C.muted,fontSize:13}}>No services logged yet.</div>}
        {vehicle.services.map((s,i)=>(
          <div key={i} style={{...S.row,cursor:"default",marginBottom:7}}>
            <div style={{width:28,height:28,borderRadius:6,background:C.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🔧</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{s.type}</div>
              <div style={{color:C.muted,fontSize:11}}>{s.date} · {Number(s.mileage).toLocaleString()} mi{s.notes?" · "+s.notes:""}</div>
              {s.mechanicName&&<div style={{color:C.muted,fontSize:11}}>By {s.mechanicName}</div>}
            </div>
            <span style={{background:C.greenDim,color:C.green,borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 5px"}}>✓</span>
          </div>
        ))}
      </>}

      {/* QR CODE */}
      {tab==="qr"&&<>
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,color:C.accent,marginBottom:6}}>VEHICLE QR CODE</div>
          <div style={{color:C.muted,fontSize:12,marginBottom:20}}>Scan to view, buy, or transfer this vehicle in GarageIQ</div>
          <div style={{display:"inline-block",padding:16,background:"#fff",borderRadius:12,marginBottom:16}}>
            <QRCode value={qrValue} size={160}/>
          </div>
          <div style={{color:C.muted,fontSize:11,marginBottom:4,fontFamily:"monospace"}}>{qrValue}</div>
          <div style={{color:C.muted,fontSize:12,marginTop:12,maxWidth:280,margin:"12px auto 0"}}>Share this QR with mechanics, buyers, or anyone who needs to identify this vehicle. Each car has a unique code.</div>
        </div>
      </>}

      {/* SELL CAR */}
      {tab==="sell"&&<>
        {saleAccepted?<div style={{textAlign:"center",padding:"30px 0"}}>
          <div style={{fontSize:48,marginBottom:12}}>🎉</div>
          <div style={{fontWeight:700,fontSize:18,marginBottom:6}}>Sale Confirmed!</div>
          <div style={{color:C.muted,fontSize:13,marginBottom:20}}>The car has been transferred to the new owner.</div>
          <button style={S.btnPrimary} onClick={onBack}>Back to Garage</button>
        </div>:!vehicle.forSale?<>
          <div style={{color:C.muted,fontSize:13,marginBottom:20,lineHeight:1.6}}>List this car on the GarageIQ Marketplace. Info from your garage is pre-filled — just add a price and photos.</div>

          {!showSellForm?<button style={{...S.btnPrimary,width:"100%",marginBottom:10}} onClick={()=>setShowSellForm(true)}>🏷 List This Car for Sale</button>
          :<>
            <div style={{background:C.accentDim,border:`1px solid ${C.accent}22`,borderRadius:8,padding:"10px 12px",marginBottom:14}}>
              <div style={{color:C.accent,fontSize:11,fontWeight:700,marginBottom:6}}>PRE-FILLED FROM YOUR GARAGE</div>
              {[["Vehicle",vehicle.vehicle],["Year",vehicle.year||"–"],["VIN",vehicle.vin],["Mileage",vehicle.mileage.toLocaleString()+" mi"]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.muted,fontSize:11}}>{l}</span><span style={{fontSize:12}}>{v}</span></div>
              ))}
            </div>

            <label style={S.label}>Asking Price ($) *</label>
            <input style={S.input} type="number" placeholder="e.g. 15000" value={sellForm.price} onChange={e=>setSellForm(p=>({...p,price:e.target.value}))}/>

            <label style={S.label}>Current Mileage</label>
            <input style={S.input} type="number" value={sellForm.mileage} onChange={e=>setSellForm(p=>({...p,mileage:e.target.value}))}/>

            <label style={S.label}>Condition</label>
            <select style={S.input} value={sellForm.condition} onChange={e=>setSellForm(p=>({...p,condition:e.target.value}))}>
              {["Excellent","Good","Fair","Poor"].map(c=><option key={c}>{c}</option>)}
            </select>

            <label style={S.label}>Location (City or ZIP)</label>
            <input style={S.input} placeholder="e.g. Miami, FL or 33101" value={sellForm.zipCity||""} onChange={e=>setSellForm(p=>({...p,zipCity:e.target.value}))}/>
            <label style={S.label}>Description</label>
            <textarea style={{...S.input,height:60,resize:"none"}} placeholder="Describe your car..." value={sellForm.description} onChange={e=>setSellForm(p=>({...p,description:e.target.value}))}/>

            {vehicle.services.length>0&&<div style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",background:C.faint,borderRadius:8,marginBottom:12,cursor:"pointer"}} onClick={()=>setSellForm(p=>({...p,includeHistory:!p.includeHistory}))}>
              <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${sellForm.includeHistory?C.accent:C.border}`,background:sellForm.includeHistory?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {sellForm.includeHistory&&<span style={{fontSize:11,color:"#000"}}>✓</span>}
              </div>
              <div><div style={{fontSize:13,fontWeight:600}}>Include Service History</div><div style={{color:C.muted,fontSize:11}}>{vehicle.services.length} service records will be shared with buyers</div></div>
            </div>}

            <label style={S.label}>Photos ({sellPhotos.length}/15)</label>
            <div style={{marginBottom:12}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>
                {sellPhotos.map((p,i)=>(
                  <div key={i} style={{position:"relative",width:68,height:52,borderRadius:6,overflow:"hidden",border:`1px solid ${C.border}`}}>
                    <img src={p} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <button onClick={()=>setSellPhotos(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:2,right:2,background:"#000000bb",border:"none",color:"#fff",borderRadius:99,width:14,height:14,cursor:"pointer",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </div>
                ))}
                {sellPhotos.length<15&&<div onClick={()=>photoRef.current.click()} style={{width:68,height:52,borderRadius:6,border:`1px dashed ${C.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:C.faint,color:C.muted,fontSize:9,gap:2}}>
                  <span style={{fontSize:16}}>📷</span><span>Add</span>
                </div>}
              </div>
              <input ref={photoRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleSellPhotos}/>
              {vehicle.carPhoto&&sellPhotos.length===0&&<div style={{color:C.muted,fontSize:11}}>Your garage photo will be used as the cover.</div>}
            </div>

            <div style={{display:"flex",gap:8}}>
              <button style={S.btnSecondary} onClick={()=>setShowSellForm(false)}>Cancel</button>
              <button style={{...S.btnPrimary,flex:1}} onClick={publishToMarket} disabled={!sellForm.price}>📤 Publish to Marketplace</button>
            </div>
          </>}
        </>:<>
          {/* Car is already listed - show sale confirmation */}
          <div style={{background:C.greenDim,border:`1px solid ${C.green}30`,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
            <div style={{color:C.green,fontWeight:700,fontSize:13,marginBottom:2}}>✓ Listed on Marketplace</div>
            <div style={{color:C.muted,fontSize:12}}>Your car is active on the marketplace.</div>
          </div>

          <div style={S.sectionTitle}>Confirm Sale</div>
          <div style={{color:C.muted,fontSize:12,marginBottom:12,lineHeight:1.6}}>Once sold, search for the buyer by name or scan their QR code. Both parties must confirm the transfer.</div>

          <div style={{background:C.accentDim,border:`1px solid ${C.accent}22`,borderRadius:8,padding:"10px 12px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>📷</span>
            <div><div style={{fontSize:13,fontWeight:600}}>Scan Buyer QR Code</div><div style={{color:C.muted,fontSize:11}}>Ask buyer to show their profile QR</div></div>
            <button style={{...S.btnPrimary,fontSize:11,padding:"5px 10px",marginLeft:"auto"}} onClick={()=>alert("In the live app, camera opens here to scan buyer QR code.")}>Scan</button>
          </div>

          <label style={S.label}>Or Search by Name</label>
          <input style={S.input} placeholder="Search users..." value={buyerSearch} onChange={e=>setBuyerSearch(e.target.value)}/>
          {buyerSearch&&potentialBuyers.slice(0,5).map(b=>(
            <div key={b.id} style={{...S.row,cursor:"pointer"}} onClick={()=>setSaleTarget(b)}>
              <div style={{fontSize:22}}>{b.photo||"😊"}</div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{b.name}</div><div style={{color:C.muted,fontSize:11}}>{b.email}</div></div>
              {saleTarget?.id===b.id&&<span style={{color:C.accent,fontSize:12}}>Selected ✓</span>}
            </div>
          ))}

          {saleTarget&&<>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",marginBottom:12,marginTop:8}}>
              <div style={{color:C.muted,fontSize:11,marginBottom:4}}>CONFIRMING SALE TO</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{fontSize:24}}>{saleTarget.photo||"😊"}</div>
                <div><div style={{fontWeight:600,fontSize:14}}>{saleTarget.name}</div><div style={{color:C.muted,fontSize:12}}>{saleTarget.email}</div></div>
              </div>
            </div>
            <div style={{color:C.muted,fontSize:12,marginBottom:10}}>⚠️ Both you and {saleTarget.name} must agree. This will transfer the vehicle to their garage.</div>
            <button style={{...S.btnPrimary,width:"100%",background:C.green,color:"#000"}} onClick={()=>confirmSale(saleTarget.id)}>✓ Confirm Sale to {saleTarget.name}</button>
          </>}
        </>}
      </>}
    </div>
  </div>);
}


// ── DEALERSHIP PROFILE ────────────────────────────────────────────────────────
function DealerProfile({dealer,listings,onClose,onDM,userLocation}){
  const dealerListings=listings.filter(l=>l.sellerId===dealer.id&&l.isDealer);
  const [selectedListing,setSelectedListing]=useState(null);
  return(<div style={S.overlay}>
    <div style={{...S.modal,maxWidth:540,maxHeight:"90vh"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:0}}>
        <div/>
        <button onClick={onClose} style={S.iconBtn}>✕</button>
      </div>

      {/* Dealer header */}
      <div style={{background:`linear-gradient(135deg,#1a1a2e,#16213e)`,borderRadius:10,padding:"18px 16px",marginBottom:14,border:`1px solid #F59E0B33`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <div style={{fontSize:44}}>{dealer.photo||"🏢"}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:17,color:"#F0F0F0"}}>{dealer.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
              <span style={{background:"#F59E0B18",color:"#F59E0B",borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 8px"}}>🏢 VERIFIED DEALER</span>
              <Stars rating={dealer.rating} size={11}/>
              <span style={{color:"#888",fontSize:11}}>({dealer.reviews})</span>
            </div>
          </div>
          <button style={{...S.btnPrimary,fontSize:12,padding:"6px 12px"}} onClick={()=>onDM(dealer.id)}>💬 Contact</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {[["Specialty",dealer.specialty],["Est.",dealer.established],["License",dealer.dealerLicense],["Location",dealer.city]].map(([l,v])=>(
            <div key={l} style={{background:"#ffffff10",borderRadius:6,padding:"6px 8px"}}>
              <div style={{color:"#888",fontSize:9,textTransform:"uppercase",letterSpacing:1,marginBottom:1}}>{l}</div>
              <div style={{fontSize:11,color:"#F0F0F0"}}>{v}</div>
            </div>
          ))}
        </div>
        {dealer.bio&&<div style={{color:"#aaa",fontSize:12,marginTop:10,lineHeight:1.6}}>{dealer.bio}</div>}
      </div>

      {/* Inventory */}
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,color:"#F59E0B",marginBottom:10}}>INVENTORY ({dealerListings.length})</div>
      {dealerListings.length===0&&<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"20px 0"}}>No listings currently available</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxHeight:300,overflow:"auto"}}>
        {dealerListings.map(l=>(
          <div key={l.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>setSelectedListing(l)}>
            <div style={{height:80,background:C.faint,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>
              {l.photos[0]&&l.photos[0].startsWith("data:")?<img src={l.photos[0]} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span>{l.photos[0]||"🚗"}</span>}
            </div>
            <div style={{padding:"7px 8px"}}>
              <div style={{fontWeight:700,fontSize:12}}>{l.year} {l.make} {l.model}</div>
              <div style={{color:"#F59E0B",fontSize:12,fontWeight:700}}>${l.price.toLocaleString()}</div>
              <div style={{color:C.muted,fontSize:10}}>{l.mileage.toLocaleString()} mi · {l.condition}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>);
}


function Marketplace({user,users,listings,setListings,onDM,userLocation}){
  const [filters,setFilters]=useState({make:"Any",model:"Any",bodyType:"Any",color:"Any",condition:"Any",titleStatus:"Any",minPrice:"",maxPrice:"",minMiles:"",maxMiles:"",minYear:"",maxYear:"",maxDist:50});
  const [sort,setSort]=useState("newest");const [selected,setSelected]=useState(null);const [showCreate,setShowCreate]=useState(false);
  const [offerTarget,setOfferTarget]=useState(null);const [offerAmt,setOfferAmt]=useState("");const [offerMsg,setOfferMsg]=useState("");const [offerSent,setOfferSent]=useState(false);
  const [viewDealerProfile,setViewDealerProfile]=useState(null);
  const [customMake,setCustomMake]=useState(false);const [customModel,setCustomModel]=useState(false);
  const setF=(k,v)=>setFilters(p=>({...p,[k]:v}));
  const availableModels=(CAR_MODELS[filters.make]||[]);
  const filtered=listings.filter(l=>{
    if(filters.make!=="Any"&&l.make!==filters.make)return false;
    if(filters.model&&!l.model.toLowerCase().includes(filters.model.toLowerCase()))return false;
    if(filters.bodyType!=="Any"&&MODEL_TYPES[l.model]!==filters.bodyType)return false;
    if(filters.color!=="Any"&&l.color!==filters.color)return false;
    if(filters.condition!=="Any"&&l.condition!==filters.condition)return false;
    if(filters.minPrice&&l.price<Number(filters.minPrice))return false;
    if(filters.maxPrice&&l.price>Number(filters.maxPrice))return false;
    if(filters.minMiles&&l.mileage<Number(filters.minMiles))return false;
    if(filters.maxMiles&&l.mileage>Number(filters.maxMiles))return false;
    if(filters.minYear&&l.year<Number(filters.minYear))return false;
    if(filters.maxYear&&l.year>Number(filters.maxYear))return false;
    if(filters.titleStatus&&filters.titleStatus!=="Any"&&l.titleStatus!==filters.titleStatus)return false;
    if(userLocation){const d=distanceMiles(userLocation.lat,userLocation.lng,l.lat,l.lng);if(d>Number(filters.maxDist))return false;}
    return true;
  }).sort((a,b)=>{
    if(sort==="price_asc")return a.price-b.price;
    if(sort==="price_desc")return b.price-a.price;
    if(sort==="miles")return a.mileage-b.mileage;
    if(sort==="distance"&&userLocation)return distanceMiles(userLocation.lat,userLocation.lng,a.lat,a.lng)-distanceMiles(userLocation.lat,userLocation.lng,b.lat,b.lng);
    return 0;
  });
  const sendOffer=()=>{if(!offerAmt)return;setListings(prev=>prev.map(l=>l.id===offerTarget.id?{...l,offers:[...l.offers,{id:Date.now(),buyerId:user.id,buyerName:user.name,amount:Number(offerAmt),message:offerMsg,status:"pending",time:"Just now"}]}:l));setOfferSent(true);};
  return(<div style={{display:"flex",height:"calc(var(--app-height, 100vh) - 120px)",minHeight:"calc(100vh - 200px)",overflow:"hidden"}}>
    <div style={{width:218,borderRight:`1px solid ${C.border}`,padding:"14px 12px",overflow:"auto",flexShrink:0,background:C.surface}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,letterSpacing:2,color:C.accent,marginBottom:12}}>FILTERS</div>

      {/* Body Type */}
      <label style={S.label}>Body Type</label>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
        {BODY_TYPES.map(t=><button key={t} onClick={()=>setF("bodyType",t)} style={{padding:"3px 8px",borderRadius:99,border:`1px solid ${filters.bodyType===t?C.accent:C.border}`,background:filters.bodyType===t?C.accentDim:"transparent",color:filters.bodyType===t?C.accent:C.muted,fontSize:10,fontWeight:600,cursor:"pointer"}}>{t}</button>)}
      </div>

      {/* Distance */}
      {userLocation&&<><label style={S.label}>Max Distance</label><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}><input type="range" min={5} max={200} value={filters.maxDist} onChange={e=>setF("maxDist",e.target.value)} style={{flex:1,accentColor:C.accent}}/><span style={{fontSize:11,color:C.text,minWidth:44}}>{filters.maxDist} mi</span></div></>}

      {/* Make */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <label style={{...S.label,marginBottom:0}}>Make</label>
        <button onClick={()=>{setCustomMake(!customMake);setF("make","Any");}} style={{background:"none",border:"none",color:C.accent,fontSize:10,cursor:"pointer"}}>{customMake?"Use List":"Type It In"}</button>
      </div>
      {customMake
        ? <input style={{...S.input,marginBottom:8}} placeholder="e.g. Porsche, Volvo..." value={filters.make==="Any"?"":filters.make} onChange={e=>setF("make",e.target.value||"Any")}/>
        : <select style={{...S.input,marginBottom:8}} value={filters.make} onChange={e=>{setF("make",e.target.value);setF("model","Any");}}>
            {CAR_MAKES.map(m=><option key={m}>{m}</option>)}
          </select>
      }

      {/* Model — only shown when make is selected */}
      {filters.make!=="Any"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <label style={{...S.label,marginBottom:0}}>Model</label>
          <button onClick={()=>setCustomModel(!customModel)} style={{background:"none",border:"none",color:C.accent,fontSize:10,cursor:"pointer"}}>{customModel?"Use List":"Type It In"}</button>
        </div>
        {customModel||availableModels.length===0
          ? <input style={{...S.input,marginBottom:8}} placeholder="e.g. Civic, Accord..." value={filters.model==="Any"?"":filters.model} onChange={e=>setF("model",e.target.value||"Any")}/>
          : <select style={{...S.input,marginBottom:8}} value={filters.model} onChange={e=>setF("model",e.target.value)}>
              <option value="Any">Any Model</option>
              {availableModels.map(m=><option key={m}>{m}</option>)}
            </select>
        }
      </>}

      <label style={S.label}>Color</label>
      <select style={{...S.input,marginBottom:8}} value={filters.color} onChange={e=>setF("color",e.target.value)}>{CAR_COLORS.map(c=><option key={c}>{c}</option>)}</select>
      <label style={S.label}>Condition</label>
      <select style={{...S.input,marginBottom:8}} value={filters.condition} onChange={e=>setF("condition",e.target.value)}>{["Any","Excellent","Good","Fair","Poor"].map(c=><option key={c}>{c}</option>)}</select>
      <label style={S.label}>Price ($)</label>
      <div style={{display:"flex",gap:5,marginBottom:8}}><input style={{...S.input,margin:0,fontSize:11,padding:"5px 7px"}} placeholder="Min" value={filters.minPrice} onChange={e=>setF("minPrice",e.target.value)}/><input style={{...S.input,margin:0,fontSize:11,padding:"5px 7px"}} placeholder="Max" value={filters.maxPrice} onChange={e=>setF("maxPrice",e.target.value)}/></div>
      <label style={S.label}>Mileage</label>
      <div style={{display:"flex",gap:5,marginBottom:8}}><input style={{...S.input,margin:0,fontSize:11,padding:"5px 7px"}} placeholder="Min" value={filters.minMiles} onChange={e=>setF("minMiles",e.target.value)}/><input style={{...S.input,margin:0,fontSize:11,padding:"5px 7px"}} placeholder="Max" value={filters.maxMiles} onChange={e=>setF("maxMiles",e.target.value)}/></div>
      <label style={S.label}>Year: {filters.minYear||1985} – {filters.maxYear||2027}</label>
      <div style={{marginBottom:4}}><div style={{fontSize:10,color:C.muted,display:"flex",justifyContent:"space-between",marginBottom:2}}><span>From</span><span>{filters.minYear||1985}</span></div><input type="range" min={1985} max={2027} value={filters.minYear||1985} onChange={e=>setF("minYear",e.target.value)} style={{width:"100%",accentColor:C.accent,marginBottom:6}}/></div>
      <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,display:"flex",justifyContent:"space-between",marginBottom:2}}><span>To</span><span>{filters.maxYear||2027}</span></div><input type="range" min={1985} max={2027} value={filters.maxYear||2027} onChange={e=>setF("maxYear",e.target.value)} style={{width:"100%",accentColor:C.accent}}/></div>
      <button onClick={()=>{setFilters({make:"Any",model:"Any",bodyType:"Any",color:"Any",condition:"Any",titleStatus:"Any",minPrice:"",maxPrice:"",minMiles:"",maxMiles:"",minYear:"",maxYear:"",maxDist:50});setCustomMake(false);setCustomModel(false);}} style={{...S.btnSecondary,width:"100%",fontSize:11,padding:"5px 0"}}>Clear All</button>
    </div>
    <div style={{flex:1,overflow:"auto",padding:"16px 18px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2}}>MARKETPLACE</span><span style={{color:C.muted,fontSize:12,marginLeft:8}}>{filtered.length} listings</span></div>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          <select style={{...S.input,margin:0,fontSize:11,padding:"5px 9px",width:"auto"}} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">Newest</option><option value="price_asc">Price Low-High</option><option value="price_desc">Price High-Low</option><option value="miles">Lowest Miles</option>{userLocation&&<option value="distance">Nearest</option>}
          </select>
          <button style={S.btnPrimary} onClick={()=>setShowCreate(true)}>+ List a Car</button>
        </div>
      </div>
      {filtered.length===0&&<div style={{textAlign:"center",padding:"36px 16px",color:C.muted}}><div style={{fontSize:44,marginBottom:10}}>🔍</div><div>No listings match your filters</div></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
        {filtered.map(l=>{const dist=userLocation?distanceMiles(userLocation.lat,userLocation.lng,l.lat,l.lng):null;return(
          <div key={l.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,overflow:"hidden",cursor:"pointer"}} onClick={()=>setSelected(l)}>
            <div style={{height:135,background:C.faint,display:"flex",alignItems:"center",justifyContent:"center",fontSize:56,borderBottom:`1px solid ${C.border}`,overflow:"hidden"}}>
              {l.photos[0]&&l.photos[0].startsWith("data:")?<img src={l.photos[0]} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:56}}>{l.photos[0]||"🚗"}</span>}
            </div>
            <div style={{padding:"10px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><div style={{fontWeight:700,fontSize:14}}>{l.year} {l.make} {l.model}</div><div style={{fontWeight:700,fontSize:14,color:C.accent}}>${l.price.toLocaleString()}</div></div>
              <div style={{color:C.muted,fontSize:11,marginBottom:4}}>{l.trim} · {l.color} · {l.condition}</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:C.muted,fontSize:11}}>🔢 {l.mileage.toLocaleString()} mi</span>{dist!=null&&<span style={{color:C.muted,fontSize:11}}>📍 {dist<1?"<1":dist.toFixed(1)} mi</span>}</div>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{fontSize:14}}>{l.sellerPhoto}</div>
                <span style={{fontSize:11,color:C.muted}}>{l.sellerName}</span>
                {l.isDealer?<span style={{background:"#F59E0B18",color:"#F59E0B",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:99}}>🏢 DEALER</span>:l.verified&&<span style={{background:C.greenDim,color:C.green,fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:99}}>🔧 MECH</span>}
              </div>
            </div>
          </div>
        );})}
      </div>
    </div>
    {selected&&<div style={{position:"fixed",inset:0,background:"#00000099",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,width:"100%",maxWidth:520,maxHeight:"90vh",overflow:"auto"}}>
        <div style={{height:220,background:C.faint,display:"flex",alignItems:"center",justifyContent:"center",fontSize:70,borderBottom:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
          {selected.photos[0]&&selected.photos[0].startsWith("data:")?<img src={selected.photos[0]} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:70}}>{selected.photos[0]||"🚗"}</span>}
          <button onClick={()=>setSelected(null)} style={{position:"absolute",top:10,right:10,background:"#000000aa",border:"none",color:"#fff",borderRadius:99,width:27,height:27,cursor:"pointer",fontSize:14}}>✕</button>
        </div>
        {selected.photos.length>1&&(
          <div style={{display:"flex",gap:6,padding:"8px 12px",background:C.faint,borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
            {selected.photos.map((p,i)=>(
              <div key={i} style={{width:60,height:44,borderRadius:6,overflow:"hidden",flexShrink:0,border:`1px solid ${C.border}`}}>
                {p.startsWith("data:")?<img src={p} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,background:C.surface}}>{p}</div>}
              </div>
            ))}
          </div>
        )}
        <div style={{padding:"16px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}><div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1}}>{selected.year} {selected.make} {selected.model}</div><div style={{color:C.muted,fontSize:12}}>{selected.trim} · {selected.color} · {selected.condition}</div></div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:C.accent}}>${selected.price.toLocaleString()}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:11}}>{[["Mileage",selected.mileage.toLocaleString()+" mi"],["Location",selected.city],["Listed",selected.listed],["Condition",selected.condition]].map(([l,v])=><div key={l} style={{background:C.faint,borderRadius:6,padding:"6px 8px"}}><div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:1}}>{l}</div><div style={{fontSize:12}}>{v}</div></div>)}</div>
          {userLocation&&<div style={{color:C.muted,fontSize:12,marginBottom:8}}>📍 {distanceMiles(userLocation.lat,userLocation.lng,selected.lat,selected.lng).toFixed(1)} miles away</div>}
          <div style={{color:C.text,fontSize:13,lineHeight:1.6,marginBottom:11}}>{selected.description}</div>
          {selected.features?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:11}}>{selected.features.map(f=><span key={f} style={{background:C.accentDim,color:C.accent,borderRadius:99,fontSize:11,padding:"2px 8px"}}>{f}</span>)}</div>}
          <div style={{background:C.faint,borderRadius:8,padding:"10px 12px",marginBottom:11}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:selected.isDealer?8:0}}>
              <div style={{fontSize:24}}>{selected.sellerPhoto}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13}}>{selected.sellerName}</div>
                <div style={{color:C.muted,fontSize:11}}>{selected.isDealer?"Licensed Dealership":selected.verified?"Verified Mechanic":"Private Seller"}</div>
              </div>
              {selected.isDealer?<span style={{background:"#F59E0B18",color:"#F59E0B",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:99}}>🏢 DEALER</span>:selected.verified&&<span style={{background:C.greenDim,color:C.green,fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:99}}>🔧 VERIFIED</span>}
            </div>
            {selected.isDealer&&<button style={{...S.btnSecondary,width:"100%",fontSize:12,padding:"6px 0",borderColor:"#F59E0B44",color:"#F59E0B"}} onClick={()=>setViewDealerProfile(selected.sellerId)}>🏢 View Dealer Profile & Full Inventory →</button>}
          </div>
          {selected.offers.filter(o=>o.buyerId===user.id).length>0&&<div style={{background:C.accentDim,border:`1px solid ${C.accent}22`,borderRadius:7,padding:"6px 10px",marginBottom:9}}><div style={{color:C.accent,fontSize:10,fontWeight:700,marginBottom:1}}>YOUR OFFER</div>{selected.offers.filter(o=>o.buyerId===user.id).map(o=><div key={o.id} style={{fontSize:12}}>${o.amount.toLocaleString()} — <span style={{color:o.status==="pending"?C.orange:C.green}}>{o.status.toUpperCase()}</span></div>)}</div>}
          {selected.sellerId!==user.id&&<div style={{display:"flex",gap:8}}><button style={{...S.btnSecondary,flex:1}} onClick={()=>{onDM(selected.sellerId);setSelected(null);}}>💬 Message</button><button style={{...S.btnPrimary,flex:1}} onClick={()=>{setOfferTarget(selected);setOfferSent(false);}}>💰 Make Offer</button></div>}
          {selected.sellerId===user.id&&<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:"6px 0"}}>Your listing · {selected.offers.length} offer{selected.offers.length!==1?"s":""}</div>}
        </div>
      </div>
    </div>}
    {offerTarget&&<div style={S.overlay}><div style={{...S.modal,maxWidth:380}}>
      <div style={S.modalHead}><span style={S.modalTitle}>Make an Offer</span><button onClick={()=>{setOfferTarget(null);setOfferSent(false);}} style={S.iconBtn}>✕</button></div>
      {!offerSent?<><div style={{background:C.faint,borderRadius:7,padding:"8px 10px",marginBottom:10}}><div style={{fontWeight:600,fontSize:13}}>{offerTarget.year} {offerTarget.make} {offerTarget.model}</div><div style={{color:C.muted,fontSize:12}}>Listed at <strong style={{color:C.accent}}>${offerTarget.price.toLocaleString()}</strong></div></div>
      <label style={S.label}>Your Offer ($)</label><input style={S.input} type="number" placeholder={offerTarget.price} value={offerAmt} onChange={e=>setOfferAmt(e.target.value)}/>
      <label style={S.label}>Message (optional)</label><textarea style={{...S.input,height:55,resize:"none"}} placeholder="Hi! I am interested..." value={offerMsg} onChange={e=>setOfferMsg(e.target.value)}/>
      <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setOfferTarget(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={sendOffer} disabled={!offerAmt}>Send Offer</button></div></>
      :<div style={{textAlign:"center",padding:"16px 0"}}><div style={{fontSize:42,marginBottom:8}}>🎉</div><div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Offer Sent!</div><div style={{color:C.muted,fontSize:13,marginBottom:14}}>Your offer of <strong style={{color:C.accent}}>${Number(offerAmt).toLocaleString()}</strong> was sent to {offerTarget.sellerName}.</div><button style={S.btnPrimary} onClick={()=>{setOfferTarget(null);setSelected(null);}}>Done</button></div>}
    </div></div>}
    {viewDealerProfile&&(()=>{const dealer=users?.find?.(u=>u.id===viewDealerProfile)||{id:viewDealerProfile,name:"Dealership",photo:"🏢",specialty:"Auto Dealer",rating:4.5,reviews:50,established:"2010",dealerLicense:"FL-DLR-2024",city:"Miami, FL",bio:""};return <DealerProfile dealer={dealer} listings={listings} onClose={()=>setViewDealerProfile(null)} onDM={onDM} userLocation={userLocation}/>;})()}
    {showCreate&&<CreateListing user={user} onClose={()=>setShowCreate(false)} onSave={l=>{setListings(p=>[{...l,id:Date.now(),sellerId:user.id,sellerName:user.name,sellerPhoto:user.photo||"😎",verified:user.role==="mechanic"||user.role==="admin",offers:[],listed:new Date().toLocaleDateString(),lat:userLocation?.lat||25.7617,lng:userLocation?.lng||-80.1918,city:l.zipCity||userLocation?.city||user.city||"Miami, FL",zipCity:l.zipCity},...p]);setShowCreate(false);}}/>}
  </div>);
}

function CreateListing({user,onClose,onSave}){
  const [form,setForm]=useState({year:new Date().getFullYear(),make:"Toyota",model:"",trim:"",color:"Black",mileage:"",price:"",condition:"Good",description:"",features:""});
  const [publishError,setPublishError]=useState("");
  const [customMake,setCustomMake]=useState(false);const [customModel,setCustomModel]=useState(false);
  const [photos,setPhotos]=useState([]);const photoRef=useRef();
  const setF=(k,v)=>setForm(p=>({...p,[k]:v}));
  const availableModels=CAR_MODELS[form.make]||[];
  const bodyType=MODEL_TYPES[form.model]||"";
  const handlePhotoAdd=(e)=>{
    const files=Array.from(e.target.files||[]);
    files.slice(0,15-photos.length).forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>setPhotos(p=>[...p,ev.target.result].slice(0,15));
      reader.readAsDataURL(file);
    });
  };
  const removePhoto=(idx)=>setPhotos(p=>p.filter((_,i)=>i!==idx));
  const save=()=>{
    if(!form.make||form.make==="Any"){setPublishError("Please select a make.");return;}
    if(!form.model){setPublishError("Please enter or select a model.");return;}
    if(!form.price){setPublishError("Please enter a price.");return;}
    if(!form.mileage){setPublishError("Please enter mileage.");return;}
    setPublishError("");
    onSave({...form,mileage:Number(form.mileage),price:Number(form.price),year:Number(form.year),photos:photos.length>0?photos:["🚗"],features:form.features.split(",").map(f=>f.trim()).filter(Boolean)});
    onClose();
  };
  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:480}}>
    <div style={S.modalHead}><span style={S.modalTitle}>List Your Car</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:10}}>
      <div><label style={S.label}>Year</label><input style={{...S.input,marginBottom:0}} type="number" value={form.year} onChange={e=>setF("year",e.target.value)}/></div>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
          <label style={{...S.label,marginBottom:0}}>Make</label>
          <button onClick={()=>{setCustomMake(!customMake);setF("make","");setF("model","");}} style={{background:"none",border:"none",color:C.accent,fontSize:10,cursor:"pointer"}}>{customMake?"Use List":"Type It In"}</button>
        </div>
        {customMake
          ? <input style={{...S.input,marginBottom:0}} placeholder="e.g. Porsche..." value={form.make} onChange={e=>setF("make",e.target.value)}/>
          : <select style={{...S.input,marginBottom:0}} value={form.make} onChange={e=>{setF("make",e.target.value);setF("model","");}}>{CAR_MAKES.filter(m=>m!=="Any").map(m=><option key={m}>{m}</option>)}</select>
        }
      </div>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
          <label style={{...S.label,marginBottom:0}}>Model</label>
          {availableModels.length>0&&<button onClick={()=>setCustomModel(!customModel)} style={{background:"none",border:"none",color:C.accent,fontSize:10,cursor:"pointer"}}>{customModel?"Use List":"Type It In"}</button>}
        </div>
        {customModel||availableModels.length===0
          ? <input style={{...S.input,marginBottom:0}} placeholder="e.g. Civic..." value={form.model} onChange={e=>setF("model",e.target.value)}/>
          : <select style={{...S.input,marginBottom:0}} value={form.model} onChange={e=>setF("model",e.target.value)}>
              <option value="">Select model...</option>
              {availableModels.map(m=><option key={m}>{m}</option>)}
            </select>
        }
      </div>
      <div><label style={S.label}>Trim</label><input style={{...S.input,marginBottom:0}} placeholder="e.g. EX, Sport..." value={form.trim} onChange={e=>setF("trim",e.target.value)}/></div>
      <div>
        <label style={S.label}>Color</label>
        <select style={{...S.input,marginBottom:0}} value={form.color} onChange={e=>setF("color",e.target.value)}>{CAR_COLORS.filter(c=>c!=="Any").map(c=><option key={c}>{c}</option>)}</select>
      </div>
      <div><label style={S.label}>Mileage</label><input style={{...S.input,marginBottom:0}} type="number" placeholder="e.g. 45000" value={form.mileage} onChange={e=>setF("mileage",e.target.value)}/></div>
      <div><label style={S.label}>Price ($)</label><input style={{...S.input,marginBottom:0}} type="number" placeholder="e.g. 18500" value={form.price} onChange={e=>setF("price",e.target.value)}/></div>
      <div><label style={S.label}>Condition</label><select style={{...S.input,marginBottom:0}} value={form.condition} onChange={e=>setF("condition",e.target.value)}>{["Excellent","Good","Fair","Poor"].map(c=><option key={c}>{c}</option>)}</select></div>
    </div>
    {bodyType&&<div style={{background:C.accentDim,border:`1px solid ${C.accent}22`,borderRadius:6,padding:"5px 10px",marginBottom:10,fontSize:12,color:C.accent}}>Body type: <strong>{bodyType}</strong> (auto-detected)</div>}

    <label style={S.label}>Photos ({photos.length}/15)</label>
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:7}}>
        {photos.map((p,i)=>(
          <div key={i} style={{position:"relative",width:76,height:58,borderRadius:7,overflow:"hidden",border:`1px solid ${C.border}`}}>
            <img src={p} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <button onClick={()=>removePhoto(i)} style={{position:"absolute",top:2,right:2,background:"#000000bb",border:"none",color:"#fff",borderRadius:99,width:16,height:16,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
        ))}
        {photos.length<15&&<div onClick={()=>photoRef.current.click()} style={{width:76,height:58,borderRadius:7,border:`1px dashed ${C.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:C.faint,color:C.muted,fontSize:10,gap:3}}>
          <span style={{fontSize:18}}>📷</span><span>Add Photo</span>
        </div>}
      </div>
      <input ref={photoRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handlePhotoAdd}/>
      {photos.length===0&&<div style={{color:C.muted,fontSize:11}}>Add up to 15 photos. First photo will be the cover.</div>}
    </div>

    <label style={S.label}>Description</label><textarea style={{...S.input,height:55,resize:"none"}} placeholder="Describe your car..." value={form.description} onChange={e=>setF("description",e.target.value)}/>
    <label style={S.label}>Features (comma separated)</label><input style={S.input} placeholder="e.g. Sunroof, Leather Seats, Backup Camera" value={form.features} onChange={e=>setF("features",e.target.value)}/>
    {publishError&&<div style={{color:C.red,fontSize:12,marginBottom:8}}>⚠ {publishError}</div>}
    <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={onClose}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={save}>Publish Listing</button></div>
  </div></div>);
}

function Messages({user,vehicles,users,initContact=null,toggleTheme=()=>{}}){
  const allContacts=user.role==="customer"?users.filter(u=>u.role!=="customer"):users.filter(u=>u.role==="customer");
  const [msgs,setMsgs]=useState(INIT_MESSAGES);
  const [draft,setDraft]=useState("");
  const [readContacts,setReadContacts]=useState(new Set());
  const bottomRef=useRef();

  const contacts=[...allContacts].sort((a,b)=>{
    const lastA=msgs.filter(m=>(m.from===user.id&&m.to===a.id)||(m.from===a.id&&m.to===user.id)).slice(-1)[0];
    const lastB=msgs.filter(m=>(m.from===user.id&&m.to===b.id)||(m.from===b.id&&m.to===user.id)).slice(-1)[0];
    if(!lastA&&!lastB)return 0;
    if(!lastA)return 1;
    if(!lastB)return -1;
    return lastB.id-lastA.id;
  });

  const [active,setActive]=useState(initContact?users.find(u=>u.id===initContact)||contacts[0]:contacts[0]);

  const openContact=(c)=>{
    setActive(c);
    setReadContacts(prev=>new Set([...prev,c.id]));
  };

  useEffect(()=>{
    if(active) setReadContacts(prev=>new Set([...prev,active.id]));
  },[]);

  const thread=msgs.filter(m=>(m.from===user.id&&m.to===active?.id)||(m.from===active?.id&&m.to===user.id));

  const send=()=>{
    if(!draft.trim()||!active)return;
    setMsgs(p=>[...p,{id:Date.now(),from:user.id,to:active.id,text:draft.trim(),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:"Today"}]);
    setReadContacts(prev=>new Set([...prev,active.id]));
    setDraft("");
  };

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[thread.length,active?.id]);

  const getV=(id)=>vehicles.find(v=>v.customerId===id);

  return(
    <div style={{display:"flex",height:"calc(100vh - 120px)",minHeight:300}}>
      {/* Contact List */}
      <div style={{width:"min(200px, 38vw)",borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"10px 12px 7px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,color:C.accent}}>MESSAGES</div>
        </div>
        <div style={{flex:1,overflow:"auto"}}>
          {contacts.map(c=>{
            const v=getV(c.id);
            const unread=readContacts.has(c.id)?0:msgs.filter(m=>m.from===c.id&&m.to===user.id).length;
            return(
              <div key={c.id} onClick={()=>openContact(c)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 11px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,background:active?.id===c.id?C.faint:"transparent"}}>
                <div style={{position:"relative"}}>
                  <div style={{fontSize:22}}>{c.photo||"😎"}</div>
                  {unread>0&&<div style={{position:"absolute",top:-2,right:-2,background:C.red,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</div>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:unread>0?700:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
                  <div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {(()=>{const last=msgs.filter(m=>(m.from===user.id&&m.to===c.id)||(m.from===c.id&&m.to===user.id)).slice(-1)[0];return last?`${last.from===user.id?"You: ":""}${last.text.substring(0,25)}${last.text.length>25?"...":""}`:c.shop||v?.vehicle||"";})()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {active?(
          <>
            <div style={{padding:"9px 13px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              <div style={{fontSize:22}}>{active.photo||"😎"}</div>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{active.name}</div>
                <div style={{color:C.muted,fontSize:11}}>{active.shop||getV(active.id)?.vehicle||""}</div>
              </div>
            </div>
            <div style={{flex:1,overflow:"auto",padding:"12px 13px",display:"flex",flexDirection:"column",gap:7}}>
              {thread.length===0&&<div style={{color:C.muted,fontSize:13,textAlign:"center",marginTop:32}}>No messages yet 👋</div>}
              {thread.map(m=>{
                const mine=m.from===user.id;
                return(
                  <div key={m.id} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"72%",background:mine?C.accent:C.surface,color:mine?"#000":C.text,borderRadius:mine?"14px 14px 3px 14px":"14px 14px 14px 3px",padding:"8px 12px",fontSize:13,border:mine?"none":`1px solid ${C.border}`}}>
                      <div>{m.text}</div>
                      <div style={{fontSize:10,marginTop:2,opacity:0.5,textAlign:"right"}}>{m.time}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}/>
            </div>
            <div style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8,flexShrink:0,background:C.surface}}>
              <input style={{...S.input,margin:0,flex:1}} placeholder="Type a message..." value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
              <button style={{...S.btnPrimary,padding:"9px 16px"}} onClick={send}>Send</button>
            </div>
          </>
        ):(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Select a conversation</div>
        )}
      </div>
    </div>
  );
}


function FindMechanic({user,users,onDM,userLocation}){
  const mechanics=users.filter(u=>u.role==="mechanic"||u.role==="admin");
  const [reviews,setReviews]=useState(INIT_REVIEWS);const [showReviews,setShowReviews]=useState(null);const [reviewMech,setReviewMech]=useState(null);const [newReview,setNewReview]=useState({rating:5,text:""});
  const [filter,setFilter]=useState("all");const [maxDist,setMaxDist]=useState(50);
  const filtered=mechanics.filter(m=>{if(filter==="available"&&!m.available)return false;if(userLocation){const d=distanceMiles(userLocation.lat,userLocation.lng,m.lat,m.lng);if(d>maxDist)return false;}return true;})
    .map(m=>({...m,dist:userLocation?distanceMiles(userLocation.lat,userLocation.lng,m.lat,m.lng):null})).sort((a,b)=>a.dist!=null?a.dist-b.dist:0);
  const mechReviews=(id)=>reviews.filter(r=>r.mechanicId===id);
  const avgRating=(id)=>{const r=mechReviews(id);return r.length?(r.reduce((a,b)=>a+b.rating,0)/r.length).toFixed(1):null;};
  const submitReview=()=>{if(!newReview.text.trim())return;setReviews(p=>[...p,{id:Date.now(),mechanicId:reviewMech.id,authorName:user.name,rating:newReview.rating,text:newReview.text,time:"Just now",verified:true}]);setNewReview({rating:5,text:""});setReviewMech(null);};
  return(<div style={{padding:"20px 22px",maxWidth:720}}>
    <div style={{marginBottom:13}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2}}>Find a Mechanic</div><div style={{color:C.muted,fontSize:12}}>Local mechanics near you</div></div>
    <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:11,alignItems:"center"}}>
      {["all","available"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"4px 12px",borderRadius:99,border:`1px solid ${filter===f?C.accent:C.border}`,background:filter===f?C.accentDim:"transparent",color:filter===f?C.accent:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{f==="all"?"All":"Available Now"}</button>)}
      {userLocation&&<div style={{display:"flex",alignItems:"center",gap:7,marginLeft:"auto"}}><span style={{color:C.muted,fontSize:12}}>Within:</span><input type="range" min={1} max={100} value={maxDist} onChange={e=>setMaxDist(Number(e.target.value))} style={{width:70,accentColor:C.accent}}/><span style={{fontSize:12,color:C.text,minWidth:38}}>{maxDist} mi</span></div>}
    </div>
    {filtered.length===0&&<div style={{color:C.muted,fontSize:13,padding:"16px 0"}}>No mechanics within {maxDist} miles. Try increasing distance.</div>}
    {filtered.map(m=>{const r=mechReviews(m.id);const avg=avgRating(m.id);return(
      <div key={m.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,padding:"12px 14px",marginBottom:9}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
          <div style={{fontSize:38}}>{m.photo||"🧑‍🔧"}</div>
          <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}><span style={{fontWeight:700,fontSize:14}}>{m.name}</span>{m.available?<span style={{background:C.greenDim,color:C.green,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 7px"}}>● AVAILABLE</span>:<span style={{background:C.faint,color:C.muted,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 7px"}}>BUSY</span>}
              {m.isOnline&&m.showOnline!==false&&<span style={{background:C.greenDim,color:C.green,borderRadius:99,fontSize:9,fontWeight:700,padding:"2px 8px",marginLeft:4,display:"inline-flex",alignItems:"center",gap:3}}><span style={{width:6,height:6,borderRadius:99,background:C.green,display:"inline-block"}}/>ONLINE</span>}</div>
          <div style={{color:C.muted,fontSize:12,marginTop:1}}>{m.logo&&<span style={{marginRight:3}}>{m.logo}</span>}{m.shop} · {m.specialty}</div>
          <div style={{color:C.muted,fontSize:12}}>📍 {m.city}{m.dist!=null&&` · ${m.dist<1?"<1":m.dist.toFixed(1)} mi away`}</div>
          {avg&&<div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}><Stars rating={parseFloat(avg)} size={12}/><span style={{fontSize:12,fontWeight:600}}>{avg}</span><span style={{color:C.muted,fontSize:11}}>({r.length} reviews)</span></div>}
          {m.bio&&<div style={{color:C.muted,fontSize:11,marginTop:3,fontStyle:"italic"}}>"{m.bio}"</div>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
            <button style={{...S.btnPrimary,fontSize:12,padding:"6px 11px"}} onClick={()=>onDM(m.id)}>💬 DM</button>
            <button style={{...S.btnSecondary,fontSize:11,padding:"4px 9px"}} onClick={()=>setShowReviews(showReviews===m.id?null:m.id)}>Reviews</button>
            {user.role==="customer"&&<button style={{...S.btnSecondary,borderColor:C.accent+"40",color:C.accent,fontSize:11,padding:"4px 8px"}} onClick={()=>setReviewMech(m)}>✏ Review</button>}
          </div>
        </div>
        {showReviews===m.id&&<div style={{marginTop:9,borderTop:`1px solid ${C.border}`,paddingTop:9}}>{r.length===0&&<div style={{color:C.muted,fontSize:12}}>No reviews yet.</div>}{r.map(rv=><div key={rv.id} style={{marginBottom:7,paddingBottom:7,borderBottom:`1px solid ${C.faint}`}}><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><span style={{fontSize:12,fontWeight:600}}>{rv.authorName}</span>{rv.verified&&<span style={{background:C.greenDim,color:C.green,fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:99}}>✓</span>}<span style={{marginLeft:"auto",color:C.muted,fontSize:11}}>{rv.time}</span></div><Stars rating={rv.rating} size={11}/><div style={{color:C.text,fontSize:12,marginTop:2}}>{rv.text}</div></div>)}</div>}
      </div>
    );})}
    {reviewMech&&<div style={S.overlay}><div style={{...S.modal,maxWidth:370}}><div style={S.modalHead}><span style={S.modalTitle}>Review {reviewMech.name}</span><button onClick={()=>setReviewMech(null)} style={S.iconBtn}>✕</button></div><div style={{display:"flex",gap:5,marginBottom:10}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setNewReview(p=>({...p,rating:n}))} style={{fontSize:22,background:"none",border:"none",cursor:"pointer",color:n<=newReview.rating?C.accent:"#333"}}>★</button>)}</div><textarea style={{...S.input,height:70,resize:"none"}} placeholder="Share your experience..." value={newReview.text} onChange={e=>setNewReview(p=>({...p,text:e.target.value}))}/><div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setReviewMech(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={submitReview}>Submit</button></div></div></div>}
  </div>);
}

// ── SHOP MANAGEMENT ──────────────────────────────────────────────────────────
function ShopManagement({user,users,vehicles}){
  const [jobs,setJobs]=useState(INIT_JOBS);
  const [workers,setWorkers]=useState(INIT_WORKERS);
  const [shops,setShops]=useState(INIT_SHOPS);
  const [view,setView]=useState("board"); // board | myjobs | workers | add
  const [showAddJob,setShowAddJob]=useState(false);
  const [showAddWorker,setShowAddWorker]=useState(false);
  const [selectedJob,setSelectedJob]=useState(null);
  const [inviteEmail,setInviteEmail]=useState("");
  const [inviteSent,setInviteSent]=useState(false);
  const [newJob,setNewJob]=useState({vehicleName:"",customerName:"",customerPhone:"",service:"",assignedTo:"",priority:"Normal",notes:"",parts:"",estimatedHours:1});

  const myShop=shops.find(s=>s.ownerId===user.id||s.workers.includes(user.id));
  const isSenior=myShop?.seniorMechanics?.includes(user.id)||myShop?.ownerId===user.id;
  const isOwner=myShop?.ownerId===user.id;
  const shopWorkers=workers.filter(w=>w.shopId===myShop?.id);
  const myWorkerProfile=workers.find(w=>w.userId===user.id);
  const myJobs=jobs.filter(j=>j.assignedTo===myWorkerProfile?.id&&j.shopId===myShop?.id);
  const allShopJobs=jobs.filter(j=>j.shopId===myShop?.id);

  const statusCounts=JOB_STATUSES.reduce((acc,s)=>({...acc,[s]:allShopJobs.filter(j=>j.status===s).length}),{});
  const urgentCount=allShopJobs.filter(j=>j.priority==="Urgent"&&j.status!=="Done"&&j.status!=="Paid").length;

  const updateJobStatus=(jobId,status)=>{
    setJobs(prev=>prev.map(j=>j.id===jobId?{...j,status,updatedAt:new Date().toLocaleDateString()}:j));
    if(selectedJob?.id===jobId)setSelectedJob(p=>({...p,status}));
  };

  const addJob=()=>{
    if(!newJob.vehicleName||!newJob.service||!newJob.assignedTo)return;
    const job={id:Date.now(),shopId:myShop?.id,assignedTo:newJob.assignedTo,assignedBy:user.id,
      customerId:null,vehicleName:newJob.vehicleName,customerName:newJob.customerName,
      customerPhone:newJob.customerPhone,service:newJob.service,status:"To-do",
      priority:newJob.priority,notes:newJob.notes,
      parts:newJob.parts.split(",").map(p=>p.trim()).filter(Boolean),
      estimatedHours:Number(newJob.estimatedHours),
      createdAt:new Date().toLocaleDateString(),updatedAt:new Date().toLocaleDateString()};
    setJobs(prev=>[job,...prev]);
    setNewJob({vehicleName:"",customerName:"",customerPhone:"",service:"",assignedTo:"",priority:"Normal",notes:"",parts:"",estimatedHours:1});
    setShowAddJob(false);
  };

  const getWorkerName=(workerId)=>workers.find(w=>w.id===workerId)?.name||"Unassigned";
  const getWorkerPhoto=(workerId)=>workers.find(w=>w.id===workerId)?.photo||"🧑‍🔧";

  return(<div style={{padding:"20px 24px",maxWidth:820,animation:"fadeUp 0.25s ease"}}>
    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

    {/* Header */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:10}}>
      <div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>Shop Management</div>
        <div style={{color:C.muted,fontSize:12}}>{myShop?.name||"Your Shop"} · {allShopJobs.length} jobs today</div>
      </div>
      <div style={{display:"flex",gap:8}}>
        {isSenior&&<button style={S.btnPrimary} onClick={()=>setShowAddJob(true)}>+ Assign Job</button>}
        {isOwner&&<button style={{...S.btnSecondary,borderColor:C.accent+"40",color:C.accent}} onClick={()=>setShowAddWorker(true)}>+ Add Worker</button>}
      </div>
    </div>

    {/* Stats row */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:18}}>
      {JOB_STATUSES.map(s=>(
        <div key={s} style={{background:C.surface,borderRadius:8,padding:"10px 8px",border:`1px solid ${C.border}`,borderTop:`3px solid ${JOB_STATUS_COLORS[s]}`}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:JOB_STATUS_COLORS[s],lineHeight:1}}>{statusCounts[s]||0}</div>
          <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:0.5,marginTop:2}}>{s}</div>
        </div>
      ))}
    </div>

    {/* View tabs */}
    <div style={{display:"flex",gap:2,marginBottom:16,background:C.faint,borderRadius:8,padding:3}}>
      {[{id:"board",label:"📋 Job Board"},{id:"myjobs",label:`🔧 My Jobs (${myJobs.length})`},{id:"workers",label:"👥 Workers"}].map(t=>(
        <button key={t.id} onClick={()=>setView(t.id)} style={{flex:1,padding:"7px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:view===t.id?C.accent:"transparent",color:view===t.id?"#000":C.muted,transition:"all 0.2s"}}>{t.label}</button>
      ))}
    </div>

    {/* JOB BOARD */}
    {view==="board"&&<>
      {urgentCount>0&&<div style={{background:C.redDim,border:`1px solid ${C.red}33`,borderRadius:8,padding:"8px 12px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:16}}>🚨</span>
        <span style={{color:C.red,fontSize:13,fontWeight:600}}>{urgentCount} urgent job{urgentCount!==1?"s":""} need attention</span>
      </div>}

      {/* Group by status */}
      {JOB_STATUSES.filter(s=>s!=="Paid").map(status=>{
        const statusJobs=allShopJobs.filter(j=>j.status===status);
        if(statusJobs.length===0)return null;
        return(<div key={status} style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:10,height:10,borderRadius:99,background:JOB_STATUS_COLORS[status]}}/>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:1.5,color:JOB_STATUS_COLORS[status]}}>{status.toUpperCase()}</span>
            <span style={{color:C.muted,fontSize:11}}>({statusJobs.length})</span>
          </div>
          {statusJobs.map(job=>(
            <div key={job.id} style={{background:C.surface,border:`1px solid ${job.priority==="Urgent"?C.red+"44":C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:8,cursor:"pointer",borderLeft:`3px solid ${JOB_STATUS_COLORS[job.status]}`}} onClick={()=>setSelectedJob(job)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{job.service}</div>
                  <div style={{color:C.muted,fontSize:12}}>{job.vehicleName} · {job.customerName}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  {job.priority==="Urgent"&&<span style={{background:C.redDim,color:C.red,borderRadius:99,fontSize:9,fontWeight:700,padding:"2px 7px"}}>🚨 URGENT</span>}
                  <span style={{background:JOB_STATUS_COLORS[job.status]+"18",color:JOB_STATUS_COLORS[job.status],borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 8px"}}>{job.status}</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                <span style={{fontSize:16}}>{getWorkerPhoto(job.assignedTo)}</span>
                <span style={{color:C.muted,fontSize:12}}>{getWorkerName(job.assignedTo)}</span>
                <span style={{color:C.muted,fontSize:11,marginLeft:"auto"}}>⏱ {job.estimatedHours}hr{job.estimatedHours!==1?"s":""}</span>
                <span style={{color:C.muted,fontSize:11}}>{job.updatedAt}</span>
              </div>
              {job.parts.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:7}}>
                {job.parts.map(p=><span key={p} style={{background:C.faint,color:C.muted,borderRadius:99,fontSize:10,padding:"2px 8px"}}>🔩 {p}</span>)}
              </div>}
            </div>
          ))}
        </div>);
      })}

      {/* Paid jobs collapsed */}
      {allShopJobs.filter(j=>j.status==="Paid").length>0&&<div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{width:10,height:10,borderRadius:99,background:C.accent}}/>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:1.5,color:C.accent}}>PAID</span>
          <span style={{color:C.muted,fontSize:11}}>({allShopJobs.filter(j=>j.status==="Paid").length} completed today)</span>
        </div>
        {allShopJobs.filter(j=>j.status==="Paid").map(job=>(
          <div key={job.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",marginBottom:6,opacity:0.7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:600,fontSize:13}}>{job.service}</div><div style={{color:C.muted,fontSize:11}}>{job.vehicleName} · {job.customerName}</div></div>
            <span style={{color:C.accent,fontSize:12,fontWeight:700}}>✓ PAID</span>
          </div>
        ))}
      </div>}
    </>}

    {/* MY JOBS */}
    {view==="myjobs"&&<>
      {myJobs.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:C.muted}}><div style={{fontSize:44,marginBottom:10}}>✅</div><div style={{fontSize:14}}>No jobs assigned to you</div></div>}
      {myJobs.filter(j=>j.status!=="Paid").sort((a,b)=>{const order={"Urgent":0,"Normal":1};return(order[a.priority]||1)-(order[b.priority]||1);}).map(job=>(
        <div key={job.id} style={{background:C.surface,border:`1px solid ${job.priority==="Urgent"?C.red+"44":C.border}`,borderRadius:10,padding:"14px 16px",marginBottom:10,borderLeft:`3px solid ${JOB_STATUS_COLORS[job.status]}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>{job.service}</div>
              <div style={{color:C.muted,fontSize:12,marginTop:2}}>{job.vehicleName}</div>
              {job.customerName&&<div style={{color:C.muted,fontSize:12}}>{job.customerName}{job.customerPhone&&` · ${job.customerPhone}`}</div>}
            </div>
            {job.priority==="Urgent"&&<span style={{background:C.redDim,color:C.red,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 8px"}}>🚨 URGENT</span>}
          </div>
          {job.notes&&<div style={{color:C.text,fontSize:13,fontStyle:"italic",marginBottom:10,padding:"7px 10px",background:C.faint,borderRadius:6}}>"{job.notes}"</div>}
          {job.parts.length>0&&<div style={{marginBottom:10}}><div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Parts Needed</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{job.parts.map(p=><span key={p} style={{background:C.faint,color:C.text,borderRadius:6,fontSize:11,padding:"3px 9px"}}>🔩 {p}</span>)}</div></div>}
          <div style={{color:C.muted,fontSize:11,marginBottom:10}}>⏱ Est. {job.estimatedHours}hr{job.estimatedHours!==1?"s":""} · Assigned {job.createdAt}</div>

          {/* Status update buttons */}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
            <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:7}}>Update Status</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {JOB_STATUSES.map(s=>(
                <button key={s} onClick={()=>updateJobStatus(job.id,s)} style={{padding:"5px 10px",borderRadius:6,border:`1px solid ${job.status===s?JOB_STATUS_COLORS[s]:C.border}`,background:job.status===s?JOB_STATUS_COLORS[s]+"18":"transparent",color:job.status===s?JOB_STATUS_COLORS[s]:C.muted,fontSize:11,fontWeight:job.status===s?700:400,cursor:"pointer"}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>}

    {/* WORKERS */}
    {view==="workers"&&<>
      {shopWorkers.map(w=>{
        const workerJobs=allShopJobs.filter(j=>j.assignedTo===w.id);
        const activeJobs=workerJobs.filter(j=>j.status!=="Done"&&j.status!=="Paid").length;
        return(<div key={w.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <div style={{fontSize:36}}>{w.photo}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontWeight:700,fontSize:15}}>{w.name}</span>
                {w.role==="senior"&&<span style={{background:C.accentDim,color:C.accent,borderRadius:99,fontSize:9,fontWeight:700,padding:"2px 7px"}}>SENIOR</span>}
              </div>
              <div style={{color:C.muted,fontSize:12}}>{w.specialty}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:activeJobs>0?C.orange:C.green,lineHeight:1}}>{activeJobs}</div>
              <div style={{color:C.muted,fontSize:10}}>active jobs</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {JOB_STATUSES.map(s=>{const c=workerJobs.filter(j=>j.status===s).length;if(!c)return null;return(
              <span key={s} style={{background:JOB_STATUS_COLORS[s]+"18",color:JOB_STATUS_COLORS[s],borderRadius:99,fontSize:10,padding:"2px 8px"}}>{c} {s}</span>
            );})}
          </div>
        </div>);
      })}
      {shopWorkers.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:C.muted}}><div style={{fontSize:40,marginBottom:8}}>👥</div><div>No workers added yet</div><div style={{fontSize:12,marginTop:4}}>Tap "+ Add Worker" to invite your team</div></div>}
    </>}

    {/* ADD JOB MODAL */}
    {showAddJob&&<div style={S.overlay}><div style={{...S.modal,maxWidth:480}}>
      <div style={S.modalHead}><span style={S.modalTitle}>Assign New Job</span><button onClick={()=>setShowAddJob(false)} style={S.iconBtn}>✕</button></div>

      <label style={S.label}>Assign To *</label>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
        {shopWorkers.map(w=>(
          <button key={w.id} onClick={()=>setNewJob(p=>({...p,assignedTo:w.id}))} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,border:`1px solid ${newJob.assignedTo===w.id?C.accent:C.border}`,background:newJob.assignedTo===w.id?C.accentDim:"transparent",cursor:"pointer"}}>
            <span style={{fontSize:18}}>{w.photo}</span>
            <span style={{fontSize:12,color:newJob.assignedTo===w.id?C.accent:C.text}}>{w.name}</span>
          </button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        <div><label style={S.label}>Vehicle</label><input style={{...S.input,marginBottom:0}} placeholder="e.g. 2021 Honda Civic" value={newJob.vehicleName} onChange={e=>setNewJob(p=>({...p,vehicleName:e.target.value}))}/></div>
        <div><label style={S.label}>Customer Name</label><input style={{...S.input,marginBottom:0}} placeholder="Full name" value={newJob.customerName} onChange={e=>setNewJob(p=>({...p,customerName:e.target.value}))}/></div>
        <div><label style={S.label}>Phone</label><input style={{...S.input,marginBottom:0}} placeholder="555-000-0000" value={newJob.customerPhone} onChange={e=>setNewJob(p=>({...p,customerPhone:e.target.value}))}/></div>
        <div><label style={S.label}>Est. Hours</label><input style={{...S.input,marginBottom:0}} type="number" min="0.5" step="0.5" value={newJob.estimatedHours} onChange={e=>setNewJob(p=>({...p,estimatedHours:e.target.value}))}/></div>
      </div>

      <label style={{...S.label,marginTop:10}}>Service / Job Description *</label>
      <input style={S.input} placeholder="e.g. Alternator Replacement, Oil Change..." value={newJob.service} onChange={e=>setNewJob(p=>({...p,service:e.target.value}))}/>

      <label style={S.label}>Priority</label>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {["Normal","Urgent"].map(p=>(
          <button key={p} onClick={()=>setNewJob(prev=>({...prev,priority:p}))} style={{flex:1,padding:"7px 0",borderRadius:7,border:`1px solid ${newJob.priority===p?(p==="Urgent"?C.red:C.accent):C.border}`,background:newJob.priority===p?(p==="Urgent"?C.redDim:C.accentDim):"transparent",color:newJob.priority===p?(p==="Urgent"?C.red:C.accent):C.muted,cursor:"pointer",fontSize:13,fontWeight:600}}>
            {p==="Urgent"?"🚨 Urgent":"✓ Normal"}
          </button>
        ))}
      </div>

      <label style={S.label}>Parts Needed (comma separated)</label>
      <input style={S.input} placeholder="e.g. Brake Pads, Rotors, Oil Filter" value={newJob.parts} onChange={e=>setNewJob(p=>({...p,parts:e.target.value}))}/>

      <label style={S.label}>Notes for Worker</label>
      <textarea style={{...S.input,height:60,resize:"none"}} placeholder="Any special instructions..." value={newJob.notes} onChange={e=>setNewJob(p=>({...p,notes:e.target.value}))}/>

      <div style={{display:"flex",gap:8}}>
        <button style={S.btnSecondary} onClick={()=>setShowAddJob(false)}>Cancel</button>
        <button style={{...S.btnPrimary,flex:1}} onClick={addJob} disabled={!newJob.vehicleName||!newJob.service||!newJob.assignedTo}>Assign Job</button>
      </div>
    </div></div>}

    {/* ADD WORKER MODAL */}
    {showAddWorker&&<div style={S.overlay}><div style={{...S.modal,maxWidth:420}}>
      <div style={S.modalHead}><span style={S.modalTitle}>Add Worker</span><button onClick={()=>setShowAddWorker(false)} style={S.iconBtn}>✕</button></div>
      {!inviteSent?<>
        <div style={{color:C.muted,fontSize:13,marginBottom:16,lineHeight:1.6}}>Workers can join by searching for your shop in the app, or you can invite them directly by email.</div>

        <div style={{background:C.accentDim,border:`1px solid ${C.accent}22`,borderRadius:8,padding:"10px 12px",marginBottom:16}}>
          <div style={{color:C.accent,fontSize:11,fontWeight:700,marginBottom:4}}>SHOP INVITE CODE</div>
          <div style={{fontFamily:"monospace",fontSize:18,color:C.text,letterSpacing:3}}>TORRES-{myShop?.id?.slice(-4).toUpperCase()||"XXXX"}</div>
          <div style={{color:C.muted,fontSize:11,marginTop:4}}>Workers enter this code in their app to join your shop</div>
        </div>

        <div style={{textAlign:"center",color:C.muted,fontSize:12,marginBottom:12}}>— or send email invite —</div>
        <label style={S.label}>Worker Email</label>
        <input style={S.input} type="email" placeholder="worker@email.com" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}/>
        <div style={{display:"flex",gap:8}}>
          <button style={S.btnSecondary} onClick={()=>setShowAddWorker(false)}>Cancel</button>
          <button style={{...S.btnPrimary,flex:1}} onClick={()=>setInviteSent(true)} disabled={!inviteEmail}>📧 Send Invite</button>
        </div>
      </>:<div style={{textAlign:"center",padding:"20px 0"}}>
        <div style={{fontSize:44,marginBottom:10}}>✅</div>
        <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>Invite Sent!</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:16}}>Invite sent to <strong>{inviteEmail}</strong>. They will appear in your workers list once they accept.</div>
        <button style={S.btnPrimary} onClick={()=>{setShowAddWorker(false);setInviteSent(false);setInviteEmail("");}}>Done</button>
      </div>}
    </div></div>}

    {/* JOB DETAIL MODAL */}
    {selectedJob&&<div style={S.overlay}><div style={{...S.modal,maxWidth:460}}>
      <div style={S.modalHead}>
        <div>
          <span style={S.modalTitle}>{selectedJob.service}</span>
          <div style={{color:C.muted,fontSize:12,marginTop:2}}>{selectedJob.vehicleName} · {selectedJob.customerName}</div>
        </div>
        <button onClick={()=>setSelectedJob(null)} style={S.iconBtn}>✕</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {[["Assigned To",getWorkerName(selectedJob.assignedTo)],["Priority",selectedJob.priority],["Est. Time",selectedJob.estimatedHours+"hr"+(selectedJob.estimatedHours!==1?"s":"")],["Created",selectedJob.createdAt],["Phone",selectedJob.customerPhone||"—"],["Updated",selectedJob.updatedAt]].map(([l,v])=>(
          <div key={l} style={{background:C.faint,borderRadius:7,padding:"8px 10px"}}>
            <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>{l}</div>
            <div style={{fontSize:12,fontWeight:600}}>{v}</div>
          </div>
        ))}
      </div>
      {selectedJob.notes&&<div style={{background:C.faint,borderRadius:7,padding:"8px 10px",marginBottom:12}}><div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Notes</div><div style={{fontSize:13,fontStyle:"italic"}}>"{selectedJob.notes}"</div></div>}
      {selectedJob.parts.length>0&&<div style={{marginBottom:14}}><div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Parts</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{selectedJob.parts.map(p=><span key={p} style={{background:C.faint,color:C.text,borderRadius:6,fontSize:11,padding:"3px 9px"}}>🔩 {p}</span>)}</div></div>}
      <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Update Status</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {JOB_STATUSES.map(s=>(
          <button key={s} onClick={()=>updateJobStatus(selectedJob.id,s)} style={{padding:"6px 12px",borderRadius:7,border:`1px solid ${selectedJob.status===s?JOB_STATUS_COLORS[s]:C.border}`,background:selectedJob.status===s?JOB_STATUS_COLORS[s]+"20":"transparent",color:selectedJob.status===s?JOB_STATUS_COLORS[s]:C.muted,fontSize:12,fontWeight:selectedJob.status===s?700:400,cursor:"pointer"}}>
            {selectedJob.status===s?"✓ ":""}{s}
          </button>
        ))}
      </div>
      <button style={{...S.btnSecondary,width:"100%"}} onClick={()=>setSelectedJob(null)}>Close</button>
    </div></div>}
  </div>);
}


// ── AVAILABILITY SETTINGS ─────────────────────────────────────────────────────
function AvailabilitySettings({user,users,setUsers,onClose}){
  const currentUser=users.find(u=>u.id===user.id)||user;
  const [available,setAvailable]=useState(currentUser.available||false);
  const [isOnline,setIsOnline]=useState(currentUser.isOnline||false);
  const [showOnline,setShowOnline]=useState(currentUser.showOnline!==false);
  const DAYS=["mon","tue","wed","thu","fri","sat","sun"];
  const DAY_LABELS={mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"};
  const TIMES=["Closed","6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"];
  const [hours,setHours]=useState(currentUser.workingHours||{mon:"9:00 AM",monEnd:"5:00 PM",tue:"9:00 AM",tueEnd:"5:00 PM",wed:"9:00 AM",wedEnd:"5:00 PM",thu:"9:00 AM",thuEnd:"5:00 PM",fri:"9:00 AM",friEnd:"5:00 PM",sat:"Closed",satEnd:"",sun:"Closed",sunEnd:""});

  const save=()=>{
    setUsers(prev=>prev.map(u=>u.id===user.id?{...u,available,isOnline,showOnline,workingHours:hours}:u));
    onClose();
  };

  return(<div style={S.overlay}><div style={{...S.modal,maxWidth:440}}>
    <div style={S.modalHead}><span style={S.modalTitle}>Availability</span><button onClick={onClose} style={S.iconBtn}>✕</button></div>

    {/* Online status */}
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,letterSpacing:1.5,color:C.accent,marginBottom:10}}>ONLINE STATUS</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div>
          <div style={{fontSize:14,fontWeight:600}}>Show as Online</div>
          <div style={{color:C.muted,fontSize:12}}>Customers can see when you're active</div>
        </div>
        <div onClick={()=>setIsOnline(p=>!p)} style={{width:46,height:26,borderRadius:99,background:isOnline?C.green:C.faint,cursor:"pointer",position:"relative",transition:"background 0.2s",border:`1px solid ${isOnline?C.green:C.border}`}}>
          <div style={{position:"absolute",top:2,left:isOnline?22:2,width:20,height:20,borderRadius:99,background:isOnline?"#000":C.muted,transition:"left 0.2s"}}/>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div>
          <div style={{fontSize:14,fontWeight:600}}>Available for Jobs</div>
          <div style={{color:C.muted,fontSize:12}}>Show "Available Now" badge to customers</div>
        </div>
        <div onClick={()=>setAvailable(p=>!p)} style={{width:46,height:26,borderRadius:99,background:available?C.accent:C.faint,cursor:"pointer",position:"relative",transition:"background 0.2s",border:`1px solid ${available?C.accent:C.border}`}}>
          <div style={{position:"absolute",top:2,left:available?22:2,width:20,height:20,borderRadius:99,background:available?"#000":C.muted,transition:"left 0.2s"}}/>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:14,fontWeight:600}}>Show Online Indicator</div>
          <div style={{color:C.muted,fontSize:12}}>Display green dot on your profile</div>
        </div>
        <div onClick={()=>setShowOnline(p=>!p)} style={{width:46,height:26,borderRadius:99,background:showOnline?C.blue:C.faint,cursor:"pointer",position:"relative",transition:"background 0.2s",border:`1px solid ${showOnline?C.blue:C.border}`}}>
          <div style={{position:"absolute",top:2,left:showOnline?22:2,width:20,height:20,borderRadius:99,background:showOnline?"#000":C.muted,transition:"left 0.2s"}}/>
        </div>
      </div>
    </div>

    {/* Working hours */}
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,letterSpacing:1.5,color:C.accent,marginBottom:10}}>WORKING HOURS</div>
      {DAYS.map(day=>(
        <div key={day} style={{display:"grid",gridTemplateColumns:"80px 1fr 1fr",gap:6,alignItems:"center",marginBottom:7}}>
          <div style={{fontSize:12,fontWeight:600,color:C.text}}>{DAY_LABELS[day].slice(0,3)}</div>
          <select style={{...S.input,margin:0,fontSize:11,padding:"5px 6px"}} value={hours[day]||"Closed"} onChange={e=>setHours(p=>({...p,[day]:e.target.value,[day+"End"]:e.target.value==="Closed"?"":p[day+"End"]||"5:00 PM"}))}>
            {TIMES.map(t=><option key={t}>{t}</option>)}
          </select>
          {hours[day]!=="Closed"
            ?<select style={{...S.input,margin:0,fontSize:11,padding:"5px 6px"}} value={hours[day+"End"]||"5:00 PM"} onChange={e=>setHours(p=>({...p,[day+"End"]:e.target.value}))}>
                {TIMES.filter(t=>t!=="Closed").map(t=><option key={t}>{t}</option>)}
              </select>
            :<div style={{color:C.muted,fontSize:11,textAlign:"center"}}>—</div>
          }
        </div>
      ))}
    </div>

    <div style={{display:"flex",gap:8}}>
      <button style={S.btnSecondary} onClick={onClose}>Cancel</button>
      <button style={{...S.btnPrimary,flex:1}} onClick={save}>Save Availability</button>
    </div>
  </div></div>);
}


// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
function SettingsPage({user,users,setUsers,onLogout,toggleTheme,onClose}){
  const currentUser=users.find(u=>u.id===user.id)||user;
  const [view,setView]=useState("main"); // main | profile | availability | terms
  const [showAvailability,setShowAvailability]=useState(false);
  const isMech=currentUser.role==="mechanic"||currentUser.role==="admin";

  // Profile edit state
  const [username,setUsername]=useState(currentUser.username||currentUser.name.replace(" ","").toLowerCase());
  const [displayName,setDisplayName]=useState(currentUser.name||"");
  const [bio,setBio]=useState(currentUser.bio||"");
  const [profilePhoto,setProfilePhoto]=useState(currentUser.profilePhoto||null);
  const [saving,setSaving]=useState(false);
  const photoRef=useRef();
  const videoRef=useRef();
  const streamRef=useRef();
  const [cameraOn,setCameraOn]=useState(false);

  const startCamera=async()=>{
    setCameraOn(true);
    try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"}});streamRef.current=s;if(videoRef.current)videoRef.current.srcObject=s;}
    catch{alert("Camera access denied.");setCameraOn(false);}
  };
  const takePhoto=()=>{
    const c=document.createElement("canvas");c.width=videoRef.current.videoWidth;c.height=videoRef.current.videoHeight;
    c.getContext("2d").drawImage(videoRef.current,0,0);
    setProfilePhoto(c.toDataURL("image/jpeg",0.8));
    streamRef.current?.getTracks().forEach(t=>t.stop());setCameraOn(false);
  };
  const handleFilePhoto=(e)=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();r.onload=ev=>setProfilePhoto(ev.target.result);r.readAsDataURL(f);
  };
  useEffect(()=>()=>streamRef.current?.getTracks().forEach(t=>t.stop()),[]);

  const saveProfile=()=>{
    setSaving(true);
    setUsers(prev=>prev.map(u=>u.id===user.id?{...u,username,name:displayName,bio,profilePhoto}:u));
    setTimeout(()=>{setSaving(false);setView("main");},800);
  };

  if(showAvailability&&isMech) return <AvailabilitySettings user={currentUser} users={users} setUsers={setUsers} onClose={()=>setShowAvailability(false)}/>;

  return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',sans-serif"}}>
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:50}}>
      <button onClick={view==="main"?onClose:()=>setView("main")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:22}}>←</button>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2,color:C.text}}>
        {view==="main"?"SETTINGS":view==="profile"?"EDIT PROFILE":view==="terms"?"TERMS OF SERVICE":"SETTINGS"}
      </div>
    </div>

    {/* MAIN SETTINGS */}
    {view==="main"&&<div style={{padding:"16px"}}>

      {/* Profile preview */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px",marginBottom:14,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setView("profile")}>
        <div style={{width:56,height:56,borderRadius:99,overflow:"hidden",flexShrink:0,background:C.faint,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {currentUser.profilePhoto?<img src={currentUser.profilePhoto} alt="Profile" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{fontSize:32}}>{currentUser.photo||"😎"}</div>}
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:16}}>{currentUser.name}</div>
          <div style={{color:C.muted,fontSize:12}}>@{currentUser.username||currentUser.name.replace(" ","").toLowerCase()}</div>
          <div style={{color:C.accent,fontSize:12,marginTop:2}}>Edit Profile →</div>
        </div>
      </div>

      {/* Settings sections */}
      {[
        {section:"ACCOUNT",items:[
          {icon:"👤",label:"Edit Profile",sub:"Name, username, bio, photo",action:()=>setView("profile")},
          ...(isMech?[{icon:"🕐",label:"Availability & Hours",sub:"Set working hours and online status",action:()=>setShowAvailability(true)}]:[]),
          {icon:"🔔",label:"Notifications",sub:"Push alerts and reminders",action:()=>alert("Notifications settings coming soon!")},
        ]},
        {section:"APPEARANCE",items:[
          {icon:C.isDark?"☀️":"🌙",label:C.isDark?"Switch to Light Mode":"Switch to Dark Mode",sub:"Currently "+(C.isDark?"Dark":"Light")+" mode",action:toggleTheme},
        ]},
        {section:"LEGAL",items:[
          {icon:"📄",label:"Terms of Service",sub:"Read our terms and conditions",action:()=>setView("terms")},
          {icon:"🔒",label:"Privacy Policy",sub:"How we handle your data",action:()=>alert("Privacy policy coming soon!")},
          {icon:"🛡",label:"Safety Center",sub:"Report issues and stay safe",action:()=>alert("Safety center coming soon!")},
        ]},
        {section:"SUPPORT",items:[
          {icon:"❓",label:"Help & FAQ",sub:"Get answers to common questions",action:()=>alert("Help center coming soon!")},
          {icon:"📧",label:"Contact Support",sub:"Reach our team",action:()=>alert("support@garageiq.com")},
          {icon:"⭐",label:"Rate GarageIQ",sub:"Leave us a review on the App Store",action:()=>alert("Thank you! Redirecting to App Store...")},
        ]},
        {section:"ACCOUNT ACTIONS",items:[
          {icon:"🚪",label:"Sign Out",sub:"Sign out of your account",action:onLogout,danger:true},
          {icon:"🗑",label:"Delete Account",sub:"Permanently delete your account",action:()=>alert("Please contact support to delete your account."),danger:true},
        ]},
      ].map(({section,items})=>(
        <div key={section} style={{marginBottom:14}}>
          <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6,paddingLeft:4}}>{section}</div>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
            {items.map((item,i)=>(
              <div key={item.label} onClick={item.action} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer",borderBottom:i<items.length-1?`1px solid ${C.border}`:"none",background:"transparent"}}>
                <div style={{width:36,height:36,borderRadius:9,background:item.danger?C.redDim:C.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{item.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:500,color:item.danger?C.red:C.text}}>{item.label}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:1}}>{item.sub}</div>
                </div>
                <span style={{color:C.muted,fontSize:16}}>›</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{textAlign:"center",color:C.muted,fontSize:11,padding:"16px 0"}}>GarageIQ v1.0 Beta · Made with ❤️</div>
    </div>}

    {/* EDIT PROFILE */}
    {view==="profile"&&<div style={{padding:"16px"}}>
      {/* Profile photo */}
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{position:"relative",display:"inline-block"}}>
          <div style={{width:100,height:100,borderRadius:99,overflow:"hidden",background:C.faint,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",border:`3px solid ${C.accent}`}}>
            {profilePhoto?<img src={profilePhoto} alt="Profile" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:currentUser.profilePhoto?<img src={currentUser.profilePhoto} alt="Profile" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{fontSize:48}}>{currentUser.photo||"😎"}</div>}
          </div>
        </div>
        {!cameraOn&&<div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10}}>
          <button style={{...S.btnSecondary,fontSize:12,padding:"6px 12px"}} onClick={()=>photoRef.current.click()}>📁 Upload</button>
          <button style={{...S.btnSecondary,fontSize:12,padding:"6px 12px"}} onClick={startCamera}>📷 Camera</button>
        </div>}
        {cameraOn&&<div style={{marginTop:10}}>
          <video ref={videoRef} autoPlay playsInline style={{width:200,height:150,borderRadius:10,background:"#000"}}/>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:8}}>
            <button style={{...S.btnSecondary,fontSize:12}} onClick={()=>{streamRef.current?.getTracks().forEach(t=>t.stop());setCameraOn(false);}}>Cancel</button>
            <button style={{...S.btnPrimary,fontSize:12}} onClick={takePhoto}>📸 Take</button>
          </div>
        </div>}
        <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFilePhoto}/>
      </div>

      <label style={S.label}>Username</label>
      <div style={{position:"relative",marginBottom:12}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:13}}>@</span>
        <input style={{...S.input,margin:0,paddingLeft:26}} placeholder="username" value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g,""))}/>
      </div>

      <label style={S.label}>Display Name</label>
      <input style={S.input} placeholder="Your name" value={displayName} onChange={e=>setDisplayName(e.target.value)}/>

      <label style={S.label}>Bio</label>
      <textarea style={{...S.input,height:80,resize:"none"}} placeholder="Tell people about yourself..." value={bio} onChange={e=>setBio(e.target.value)} maxLength={150}/>
      <div style={{color:C.muted,fontSize:11,textAlign:"right",marginTop:-8,marginBottom:12}}>{bio.length}/150</div>

      <button style={{...S.btnPrimary,width:"100%"}} onClick={saveProfile} disabled={saving}>
        {saving?"Saving...":"Save Profile"}
      </button>
    </div>}

    {/* TERMS OF SERVICE */}
    {view==="terms"&&<div style={{padding:"16px"}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px"}}>
        {[
          ["1. Acceptance","By using GarageIQ you agree to these terms. If you do not agree, please do not use the app."],
          ["2. User Accounts","You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities under your account."],
          ["3. Marketplace Rules","All vehicle listings must be accurate and truthful. Fraudulent listings will result in immediate account termination. GarageIQ is not responsible for transactions between users."],
          ["4. Mechanic Services","Mechanics are independent service providers. GarageIQ does not guarantee the quality of services. Users engage mechanics at their own risk."],
          ["5. Prohibited Content","Users may not post offensive, illegal, or misleading content. GarageIQ reserves the right to remove content and ban users at any time."],
          ["6. Privacy","We collect data to provide our services. See our Privacy Policy for full details on data collection and usage."],
          ["7. Payments","In-app purchases are processed by Apple/Google. GarageIQ is not responsible for payment disputes with third parties."],
          ["8. Limitation of Liability","GarageIQ is not liable for any damages arising from use of the app, including vehicle transactions, service quality, or data loss."],
          ["9. Changes","We may update these terms at any time. Continued use of the app constitutes acceptance of updated terms."],
          ["10. Contact","For questions about these terms contact us at legal@garageiq.com"],
        ].map(([title,text])=>(
          <div key={title} style={{marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:4,color:C.accent}}>{title}</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>{text}</div>
          </div>
        ))}
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:4,color:C.muted,fontSize:11,textAlign:"center"}}>
          Last updated: January 2025 · GarageIQ Inc.
        </div>
      </div>
    </div>}
  </div>);
}


function Community({user}){
  const [posts,setPosts]=useState(INIT_POSTS);const [newPost,setNewPost]=useState({text:"",tag:JOB_TAGS[0]});const [replyText,setReplyText]=useState({});const [showCompose,setShowCompose]=useState(false);const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?posts:posts.filter(p=>p.tag===filter);
  const submit=()=>{if(!newPost.text.trim())return;setPosts(p=>[{id:Date.now(),authorId:user.id,authorName:user.name,authorRole:user.role,time:"Just now",text:newPost.text,tag:newPost.tag,replies:[]},...p]);setNewPost({text:"",tag:JOB_TAGS[0]});setShowCompose(false);};
  const reply=(postId)=>{const txt=replyText[postId];if(!txt?.trim())return;setPosts(prev=>prev.map(p=>p.id===postId?{...p,replies:[...p.replies,{id:Date.now(),authorId:user.id,authorName:user.name,authorRole:user.role,text:txt.trim(),time:"Just now"}]}:p));setReplyText(p=>({...p,[postId]:""}));};
  const roleColor=(role)=>role==="mechanic"||role==="admin"?C.orange:C.blue;
  return(<div style={{padding:"20px 22px",maxWidth:720}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:11}}><div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2}}>Community Board</div><div style={{color:C.muted,fontSize:12}}>Post requests or offer services</div></div><button style={S.btnPrimary} onClick={()=>setShowCompose(true)}>+ Post</button></div>
    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>{["all",...JOB_TAGS].map(t=><button key={t} onClick={()=>setFilter(t)} style={{padding:"3px 9px",borderRadius:99,border:`1px solid ${filter===t?C.accent:C.border}`,background:filter===t?C.accentDim:"transparent",color:filter===t?C.accent:C.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}>{t==="all"?"All":t}</button>)}</div>
    {filtered.map(post=>(
      <div key={post.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,padding:"11px 13px",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}><div style={{fontSize:22}}>{INIT_USERS.find(u=>u.id===post.authorId)?.photo||"😎"}</div><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><span style={{fontWeight:600,fontSize:13}}>{post.authorName}</span><span style={{background:roleColor(post.authorRole)+"18",color:roleColor(post.authorRole),borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 6px"}}>{post.authorRole==="mechanic"||post.authorRole==="admin"?"MECHANIC":"CUSTOMER"}</span><span style={{background:C.accentDim,color:C.accent,borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 6px"}}>{post.tag}</span><span style={{color:C.muted,fontSize:11,marginLeft:"auto"}}>{post.time}</span></div><div style={{color:C.text,fontSize:13,marginTop:5,lineHeight:1.6}}>{post.text}</div></div></div>
        {post.replies.length>0&&<div style={{marginLeft:30,borderLeft:`2px solid ${C.border}`,paddingLeft:10,marginBottom:7}}>{post.replies.map(r=><div key={r.id} style={{marginBottom:6}}><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:12}}>{INIT_USERS.find(u=>u.id===r.authorId)?.photo||"😎"}</span><span style={{fontWeight:600,fontSize:12}}>{r.authorName}</span><span style={{color:C.muted,fontSize:10,marginLeft:"auto"}}>{r.time}</span></div><div style={{color:C.text,fontSize:12,marginTop:2,marginLeft:19}}>{r.text}</div></div>)}</div>}
        <div style={{display:"flex",gap:6,marginLeft:30}}><input style={{...S.input,margin:0,flex:1,fontSize:12,padding:"5px 8px"}} placeholder="Write a reply..." value={replyText[post.id]||""} onChange={e=>setReplyText(p=>({...p,[post.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&reply(post.id)}/><button style={{...S.btnPrimary,padding:"5px 10px",fontSize:12}} onClick={()=>reply(post.id)}>Reply</button></div>
      </div>
    ))}
    {showCompose&&<div style={S.overlay}><div style={{...S.modal,maxWidth:420}}><div style={S.modalHead}><span style={S.modalTitle}>New Post</span><button onClick={()=>setShowCompose(false)} style={S.iconBtn}>✕</button></div><div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>{JOB_TAGS.map(t=><button key={t} onClick={()=>setNewPost(p=>({...p,tag:t}))} style={{padding:"3px 9px",borderRadius:99,border:`1px solid ${newPost.tag===t?C.accent:C.border}`,background:newPost.tag===t?C.accentDim:"transparent",color:newPost.tag===t?C.accent:C.muted,fontSize:11,cursor:"pointer"}}>{t}</button>)}</div><textarea style={{...S.input,height:80,resize:"none"}} placeholder="Describe what you need or offer..." value={newPost.text} onChange={e=>setNewPost(p=>({...p,text:e.target.value}))}/><div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setShowCompose(false)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={submit} disabled={!newPost.text.trim()}>Post</button></div></div></div>}
  </div>);
}

function CustomerPortal({user,users,setUsers,vehicles,setVehicles,quotes,setQuotes,listings,setListings,onLogout,toggleTheme}){
  const myVehicles=vehicles.filter(v=>user.vehicleIds?.includes(v.id));const myQuotes=quotes.filter(q=>q.customerId===user.id);
  const totalPending=myVehicles.reduce((a,v)=>a+(v.pendingServices?.length||0),0);
  const [tab,setTab]=useState("garage");const [dmContact,setDmContact]=useState(null);const [showProfile,setShowProfile]=useState(false);const [carPhotoTarget,setCarPhotoTarget]=useState(null);
  const [selectedVehicle,setSelectedVehicle]=useState(null);
  const [showAddVehicle,setShowAddVehicle]=useState(false);
  const [garagePublic,setGaragePublic]=useState(false);
  const [newVehicleVin,setNewVehicleVin]=useState("");
  const [newVehicleData,setNewVehicleData]=useState({year:new Date().getFullYear(),make:"Toyota",model:"",mileage:""});
  const [userLocation,setUserLocation]=useState({lat:user.lat||25.7617,lng:user.lng||-80.1918,city:user.city||"Miami, FL"});
  const handleDM=(id)=>{setDmContact(id);setTab("messages");};
  const respondToQuote=(qid,status,counter)=>setQuotes(p=>p.map(q=>q.id===qid?{...q,status,counterOffer:counter||null}:q));
  const currentUser=users.find(u=>u.id===user.id)||user;
  // Location requested only when user clicks "Auto Detect" in LocationBar
  const acceptPendingService=(vehicleId,serviceId)=>{setVehicles(prev=>prev.map(v=>{if(v.id!==vehicleId)return v;const svc=v.pendingServices.find(s=>s.id===serviceId);if(!svc)return v;return{...v,services:[{...svc,status:"confirmed"},...v.services],pendingServices:v.pendingServices.filter(s=>s.id!==serviceId),lastVisit:svc.date,mileage:svc.mileage};}));};
  const declinePendingService=(vehicleId,serviceId)=>setVehicles(prev=>prev.map(v=>v.id===vehicleId?{...v,pendingServices:v.pendingServices.filter(s=>s.id!==serviceId)}:v));
  const saveCarPhoto=(vehicleId,photo)=>setVehicles(prev=>prev.map(v=>v.id===vehicleId?{...v,carPhoto:photo}:v));
  const pendingQuotes=myQuotes.filter(q=>q.status==="pending").length;
  const tabs=[{id:"garage",label:"Garage",icon:"🚗",badge:totalPending+pendingQuotes},{id:"marketplace",label:"Market",icon:"🏪"},{id:"find",label:"Mechanics",icon:"🔧"},{id:"board",label:"Community",icon:"💬"},{id:"messages",label:"Messages",icon:"✉️"},{id:"settings",label:"Settings",icon:"⚙️"}];
  return(<div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text}}>
    <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  body{overflow-x:hidden;}
`}</style>
        {/* Top Bar */}
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 14px",display:"flex",alignItems:"center",height:50,position:"sticky",top:0,zIndex:50}}>
      <div onClick={()=>{setTab("garage");setSelectedVehicle(null);setDmContact(null);}} style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,flexShrink:0,cursor:"pointer"}}><span style={{color:C.accent}}>G</span><span style={{color:C.text}}>ARAGEIQ</span></div>
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <button onClick={toggleTheme} style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:99,width:34,height:34,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} title="Toggle theme">
          {C.isDark?"☀️":"🌙"}
        </button>
        <button onClick={()=>setTab("settings")} style={{background:"none",border:"none",cursor:"pointer",width:32,height:32,borderRadius:99,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>{currentUser.profilePhoto?<img src={currentUser.profilePhoto} alt="P" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:22}}>{currentUser.photo||"😎"}</span>}</button>
        <button onClick={onLogout} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:11}}>out</button>
      </div>
    </div>
    {/* Bottom Nav */}
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>{setDmContact(null);setTab(t.id);setSelectedVehicle(null);}} style={{flex:1,paddingTop:12,paddingBottom:12,border:"none",background:"transparent",color:tab===t.id?C.accent:C.muted,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative",transition:"color 0.15s",minHeight:68}}>
          <span style={{fontSize:26}}>{t.icon}</span>
          <span style={{fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{t.label}</span>
          {t.badge>0&&<div style={{position:"absolute",top:6,right:"22%",background:C.red,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>{t.badge}</div>}
        </button>
      ))}
    </div>
    <div style={{height:70}}/>

    {(tab==="marketplace"||tab==="find")&&<LocationBar location={userLocation} onUpdate={setUserLocation}/>}
    {tab==="garage"&&!selectedVehicle&&<div style={{padding:"18px 16px",maxWidth:620,margin:"0 auto",animation:"fadeUp 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:13}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:1}}>My Garage</div>
          <div style={{color:C.muted,fontSize:12}}>Hey {user.name.split(" ")[0]}! ({myVehicles.length}/5 cars)</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {/* Public/Private toggle */}
          <button onClick={()=>setGaragePublic(p=>!p)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:99,border:`1px solid ${garagePublic?C.green:C.border}`,background:garagePublic?C.greenDim:"transparent",cursor:"pointer",fontSize:11,fontWeight:600,color:garagePublic?C.green:C.muted}}>
            {garagePublic?"🌐 Public":"🔒 Private"}
          </button>
          {myVehicles.length<5&&<button onClick={()=>setShowAddVehicle(true)} style={{width:36,height:36,borderRadius:99,background:C.accent,border:"none",color:"#000",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>}
        </div>
      </div>
      {garagePublic&&<div style={{background:C.greenDim,border:`1px solid ${C.green}30`,borderRadius:8,padding:"8px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:7}}>
        <span style={{fontSize:14}}>🌐</span>
        <div><div style={{color:C.green,fontSize:12,fontWeight:600}}>Garage is Public</div><div style={{color:C.muted,fontSize:11}}>Your cars and service history are visible to other users and appear on marketplace listings</div></div>
      </div>}

      {showAddVehicle&&<div style={{background:C.surface,border:`1px solid ${C.accent}30`,borderRadius:12,padding:"14px 14px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,letterSpacing:1,color:C.accent}}>ADD A CAR</div>
          <button onClick={()=>setShowAddVehicle(false)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <label style={S.label}>VIN (or enter details manually)</label>
        <input style={S.input} placeholder="Enter 17-char VIN to auto-lookup" value={newVehicleVin} onChange={e=>setNewVehicleVin(e.target.value.toUpperCase())} maxLength={17}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div><label style={S.label}>Year</label><input style={{...S.input,marginBottom:0}} type="number" value={newVehicleData.year} onChange={e=>setNewVehicleData(p=>({...p,year:e.target.value}))}/></div>
          <div><label style={S.label}>Make</label><select style={{...S.input,marginBottom:0}} value={newVehicleData.make} onChange={e=>setNewVehicleData(p=>({...p,make:e.target.value,model:""}))}>
            {CAR_MAKES.filter(m=>m!=="Any").map(m=><option key={m}>{m}</option>)}
          </select></div>
          <div><label style={S.label}>Model</label>
            {(CAR_MODELS[newVehicleData.make]||[]).length>0
              ?<select style={{...S.input,marginBottom:0}} value={newVehicleData.model} onChange={e=>setNewVehicleData(p=>({...p,model:e.target.value}))}><option value="">Select...</option>{(CAR_MODELS[newVehicleData.make]||[]).map(m=><option key={m}>{m}</option>)}</select>
              :<input style={{...S.input,marginBottom:0}} placeholder="Model" value={newVehicleData.model} onChange={e=>setNewVehicleData(p=>({...p,model:e.target.value}))}/>}
          </div>
          <div><label style={S.label}>Mileage</label><input style={{...S.input,marginBottom:0}} type="number" placeholder="e.g. 45000" value={newVehicleData.mileage} onChange={e=>setNewVehicleData(p=>({...p,mileage:e.target.value}))}/></div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button style={S.btnSecondary} onClick={()=>setShowAddVehicle(false)}>Cancel</button>
          <button style={{...S.btnPrimary,flex:1}} onClick={()=>{
            if(!newVehicleData.make||!newVehicleData.model)return;
            const nv={id:Date.now(),customerId:user.id,name:user.name,phone:"",
              vin:newVehicleVin||"MANUAL-"+Date.now(),
              vehicle:`${newVehicleData.year} ${newVehicleData.make} ${newVehicleData.model}`,
              year:Number(newVehicleData.year),make:newVehicleData.make,model:newVehicleData.model,
              mileage:Number(newVehicleData.mileage)||0,lastVisit:"—",carPhoto:null,forSale:false,
              services:[],alerts:[],pendingServices:[]};
            setVehicles(prev=>[...prev,nv]);
            setUsers(prev=>prev.map(u=>u.id===user.id?{...u,vehicleIds:[...(u.vehicleIds||[]),nv.id]}:u));
            setShowAddVehicle(false);setNewVehicleVin("");setNewVehicleData({year:new Date().getFullYear(),make:"Toyota",model:"",mileage:""});
          }}>Add to Garage</button>
        </div>
      </div>}

      {myVehicles.map(v=>{const hasPending=(v.pendingServices?.length||0)>0;return(
        <div key={v.id} style={{background:C.surface,border:`1px solid ${hasPending?C.orange+"44":v.forSale?C.green+"44":C.border}`,borderRadius:12,overflow:"hidden",marginBottom:14,cursor:"pointer"}} onClick={()=>setSelectedVehicle(v)}>
          <div style={{position:"relative",height:130,background:C.faint,overflow:"hidden"}}>
            {v.carPhoto
              ?<img src={v.carPhoto} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              :<div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
                <div style={{fontSize:38}}>🚗</div>
                <div style={{color:C.muted,fontSize:11}}>No photo yet</div>
              </div>
            }
            {/* Camera button — always visible, stops propagation so card click still works */}
            <button
              onClick={(e)=>{e.stopPropagation();setCarPhotoTarget(v);}}
              style={{position:"absolute",bottom:8,right:8,background:"#000000cc",border:"none",borderRadius:7,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:"#fff",fontSize:11,fontWeight:600}}>
              📷 {v.carPhoto?"Change Photo":"Add Photo"}
            </button>
            {v.forSale&&<div style={{position:"absolute",top:8,left:8,background:C.green,color:"#000",borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 8px"}}>FOR SALE</div>}
            {hasPending&&<div style={{position:"absolute",top:8,right:8,background:C.orange,color:"#000",borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 8px"}}>🔔 {v.pendingServices.length}</div>}
          </div>
          <div style={{padding:"10px 13px"}}>
            <div style={{fontWeight:700,fontSize:14}}>{v.vehicle}</div>
            <div style={{color:C.muted,fontSize:11,display:"flex",justifyContent:"space-between",marginTop:3}}>
              <span>{v.mileage.toLocaleString()} mi</span>
              <span>Last visit: {v.lastVisit}</span>
            </div>
            {v.alerts.length>0&&<div style={{color:C.red,fontSize:11,marginTop:4}}>⚠ {v.alerts.length} alert{v.alerts.length!==1?"s":""}</div>}
          </div>
        </div>
      );})}
      {/* Quotes notification inside garage */}
      {pendingQuotes>0&&<div style={{background:C.surface,border:`2px solid ${C.purple}44`,borderRadius:12,padding:"14px 16px",marginBottom:14,cursor:"pointer"}} onClick={()=>setTab("quotes")}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:99,background:C.purpleDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📋</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14}}>You have {pendingQuotes} pending quote{pendingQuotes!==1?"s":""}</div>
            <div style={{color:C.muted,fontSize:12,marginTop:2}}>Tap to review and accept or decline</div>
          </div>
          <span style={{color:C.purple,fontSize:18}}>→</span>
        </div>
      </div>}
      {myVehicles.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:C.muted}}><div style={{fontSize:48,marginBottom:12}}>🚗</div><div style={{fontSize:14,marginBottom:6}}>No cars yet</div><div style={{fontSize:12}}>Tap + to add your first car</div></div>}
    </div>}

    {tab==="garage"&&selectedVehicle&&<VehicleDetailPage
      vehicle={selectedVehicle}
      user={currentUser}
      users={users}
      vehicles={vehicles}
      setVehicles={setVehicles}
      listings={listings}
      setListings={setListings}
      userLocation={userLocation}
      onBack={()=>setSelectedVehicle(null)}
      onDMSeller={handleDM}
    />}
    {tab==="quotes"&&<div style={{padding:"18px 16px",maxWidth:620,margin:"0 auto",animation:"fadeUp 0.3s ease"}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:13}}><button onClick={()=>setTab("garage")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:20}}>←</button><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2}}>My Quotes</div></div>{myQuotes.length===0&&<div style={{color:C.muted,fontSize:13}}>No quotes yet.</div>}{myQuotes.map(q=><QuoteCard key={q.id} quote={q} isCustomer={true} onRespond={respondToQuote}/>)}</div>}
    {tab==="marketplace"&&<Marketplace user={currentUser} users={users} listings={listings} setListings={setListings} onDM={handleDM} userLocation={userLocation}/>}
    {tab==="find"&&<FindMechanic user={currentUser} users={users} onDM={handleDM} userLocation={userLocation}/>}
    {tab==="board"&&<Community user={currentUser}/>}
    {tab==="messages"&&<Messages user={user} vehicles={vehicles} users={users} initContact={dmContact} toggleTheme={toggleTheme}/>}
    {tab==="settings"&&<SettingsPage user={currentUser} users={users} setUsers={setUsers} onLogout={onLogout} toggleTheme={toggleTheme} onClose={()=>setTab("garage")}/>}
    {carPhotoTarget&&<CarPhotoPicker current={carPhotoTarget.carPhoto} onSave={(photo)=>saveCarPhoto(carPhotoTarget.id,photo)} onClose={()=>setCarPhotoTarget(null)}/>}
    {showProfile&&<ProfilePage user={currentUser} users={users} setUsers={setUsers} onClose={()=>setShowProfile(false)}/>}
    {showSettings&&<SettingsPage user={currentUser} users={users} setUsers={setUsers} onLogout={()=>setUser(null)} toggleTheme={toggleTheme} onClose={()=>setShowSettings(false)}/>}
  </div>);
}
function GarageIQApp({theme,toggleTheme}){
  // Update global C with current theme
  Object.assign(C, theme);
  const [users,setUsers]=useState(INIT_USERS);const [user,setUser]=useState(null);
  const [vehicles,setVehicles]=useState(INIT_VEHICLES);const [quotes,setQuotes]=useState(INIT_QUOTES);
  const [listings,setListings]=useState(INIT_LISTINGS);
  const [nav,setNav]=useState("dashboard");const [selected,setSelected]=useState(null);const [modal,setModal]=useState(null);
  const [shareTarget,setShareTarget]=useState(null);const [newSvc,setNewSvc]=useState({type:SERVICE_TYPES[0],date:new Date().toISOString().split("T")[0],mileage:"",notes:""});
  const [alertSent,setAlertSent]=useState([]);const [search,setSearch]=useState("");const [showProfile,setShowProfile]=useState(false);
  const [quoteTarget,setQuoteTarget]=useState(null);const [completedTarget,setCompletedTarget]=useState(null);
  const [userLocation,setUserLocation]=useState({lat:25.7617,lng:-80.1918,city:"Miami, FL"});
  // Location requested only when user clicks "Auto Detect" in LocationBar

  if(!user){
    const LoginScreen=()=>{
      const [email,setEmail]=useState("");const [pass,setPass]=useState("");const [err,setErr]=useState("");const [tab,setTab]=useState("mechanic");
      const handle=()=>{const u=users.find(u=>u.email===email&&u.password===pass);if(!u){setErr("Invalid credentials.");return;}setUser(u);};
      const allHints=[{label:"Mechanic",e:"jake@garageiq.com",p:"mechanic123"},{label:"Admin",e:"admin@garageiq.com",p:"admin123"},{label:"Customer",e:"marcus@email.com",p:"customer123"},{label:"Dealer",e:"miami@autodealer.com",p:"dealer123"}];
      return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{width:"100%",maxWidth:400,animation:"fadeUp 0.4s ease"}}>
          <div style={{textAlign:"center",marginBottom:26}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,lineHeight:1}}><span style={{color:C.accent}}>G</span><span style={{color:C.text}}>ARAGEIQ</span></div><div style={{color:C.muted,fontSize:13,marginTop:3}}>Shop Management & Marketplace</div></div>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:24}}>
            <div style={{textAlign:"center",marginBottom:16,color:C.muted,fontSize:13}}>Sign in to your account</div>
            <label style={S.label}>Email</label><input style={S.input} type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
            <label style={S.label}>Password</label><input style={S.input} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
            {err&&<div style={{color:C.red,fontSize:12,marginBottom:10}}>{err}</div>}
            <button style={{...S.btnPrimary,width:"100%"}} onClick={handle}>Sign In →</button>
          </div>
          <div style={{marginTop:10,background:C.faint,borderRadius:10,padding:"10px 14px"}}><div style={{color:C.muted,fontSize:11,marginBottom:5,textTransform:"uppercase",letterSpacing:1}}>Demo Accounts</div>{hints[tab].map(h=><button key={h.e} onClick={()=>{setEmail(h.e);setPass(h.p);setErr("");}} style={{display:"block",width:"100%",background:"none",border:"none",textAlign:"left",color:C.accent,fontSize:12,cursor:"pointer",padding:"2px 0"}}>{h.label}: {h.e} / {h.p}</button>)}</div>
        </div>
      </div>;
    };
    return <LoginScreen/>;
  }

  const currentUser=users.find(u=>u.id===user.id)||user;
  if(currentUser.role==="customer"||currentUser.role==="dealership") return <CustomerPortal user={currentUser} users={users} setUsers={setUsers} vehicles={vehicles} setVehicles={setVehicles} quotes={quotes} setQuotes={setQuotes} listings={listings} setListings={setListings} onLogout={()=>setUser(null)} toggleTheme={toggleTheme}/>;

  const totalAlerts=vehicles.reduce((a,v)=>a+v.alerts.length,0);
  const criticals=vehicles.filter(v=>v.alerts.some(a=>a.level==="critical"));
  const myQuotes=quotes.filter(q=>q.mechanicId===user.id);
  const filteredV=vehicles.filter(v=>v.name.toLowerCase().includes(search.toLowerCase())||v.vehicle.toLowerCase().includes(search.toLowerCase())||v.vin.toLowerCase().includes(search.toLowerCase()));
  const addVehicle=({name,phone,vin,vehicle})=>{setVehicles(p=>[{id:Date.now(),customerId:null,name,phone,vin,vehicle,mileage:0,lastVisit:"—",carPhoto:null,services:[],alerts:[{text:"Schedule first service",level:"info"}],pendingServices:[]},...p]);};
  const logService=()=>{if(!selected||!newSvc.mileage)return;const svc={...newSvc,mileage:Number(newSvc.mileage),status:"confirmed"};setVehicles(p=>p.map(v=>v.id===selected.id?{...v,services:[svc,...v.services],lastVisit:svc.date,mileage:svc.mileage}:v));setSelected(p=>({...p,services:[svc,...p.services]}));setModal(null);};
  const sendQuote=(q)=>setQuotes(p=>[{id:Date.now(),mechanicId:user.id,...q},...p]);
  const sendCompletedService=(vehicleId,service)=>{setVehicles(p=>p.map(v=>v.id===vehicleId?{...v,pendingServices:[...(v.pendingServices||[]),service]}:v));if(selected?.id===vehicleId)setSelected(p=>({...p,pendingServices:[...(p.pendingServices||[]),service]}));};

  const myWorkerJobs=INIT_JOBS.filter(j=>j.assignedTo===INIT_WORKERS.find(w=>w.userId===user.id)?.id&&(j.status==="To-do"||j.status==="In Progress"||j.status==="Waiting on Parts"));
  const isMechOnline=currentUser.isOnline||false;
  const navItems=[
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"customers",icon:"👥",label:"Customers"},
    {id:"shop",icon:"🏗",label:"Shop Jobs",badge:myWorkerJobs.length},
    {id:"quotes",icon:"📋",label:"Quotes",badge:myQuotes.filter(q=>q.status==="countered").length},
    {id:"marketplace",icon:"🏪",label:"Marketplace"},
    {id:"alerts",icon:"⚠️",label:"Alerts",badge:totalAlerts},
    {id:"board",icon:"💬",label:"Community"},
    {id:"messages",icon:"✉️",label:"Messages"},
  ];

  return(<div style={{display:"flex",height:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text,overflow:"hidden"}}>
    <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .sidebar{display:flex!important;}
  .mobile-bottom-nav{display:none!important;}
  .main-content{margin-bottom:0!important;}
  .mobile-top-bar{display:none!important;}
  @media(max-width:768px){
    .sidebar{display:none!important;}
    .mobile-bottom-nav{display:flex!important;}
    .mobile-top-bar{display:flex!important;}
    .main-content{margin-bottom:70px!important;}
  }
`}</style>

    <div className="sidebar" style={{width:186,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"14px 0",flexShrink:0}}>
      <div style={{padding:"12px 12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:2}}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.accent,lineHeight:1}}>G</span><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:3}}>ARAGEIQ</span></div>
        <div onClick={()=>{setUsers(prev=>prev.map(u=>u.id===currentUser.id?{...u,isOnline:!u.isOnline}:u));}} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",padding:"3px 7px",borderRadius:99,background:isMechOnline?C.greenDim:C.faint,border:`1px solid ${isMechOnline?C.green:C.border}`}} title={isMechOnline?"Go Offline":"Go Online"}>
          <div style={{width:8,height:8,borderRadius:99,background:isMechOnline?C.green:C.muted}}/>
          <span style={{fontSize:9,fontWeight:700,color:isMechOnline?C.green:C.muted}}>{isMechOnline?"ONLINE":"OFFLINE"}</span>
        </div>
      </div>
      <nav style={{flex:1,padding:"0 7px",display:"flex",flexDirection:"column",gap:1}}>
        {navItems.map(item=><button key={item.id} onClick={()=>{setNav(item.id);setSelected(null);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 9px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,background:nav===item.id?C.accentDim:"transparent",color:nav===item.id?C.accent:C.muted,borderLeft:`2px solid ${nav===item.id?C.accent:"transparent"}`,fontWeight:nav===item.id?600:400,transition:"all 0.15s",textAlign:"left"}}>
          <span style={{fontSize:12,width:15,textAlign:"center"}}>{item.icon}</span>
          <span style={{flex:1}}>{item.label}</span>
          {item.badge>0&&<Badge count={item.badge}/>}
        </button>)}
      </nav>
      <div style={{padding:"10px 9px",borderTop:`1px solid ${C.border}`}}>
        <button onClick={()=>setModal("vin")} style={{width:"100%",background:C.accentDim,border:`1px solid ${C.accent}30`,borderRadius:7,color:C.accent,padding:"6px 0",cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:9}}>+ SCAN VIN</button>
        <button onClick={()=>setShowSettings(true)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",width:"100%",padding:0}}>
          <div style={{width:26,height:26,borderRadius:99,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{currentUser.profilePhoto?<img src={currentUser.profilePhoto} alt="P" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:22}}>{currentUser.photo||"🧑‍🔧"}</span>}</div>
          <div style={{minWidth:0,textAlign:"left"}}><div style={{fontSize:11,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{currentUser.name}</div><div style={{fontSize:9,color:C.muted,textTransform:"capitalize"}}>{currentUser.role}</div></div>
          <button onClick={(e)=>{e.stopPropagation();setUser(null);}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:9,marginLeft:"auto"}}>out</button>
        </button>
        <button onClick={toggleTheme} style={{width:"100%",background:C.faint,border:`1px solid ${C.border}`,borderRadius:7,color:C.text,padding:"5px 0",cursor:"pointer",fontSize:10,marginTop:7,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
          {C.isDark?"☀️ Light":"🌙 Dark"}
        </button>
        <button onClick={()=>setShowSettings(true)} style={{width:"100%",background:C.accentDim,border:`1px solid ${C.accent}30`,borderRadius:7,color:C.accent,padding:"6px 0",cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:1,marginTop:5}}>⚙ SETTINGS</button>
      </div>
    </div>

    <div className="main-content" style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column"}}>
      {(nav==="marketplace"||nav==="find")&&<LocationBar location={userLocation} onUpdate={setUserLocation}/>}
      <div style={{flex:1,overflow:"auto"}}>

        {nav==="dashboard"&&<div style={{padding:"20px 24px",maxWidth:740,animation:"fadeUp 0.25s ease"}}>
          <div style={{marginBottom:16}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>Dashboard</div><div style={{color:C.muted,fontSize:12}}>Welcome back, {currentUser.name.split(" ")[0]}</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:20}}>
            {[{label:"Customers",val:vehicles.length,col:C.accent},{label:"Alerts",val:totalAlerts,col:C.red},{label:"Critical",val:criticals.length,col:C.orange},{label:"Quotes",val:myQuotes.length,col:C.purple}].map((s,i)=>(
              <div key={i} style={{background:C.surface,borderRadius:9,padding:"12px 10px",borderTop:`3px solid ${s.col}`,border:`1px solid ${C.border}`,borderTopColor:s.col}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:s.col,lineHeight:1}}>{s.val}</div>
                <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginTop:2}}>{s.label}</div>
              </div>
            ))}
          </div>
          {criticals.length>0&&<><div style={S.sectionTitle}>⚠ Needs Attention</div>{criticals.map(v=><div key={v.id} style={{background:C.surface,border:`1px solid ${C.red}22`,borderLeft:`3px solid ${C.red}`,borderRadius:9,padding:"9px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <div><div style={{fontWeight:600,fontSize:13}}>{v.name} <span style={{color:C.muted,fontWeight:400}}>· {v.vehicle}</span></div>{v.alerts.filter(a=>a.level==="critical").map((a,i)=><div key={i} style={{color:C.red,fontSize:11,marginTop:2}}>● {a.text}</div>)}</div>
            <button style={S.btnPrimary} onClick={()=>{setSelected(v);setModal("alert");}}>Alert</button>
          </div>)}</>}
          <div style={S.sectionTitle}>Recent Customers</div>
          {vehicles.slice(0,4).map(v=><div key={v.id} style={{...S.row,cursor:"pointer"}} onClick={()=>{setSelected(v);setNav("detail");}}>
            {v.carPhoto?<img src={v.carPhoto} alt="Car" style={{width:34,height:24,objectFit:"cover",borderRadius:5,flexShrink:0}}/>:<Av name={v.name} size={30}/>}
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{v.name}</div><div style={{color:C.muted,fontSize:11}}>{v.vehicle} · {v.lastVisit}</div></div>
            <span style={{color:v.alerts.length>0?C.red:C.muted,fontSize:11}}>{v.alerts.length} alerts</span>
          </div>)}
        </div>}

        {nav==="customers"&&<div style={{padding:"20px 24px",maxWidth:740,animation:"fadeUp 0.25s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:13}}>
            <div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>Customers</div><div style={{color:C.muted,fontSize:12}}>{vehicles.length} vehicles</div></div>
            <button style={S.btnPrimary} onClick={()=>setModal("vin")}>+ Scan VIN</button>
          </div>
          <input style={{...S.input,marginBottom:11}} placeholder="Search name, vehicle, VIN…" value={search} onChange={e=>setSearch(e.target.value)}/>
          {filteredV.map(v=><div key={v.id} style={{...S.row,cursor:"pointer"}} onClick={()=>{setSelected(v);setNav("detail");}}>
            {v.carPhoto?<img src={v.carPhoto} alt="Car" style={{width:42,height:30,objectFit:"cover",borderRadius:6,flexShrink:0}}/>:<Av name={v.name} size={32}/>}
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{v.name}</div><div style={{color:C.muted,fontSize:11}}>{v.vehicle} · {v.mileage.toLocaleString()} mi</div></div>
            <span style={{background:v.alerts.length?C.red+"18":C.faint,color:v.alerts.length?C.red:C.muted,borderRadius:99,padding:"2px 8px",fontSize:11,fontWeight:700}}>{v.alerts.length} alerts</span>
          </div>)}
        </div>}

        {nav==="quotes"&&<div style={{padding:"20px 24px",maxWidth:740,animation:"fadeUp 0.25s ease"}}>
          <div style={{marginBottom:13}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>Quotes</div><div style={{color:C.muted,fontSize:12}}>{myQuotes.length} sent</div></div>
          {myQuotes.length===0&&<div style={{color:C.muted,fontSize:13}}>No quotes sent yet. Open a customer and tap Quote.</div>}
          {myQuotes.map(q=>{const v=vehicles.find(vv=>vv.id===q.vehicleId);return <QuoteCard key={q.id} quote={{...q,name:v?.name}} isCustomer={false} onRespond={()=>{}}/>;}) }
        </div>}

        {nav==="marketplace"&&<Marketplace user={currentUser} users={users} listings={listings} setListings={setListings} onDM={()=>setNav("messages")} userLocation={userLocation}/>}

        {nav==="alerts"&&<div style={{padding:"20px 24px",maxWidth:740,animation:"fadeUp 0.25s ease"}}>
          <div style={{marginBottom:13}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>Alerts</div><div style={{color:C.muted,fontSize:12}}>{totalAlerts} active</div></div>
          {vehicles.filter(v=>v.alerts.length>0).map(v=><div key={v.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}><Av name={v.name} size={28}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{v.name}</div><div style={{color:C.muted,fontSize:11}}>{v.vehicle}</div></div><button style={S.btnPrimary} onClick={()=>{setSelected(v);setModal("alert");}}>Send Texts</button></div>
            {v.alerts.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 7px",borderRadius:5,background:LEVEL_COLOR[a.level]+"0D",marginBottom:3,border:`1px solid ${LEVEL_COLOR[a.level]}22`}}><span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span><span style={{fontSize:11,flex:1}}>{a.text}</span><Pill level={a.level}/></div>)}
          </div>)}
        </div>}

        {nav==="shop"&&<ShopManagement user={currentUser} users={users} vehicles={vehicles}/>}
        {nav==="board"&&<Community user={currentUser}/>}
        {nav==="messages"&&<Messages user={user} vehicles={vehicles} users={users} toggleTheme={toggleTheme}/>}
        {nav==="find"&&<FindMechanic user={currentUser} users={users} onDM={()=>setNav("messages")} userLocation={userLocation}/>}

        {nav==="detail"&&selected&&<div style={{padding:"20px 24px",maxWidth:740,animation:"fadeUp 0.25s ease"}}>
          <button onClick={()=>setNav("customers")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12,marginBottom:12,padding:0}}>← Back</button>
          {selected.carPhoto&&<div style={{height:145,borderRadius:10,overflow:"hidden",marginBottom:12}}><img src={selected.carPhoto} alt="Car" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>}
          <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:14,flexWrap:"wrap"}}>
            <Av name={selected.name} size={42}/>
            <div style={{flex:1}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:21,letterSpacing:1}}>{selected.name}</div><div style={{color:C.muted,fontSize:12}}>{selected.vehicle} · {selected.phone}</div><div style={{color:C.muted,fontSize:10,fontFamily:"monospace"}}>{selected.vin}</div></div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              <button style={{...S.btnSecondary,fontSize:11,padding:"5px 9px"}} onClick={()=>{setShareTarget(selected);setModal("share");}}>🔗</button>
              <button style={{...S.btnSecondary,fontSize:11,padding:"5px 9px"}} onClick={()=>setModal("alert")}>📱</button>
              <button style={{...S.btnSecondary,fontSize:11,padding:"5px 9px",borderColor:C.purple+"40",color:C.purple}} onClick={()=>{setQuoteTarget(selected);setModal("quote");}}>📋 Quote</button>
              <button style={{...S.btnSecondary,fontSize:11,padding:"5px 9px",borderColor:C.green+"40",color:C.green}} onClick={()=>setCompletedTarget(selected)}>✓ Done</button>
              <button style={{...S.btnPrimary,fontSize:11,padding:"5px 9px"}} onClick={()=>setModal("service")}>+ Service</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            <div style={S.card}><div style={S.cardTitle}>Vehicle Info</div>{[["Mileage",selected.mileage.toLocaleString()+" mi"],["Last Visit",selected.lastVisit]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:C.muted,fontSize:11}}>{l}</span><span style={{fontSize:12}}>{v}</span></div>)}</div>
            <div style={S.card}><div style={S.cardTitle}>Alerts</div>{selected.alerts.length===0&&<div style={{color:C.muted,fontSize:11}}>No alerts</div>}{selected.alerts.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}><span style={{color:LEVEL_COLOR[a.level],fontSize:10}}>●</span><span style={{fontSize:11}}>{a.text}</span></div>)}</div>
          </div>
          {(selected.pendingServices?.length||0)>0&&<><div style={S.sectionTitle}>⏳ Awaiting Customer Approval</div>{selected.pendingServices.map(svc=><div key={svc.id} style={{background:C.surface,border:`1px solid ${C.orange}33`,borderRadius:7,padding:"8px 11px",marginBottom:5,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600,fontSize:12}}>{svc.type}</div><div style={{color:C.muted,fontSize:11}}>{svc.date}</div></div><span style={{background:C.orangeDim,color:C.orange,borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 7px"}}>PENDING</span></div>)}</>}
          <div style={S.sectionTitle}>Service History</div>
          {selected.services.length===0&&<div style={{color:C.muted,fontSize:12}}>No services yet.</div>}
          {selected.services.map((s,i)=><div key={i} style={{...S.row,cursor:"default"}}>
            <div style={{width:24,height:24,borderRadius:5,background:C.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🔧</div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12}}>{s.type}</div><div style={{color:C.muted,fontSize:11}}>{s.date} · {Number(s.mileage).toLocaleString()} mi{s.notes?" · "+s.notes:""}</div></div>
            <span style={{background:C.greenDim,color:C.green,borderRadius:99,fontSize:9,fontWeight:700,padding:"1px 5px"}}>✓</span>
          </div>)}
        </div>}
      </div>
    </div>

    {/* Mobile Bottom Nav - 5 items max */}
    <div className="mobile-bottom-nav" style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,borderTop:`1px solid ${C.border}`,display:"none",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"}}>
      {[
        {id:"dashboard",icon:"🏠",label:"Home"},
        {id:"customers",icon:"👥",label:"Customers"},
        {id:"shop",icon:"🏗",label:"Jobs",badge:myWorkerJobs.length},
        {id:"marketplace",icon:"🏪",label:"Market"},
        {id:"messages",icon:"✉️",label:"Messages",badge:0},
      ].map(item=>(
        <button key={item.id} onClick={()=>{setNav(item.id);setSelected(null);}} style={{flex:1,paddingTop:12,paddingBottom:12,border:"none",background:"transparent",color:nav===item.id?C.accent:C.muted,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative",transition:"color 0.15s",minHeight:68}}>
          <span style={{fontSize:26}}>{item.icon}</span>
          <span style={{fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{item.label}</span>
          {item.badge>0&&<div style={{position:"absolute",top:6,right:"22%",background:C.red,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>{item.badge}</div>}
        </button>
      ))}
    </div>

    {modal==="vin"&&<VINModal onClose={()=>setModal(null)} onAdd={addVehicle}/>}
    {modal==="quote"&&quoteTarget&&<QuoteBuilder mechanic={currentUser} vehicle={quoteTarget} onClose={()=>{setModal(null);setQuoteTarget(null);}} onSend={sendQuote}/>}
    {completedTarget&&<LogCompletedService mechanic={currentUser} vehicle={completedTarget} onClose={()=>setCompletedTarget(null)} onSend={sendCompletedService}/>}
    {showProfile&&<ProfilePage user={currentUser} users={users} setUsers={setUsers} onClose={()=>setShowProfile(false)}/>}
    {showSettings&&<SettingsPage user={currentUser} users={users} setUsers={setUsers} onLogout={()=>setUser(null)} toggleTheme={toggleTheme} onClose={()=>setShowSettings(false)}/>}

    {modal==="share"&&shareTarget&&<div style={S.overlay}><div style={{...S.modal,maxWidth:340}}>
      <div style={S.modalHead}><span style={S.modalTitle}>Share Profile</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
      <div style={{background:C.faint,borderRadius:7,padding:"8px 10px",marginBottom:10}}><div style={{fontWeight:600,fontSize:13}}>{shareTarget.vehicle}</div><div style={{color:C.muted,fontSize:11,marginTop:1}}>{shareTarget.name} · {shareTarget.phone}</div></div>
      <div style={{color:C.muted,fontSize:12,marginBottom:10}}>Sends the customer a secure link to view their full service history.</div>
      <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setModal(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={()=>setModal(null)}>📱 Send to Customer</button></div>
    </div></div>}

    {modal==="service"&&selected&&<div style={S.overlay}><div style={{...S.modal,maxWidth:370}}>
      <div style={S.modalHead}><span style={S.modalTitle}>Log Service</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
      <div style={{color:C.muted,fontSize:11,marginBottom:10}}>{selected.vehicle} · {selected.name}</div>
      <label style={S.label}>Service Type</label><select style={S.input} value={newSvc.type} onChange={e=>setNewSvc(p=>({...p,type:e.target.value}))}>{SERVICE_TYPES.map(t=><option key={t}>{t}</option>)}</select>
      <label style={S.label}>Date</label><input style={S.input} type="date" value={newSvc.date} onChange={e=>setNewSvc(p=>({...p,date:e.target.value}))}/>
      <label style={S.label}>Mileage</label><input style={S.input} type="number" value={newSvc.mileage} onChange={e=>setNewSvc(p=>({...p,mileage:e.target.value}))}/>
      <label style={S.label}>Notes</label><textarea style={{...S.input,height:46,resize:"none"}} value={newSvc.notes} onChange={e=>setNewSvc(p=>({...p,notes:e.target.value}))}/>
      <div style={{display:"flex",gap:8}}><button style={S.btnSecondary} onClick={()=>setModal(null)}>Cancel</button><button style={{...S.btnPrimary,flex:1}} onClick={logService}>Save</button></div>
    </div></div>}

    {modal==="alert"&&selected&&<div style={S.overlay}><div style={{...S.modal,maxWidth:350}}>
      <div style={S.modalHead}><span style={S.modalTitle}>Send Alert</span><button onClick={()=>setModal(null)} style={S.iconBtn}>✕</button></div>
      <div style={{color:C.muted,fontSize:11,marginBottom:10}}>📱 {selected.phone} · {selected.vehicle}</div>
      {selected.alerts.map((a,i)=>{const sent=alertSent.includes(selected.id+i);return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:LEVEL_COLOR[a.level]+"10",border:`1px solid ${LEVEL_COLOR[a.level]}28`,borderRadius:7,padding:"8px 10px",marginBottom:5,gap:7}}>
        <div><Pill level={a.level}/><div style={{fontSize:12,marginTop:2}}>{a.text}</div>{sent&&<div style={{color:C.blue,fontSize:10,marginTop:2}}>✓ Sent</div>}</div>
        <button style={sent?{...S.btnSecondary,opacity:0.5}:S.btnPrimary} disabled={sent} onClick={()=>setAlertSent(p=>[...p,selected.id+i])}>{sent?"Sent":"Send"}</button>
      </div>;})}
      <button style={{...S.btnSecondary,marginTop:5}} onClick={()=>setModal(null)}>Close</button>
    </div></div>}
  </div>);
}

const S={
  label:{display:"block",color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:1,marginBottom:5},
  input:{width:"100%",background:"#0A0A0C",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,marginBottom:12,outline:"none",fontFamily:"inherit"},
  btnPrimary:{background:C.accent,color:"#000",border:"none",borderRadius:8,padding:"9px 18px",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0},
  btnSecondary:{background:C.faint,color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:13,flexShrink:0},
  sectionTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,letterSpacing:2,color:C.accent,marginBottom:8,marginTop:4},
  row:{display:"flex",alignItems:"center",gap:10,background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 11px",marginBottom:6},
  card:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 12px"},
  cardTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:1.5,color:C.accent,marginBottom:8},
  overlay:{position:"fixed",inset:0,background:"#00000099",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20},
  modal:{background:"#141417",border:`1px solid ${C.border}`,borderRadius:14,padding:22,width:"100%",maxHeight:"90vh",overflow:"auto",animation:"fadeUp 0.2s ease"},
  modalHead:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14},
  modalTitle:{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:1,color:C.accent},
  iconBtn:{background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer"},
};

// ── THEME WRAPPER ─────────────────────────────────────────────────────────────
export default function GarageIQ(){
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark,setIsDark]=useState(prefersDark);
  const theme=isDark?DARK_THEME:LIGHT_THEME;
  // Keep C in sync
  Object.assign(C,theme);
  const toggleTheme=()=>{setIsDark(p=>!p);};
  return <GarageIQApp theme={theme} toggleTheme={toggleTheme}/>;
}
