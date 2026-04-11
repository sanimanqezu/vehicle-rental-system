import { Car, User, Reservation } from "@/types";

export const MOCK_CARS: Car[] = [
  { vin: "WBAJB0C51BC613693", make: "BMW",           model: "3 Series",        year: 2022, color: "Black",          engine: "2.0L TwinPower Turbo",    transmission: "Automatic", fuelType: "PETROL",   mileage: 28400, price: 8500,  ownerId: 1, features: ["Sunroof", "Leather Seats", "Navigation", "Parking Sensors"] },
  { vin: "WBAKJ8C54JE937201", make: "BMW",           model: "5 Series",        year: 2023, color: "Alpine White",   engine: "3.0L TwinPower Turbo",    transmission: "Automatic", fuelType: "PETROL",   mileage: 14200, price: 12800, ownerId: 1, features: ["Driving Assistant Pro", "Harman Kardon", "Head-Up Display"] },
  { vin: "JTDBU4EE8AJ058329", make: "Toyota",        model: "Camry",           year: 2023, color: "White",          engine: "2.5L Dynamic Force",      transmission: "Automatic", fuelType: "HYBRID",   mileage: 11200, price: 6800,  ownerId: 1, features: ["Adaptive Cruise Control", "Lane Assist", "Apple CarPlay"] },
  { vin: "JTMRFREV8JD213580", make: "Toyota",        model: "RAV4",            year: 2022, color: "Magnetic Grey",  engine: "2.5L Hybrid",             transmission: "Automatic", fuelType: "HYBRID",   mileage: 31800, price: 7400,  ownerId: 1, features: ["Toyota Safety Sense", "Panoramic View Monitor", "JBL Audio"] },
  { vin: "NMTKHMBX0NR147291", make: "Toyota",        model: "Fortuner",        year: 2023, color: "Pearl White",    engine: "2.8L GD-6 Turbo Diesel",  transmission: "Automatic", fuelType: "DIESEL",   mileage: 8600,  price: 9100,  ownerId: 1, features: ["4WD Lock", "Terrain Select", "Downhill Assist"] },
  { vin: "1FAFP34P83W181823", make: "Ford",          model: "Mustang",         year: 2021, color: "Race Red",       engine: "5.0L V8 Coyote",          transmission: "Manual",    fuelType: "PETROL",   mileage: 44700, price: 9200,  ownerId: 1, features: ["Brembo Brakes", "Launch Control", "Premium Sound"] },
  { vin: "1FMJK1MT0MEA30412", make: "Ford",          model: "Explorer",        year: 2022, color: "Rapid Red",      engine: "3.0L EcoBoost V6",        transmission: "Automatic", fuelType: "PETROL",   mileage: 26900, price: 8100,  ownerId: 1, features: ["Ford Co-Pilot360", "B&O Sound", "Hands-Free Liftgate"] },
  { vin: "WVWZZZ3CZPE204978", make: "Volkswagen",    model: "Golf GTI",        year: 2022, color: "Silver",         engine: "2.0L TSI",                transmission: "Automatic", fuelType: "PETROL",   mileage: 33900, price: 5900,  ownerId: 1, features: ["Virtual Cockpit", "Heated Seats", "Wireless Charging"] },
  { vin: "WV2ZZZ7HZNH051834", make: "Volkswagen",    model: "Tiguan",          year: 2023, color: "Deep Black",     engine: "2.0L TDI",                transmission: "Automatic", fuelType: "DIESEL",   mileage: 12400, price: 6600,  ownerId: 1, features: ["IQ.DRIVE", "Area View", "Discover Pro Navigation"] },
  { vin: "KMHDU4AD1AU135710", make: "Hyundai",       model: "Tucson",          year: 2023, color: "Blue",           engine: "1.6L T-GDi",              transmission: "Automatic", fuelType: "PETROL",   mileage: 9800,  price: 5200,  ownerId: 1, features: ["360° Camera", "Blind Spot Monitor", "Wireless Android Auto"] },
  { vin: "5NPE34AF4FH054028", make: "Hyundai",       model: "Sonata",          year: 2020, color: "Charcoal",       engine: "2.0L MPI",                transmission: "Automatic", fuelType: "PETROL",   mileage: 72100, price: 4100,  ownerId: 1, features: ["Sunroof", "Rear Camera", "Smart Parking Assist"] },
  { vin: "WDD2050421F425890", make: "Mercedes-Benz", model: "C200",            year: 2022, color: "Graphite",       engine: "1.5L EQ Boost",           transmission: "Automatic", fuelType: "PETROL",   mileage: 21600, price: 10500, ownerId: 1, features: ["MBUX Infotainment", "Burmester Sound", "Driver Assist"] },
  { vin: "WDD2131861A312045", make: "Mercedes-Benz", model: "E220d",           year: 2022, color: "Obsidian Black", engine: "2.0L OM654 Diesel",       transmission: "Automatic", fuelType: "DIESEL",   mileage: 34500, price: 13200, ownerId: 1, features: ["Air Body Control", "Widescreen Cockpit", "DISTRONIC"] },
  { vin: "WAUZZZ4G1FN019428", make: "Audi",          model: "A4",              year: 2021, color: "White",          engine: "2.0L TFSI",               transmission: "Automatic", fuelType: "PETROL",   mileage: 57200, price: 7800,  ownerId: 1, features: ["Virtual Cockpit Plus", "Matrix LED", "Bang & Olufsen"] },
  { vin: "WAUZZZF46LN035291", make: "Audi",          model: "Q5",              year: 2023, color: "Daytona Grey",   engine: "2.0L TFSI Quattro",       transmission: "Automatic", fuelType: "PETROL",   mileage: 7900,  price: 11600, ownerId: 1, features: ["Audi Virtual Cockpit", "MMI Navigation Plus", "Panoramic Sunroof"] },
  { vin: "KNDJN2A26G7369140", make: "Kia",           model: "Sportage",        year: 2023, color: "Runway Red",     engine: "1.6L T-GDi",              transmission: "Automatic", fuelType: "HYBRID",   mileage: 5400,  price: 6300,  ownerId: 1, features: ["Panoramic Roof", "Highway Drive Assist", "Remote Smart Parking"] },
  { vin: "U5YHM81BCP3441502", make: "Kia",           model: "Sorento",         year: 2022, color: "Steel Grey",     engine: "2.2L CRDi",               transmission: "Automatic", fuelType: "DIESEL",   mileage: 41200, price: 7200,  ownerId: 1, features: ["7-Seater", "Harman Kardon", "Blind Spot Collision Warning"] },
  { vin: "JN1AZ4EH5FM730167", make: "Nissan",        model: "Leaf",            year: 2023, color: "Pearl White",    engine: "150kW Electric Motor",    transmission: "Automatic", fuelType: "ELECTRIC", mileage: 4200,  price: 7100,  ownerId: 1, features: ["ProPilot Assist", "e-Pedal", "DC Fast Charging"] },
  { vin: "JN8BT3BA4LW306471", make: "Nissan",        model: "Patrol",          year: 2021, color: "Black",          engine: "5.6L V8 Petrol",          transmission: "Automatic", fuelType: "PETROL",   mileage: 63400, price: 10100, ownerId: 1, features: ["Hydraulic Body Motion Control", "Around View Monitor", "Bose Premium Audio"] },
  { vin: "SALWA2BK5LA731984", make: "Land Rover",    model: "Discovery Sport", year: 2022, color: "Santorini Black", engine: "2.0L Ingenium",          transmission: "Automatic", fuelType: "DIESEL",   mileage: 29300, price: 11200, ownerId: 1, features: ["Terrain Response", "Pivi Pro", "ClearSight Ground View"] },
  { vin: "JTJAM7BX4N2002734", make: "Lexus",         model: "NX 350h",         year: 2023, color: "Sonic Chrome",   engine: "2.5L Hybrid",             transmission: "Automatic", fuelType: "HYBRID",   mileage: 7600,  price: 12400, ownerId: 1, features: ["Mark Levinson Audio", "Tazuna Cockpit", "Self-Charging Hybrid"] },
  { vin: "YV1BW982891102534", make: "Volvo",         model: "XC60",            year: 2022, color: "Crystal White",  engine: "2.0L B4 Mild Hybrid",     transmission: "Automatic", fuelType: "PETROL",   mileage: 18700, price: 10900, ownerId: 1, features: ["Pilot Assist", "Bowers & Wilkins", "Air Quality System"] },
  { vin: "3CZRU5H78GM706214", make: "Honda",         model: "CR-V",            year: 2021, color: "Lunar Silver",   engine: "1.5L VTEC Turbo",         transmission: "Automatic", fuelType: "PETROL",   mileage: 48200, price: 5600,  ownerId: 1, features: ["Honda Sensing", "Magic Seat", "Walk Away Auto Lock"] },
  { vin: "1G1ZD5ST4JF123456", make: "Chevrolet",     model: "Malibu",          year: 2021, color: "Mosaic Blue",    engine: "1.5L Turbocharged",       transmission: "Automatic", fuelType: "PETROL",   mileage: 38900, price: 4700,  ownerId: 1, features: ["Teen Driver", "4G LTE WiFi", "Rear Cross Traffic Alert"] },
  { vin: "Z6FAAXTMT0J114862", make: "Peugeot",       model: "3008",            year: 2022, color: "Nera Black",     engine: "1.6L PureTech",           transmission: "Automatic", fuelType: "PETROL",   mileage: 22100, price: 5400,  ownerId: 1, features: ["i-Cockpit 3D", "Night Vision", "Focal Hi-Fi"] },
  { vin: "VF1RFD00X63421897", make: "Renault",       model: "Kadjar",          year: 2020, color: "Highland Grey",  engine: "1.5L dCi",                transmission: "Manual",    fuelType: "DIESEL",   mileage: 81300, price: 3600,  ownerId: 1, features: ["Multi-Sense", "Bose Sound", "Easy Park Assist"] },
];

export const MOCK_USERS: User[] = [
  { id: 1,  firstName: "Thabo",      lastName: "Nkosi",        dateOfBirth: "1990-03-15", rsaId: "9003150432087", username: "thabo.nkosi",    password: "" },
  { id: 2,  firstName: "Lerato",     lastName: "Dlamini",      dateOfBirth: "1995-07-22", rsaId: "9507220824082", username: "lerato.d",       password: "" },
  { id: 3,  firstName: "Sipho",      lastName: "Mthembu",      dateOfBirth: "1988-11-04", rsaId: "8811045113080", username: "sipho.m",        password: "" },
  { id: 4,  firstName: "Ayanda",     lastName: "Zulu",         dateOfBirth: "2000-01-30", rsaId: "0001305224086", username: "ayanda.zulu",    password: "" },
  { id: 5,  firstName: "Naledi",     lastName: "Molefe",       dateOfBirth: "1993-09-18", rsaId: "9309185469085", username: "naledi.m",       password: "" },
  { id: 6,  firstName: "Kwame",      lastName: "Boateng",      dateOfBirth: "1986-05-07", rsaId: "8605075631083", username: "kwame.b",        password: "" },
  { id: 7,  firstName: "Zanele",     lastName: "Khumalo",      dateOfBirth: "1998-12-25", rsaId: "9812254723081", username: "zanele.k",       password: "" },
  { id: 8,  firstName: "Bongani",    lastName: "Sithole",      dateOfBirth: "1992-04-03", rsaId: "9204035817089", username: "bongani.s",      password: "" },
  { id: 9,  firstName: "Fatima",     lastName: "Hendricks",    dateOfBirth: "1997-08-14", rsaId: "9708140938084", username: "fatima.h",       password: "" },
  { id: 10, firstName: "Pieter",     lastName: "van der Berg", dateOfBirth: "1984-02-28", rsaId: "8402285049082", username: "pieter.vdb",     password: "" },
  { id: 11, firstName: "Amahle",     lastName: "Ndlovu",       dateOfBirth: "2001-06-11", rsaId: "0106115162080", username: "amahle.n",       password: "" },
  { id: 12, firstName: "Ruan",       lastName: "Steenkamp",    dateOfBirth: "1991-10-20", rsaId: "9110205273088", username: "ruan.s",         password: "" },
  { id: 13, firstName: "Nomsa",      lastName: "Mahlangu",     dateOfBirth: "1996-04-17", rsaId: "9604175381086", username: "nomsa.m",        password: "" },
  { id: 14, firstName: "Jacques",    lastName: "Fourie",       dateOfBirth: "1983-09-02", rsaId: "8309025492084", username: "jacques.f",      password: "" },
  { id: 15, firstName: "Siphokazi",  lastName: "Mokoena",      dateOfBirth: "1999-12-08", rsaId: "9912085603082", username: "siphokazi.m",    password: "" },
  { id: 16, firstName: "Dean",       lastName: "Jacobs",       dateOfBirth: "1987-06-23", rsaId: "8706235714080", username: "dean.j",         password: "" },
  { id: 17, firstName: "Thandeka",   lastName: "Cele",         dateOfBirth: "2002-03-30", rsaId: "0203305825088", username: "thandeka.c",     password: "" },
  { id: 18, firstName: "Ashraf",     lastName: "Davids",       dateOfBirth: "1994-11-14", rsaId: "9411145936086", username: "ashraf.d",       password: "" },
];

const today = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString().split("T")[0];
};

export const MOCK_RESERVATIONS: Reservation[] = [
  // ── Active ──────────────────────────────────────────────────────────────
  { id: 1,  userId: 1,  carId: "WBAJB0C51BC613693", fromDate: d(-3),  toDate: d(4),   pickUpLocation: "Johannesburg CBD",      dropOffLocation: "OR Tambo International Airport"  },
  { id: 2,  userId: 3,  carId: "WDD2050421F425890", fromDate: d(-1),  toDate: d(6),   pickUpLocation: "Sandton City Mall",     dropOffLocation: "Lanseria Airport"                },
  { id: 3,  userId: 7,  carId: "JTJAM7BX4N2002734", fromDate: d(-5),  toDate: d(2),   pickUpLocation: "Cape Town Waterfront",  dropOffLocation: "Cape Town International Airport" },
  { id: 4,  userId: 13, carId: "WAUZZZF46LN035291", fromDate: d(-2),  toDate: d(5),   pickUpLocation: "Rosebank Mall",         dropOffLocation: "Midrand Gallagher Estate"        },
  { id: 5,  userId: 16, carId: "WBAKJ8C54JE937201", fromDate: d(-4),  toDate: d(3),   pickUpLocation: "Menlyn Maine",          dropOffLocation: "Centurion Lake Hotel"            },

  // ── Upcoming ─────────────────────────────────────────────────────────────
  { id: 6,  userId: 2,  carId: "JTDBU4EE8AJ058329", fromDate: d(3),   toDate: d(10),  pickUpLocation: "Durban Point Waterfront", dropOffLocation: "King Shaka Airport"            },
  { id: 7,  userId: 5,  carId: "KNDJN2A26G7369140", fromDate: d(7),   toDate: d(14),  pickUpLocation: "Pretoria Hatfield",     dropOffLocation: "Pretoria Central Station"        },
  { id: 8,  userId: 9,  carId: "SALWA2BK5LA731984", fromDate: d(2),   toDate: d(9),   pickUpLocation: "Rosebank",              dropOffLocation: "Fourways Gardens Mall"           },
  { id: 9,  userId: 11, carId: "YV1BW982891102534", fromDate: d(14),  toDate: d(21),  pickUpLocation: "Stellenbosch Town",     dropOffLocation: "Cape Town CBD"                   },
  { id: 10, userId: 4,  carId: "WAUZZZ4G1FN019428", fromDate: d(5),   toDate: d(8),   pickUpLocation: "Menlyn Park",           dropOffLocation: "Centurion Mall"                  },
  { id: 11, userId: 15, carId: "JTMRFREV8JD213580", fromDate: d(10),  toDate: d(17),  pickUpLocation: "Gateway Theatre Mall",  dropOffLocation: "Umhlanga Ridge"                  },
  { id: 12, userId: 17, carId: "WV2ZZZ7HZNH051834", fromDate: d(4),   toDate: d(11),  pickUpLocation: "V&A Waterfront",        dropOffLocation: "Cape Town Airport"               },
  { id: 13, userId: 18, carId: "NMTKHMBX0NR147291", fromDate: d(18),  toDate: d(25),  pickUpLocation: "Polokwane Cycad Mall",  dropOffLocation: "Limpopo Airport"                 },

  // ── Completed ─────────────────────────────────────────────────────────────
  { id: 14, userId: 6,  carId: "1FAFP34P83W181823", fromDate: d(-21), toDate: d(-14), pickUpLocation: "Midrand",               dropOffLocation: "Soweto Maponya Mall"             },
  { id: 15, userId: 8,  carId: "WVWZZZ3CZPE204978", fromDate: d(-30), toDate: d(-23), pickUpLocation: "East London City",      dropOffLocation: "Beacon Bay Retail Park"          },
  { id: 16, userId: 10, carId: "3CZRU5H78GM706214", fromDate: d(-14), toDate: d(-7),  pickUpLocation: "Bloemfontein Central",  dropOffLocation: "Bram Fischer Airport"            },
  { id: 17, userId: 12, carId: "5NPE34AF4FH054028", fromDate: d(-45), toDate: d(-38), pickUpLocation: "Umhlanga Rocks",        dropOffLocation: "Gateway Theatre of Shopping"     },
  { id: 18, userId: 2,  carId: "JN1AZ4EH5FM730167", fromDate: d(-10), toDate: d(-3),  pickUpLocation: "Green Point Stadium",   dropOffLocation: "Boulders Beach"                  },
  { id: 19, userId: 5,  carId: "KMHDU4AD1AU135710", fromDate: d(-60), toDate: d(-53), pickUpLocation: "Polokwane CBD",         dropOffLocation: "Limpopo Airport"                 },
  { id: 20, userId: 1,  carId: "1G1ZD5ST4JF123456", fromDate: d(-7),  toDate: d(-1),  pickUpLocation: "Benoni Station",        dropOffLocation: "Kempton Park Mall"               },
  { id: 21, userId: 14, carId: "WDD2131861A312045", fromDate: d(-90), toDate: d(-83), pickUpLocation: "Hyde Park Corner",      dropOffLocation: "Johannesburg CBD"                },
  { id: 22, userId: 6,  carId: "SALWA2BK5LA731984", fromDate: d(-35), toDate: d(-28), pickUpLocation: "Rustenburg Plaza",     dropOffLocation: "Hartbeespoort Dam"               },
  { id: 23, userId: 3,  carId: "U5YHM81BCP3441502", fromDate: d(-18), toDate: d(-11), pickUpLocation: "Durban Berea",          dropOffLocation: "Amanzimtoti Beach"               },
  { id: 24, userId: 9,  carId: "WBAJB0C51BC613693", fromDate: d(-55), toDate: d(-48), pickUpLocation: "Kimberley Diamond City", dropOffLocation: "Kimberley Airport"             },
  { id: 25, userId: 11, carId: "1FMJK1MT0MEA30412", fromDate: d(-25), toDate: d(-18), pickUpLocation: "George Airport",        dropOffLocation: "Knysna Waterfront"               },
];
