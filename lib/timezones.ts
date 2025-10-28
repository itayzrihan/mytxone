// Complete list of all IANA timezones
export const ALL_TIMEZONES = [
  // UTC
  { value: "UTC", label: "UTC (Coordinated Universal Time)", region: "UTC" },
  
  // Africa
  { value: "Africa/Abidjan", label: "Abidjan (GMT)", region: "Africa" },
  { value: "Africa/Accra", label: "Accra (GMT)", region: "Africa" },
  { value: "Africa/Addis_Ababa", label: "Addis Ababa (EAT)", region: "Africa" },
  { value: "Africa/Algiers", label: "Algiers (CET)", region: "Africa" },
  { value: "Africa/Asmara", label: "Asmara (EAT)", region: "Africa" },
  { value: "Africa/Bamako", label: "Bamako (GMT)", region: "Africa" },
  { value: "Africa/Bangui", label: "Bangui (WAT)", region: "Africa" },
  { value: "Africa/Banjul", label: "Banjul (GMT)", region: "Africa" },
  { value: "Africa/Bissau", label: "Bissau (GMT)", region: "Africa" },
  { value: "Africa/Blantyre", label: "Blantyre (CAT)", region: "Africa" },
  { value: "Africa/Brazzaville", label: "Brazzaville (WAT)", region: "Africa" },
  { value: "Africa/Bujumbura", label: "Bujumbura (CAT)", region: "Africa" },
  { value: "Africa/Cairo", label: "Cairo (EET)", region: "Africa" },
  { value: "Africa/Casablanca", label: "Casablanca (WET/WEST)", region: "Africa" },
  { value: "Africa/Ceuta", label: "Ceuta (CET/CEST)", region: "Africa" },
  { value: "Africa/Conakry", label: "Conakry (GMT)", region: "Africa" },
  { value: "Africa/Dakar", label: "Dakar (GMT)", region: "Africa" },
  { value: "Africa/Dar_es_Salaam", label: "Dar es Salaam (EAT)", region: "Africa" },
  { value: "Africa/Djibouti", label: "Djibouti (EAT)", region: "Africa" },
  { value: "Africa/Douala", label: "Douala (WAT)", region: "Africa" },
  { value: "Africa/El_Aaiun", label: "El Aaiun (WET/WEST)", region: "Africa" },
  { value: "Africa/Freetown", label: "Freetown (GMT)", region: "Africa" },
  { value: "Africa/Gaborone", label: "Gaborone (SAST)", region: "Africa" },
  { value: "Africa/Harare", label: "Harare (CAT)", region: "Africa" },
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST)", region: "Africa" },
  { value: "Africa/Juba", label: "Juba (EAT)", region: "Africa" },
  { value: "Africa/Kampala", label: "Kampala (EAT)", region: "Africa" },
  { value: "Africa/Khartoum", label: "Khartoum (EAT)", region: "Africa" },
  { value: "Africa/Kigali", label: "Kigali (CAT)", region: "Africa" },
  { value: "Africa/Kinshasa", label: "Kinshasa (WAT)", region: "Africa" },
  { value: "Africa/Lagos", label: "Lagos (WAT)", region: "Africa" },
  { value: "Africa/Libreville", label: "Libreville (WAT)", region: "Africa" },
  { value: "Africa/Lilongwe", label: "Lilongwe (CAT)", region: "Africa" },
  { value: "Africa/Lome", label: "Lome (GMT)", region: "Africa" },
  { value: "Africa/Luanda", label: "Luanda (WAT)", region: "Africa" },
  { value: "Africa/Lubumbashi", label: "Lubumbashi (CAT)", region: "Africa" },
  { value: "Africa/Lusaka", label: "Lusaka (CAT)", region: "Africa" },
  { value: "Africa/Malabo", label: "Malabo (WAT)", region: "Africa" },
  { value: "Africa/Maputo", label: "Maputo (CAT)", region: "Africa" },
  { value: "Africa/Maseru", label: "Maseru (SAST)", region: "Africa" },
  { value: "Africa/Mbabane", label: "Mbabane (SAST)", region: "Africa" },
  { value: "Africa/Mogadishu", label: "Mogadishu (EAT)", region: "Africa" },
  { value: "Africa/Monrovia", label: "Monrovia (GMT)", region: "Africa" },
  { value: "Africa/Montserrado", label: "Montserrado (GMT)", region: "Africa" },
  { value: "Africa/Ndjamena", label: "Ndjamena (WAT)", region: "Africa" },
  { value: "Africa/Niamey", label: "Niamey (WAT)", region: "Africa" },
  { value: "Africa/Nouakchott", label: "Nouakchott (GMT)", region: "Africa" },
  { value: "Africa/Nzerekore", label: "Nzerekore (GMT)", region: "Africa" },
  { value: "Africa/Ouagadougou", label: "Ouagadougou (GMT)", region: "Africa" },
  { value: "Africa/Porto-Novo", label: "Porto-Novo (WAT)", region: "Africa" },
  { value: "Africa/Sao_Tome", label: "São Tomé (GMT)", region: "Africa" },
  { value: "Africa/Tripoli", label: "Tripoli (EET)", region: "Africa" },
  { value: "Africa/Tunis", label: "Tunis (CET)", region: "Africa" },
  { value: "Africa/Windhoek", label: "Windhoek (WAT/WAST)", region: "Africa" },
  
  // Americas - North America
  { value: "America/Adak", label: "Adak (HST/HDT)", region: "Americas" },
  { value: "America/Anchorage", label: "Anchorage (AKST/AKDT)", region: "Americas" },
  { value: "America/Boise", label: "Boise (MST/MDT)", region: "Americas" },
  { value: "America/Chicago", label: "Chicago (CST/CDT)", region: "Americas" },
  { value: "America/Denver", label: "Denver (MST/MDT)", region: "Americas" },
  { value: "America/Detroit", label: "Detroit (EST/EDT)", region: "Americas" },
  { value: "America/Edmonton", label: "Edmonton (MST/MDT)", region: "Americas" },
  { value: "America/Halifax", label: "Halifax (AST/ADT)", region: "Americas" },
  { value: "America/Juneau", label: "Juneau (AKST/AKDT)", region: "Americas" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)", region: "Americas" },
  { value: "America/Metlakatla", label: "Metlakatla (AKST/AKDT)", region: "Americas" },
  { value: "America/Mexico_City", label: "Mexico City (CST/CDT)", region: "Americas" },
  { value: "America/Montreal", label: "Montreal (EST/EDT)", region: "Americas" },
  { value: "America/New_York", label: "New York (EST/EDT)", region: "Americas" },
  { value: "America/Nome", label: "Nome (AKST/AKDT)", region: "Americas" },
  { value: "America/North_Dakota/Center", label: "North Dakota - Center (CST/CDT)", region: "Americas" },
  { value: "America/North_Dakota/New_Salem", label: "North Dakota - New Salem (CST/CDT)", region: "Americas" },
  { value: "America/Phoenix", label: "Phoenix (MST)", region: "Americas" },
  { value: "America/Puerto_Rico", label: "Puerto Rico (AST)", region: "Americas" },
  { value: "America/Sitka", label: "Sitka (AKST/AKDT)", region: "Americas" },
  { value: "America/Toronto", label: "Toronto (EST/EDT)", region: "Americas" },
  { value: "America/Winnipeg", label: "Winnipeg (CST/CDT)", region: "Americas" },
  
  // Americas - Central America
  { value: "America/Belmopan", label: "Belmopan (CST)", region: "Americas" },
  { value: "America/Costa_Rica", label: "Costa Rica (CST)", region: "Americas" },
  { value: "America/El_Salvador", label: "El Salvador (CST)", region: "Americas" },
  { value: "America/Guatemala", label: "Guatemala (CST)", region: "Americas" },
  { value: "America/Managua", label: "Managua (CST)", region: "Americas" },
  { value: "America/Panama", label: "Panama (EST)", region: "Americas" },
  { value: "America/Tegucigalpa", label: "Tegucigalpa (CST)", region: "Americas" },
  
  // Americas - Caribbean
  { value: "America/Antigua", label: "Antigua (AST)", region: "Americas" },
  { value: "America/Aruba", label: "Aruba (AST)", region: "Americas" },
  { value: "America/Barbados", label: "Barbados (AST)", region: "Americas" },
  { value: "America/Curacao", label: "Curaçao (AST)", region: "Americas" },
  { value: "America/Dominica", label: "Dominica (AST)", region: "Americas" },
  { value: "America/Grand_Turk", label: "Grand Turk (EST/EDT)", region: "Americas" },
  { value: "America/Grenada", label: "Grenada (AST)", region: "Americas" },
  { value: "America/Guadeloupe", label: "Guadeloupe (AST)", region: "Americas" },
  { value: "America/Jamaica", label: "Jamaica (EST)", region: "Americas" },
  { value: "America/Martinique", label: "Martinique (AST)", region: "Americas" },
  { value: "America/Montserrat", label: "Montserrat (AST)", region: "Americas" },
  { value: "America/Santo_Domingo", label: "Santo Domingo (AST)", region: "Americas" },
  { value: "America/St_Barthelemy", label: "St. Barthélemy (AST)", region: "Americas" },
  { value: "America/St_Johns", label: "St. John's (NST/NDT)", region: "Americas" },
  { value: "America/St_Kitts", label: "St. Kitts (AST)", region: "Americas" },
  { value: "America/St_Lucia", label: "St. Lucia (AST)", region: "Americas" },
  { value: "America/St_Thomas", label: "St. Thomas (AST)", region: "Americas" },
  { value: "America/St_Vincent", label: "St. Vincent (AST)", region: "Americas" },
  { value: "America/Tortola", label: "Tortola (AST)", region: "Americas" },
  { value: "America/US_Virgin", label: "US Virgin Islands (AST)", region: "Americas" },
  
  // Americas - South America
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (ART)", region: "Americas" },
  { value: "America/Argentina/Catamarca", label: "Catamarca (ART)", region: "Americas" },
  { value: "America/Argentina/Cordoba", label: "Córdoba (ART)", region: "Americas" },
  { value: "America/Argentina/Jujuy", label: "Jujuy (ART)", region: "Americas" },
  { value: "America/Argentina/La_Rioja", label: "La Rioja (ART)", region: "Americas" },
  { value: "America/Argentina/Mendoza", label: "Mendoza (ART)", region: "Americas" },
  { value: "America/Argentina/Rio_Gallegos", label: "Rio Gallegos (ART)", region: "Americas" },
  { value: "America/Argentina/Salta", label: "Salta (ART)", region: "Americas" },
  { value: "America/Argentina/San_Juan", label: "San Juan (ART)", region: "Americas" },
  { value: "America/Argentina/San_Luis", label: "San Luis (ART)", region: "Americas" },
  { value: "America/Argentina/Tucuman", label: "Tucumán (ART)", region: "Americas" },
  { value: "America/Argentina/Ushuaia", label: "Ushuaia (ART)", region: "Americas" },
  { value: "America/Bolivar", label: "Bolivar (VET)", region: "Americas" },
  { value: "America/Bogota", label: "Bogotá (COT)", region: "Americas" },
  { value: "America/Cayenne", label: "Cayenne (GFT)", region: "Americas" },
  { value: "America/Guyana", label: "Georgetown (GYT)", region: "Americas" },
  { value: "America/Lima", label: "Lima (PET)", region: "Americas" },
  { value: "America/Paramaribo", label: "Paramaribo (SRT)", region: "Americas" },
  { value: "America/Sao_Paulo", label: "São Paulo (BRT/BRST)", region: "Americas" },
  { value: "America/Suriname", label: "Suriname (SRT)", region: "Americas" },
  { value: "America/Thule", label: "Thule (AST/ADT)", region: "Americas" },
  { value: "America/Virgin", label: "Virgin Islands (AST)", region: "Americas" },
  
  // Asia
  { value: "Asia/Aden", label: "Aden (GST)", region: "Asia" },
  { value: "Asia/Almaty", label: "Almaty (ALMT)", region: "Asia" },
  { value: "Asia/Amman", label: "Amman (EET/EEST)", region: "Asia" },
  { value: "Asia/Anadyr", label: "Anadyr (ANAT)", region: "Asia" },
  { value: "Asia/Aqtau", label: "Aqtau (AQTT)", region: "Asia" },
  { value: "Asia/Aqtobe", label: "Aqtobe (AQTT)", region: "Asia" },
  { value: "Asia/Ashkhabad", label: "Ashkhabad (TMT)", region: "Asia" },
  { value: "Asia/Ashgabat", label: "Ashgabat (TMT)", region: "Asia" },
  { value: "Asia/Baghdad", label: "Baghdad (AST)", region: "Asia" },
  { value: "Asia/Bahrain", label: "Bahrain (GST)", region: "Asia" },
  { value: "Asia/Baku", label: "Baku (AZT/AZST)", region: "Asia" },
  { value: "Asia/Bangkok", label: "Bangkok (ICT)", region: "Asia" },
  { value: "Asia/Beirut", label: "Beirut (EET/EEST)", region: "Asia" },
  { value: "Asia/Bishkek", label: "Bishkek (KGT)", region: "Asia" },
  { value: "Asia/Brunei", label: "Brunei (BNT)", region: "Asia" },
  { value: "Asia/Calcutta", label: "Calcutta (IST)", region: "Asia" },
  { value: "Asia/Chiang_Mai", label: "Chiang Mai (ICT)", region: "Asia" },
  { value: "Asia/Chita", label: "Chita (YAKT)", region: "Asia" },
  { value: "Asia/Choibalsan", label: "Choibalsan (CHOT)", region: "Asia" },
  { value: "Asia/Chongqing", label: "Chongqing (CST)", region: "Asia" },
  { value: "Asia/Colombo", label: "Colombo (IST)", region: "Asia" },
  { value: "Asia/Dacca", label: "Dacca (BDT)", region: "Asia" },
  { value: "Asia/Damascus", label: "Damascus (EET/EEST)", region: "Asia" },
  { value: "Asia/Dhaka", label: "Dhaka (BDT)", region: "Asia" },
  { value: "Asia/Dili", label: "Dili (TLT)", region: "Asia" },
  { value: "Asia/Dubai", label: "Dubai (GST)", region: "Asia" },
  { value: "Asia/Dushanbe", label: "Dushanbe (TJT)", region: "Asia" },
  { value: "Asia/Famagusta", label: "Famagusta (EET/EEST)", region: "Asia" },
  { value: "Asia/Gaza", label: "Gaza (EET/EEST)", region: "Asia" },
  { value: "Asia/Harbin", label: "Harbin (CST)", region: "Asia" },
  { value: "Asia/Hebron", label: "Hebron (EET/EEST)", region: "Asia" },
  { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh City (ICT)", region: "Asia" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)", region: "Asia" },
  { value: "Asia/Hovd", label: "Hovd (HOVT)", region: "Asia" },
  { value: "Asia/Irkutsk", label: "Irkutsk (IRKT/IRKST)", region: "Asia" },
  { value: "Asia/Istanbul", label: "Istanbul (EET/EEST)", region: "Asia" },
  { value: "Asia/Jakarta", label: "Jakarta (WIB)", region: "Asia" },
  { value: "Asia/Jayapura", label: "Jayapura (WIT)", region: "Asia" },
  { value: "Asia/Jerusalem", label: "Jerusalem (IST/IDT)", region: "Asia" },
  { value: "Asia/Kabul", label: "Kabul (AFT)", region: "Asia" },
  { value: "Asia/Kamchatka", label: "Kamchatka (PETT)", region: "Asia" },
  { value: "Asia/Kandinsky", label: "Kandinsky (YEKT)", region: "Asia" },
  { value: "Asia/Karachi", label: "Karachi (PKT)", region: "Asia" },
  { value: "Asia/Kashgar", label: "Kashgar (CST)", region: "Asia" },
  { value: "Asia/Kathmandu", label: "Kathmandu (NPT)", region: "Asia" },
  { value: "Asia/Katmandu", label: "Katmandu (NPT)", region: "Asia" },
  { value: "Asia/Khandyga", label: "Khandyga (YAKT)", region: "Asia" },
  { value: "Asia/Kolkata", label: "Kolkata (IST)", region: "Asia" },
  { value: "Asia/Krasnoyarsk", label: "Krasnoyarsk (KRAT/KRAST)", region: "Asia" },
  { value: "Asia/Kuchining", label: "Kuching (MYT)", region: "Asia" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur (MYT)", region: "Asia" },
  { value: "Asia/Kuching", label: "Kuching (MYT)", region: "Asia" },
  { value: "Asia/Kuwait", label: "Kuwait (AST)", region: "Asia" },
  { value: "Asia/Macao", label: "Macao (CST)", region: "Asia" },
  { value: "Asia/Macau", label: "Macau (CST)", region: "Asia" },
  { value: "Asia/Magadan", label: "Magadan (MAGT)", region: "Asia" },
  { value: "Asia/Makassar", label: "Makassar (WITA)", region: "Asia" },
  { value: "Asia/Manila", label: "Manila (PHT)", region: "Asia" },
  { value: "Asia/Mariehamn", label: "Mariehamn (EET/EEST)", region: "Asia" },
  { value: "Asia/Marquesas", label: "Marquesas (MART)", region: "Asia" },
  { value: "Asia/Maykop", label: "Maykop (MSK)", region: "Asia" },
  { value: "Asia/Medina", label: "Medina (AST)", region: "Asia" },
  { value: "Asia/Mecca", label: "Mecca (AST)", region: "Asia" },
  { value: "Asia/Midway", label: "Midway (SST)", region: "Asia" },
  { value: "Asia/Minsk", label: "Minsk (MSK)", region: "Asia" },
  { value: "Asia/Mogadishu", label: "Mogadishu (EAT)", region: "Asia" },
  { value: "Asia/Monrovia", label: "Monrovia (GMT)", region: "Asia" },
  { value: "Asia/Monterrey", label: "Monterrey (CST/CDT)", region: "Asia" },
  { value: "Asia/Moscow", label: "Moscow (MSK)", region: "Asia" },
  { value: "Asia/Muscat", label: "Muscat (GST)", region: "Asia" },
  { value: "Asia/Nicosia", label: "Nicosia (EET/EEST)", region: "Asia" },
  { value: "Asia/Novokuznetsk", label: "Novokuznetsk (KRAT/KRAST)", region: "Asia" },
  { value: "Asia/Novosibirsk", label: "Novosibirsk (NOVT/NOVST)", region: "Asia" },
  { value: "Asia/Omsk", label: "Omsk (OMST/OMSST)", region: "Asia" },
  { value: "Asia/Oral", label: "Oral (AQTT)", region: "Asia" },
  { value: "Asia/Phnom_Penh", label: "Phnom Penh (ICT)", region: "Asia" },
  { value: "Asia/Pontianak", label: "Pontianak (WIB)", region: "Asia" },
  { value: "Asia/Pyongyang", label: "Pyongyang (KST)", region: "Asia" },
  { value: "Asia/Qatar", label: "Qatar (AST)", region: "Asia" },
  { value: "Asia/Qostanay", label: "Qostanay (AQTT)", region: "Asia" },
  { value: "Asia/Qyzylorda", label: "Qyzylorda (AQTT)", region: "Asia" },
  { value: "Asia/Rangoon", label: "Rangoon (MMT)", region: "Asia" },
  { value: "Asia/Riyadh", label: "Riyadh (AST)", region: "Asia" },
  { value: "Asia/Sakhalin", label: "Sakhalin (SAKT/SAKST)", region: "Asia" },
  { value: "Asia/Samarkand", label: "Samarkand (UZT)", region: "Asia" },
  { value: "Asia/Seoul", label: "Seoul (KST)", region: "Asia" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)", region: "Asia" },
  { value: "Asia/Singapore", label: "Singapore (SGT)", region: "Asia" },
  { value: "Asia/Srednekolymsk", label: "Srednekolymsk (SRET)", region: "Asia" },
  { value: "Asia/Taipei", label: "Taipei (CST)", region: "Asia" },
  { value: "Asia/Tashkent", label: "Tashkent (UZT)", region: "Asia" },
  { value: "Asia/Tbilisi", label: "Tbilisi (GET)", region: "Asia" },
  { value: "Asia/Tehran", label: "Tehran (IRST/IRDT)", region: "Asia" },
  { value: "Asia/Tel_Aviv", label: "Tel Aviv (IST/IDT)", region: "Asia" },
  { value: "Asia/Thimbu", label: "Thimbu (BTT)", region: "Asia" },
  { value: "Asia/Thimphu", label: "Thimphu (BTT)", region: "Asia" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", region: "Asia" },
  { value: "Asia/Tomsk", label: "Tomsk (NOVT/NOVST)", region: "Asia" },
  { value: "Asia/Ujung_Pandang", label: "Ujung Pandang (WITA)", region: "Asia" },
  { value: "Asia/Ulaanbaatar", label: "Ulaanbaatar (ULAT)", region: "Asia" },
  { value: "Asia/Ulan_Bator", label: "Ulan Bator (ULAT)", region: "Asia" },
  { value: "Asia/Urumqi", label: "Urumqi (CST)", region: "Asia" },
  { value: "Asia/Ust-Nera", label: "Ust-Nera (YAKT)", region: "Asia" },
  { value: "Asia/Vientiane", label: "Vientiane (ICT)", region: "Asia" },
  { value: "Asia/Vladivostok", label: "Vladivostok (VLAT/VLAST)", region: "Asia" },
  { value: "Asia/Yakutsk", label: "Yakutsk (YAKT/YAKST)", region: "Asia" },
  { value: "Asia/Yangon", label: "Yangon (MMT)", region: "Asia" },
  { value: "Asia/Yekaterinburg", label: "Yekaterinburg (YEKT/YEKST)", region: "Asia" },
  { value: "Asia/Yerevan", label: "Yerevan (AMT)", region: "Asia" },
  
  // Atlantic
  { value: "Atlantic/Azores", label: "Azores (AZOT/AZOST)", region: "Atlantic" },
  { value: "Atlantic/Bermuda", label: "Bermuda (AST/ADT)", region: "Atlantic" },
  { value: "Atlantic/Canary", label: "Canary Islands (WET/WEST)", region: "Atlantic" },
  { value: "Atlantic/Cape_Verde", label: "Cape Verde (CVT)", region: "Atlantic" },
  { value: "Atlantic/Faroe", label: "Faroe Islands (WET/WEST)", region: "Atlantic" },
  { value: "Atlantic/Madeira", label: "Madeira (WET/WEST)", region: "Atlantic" },
  { value: "Atlantic/Reykjavik", label: "Reykjavik (GMT)", region: "Atlantic" },
  { value: "Atlantic/South_Georgia", label: "South Georgia (GST)", region: "Atlantic" },
  { value: "Atlantic/South_Sandwich_Islands", label: "South Sandwich Islands (-03)", region: "Atlantic" },
  { value: "Atlantic/Stanley", label: "Stanley (FKT)", region: "Atlantic" },
  
  // Europe
  { value: "Europe/Amsterdam", label: "Amsterdam (CET/CEST)", region: "Europe" },
  { value: "Europe/Andorra", label: "Andorra (CET/CEST)", region: "Europe" },
  { value: "Europe/Astrakhan", label: "Astrakhan (MSK)", region: "Europe" },
  { value: "Europe/Athens", label: "Athens (EET/EEST)", region: "Europe" },
  { value: "Europe/Belfast", label: "Belfast (GMT/BST)", region: "Europe" },
  { value: "Europe/Belgrade", label: "Belgrade (CET/CEST)", region: "Europe" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)", region: "Europe" },
  { value: "Europe/Bratislava", label: "Bratislava (CET/CEST)", region: "Europe" },
  { value: "Europe/Brussels", label: "Brussels (CET/CEST)", region: "Europe" },
  { value: "Europe/Bucharest", label: "Bucharest (EET/EEST)", region: "Europe" },
  { value: "Europe/Budapest", label: "Budapest (CET/CEST)", region: "Europe" },
  { value: "Europe/Busingen", label: "Büsingen (CET/CEST)", region: "Europe" },
  { value: "Europe/Chisinau", label: "Chișinău (EET/EEST)", region: "Europe" },
  { value: "Europe/Copenhagen", label: "Copenhagen (CET/CEST)", region: "Europe" },
  { value: "Europe/Cork", label: "Cork (GMT/IST)", region: "Europe" },
  { value: "Europe/Cyrene", label: "Cyrene (EET)", region: "Europe" },
  { value: "Europe/Dublin", label: "Dublin (GMT/IST)", region: "Europe" },
  { value: "Europe/Gibraltar", label: "Gibraltar (CET/CEST)", region: "Europe" },
  { value: "Europe/Guernsey", label: "Guernsey (GMT/BST)", region: "Europe" },
  { value: "Europe/Helsinki", label: "Helsinki (EET/EEST)", region: "Europe" },
  { value: "Europe/Isle_of_Man", label: "Isle of Man (GMT/BST)", region: "Europe" },
  { value: "Europe/Istanbul", label: "Istanbul (EET/EEST)", region: "Europe" },
  { value: "Europe/Jersey", label: "Jersey (GMT/BST)", region: "Europe" },
  { value: "Europe/Kaliningrad", label: "Kaliningrad (EKT)", region: "Europe" },
  { value: "Europe/Kiev", label: "Kiev (EET/EEST)", region: "Europe" },
  { value: "Europe/Kirov", label: "Kirov (MSK)", region: "Europe" },
  { value: "Europe/Lisbon", label: "Lisbon (WET/WEST)", region: "Europe" },
  { value: "Europe/Ljubljana", label: "Ljubljana (CET/CEST)", region: "Europe" },
  { value: "Europe/London", label: "London (GMT/BST)", region: "Europe" },
  { value: "Europe/Luxembourg", label: "Luxembourg (CET/CEST)", region: "Europe" },
  { value: "Europe/Madrid", label: "Madrid (CET/CEST)", region: "Europe" },
  { value: "Europe/Malta", label: "Malta (CET/CEST)", region: "Europe" },
  { value: "Europe/Mariehamn", label: "Mariehamn (EET/EEST)", region: "Europe" },
  { value: "Europe/Minsk", label: "Minsk (MSK)", region: "Europe" },
  { value: "Europe/Chisinau", label: "Modova (EET/EEST)", region: "Europe" },
  { value: "Europe/Monaco", label: "Monaco (CET/CEST)", region: "Europe" },
  { value: "Europe/Moscow", label: "Moscow (MSK)", region: "Europe" },
  { value: "Europe/Nicosia", label: "Nicosia (EET/EEST)", region: "Europe" },
  { value: "Europe/Norway", label: "Norway (CET/CEST)", region: "Europe" },
  { value: "Europe/Oslo", label: "Oslo (CET/CEST)", region: "Europe" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)", region: "Europe" },
  { value: "Europe/Podgorica", label: "Podgorica (CET/CEST)", region: "Europe" },
  { value: "Europe/Prague", label: "Prague (CET/CEST)", region: "Europe" },
  { value: "Europe/Riga", label: "Riga (EET/EEST)", region: "Europe" },
  { value: "Europe/Rome", label: "Rome (CET/CEST)", region: "Europe" },
  { value: "Europe/Samara", label: "Samara (SAMT)", region: "Europe" },
  { value: "Europe/San_Marino", label: "San Marino (CET/CEST)", region: "Europe" },
  { value: "Europe/Sarajevo", label: "Sarajevo (CET/CEST)", region: "Europe" },
  { value: "Europe/Saratov", label: "Saratov (SAMT)", region: "Europe" },
  { value: "Europe/Simferopol", label: "Simferopol (MSK)", region: "Europe" },
  { value: "Europe/Skopje", label: "Skopje (CET/CEST)", region: "Europe" },
  { value: "Europe/Sofia", label: "Sofia (EET/EEST)", region: "Europe" },
  { value: "Europe/Stockholm", label: "Stockholm (CET/CEST)", region: "Europe" },
  { value: "Europe/Tallinn", label: "Tallinn (EET/EEST)", region: "Europe" },
  { value: "Europe/Tirane", label: "Tirane (CET/CEST)", region: "Europe" },
  { value: "Europe/Ulyanovsk", label: "Ulyanovsk (SAMT)", region: "Europe" },
  { value: "Europe/Vaduz", label: "Vaduz (CET/CEST)", region: "Europe" },
  { value: "Europe/Vatican", label: "Vatican (CET/CEST)", region: "Europe" },
  { value: "Europe/Vienna", label: "Vienna (CET/CEST)", region: "Europe" },
  { value: "Europe/Vilnius", label: "Vilnius (EET/EEST)", region: "Europe" },
  { value: "Europe/Volgograd", label: "Volgograd (MSK)", region: "Europe" },
  { value: "Europe/Warsaw", label: "Warsaw (CET/CEST)", region: "Europe" },
  { value: "Europe/Zagreb", label: "Zagreb (CET/CEST)", region: "Europe" },
  { value: "Europe/Zaporozhye", label: "Zaporozhye (EET/EEST)", region: "Europe" },
  { value: "Europe/Zurich", label: "Zurich (CET/CEST)", region: "Europe" },
  
  // Indian
  { value: "Indian/Antananarivo", label: "Antananarivo (EAT)", region: "Indian" },
  { value: "Indian/Chagos", label: "Chagos (IOT)", region: "Indian" },
  { value: "Indian/Christmas", label: "Christmas Island (CXT)", region: "Indian" },
  { value: "Indian/Cocos", label: "Cocos Islands (CCT)", region: "Indian" },
  { value: "Indian/Comoro", label: "Comoro (EAT)", region: "Indian" },
  { value: "Indian/Kerguelen", label: "Kerguelen (TFT)", region: "Indian" },
  { value: "Indian/Mahe", label: "Mahé (SCT)", region: "Indian" },
  { value: "Indian/Maldives", label: "Maldives (MVT)", region: "Indian" },
  { value: "Indian/Mauritius", label: "Mauritius (MUT)", region: "Indian" },
  { value: "Indian/Mayotte", label: "Mayotte (EAT)", region: "Indian" },
  { value: "Indian/Reunion", label: "Réunion (RET)", region: "Indian" },
  
  // Pacific
  { value: "Pacific/Apia", label: "Apia (WST/WSDT)", region: "Pacific" },
  { value: "Pacific/Auckland", label: "Auckland (NZDT/NZST)", region: "Pacific" },
  { value: "Pacific/Bougainville", label: "Bougainville (BST)", region: "Pacific" },
  { value: "Pacific/Chatham", label: "Chatham (CHADT/CHAST)", region: "Pacific" },
  { value: "Pacific/Chuuk", label: "Chuuk (CHUT)", region: "Pacific" },
  { value: "Pacific/Easter", label: "Easter Island (EAST/EASST)", region: "Pacific" },
  { value: "Pacific/Efate", label: "Efate (VUT)", region: "Pacific" },
  { value: "Pacific/Enderbury", label: "Enderbury (PHOT)", region: "Pacific" },
  { value: "Pacific/Fakaofo", label: "Fakaofo (TKT)", region: "Pacific" },
  { value: "Pacific/Fiji", label: "Fiji (FJT/FJST)", region: "Pacific" },
  { value: "Pacific/Funafuti", label: "Funafuti (TUT)", region: "Pacific" },
  { value: "Pacific/Galapagos", label: "Galapagos (GALT)", region: "Pacific" },
  { value: "Pacific/Gambier", label: "Gambier (GAMT)", region: "Pacific" },
  { value: "Pacific/Guadalcanal", label: "Guadalcanal (SBT)", region: "Pacific" },
  { value: "Pacific/Guam", label: "Guam (ChST)", region: "Pacific" },
  { value: "Pacific/Honolulu", label: "Honolulu (HST)", region: "Pacific" },
  { value: "Pacific/Jaluit", label: "Jaluit (MHT)", region: "Pacific" },
  { value: "Pacific/Johnston", label: "Johnston (HST)", region: "Pacific" },
  { value: "Pacific/Kiritimati", label: "Kiritimati (LINT)", region: "Pacific" },
  { value: "Pacific/Kosrae", label: "Kosrae (CHUT)", region: "Pacific" },
  { value: "Pacific/Kwajalein", label: "Kwajalein (MHT)", region: "Pacific" },
  { value: "Pacific/Majuro", label: "Majuro (MHT)", region: "Pacific" },
  { value: "Pacific/Marquesas", label: "Marquesas (MART)", region: "Pacific" },
  { value: "Pacific/Midway", label: "Midway (SST)", region: "Pacific" },
  { value: "Pacific/Nauru", label: "Nauru (NRT)", region: "Pacific" },
  { value: "Pacific/Niue", label: "Niue (NUT)", region: "Pacific" },
  { value: "Pacific/Noumea", label: "Noumea (NCT)", region: "Pacific" },
  { value: "Pacific/Pago_Pago", label: "Pago Pago (SST)", region: "Pacific" },
  { value: "Pacific/Palau", label: "Palau (PWT)", region: "Pacific" },
  { value: "Pacific/Palmyra", label: "Palmyra (PST)", region: "Pacific" },
  { value: "Pacific/Pohnpei", label: "Pohnpei (PONT)", region: "Pacific" },
  { value: "Pacific/Port_Moresby", label: "Port Moresby (PGT)", region: "Pacific" },
  { value: "Pacific/Rarotonga", label: "Rarotonga (CKT)", region: "Pacific" },
  { value: "Pacific/Saipan", label: "Saipan (ChST)", region: "Pacific" },
  { value: "Pacific/Samoa", label: "Samoa (WST/WSDT)", region: "Pacific" },
  { value: "Pacific/Tahiti", label: "Tahiti (TAHT)", region: "Pacific" },
  { value: "Pacific/Tarawa", label: "Tarawa (GILT)", region: "Pacific" },
  { value: "Pacific/Tongatapu", label: "Tongatapu (TOT)", region: "Pacific" },
  { value: "Pacific/Truk", label: "Truk (CHUT)", region: "Pacific" },
  { value: "Pacific/Wake", label: "Wake (WAKT)", region: "Pacific" },
  { value: "Pacific/Wallis", label: "Wallis (WFT)", region: "Pacific" },
  { value: "Pacific/Yap", label: "Yap (CHUT)", region: "Pacific" },
];

/**
 * Convert a datetime string and timezone to UTC
 * @param dateTime - DateTime string in format "YYYY-MM-DDTHH:mm"
 * @param timezone - IANA timezone (e.g., "America/New_York")
 * @returns UTC datetime string in ISO format
 */
export function convertToUTC(dateTime: string, timezone: string): string {
  try {
    // Create a date object from the local datetime
    const date = new Date(dateTime);
    
    // Format the date in the user's timezone to get the offset
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    const parts = formatter.formatToParts(date);
    const tzDate = new Date(
      parseInt(parts[4].value), // year
      parseInt(parts[0].value) - 1, // month (0-indexed)
      parseInt(parts[2].value), // day
      parseInt(parts[6].value), // hour
      parseInt(parts[8].value), // minute
      parseInt(parts[10].value) // second
    );
    
    // Calculate the difference between the local time and the timezone time
    const diff = date.getTime() - tzDate.getTime();
    
    // Create the UTC time by adding the difference
    const utcDate = new Date(date.getTime() + diff);
    
    return utcDate.toISOString();
  } catch (error) {
    console.error('Error converting to UTC:', error);
    // Fallback: assume the input is already UTC
    return new Date(dateTime).toISOString();
  }
}

/**
 * Convert a UTC datetime to user's timezone
 * @param utcDateTime - UTC datetime string in ISO format
 * @param timezone - IANA timezone (e.g., "America/New_York")
 * @returns DateTime string in format "YYYY-MM-DDTHH:mm" for the user's timezone
 */
export function convertFromUTC(utcDateTime: string, timezone: string): string {
  try {
    const date = new Date(utcDateTime);
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    const parts = formatter.formatToParts(date);
    const year = parts[4].value;
    const month = parts[0].value;
    const day = parts[2].value;
    const hour = parts[6].value;
    const minute = parts[8].value;
    
    return `${year}-${month}-${day}T${hour}:${minute}`;
  } catch (error) {
    console.error('Error converting from UTC:', error);
    // Fallback: return ISO string without Z
    return utcDateTime.slice(0, 16);
  }
}

/**
 * Get user's device timezone
 * @returns IANA timezone string
 */
export function getUserDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

/**
 * Get timezone display name
 * @param timezone - IANA timezone
 * @returns Display label for the timezone
 */
export function getTimezoneLabel(timezone: string): string {
  const tz = ALL_TIMEZONES.find(t => t.value === timezone);
  return tz ? tz.label : timezone;
}
