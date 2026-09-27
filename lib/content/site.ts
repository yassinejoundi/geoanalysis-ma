import type { LocalizedText, Locale } from "@/lib/i18n";

export interface Expertise {
  id: "mining" | "env" | "water";
  slug: string;
  number: string;
  name: LocalizedText;
  summary: LocalizedText;
  image: { src: string; alt: LocalizedText };
  subServices: { name: LocalizedText; summary: LocalizedText }[];
}

export interface Project {
  id: string;
  slug: string;
  expertiseId: Expertise["id"];
  domain: LocalizedText;
  location: string;
  title: LocalizedText;
  teaser: LocalizedText;
}

export interface EditorialEntry {
  id: string;
  slug: string;
  category: LocalizedText;
  date: LocalizedText;
  dateISO?: string;
  readingTime?: string;
  title: LocalizedText;
  teaser: LocalizedText;
  imageLabel: string;
  image?: { src: string; alt: LocalizedText };
  sources?: { label: LocalizedText; url: string }[];
}

export interface EditorialDetailEntry extends EditorialEntry {
  body: Record<Locale, string[]>;
}

export interface MethodGroup {
  id: string;
  title: LocalizedText;
  items: { name: LocalizedText; description: LocalizedText }[];
}

export const expertises: Expertise[] = [
  {
    id: "mining", slug: "exploration-miniere", number: "01",
    name: { fr: "Géologie et mines", en: "Geology and mining" },
    summary: { fr: "Études géologiques, cartographie, travaux de terrain et accompagnement des projets miniers.", en: "Geological studies, mapping, fieldwork and support for mining projects." },
    image: {
      src: "/expertises/geology-outcrop.jpg",
      alt: { fr: "Affleurement rocheux aux couches contrastées", en: "Rock outcrop with contrasting layers" },
    },
    subServices: [
      { name: { fr: "Études géologiques", en: "Geological studies" }, summary: { fr: "Exploration et études géologiques", en: "Exploration and geological studies" } },
      { name: { fr: "Cartographie", en: "Mapping" }, summary: { fr: "Cartographie et levés de terrain", en: "Mapping and field surveys" } },
      { name: { fr: "Sondages", en: "Drilling" }, summary: { fr: "Planification et suivi", en: "Planning and supervision" } },
      { name: { fr: "Appui minier", en: "Mining support" }, summary: { fr: "Études, gestion et démarches administratives", en: "Studies, administration and operational support" } },
    ],
  },
  {
    id: "env", slug: "etudes-impact", number: "02",
    name: { fr: "Études environnementales", en: "Environmental studies" },
    summary: { fr: "Études d’impact, protection de l’environnement et appui aux démarches administratives.", en: "Impact studies, environmental protection and administrative support." },
    image: {
      src: "/expertises/environment-landscape.jpg",
      alt: { fr: "Versant montagneux couvert d’une végétation basse", en: "Mountain slope covered with low-growing vegetation" },
    },
    subServices: [
      { name: { fr: "Études d’impact", en: "Impact studies" }, summary: { fr: "Projets miniers et carrières", en: "Mining and quarry projects" } },
      { name: { fr: "Protection environnementale", en: "Environmental protection" }, summary: { fr: "Solutions de protection", en: "Protection solutions" } },
      { name: { fr: "Aménagement de sites", en: "Site planning" }, summary: { fr: "Études d’aménagement", en: "Site planning studies" } },
      { name: { fr: "Appui administratif", en: "Administrative support" }, summary: { fr: "Occupation temporaire", en: "Temporary occupation" } },
    ],
  },
  {
    id: "water", slug: "ressources-en-eau", number: "03",
    name: { fr: "Hydrologie et hydrogéologie", en: "Hydrology and hydrogeology" },
    summary: { fr: "Études hydrologiques et hydrogéologiques, hydro-géophysique et analyse de l’eau.", en: "Hydrological and hydrogeological studies, hydrogeophysics and water analysis." },
    image: {
      src: "/expertises/hydrogeology-well.jpg",
      alt: { fr: "Puits en pierre avec poulie dans un paysage aride", en: "Stone well with a pulley in an arid landscape" },
    },
    subServices: [
      { name: { fr: "Études hydrologiques", en: "Hydrological studies" }, summary: { fr: "Études hydrologiques et hydrogéologiques", en: "Hydrological and hydrogeological studies" } },
      { name: { fr: "Hydro-géophysique", en: "Hydrogeophysics" }, summary: { fr: "Études hydro-géophysiques", en: "Hydrogeophysical studies" } },
      { name: { fr: "Prélèvements et analyses", en: "Sampling and analysis" }, summary: { fr: "Prélèvements et analyses in situ", en: "In-situ sampling and analysis" } },
      { name: { fr: "Zones inondables", en: "Flood zones" }, summary: { fr: "Simulation hydraulique et délimitation", en: "Hydraulic simulation and delineation" } },
    ],
  },
];

export const projects: Project[] = [];
export const news: EditorialDetailEntry[] = [
  {
    id: "reconnaissance-terrain",
    slug: "reconnaissance-geologique-aout-2024",
    category: { fr: "Terrain", en: "Fieldwork" },
    date: { fr: "22 août 2024", en: "August 22, 2024" },
    dateISO: "2024-08-22",
    title: {
      fr: "Reconnaissance géologique sur le terrain",
      en: "Geological reconnaissance in the field",
    },
    teaser: {
      fr: "Une archive du 22 août 2024 montre un versant rocheux entaillé par une coupe de terrain.",
      en: "An archive photo dated August 22, 2024 shows a rocky slope with a field cut.",
    },
    imageLabel: "Versant rocheux dans une archive de terrain",
    image: {
      src: "/actualites/reconnaissance-terrain.webp",
      alt: {
        fr: "Versant rocheux aride marqué par une coupe de terrain",
        en: "Arid rocky slope marked by a field cut",
      },
    },
    body: {
      fr: [
        "L’archive photographique de GEOANALYSIS contient un cliché daté du 22 août 2024. Il montre un versant rocheux entaillé par une coupe de terrain.",
        "La fiche de services du bureau cite les études et levés géologiques, l’échantillonnage et la préparation de travaux de reconnaissance.",
      ],
      en: [
        "The GEOANALYSIS photo archive contains an image dated August 22, 2024. It shows a rocky slope cut by a field trench.",
        "The firm’s service sheet lists geological studies and surveys, sampling, and reconnaissance planning.",
      ],
    },
  },
  {
    id: "echantillons-roches",
    slug: "echantillons-roches-fevrier-2024",
    category: { fr: "Échantillonnage", en: "Sampling" },
    date: { fr: "14 février 2024", en: "February 14, 2024" },
    dateISO: "2024-02-14",
    title: {
      fr: "Des échantillons de roche documentés",
      en: "Rock samples documented",
    },
    teaser: {
      fr: "Des clichés datés de février 2024 montrent des échantillons photographiés avec un repère de mesure.",
      en: "Photos dated February 2024 show rock samples photographed beside a measuring scale.",
    },
    imageLabel: "Échantillon de roche avec repère de mesure",
    image: {
      src: "/actualites/echantillons-roche.webp",
      alt: {
        fr: "Échantillon de roche posé sur une planche graduée",
        en: "Rock sample placed on a measuring board",
      },
    },
    body: {
      fr: [
        "Plusieurs images conservées dans les supports du bureau sont datées du 14 février 2024. Elles montrent des roches photographiées avec un repère de mesure.",
        "La fiche de services mentionne l’échantillonnage géologique et les synthèses issues de recherches documentaires.",
        "Les sources ne précisent ni l’origine de ces échantillons ni les analyses éventuellement associées.",
      ],
      en: [
        "Several images in the firm’s archive are dated February 14, 2024. They show rocks photographed beside a measuring scale.",
        "The service sheet mentions geological sampling and syntheses based on documentary research.",
        "The sources do not identify the origin of these samples or any related analyses.",
      ],
    },
  },
  {
    id: "affleurements-geologiques",
    slug: "affleurements-geologiques-aout-2023",
    category: { fr: "Géologie", en: "Geology" },
    date: { fr: "29 août 2023", en: "August 29, 2023" },
    dateISO: "2023-08-29",
    title: {
      fr: "Lire les couches, décrire l’affleurement",
      en: "Reading the layers, describing the outcrop",
    },
    teaser: {
      fr: "Une vue d’archive montre un affleurement aux couches contrastées, dans un ensemble de photos datées d’août 2023.",
      en: "An archive image shows a rocky outcrop with contrasting layers in a photo set dated August 2023.",
    },
    imageLabel: "Affleurement rocheux aux couches contrastées",
    image: {
      src: "/actualites/affleurement-geologique.webp",
      alt: {
        fr: "Affleurement rocheux présentant des couches contrastées",
        en: "Rocky outcrop with contrasting visible layers",
      },
    },
    body: {
      fr: [
        "Un cliché du fonds photographique, daté du 29 août 2023, montre un affleurement rocheux aux couches visibles.",
        "La fiche de services de GEOANALYSIS cite les études, les levés et la cartographie géologiques.",
      ],
      en: [
        "A photo in the archive, dated August 29, 2023, shows a rocky outcrop with visible layers.",
        "The GEOANALYSIS service sheet lists geological studies, surveys, and mapping.",
      ],
    },
  },
];
export const articles: EditorialDetailEntry[] = [
  {
    id: "sentinel-2",
    slug: "imagerie-optique-sentinel-2",
    category: { fr: "Télédétection", en: "Remote sensing" },
    date: { fr: "Guide · 2026", en: "Guide · 2026" },
    readingTime: "3 min",
    title: {
      fr: "Sentinel-2 : lire les paysages en plusieurs bandes",
      en: "Sentinel-2: reading landscapes across spectral bands",
    },
    teaser: {
      fr: "À quoi servent les bandes optiques et quelle précision attendre d’une image satellitaire ?",
      en: "What do optical bands show, and what resolution can you expect from satellite imagery?",
    },
    imageLabel: "Affleurement observé sur le terrain",
    image: {
      src: "/articles/lecture-paysage.webp",
      alt: {
        fr: "Versant aride et affleurement de roches claires",
        en: "Arid slope and pale rock outcrop",
      },
    },
    body: {
      fr: [
        "Sentinel-2 observe les terres avec un capteur optique multispectral. Il enregistre 13 bandes : quatre dans le visible et le proche infrarouge à 10 mètres, six dans le red-edge et l’infrarouge à ondes courtes à 20 mètres, puis trois à 60 mètres destinées notamment aux corrections atmosphériques.",
        "Ces bandes permettent de comparer la réponse de la végétation, des sols et des surfaces en eau. Des images prises à des dates différentes aident à repérer des changements d’occupation du sol ou de couverture végétale. La constellation fournit un nouveau passage environ tous les cinq jours à l’équateur.",
        "La taille du pixel n’est pas la précision d’une limite géologique. Chaque pixel combine les surfaces qu’il couvre, et les nuages, les ombres, le relief et la saison modifient la mesure. Une image sert donc à orienter une interprétation et à préparer le terrain ; elle ne confirme pas, seule, une lithologie ou une ressource minérale.",
      ],
      en: [
        "Sentinel-2 observes land with a multispectral optical instrument. It records 13 bands: four in visible and near-infrared wavelengths at 10 metres, six in the red edge and shortwave infrared at 20 metres, and three at 60 metres used in part for atmospheric correction.",
        "These bands help compare the response of vegetation, soil and water surfaces. Images from different dates can reveal changes in land cover or vegetation. The constellation revisits a location about every five days at the equator.",
        "Pixel size is not the positional accuracy of a geological boundary. Each pixel combines the surfaces it covers, while clouds, shadows, terrain and season affect the measurement. An image helps guide interpretation and plan fieldwork; it cannot confirm a rock type or mineral resource on its own.",
      ],
    },
    sources: [
      {
        label: { fr: "Mission Sentinel-2 : chiffres clés (ESA)", en: "Sentinel-2 mission: facts and figures (ESA)" },
        url: "https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-2/Facts_and_figures",
      },
    ],
  },
  {
    id: "sentinel-1",
    slug: "radar-sentinel-1-sous-les-nuages",
    category: { fr: "Télédétection", en: "Remote sensing" },
    date: { fr: "Guide · 2026", en: "Guide · 2026" },
    readingTime: "3 min",
    title: {
      fr: "Sentinel-1 : observer quand les nuages masquent le sol",
      en: "Sentinel-1: observing when clouds hide the ground",
    },
    teaser: {
      fr: "Le radar fournit des images de jour comme de nuit, y compris par temps couvert, avec une lecture différente de l’optique.",
      en: "Radar imagery works day and night, even in cloudy conditions, and shows the surface differently from optical imagery.",
    },
    imageLabel: "Relief rocheux photographié pendant une sortie de terrain",
    image: {
      src: "/articles/relief-radar.webp",
      alt: {
        fr: "Échantillon de roche vert et gris posé à côté d’une pièce pour l’échelle",
        en: "Green-grey rock sample beside a coin for scale",
      },
    },
    body: {
      fr: [
        "Sentinel-1 embarque un radar à synthèse d’ouverture en bande C. Contrairement à un capteur optique, il émet et reçoit des micro-ondes : l’acquisition ne dépend pas de la lumière solaire et reste possible à travers les nuages. Cette continuité est utile pour suivre un territoire pendant une période pluvieuse ou comparer rapidement plusieurs dates.",
        "L’intensité rétrodiffusée dépend de la rugosité, de l’humidité, de l’orientation de la surface et de la végétation. Après une inondation, une paire d’images peut aider à repérer des changements de surface ; en terrain végétalisé ou montagneux, la réponse est plus complexe et doit être interprétée avec prudence.",
        "Le radar n’est pas une photographie et ne mesure pas directement la profondeur d’eau, sa qualité ou la nature d’une roche. Le relief, l’angle d’observation et le traitement influencent le résultat. Une carte fiable associe les séries radar à d’autres données, à une analyse du terrain et, lorsque nécessaire, à des observations locales.",
      ],
      en: [
        "Sentinel-1 carries a C-band synthetic aperture radar. Unlike an optical sensor, it transmits and receives microwaves: acquisition does not depend on sunlight and can continue through clouds. That continuity helps monitor an area during cloudy periods and compare images from different dates.",
        "Backscatter intensity depends on surface roughness, moisture, orientation and vegetation. After flooding, a pair of images can help identify surface change; in vegetated or mountainous terrain, the response is more complex and needs careful interpretation.",
        "Radar is not a photograph and does not directly measure water depth, water quality or rock type. Terrain, viewing angle and processing all affect the result. A reliable map combines radar time series with other data, terrain analysis and, where needed, local observations.",
      ],
    },
    sources: [
      {
        label: { fr: "Présentation de la mission Sentinel-1 (ESA)", en: "Introducing the Sentinel-1 mission (ESA)" },
        url: "https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-1/Introducing_Sentinel-1",
      },
    ],
  },
  {
    id: "geologic-maps",
    slug: "carte-geologique-observations-terrain",
    category: { fr: "Géologie", en: "Geology" },
    date: { fr: "Guide · 2026", en: "Guide · 2026" },
    readingTime: "3 min",
    title: {
      fr: "Carte géologique : relier les affleurements au sous-sol",
      en: "Geological maps: connecting outcrops to the subsurface",
    },
    teaser: {
      fr: "Couleurs, contacts et structures résument des observations, mais chaque carte conserve une part d’interprétation.",
      en: "Colours, boundaries and structures summarise observations, while every map retains some interpretation.",
    },
    imageLabel: "Échantillon rocheux relevé sur le terrain",
    image: {
      src: "/articles/echantillon-geologique.webp",
      alt: {
        fr: "Géologue examinant des blocs rocheux à l’aide d’un marteau de terrain",
        en: "Geologist examining rock fragments with a field hammer",
      },
    },
    body: {
      fr: [
        "Une carte géologique représente la répartition des roches affleurantes ou proches de la surface, ainsi que des structures comme les failles et les plis. Les couleurs distinguent les unités ; les traits, symboles et annotations renseignent sur leurs contacts, leur orientation ou leur relation. Une coupe géologique prolonge cette lecture en profondeur sous forme d’un modèle interprété.",
        "La carte se construit à partir de données existantes, de l’observation des affleurements et de mesures reportées dans des carnets de terrain. Les images satellitaires et les modèles de relief facilitent la préparation et la continuité spatiale, mais ne remplacent pas l’identification directe des roches ni le contrôle des limites.",
        "L’échelle détermine le niveau de détail qu’une carte peut porter. La couverture des affleurements, la topographie, la qualité du fond de carte et le temps consacré aux levés influencent aussi la confiance dans chaque tracé. Il faut donc lire la légende, les sources et la date de la carte avant de l’utiliser pour une décision technique.",
      ],
      en: [
        "A geological map shows the distribution of rocks exposed at or near the surface, along with structures such as faults and folds. Colours distinguish units; lines, symbols and notes describe their boundaries, orientation or relationships. A geological cross-section extends this reading below ground as an interpreted model.",
        "A map draws on existing data, outcrop observations and measurements recorded in field notes. Satellite imagery and terrain models help plan surveys and provide spatial continuity, but they cannot replace identifying rocks directly or checking boundaries in the field.",
        "Scale sets the level of detail a map can show. Outcrop coverage, terrain, the quality of the base map and time spent surveying also affect confidence in each line. Read the legend, sources and date before using a map for a technical decision.",
      ],
    },
    sources: [
      {
        label: { fr: "Comprendre les cartes géologiques (USGS)", en: "Understanding geological maps (USGS)" },
        url: "https://pubs.usgs.gov/gip/70039406/report.pdf",
      },
      {
        label: { fr: "Précision des éléments cartographiés (USGS)", en: "Accuracy of mapped features (USGS)" },
        url: "https://pubs.usgs.gov/of/2002/of02-370/soller1.html",
      },
    ],
  },
  {
    id: "electrical-resistivity",
    slug: "resistivite-electrique-hydrogeologie",
    category: { fr: "Hydrogéologie", en: "Hydrogeology" },
    date: { fr: "Guide · 2026", en: "Guide · 2026" },
    readingTime: "3 min",
    title: {
      fr: "Résistivité électrique : un indice, pas une garantie d’eau",
      en: "Electrical resistivity: a clue, not a guarantee of water",
    },
    teaser: {
      fr: "Les mesures géophysiques aident à comparer les terrains en profondeur ; leur interprétation doit rester croisée.",
      en: "Geophysical measurements help compare subsurface layers, but their interpretation must be checked against other evidence.",
    },
    imageLabel: "Échantillons observés lors d’une étude géologique",
    image: {
      src: "/articles/mesure-resistivite.webp",
      alt: {
        fr: "Fragments de roche utilisés pour décrire les matériaux du sous-sol",
        en: "Rock fragments used to describe subsurface materials",
      },
    },
    body: {
      fr: [
        "En prospection électrique, un courant est injecté dans le sol par des électrodes et la différence de potentiel est mesurée à la surface. En déplaçant les électrodes, on obtient des profils qui servent à estimer comment la résistivité varie avec la profondeur. Le résultat est un modèle calculé à partir de mesures, pas une image directe du sous-sol.",
        "La résistivité dépend de plusieurs facteurs : la nature des roches, leur porosité, la teneur en eau, sa salinité et la présence d’argiles. Plusieurs combinaisons de matériaux peuvent produire une réponse semblable. Une zone conductrice peut être liée à l’eau, mais aussi à l’argile ou à une eau minéralisée ; elle ne prouve donc pas, à elle seule, qu’un forage sera productif.",
        "La conception du profil, les conditions de contact des électrodes et le contrôle qualité influencent la mesure. Pour réduire l’ambiguïté, les résultats se confrontent à la géologie locale, aux données de forages et aux autres méthodes disponibles. L’objectif est de mieux cibler une investigation, puis de vérifier l’hypothèse sur le terrain.",
      ],
      en: [
        "In electrical surveying, electrodes inject current into the ground and measure voltage differences at the surface. Moving the electrodes produces profiles used to estimate how resistivity changes with depth. The result is a model calculated from measurements, not a direct picture of the subsurface.",
        "Resistivity depends on several factors: rock type, porosity, water content, salinity and clay. Different combinations of materials can produce similar responses. A conductive zone may relate to water, clay or mineralised water; it does not prove on its own that a borehole will be productive.",
        "Survey design, electrode contact and quality checks all affect the measurements. To reduce ambiguity, results are compared with local geology, borehole records and other available methods. The aim is to target further investigation more carefully, then check the interpretation in the field.",
      ],
    },
    sources: [
      {
        label: { fr: "Géophysique de surface appliquée aux eaux souterraines (USGS)", en: "Surface geophysics for groundwater investigations (USGS)" },
        url: "https://www.usgs.gov/publications/application-surface-geophysics-ground-water-investigations",
      },
      {
        label: { fr: "Imagerie électrique en hydrogéologie (USGS)", en: "Electrical imaging for hydrogeology (USGS)" },
        url: "https://www.usgs.gov/publications/electrical-imaging-hydrogeology",
      },
    ],
  },
  {
    id: "groundwater",
    slug: "eaux-souterraines-ressource-invisible",
    category: { fr: "Ressources en eau", en: "Water resources" },
    date: { fr: "Guide · 2026", en: "Guide · 2026" },
    readingTime: "3 min",
    title: {
      fr: "Eaux souterraines : rendre visible une ressource cachée",
      en: "Groundwater: making an unseen resource visible",
    },
    teaser: {
      fr: "Comprendre un aquifère suppose de suivre ensemble ses niveaux, ses usages, sa recharge et sa qualité.",
      en: "Understanding an aquifer means tracking its water levels, uses, recharge and quality together.",
    },
    imageLabel: "Terrain rocheux parcouru pour une reconnaissance géologique",
    image: {
      src: "/articles/terrain-aquifere.webp",
      alt: {
        fr: "Terrain minéral aride observé lors d’une reconnaissance",
        en: "Arid mineral terrain observed during a field survey",
      },
    },
    body: {
      fr: [
        "Les eaux souterraines sont invisibles en surface, mais elles ne forment pas nécessairement de vastes cavités remplies d’eau. Elles circulent et se stockent dans les pores et les fractures de matériaux géologiques. La géométrie de ces réservoirs, leurs connexions et leur capacité de renouvellement varient d’un bassin à l’autre.",
        "L’UNESCO estime que les eaux souterraines représentent 99 % de l’eau douce liquide de la planète. Cette proportion souligne leur importance globale, sans indiquer la quantité disponible dans un site particulier. L’accès à la ressource dépend notamment de la géologie, de la recharge, de la profondeur et de la qualité de l’eau.",
        "Un diagnostic s’appuie sur des observations répétées : niveaux dans les puits, débits, prélèvements et paramètres de qualité, replacés dans leur contexte géologique et climatique. Une série de mesures sur plusieurs saisons distingue mieux une variation ponctuelle d’une tendance durable. Ces données aident à discuter les usages et les besoins de suivi ; elles ne remplacent pas une gestion collective de la ressource.",
      ],
      en: [
        "Groundwater is hidden from view, but it does not necessarily fill large underground caverns. It moves and is stored in the pores and fractures of geological materials. The geometry of these reservoirs, their connections and their capacity to renew vary from one basin to another.",
        "UNESCO estimates that groundwater accounts for 99% of the planet’s liquid freshwater. That proportion highlights its global importance; it does not tell us how much water is available at a particular site. Access depends on geology, recharge, depth and water quality, among other factors.",
        "An assessment uses repeated observations: well levels, flow, withdrawals and water-quality parameters, interpreted alongside geological and climate information. Measurements across seasons help distinguish a short-term fluctuation from a lasting trend. Such data inform discussion of water use and monitoring needs; they do not replace shared resource management.",
      ],
    },
    sources: [
      {
        label: { fr: "Rapport mondial des Nations Unies sur la mise en valeur des ressources en eau 2022 (UNESCO)", en: "2022 United Nations World Water Development Report (UNESCO)" },
        url: "https://www.unesco.org/reports/wwdr/2022/en/articles/new-report-solution-water-crises-hiding-right-under-our-feet",
      },
    ],
  },
  {
    id: "environmental-assessment",
    slug: "etude-impact-environnemental-cycle-projet",
    category: { fr: "Environnement", en: "Environment" },
    date: { fr: "Guide · 2026", en: "Guide · 2026" },
    readingTime: "3 min",
    title: {
      fr: "Étude d’impact : du diagnostic au suivi des mesures",
      en: "Environmental assessment: from baseline to follow-up",
    },
    teaser: {
      fr: "Une étude utile relie l’état initial du milieu aux risques, aux mesures et au suivi pendant le projet.",
      en: "A useful assessment links baseline conditions to risks, mitigation and monitoring throughout a project.",
    },
    imageLabel: "Affleurement rocheux au sein d’un paysage aride",
    image: {
      src: "/articles/affleurement-environnement.webp",
      alt: {
        fr: "Relief rocheux aride observé pendant une reconnaissance de terrain",
        en: "Arid rocky terrain observed during a field survey",
      },
    },
    body: {
      fr: [
        "Une étude d’impact commence par préciser le projet, son emprise et les activités susceptibles d’interagir avec le milieu. L’état initial documente les conditions existantes avant travaux : eau, sols, habitats, usages et enjeux sociaux pertinents. La période et l’échelle des observations doivent correspondre aux questions posées ; une visite unique ne représente pas toujours les variations saisonnières.",
        "L’analyse relie ensuite les activités aux effets possibles, en distinguant leur portée, leur durée et les récepteurs concernés. Les mesures suivent une logique de prévention : éviter l’effet lorsque c’est possible, le réduire, puis traiter les impacts résiduels selon le cadre applicable. Les choix doivent être expliqués et associés à des responsabilités et à des indicateurs observables.",
        "Le travail continue après la remise du rapport. Un plan de suivi compare les résultats aux références initiales, signale les écarts et permet d’ajuster les mesures. Les échanges avec les communautés concernées et les autres parties prenantes font partie d’un processus de gestion continu. Pour un projet au Maroc, les procédures et exigences juridiques doivent être vérifiées selon la réglementation en vigueur et le secteur concerné.",
      ],
      en: [
        "An environmental assessment starts by describing the project, its footprint and the activities that may interact with the surrounding area. Baseline work documents existing conditions before construction: water, soil, habitats, land use and relevant social concerns. The timing and scale of observations should fit the questions; a single visit may not capture seasonal change.",
        "The analysis then connects activities to possible effects, considering their extent, duration and affected receptors. Mitigation follows a prevention logic: avoid an impact where possible, reduce it, then address residual effects under the applicable framework. Decisions should be explained and tied to clear responsibilities and observable indicators.",
        "The work continues after the report is delivered. A monitoring plan compares results with baseline conditions, flags deviations and helps adjust measures. Engagement with affected communities and other stakeholders is part of ongoing management. For projects in Morocco, legal requirements and procedures must be checked against current rules and the relevant sector.",
      ],
    },
    sources: [
      {
        label: { fr: "Norme de performance 1 : évaluation et gestion des risques et impacts (SFI)", en: "Performance Standard 1: assessment and management of risks and impacts (IFC)" },
        url: "https://www.ifc.org/en/insights-reports/2012/ifc-performance-standard-1",
      },
    ],
  },
];

export const methodGroups: MethodGroup[] = [
  {
    id: "01",
    title: { fr: "Géologie et mines", en: "Geology and mining" },
    items: [
      { name: { fr: "Cartographie géologique", en: "Geological mapping" }, description: { fr: "Cartographie et levés géologiques.", en: "Geological mapping and surveys." } },
      { name: { fr: "Échantillonnage", en: "Sampling" }, description: { fr: "Prélèvements et échantillonnages géologiques.", en: "Geological sampling." } },
      { name: { fr: "Sondages", en: "Drilling" }, description: { fr: "Planification et supervision des sondages.", en: "Drilling planning and supervision." } },
      { name: { fr: "Études minières", en: "Mining studies" }, description: { fr: "Études de faisabilité et estimation des réserves.", en: "Feasibility studies and reserve estimates." } },
      { name: { fr: "Appui aux projets miniers", en: "Mining project support" }, description: { fr: "Gestion, conseil et accompagnement opérationnel ou administratif.", en: "Administration, consulting and operational or administrative support." } },
    ],
  },
  {
    id: "02",
    title: { fr: "Hydrologie et environnement", en: "Water and environment" },
    items: [
      { name: { fr: "Études hydrologiques et hydrogéologiques", en: "Hydrological and hydrogeological studies" }, description: { fr: "Études hydrologiques, hydrogéologiques et hydro-géophysiques.", en: "Hydrological, hydrogeological and hydrogeophysical studies." } },
      { name: { fr: "Analyse de l’eau", en: "Water analysis" }, description: { fr: "Prélèvements et analyses in situ.", en: "In-situ sampling and analysis." } },
      { name: { fr: "Simulation hydraulique", en: "Hydraulic simulation" }, description: { fr: "Simulation pour délimiter les zones inondables.", en: "Simulation to delineate flood zones." } },
      { name: { fr: "Études d’impact environnemental", en: "Environmental impact studies" }, description: { fr: "Études pour les projets miniers et de carrières.", en: "Studies for mining and quarry projects." } },
      { name: { fr: "Protection et aménagement", en: "Protection and planning" }, description: { fr: "Solutions de protection environnementale, études d’aménagement et appui administratif.", en: "Environmental protection solutions, site planning studies and administrative support." } },
    ],
  },
  {
    id: "03",
    title: { fr: "SIG et télédétection", en: "GIS and remote sensing" },
    items: [
      { name: { fr: "Cartographie thématique", en: "Thematic mapping" }, description: { fr: "Cartes thématiques, minières, géophysiques et hydrologiques.", en: "Thematic, mining, geophysical and hydrological maps." } },
      { name: { fr: "Rapports et synthèses", en: "Reports and syntheses" }, description: { fr: "Rapports bibliographiques et synthèses.", en: "Bibliographic reports and syntheses." } },
      { name: { fr: "Formation en SIG", en: "GIS training" }, description: { fr: "Formation en systèmes d’information géographique.", en: "Geographic information systems training." } },
      { name: { fr: "Formation en télédétection", en: "Remote-sensing training" }, description: { fr: "Formation en télédétection.", en: "Remote-sensing training." } },
    ],
  },
];
