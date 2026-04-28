export type VehicleCatalogItem = {
  make: string;
  models: string[];
};

export const OTHER_OPTION_VALUE = '__other__';
export const OTHER_MAKE_LABEL = 'Inna marka / wpisz ręcznie';
export const OTHER_MODEL_LABEL = 'Inny model / wpisz ręcznie';
export const OTHER_TIRE_BRAND_LABEL = 'Inna marka / wpisz ręcznie';

export const VEHICLE_CATALOG: VehicleCatalogItem[] = [
  { make: 'Abarth', models: ['500', '595', '695', 'Grande Punto', 'Punto Evo'] },
  { make: 'Alfa Romeo', models: ['147', '156', '159', '166', 'Giulia', 'Giulietta', 'GT', 'MiTo', 'Stelvio', 'Tonale'] },
  { make: 'Audi', models: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'R8', 'TT'] },
  { make: 'BMW', models: ['Seria 1', 'Seria 2', 'Seria 3', 'Seria 4', 'Seria 5', 'Seria 6', 'Seria 7', 'Seria 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z3', 'Z4', 'i3', 'i4', 'iX'] },
  { make: 'Chevrolet', models: ['Aveo', 'Camaro', 'Captiva', 'Cruze', 'Lacetti', 'Malibu', 'Orlando', 'Spark', 'Trax'] },
  { make: 'Chrysler', models: ['300C', 'Grand Voyager', 'Pacifica', 'PT Cruiser', 'Sebring', 'Voyager'] },
  { make: 'Citroën', models: ['C1', 'C2', 'C3', 'C3 Aircross', 'C4', 'C4 Cactus', 'C4 Picasso', 'C5', 'C5 Aircross', 'Berlingo', 'Jumpy', 'Jumper'] },
  { make: 'Cupra', models: ['Ateca', 'Born', 'Formentor', 'Leon'] },
  { make: 'Dacia', models: ['Dokker', 'Duster', 'Jogger', 'Lodgy', 'Logan', 'Sandero', 'Spring'] },
  { make: 'Daewoo', models: ['Kalos', 'Lanos', 'Leganza', 'Matiz', 'Nubira', 'Tacuma'] },
  { make: 'Daihatsu', models: ['Charade', 'Cuore', 'Materia', 'Sirion', 'Terios'] },
  { make: 'Dodge', models: ['Avenger', 'Caliber', 'Challenger', 'Charger', 'Durango', 'Journey', 'Nitro', 'Ram'] },
  { make: 'DS Automobiles', models: ['DS 3', 'DS 4', 'DS 5', 'DS 7 Crossback', 'DS 9'] },
  { make: 'Fiat', models: ['500', '500L', '500X', 'Bravo', 'Croma', 'Doblo', 'Ducato', 'Freemont', 'Grande Punto', 'Linea', 'Panda', 'Punto', 'Scudo', 'Sedici', 'Seicento', 'Stilo', 'Tipo'] },
  { make: 'Ford', models: ['B-Max', 'C-Max', 'EcoSport', 'Edge', 'Explorer', 'Fiesta', 'Focus', 'Fusion', 'Galaxy', 'Ka', 'Kuga', 'Maverick', 'Mondeo', 'Mustang', 'Puma', 'Ranger', 'S-Max', 'Tourneo Connect', 'Transit'] },
  { make: 'Honda', models: ['Accord', 'Civic', 'CR-V', 'CR-Z', 'FR-V', 'HR-V', 'Insight', 'Jazz', 'Legend'] },
  { make: 'Hyundai', models: ['Accent', 'Bayon', 'Coupe', 'Elantra', 'Getz', 'i10', 'i20', 'i30', 'i40', 'ix20', 'ix35', 'Kona', 'Santa Fe', 'Sonata', 'Tucson', 'Veloster'] },
  { make: 'Infiniti', models: ['EX', 'FX', 'G', 'M', 'Q30', 'Q50', 'Q60', 'Q70', 'QX30', 'QX50', 'QX70'] },
  { make: 'Jaguar', models: ['E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'S-Type', 'XE', 'XF', 'XJ', 'X-Type'] },
  { make: 'Jeep', models: ['Cherokee', 'Compass', 'Grand Cherokee', 'Patriot', 'Renegade', 'Wrangler'] },
  { make: 'Kia', models: ['Carens', 'Ceed', 'Cerato', 'Niro', 'Optima', 'Picanto', 'ProCeed', 'Rio', 'Sorento', 'Soul', 'Sportage', 'Stinger', 'Stonic', 'Venga', 'XCeed'] },
  { make: 'Lancia', models: ['Delta', 'Musa', 'Phedra', 'Thema', 'Voyager', 'Ypsilon'] },
  { make: 'Land Rover', models: ['Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'] },
  { make: 'Lexus', models: ['CT', 'ES', 'GS', 'IS', 'LS', 'NX', 'RC', 'RX', 'UX'] },
  { make: 'Mazda', models: ['2', '3', '5', '6', 'CX-3', 'CX-30', 'CX-5', 'CX-7', 'CX-9', 'MX-5', 'Premacy', 'RX-8'] },
  { make: 'Mercedes-Benz', models: ['Klasa A', 'Klasa B', 'Klasa C', 'Klasa E', 'Klasa G', 'Klasa M', 'Klasa R', 'Klasa S', 'CLA', 'CLC', 'CLK', 'CLS', 'EQA', 'EQB', 'EQC', 'GLA', 'GLB', 'GLC', 'GLE', 'GLK', 'GLS', 'SL', 'SLK', 'Sprinter', 'Viano', 'Vito'] },
  { make: 'MINI', models: ['Clubman', 'Cooper', 'Countryman', 'One', 'Paceman'] },
  { make: 'Mitsubishi', models: ['ASX', 'Carisma', 'Colt', 'Eclipse Cross', 'Galant', 'L200', 'Lancer', 'Outlander', 'Pajero', 'Space Star'] },
  { make: 'Nissan', models: ['Almera', 'Juke', 'Leaf', 'Micra', 'Murano', 'Navara', 'Note', 'Pathfinder', 'Primera', 'Pulsar', 'Qashqai', 'Tiida', 'X-Trail'] },
  { make: 'Opel', models: ['Adam', 'Agila', 'Antara', 'Astra', 'Combo', 'Corsa', 'Crossland', 'Frontera', 'Grandland', 'Insignia', 'Karl', 'Meriva', 'Mokka', 'Omega', 'Signum', 'Vectra', 'Vivaro', 'Zafira'] },
  { make: 'Peugeot', models: ['107', '108', '206', '207', '208', '307', '308', '407', '508', '2008', '3008', '5008', 'Bipper', 'Boxer', 'Expert', 'Partner', 'RCZ'] },
  { make: 'Porsche', models: ['911', 'Boxster', 'Cayenne', 'Cayman', 'Macan', 'Panamera', 'Taycan'] },
  { make: 'Renault', models: ['Arkana', 'Captur', 'Clio', 'Espace', 'Fluence', 'Kadjar', 'Kangoo', 'Koleos', 'Laguna', 'Megane', 'Scenic', 'Talisman', 'Trafic', 'Twingo', 'Zoe'] },
  { make: 'Saab', models: ['9-3', '9-5', '900', '9000'] },
  { make: 'Seat', models: ['Alhambra', 'Altea', 'Arona', 'Arosa', 'Ateca', 'Cordoba', 'Exeo', 'Ibiza', 'Leon', 'Mii', 'Tarraco', 'Toledo'] },
  { make: 'Škoda', models: ['Citigo', 'Enyaq', 'Fabia', 'Felicia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Rapid', 'Roomster', 'Scala', 'Superb', 'Yeti'] },
  { make: 'Smart', models: ['Forfour', 'Fortwo', 'Roadster'] },
  { make: 'Subaru', models: ['BRZ', 'Forester', 'Impreza', 'Justy', 'Legacy', 'Levorg', 'Outback', 'Tribeca', 'XV'] },
  { make: 'Suzuki', models: ['Alto', 'Baleno', 'Grand Vitara', 'Ignis', 'Jimny', 'SX4', 'Swift', 'Vitara', 'Wagon R+'] },
  { make: 'Tesla', models: ['Model 3', 'Model S', 'Model X', 'Model Y'] },
  { make: 'Toyota', models: ['Auris', 'Avensis', 'Aygo', 'Camry', 'C-HR', 'Corolla', 'Corolla Verso', 'GT86', 'Hilux', 'Land Cruiser', 'Prius', 'Proace', 'RAV4', 'Verso', 'Yaris', 'Yaris Cross'] },
  { make: 'Volkswagen', models: ['Amarok', 'Arteon', 'Beetle', 'Bora', 'Caddy', 'CC', 'Crafter', 'Eos', 'Fox', 'Golf', 'Jetta', 'Lupo', 'Multivan', 'Passat', 'Phaeton', 'Polo', 'Scirocco', 'Sharan', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Touran', 'Transporter', 'Up!'] },
  { make: 'Volvo', models: ['C30', 'C70', 'S40', 'S60', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC70', 'XC90'] },
].sort((a, b) => a.make.localeCompare(b.make, 'pl'));

export const TIRE_BRANDS = [
  'Michelin', 'Continental', 'Bridgestone', 'Goodyear', 'Pirelli', 'Dunlop', 'Hankook', 'Yokohama', 'Nokian', 'Firestone', 'Falken', 'Kleber', 'Uniroyal', 'Vredestein', 'Toyo', 'Kumho', 'Nexen', 'Fulda', 'Barum', 'Dębica', 'Sava', 'Matador', 'BFGoodrich', 'Cooper', 'General Tire', 'Semperit', 'Gislaved', 'Laufenn', 'Apollo', 'Maxxis', 'Triangle', 'Linglong', 'Goodride', 'Westlake', 'Imperial', 'Rotalla', 'Zeetex',
] as const;

export const getModelsForMake = (make?: string) => {
  if (!make) return [];
  return VEHICLE_CATALOG.find((item) => item.make === make)?.models ?? [];
};
