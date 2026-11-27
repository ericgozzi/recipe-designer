// Built-in recipe presets, localized in all 7 languages.
export const PRESETS = {
  carbonara: {
    baseServings: 4,
    l10n: {
      en: {
        title: 'Classic Spaghetti Carbonara',
        preStartSteps: [
          'Bring a large pot of salted water to a rolling boil',
          'Warm 4 ceramic serving bowls slightly so the emulsion stays glossy',
          'Finely grate Pecorino Romano and coarsely crack black pepper'
        ],
        nodes: {
          ing_pasta: { name: 'Spaghetti', note: 'bronze-die' },
          ing_guanciale: { name: 'Guanciale', note: '5mm strips' },
          ing_yolks: { name: 'Egg Yolks', note: 'room temp' },
          ing_pecorino: { name: 'Pecorino Romano', note: 'finely grated' },
          ing_pepper: { name: 'Black Pepper', note: 'freshly cracked' },
          lav_boil: { title: 'Cook pasta shy of al dente; reserve 1 cup starchy water', tags: ['BOIL', '9 MIN'] },
          lav_render: { title: 'Render guanciale in cold pan until fat is clear and crisp', tags: ['SAUTÉ', 'MED HEAT', '7 MIN'] },
          lav_paste: { title: 'Whisk yolks, Pecorino, and pepper into a thick paste', tags: ['WHISK'] },
          lav_emulsify: { title: 'Toss drained pasta in guanciale pan off heat; temper yolk paste with pasta water and toss briskly', tags: ['EMULSIFY', '2 MIN'] },
          out_serve: { title: 'Twirl into warm bowls; finish with crisp guanciale & extra Pecorino', tags: ['PLATE'] }
        }
      },
      fr: {
        title: 'Spaghetti Carbonara Classique',
        preStartSteps: [
          'Porter une grande marmite d’eau salée à ébullition',
          'Tiédir 4 assiettes creuses pour garder la sauce onctueuse',
          'Râper finement le Pecorino Romano et concasser le poivre noir'
        ],
        nodes: {
          ing_pasta: { name: 'Spaghetti', note: 'tréfilés au bronze' },
          ing_guanciale: { name: 'Guanciale', note: 'bâtonnets 5mm' },
          ing_yolks: { name: 'Jaunes d’œufs', note: 'temp. ambiante' },
          ing_pecorino: { name: 'Pecorino Romano', note: 'finement râpé' },
          ing_pepper: { name: 'Poivre Noir', note: 'fraîchement concassé' },
          lav_boil: { title: 'Cuire les pâtes al dente ; réserver une louche d’eau de cuisson', tags: ['BOUILLIR', '9 MIN'] },
          lav_render: { title: 'Faire fondre le guanciale à feu moyen jusqu’à ce qu’il soit croustillant', tags: ['SAUTER', 'FEU MOYEN', '7 MIN'] },
          lav_paste: { title: 'Fouetter les jaunes, le Pecorino et le poivre en pâte épaisse', tags: ['FOUETTER'] },
          lav_emulsify: { title: 'Mélanger les pâtes hors du feu avec le gras ; détendre la pâte aux œufs avec l’eau et émulsionner', tags: ['ÉMULSIONNER', '2 MIN'] },
          out_serve: { title: 'Dresser en nid ; garnir de guanciale croustillant et de Pecorino', tags: ['DRESSER'] }
        }
      },
      it: {
        title: 'Spaghetti alla Carbonara',
        preStartSteps: [
          'Portare a bollore una pentola capiente di acqua salata',
          'Intiepidire 4 fondine per mantenere cremosa l’emulsione',
          'Grattugiare finemente il Pecorino Romano e macinare il pepe nero'
        ],
        nodes: {
          ing_pasta: { name: 'Spaghetti', note: 'trafilati al bronzo' },
          ing_guanciale: { name: 'Guanciale', note: 'listarelle 5mm' },
          ing_yolks: { name: 'Tuorli d’uovo', note: 'temp. ambiente' },
          ing_pecorino: { name: 'Pecorino Romano', note: 'grattugiato fine' },
          ing_pepper: { name: 'Pepe Nero', note: 'macinato fresco' },
          lav_boil: { title: 'Cuocere gli spaghetti al dente; conservare un mestolo di acqua di cottura', tags: ['BOLLIRE', '9 MIN'] },
          lav_render: { title: 'Rosolare il guanciale partendo da padella fredda finché è croccante', tags: ['ROSOLARE', 'FUOCO MEDIO', '7 MIN'] },
          lav_paste: { title: 'Sbattere tuorli, Pecorino e pepe fino a ottenere una crema densa', tags: ['SBATTERE'] },
          lav_emulsify: { title: 'Saltare la pasta nel grasso fuori dal fuoco; unire la crema e mantecare con acqua di cottura', tags: ['EMULSIONARE', '2 MIN'] },
          out_serve: { title: 'Impiattare a nido; completare con guanciale croccante e Pecorino', tags: ['IMPIATTARE'] }
        }
      },
      de: {
        title: 'Klassische Spaghetti Carbonara',
        preStartSteps: [
          'Einen großen Topf mit Salzwasser zum Kochen bringen',
          '4 tiefe Teller leicht vorwärmen, damit die Sauce cremig bleibt',
          'Pecorino Romano fein reiben und schwarzen Pfeffer grob mahlen'
        ],
        nodes: {
          ing_pasta: { name: 'Spaghetti', note: 'Bronze-Matrize' },
          ing_guanciale: { name: 'Guanciale', note: '5mm Streifen' },
          ing_yolks: { name: 'Eigelb', note: 'zimmerwarm' },
          ing_pecorino: { name: 'Pecorino Romano', note: 'fein gerieben' },
          ing_pepper: { name: 'Schwarzer Pfeffer', note: 'grob geschrotet' },
          lav_boil: { title: 'Pasta knapp al dente kochen; 1 Tasse Nudelwasser auffangen', tags: ['KOCHEN', '9 MIN'] },
          lav_render: { title: 'Guanciale in kalter Pfanne knusprig auslassen', tags: ['ANBRATEN', 'MITTL. HITZE', '7 MIN'] },
          lav_paste: { title: 'Eigelb, Pecorino und Pfeffer zu einer dicken Paste verquirlen', tags: ['SCHLAGEN'] },
          lav_emulsify: { title: 'Pasta abseits der Hitze im Fett schwenken; Eigelbpaste mit Nudelwasser cremig emulgieren', tags: ['EMULGIEREN', '2 MIN'] },
          out_serve: { title: 'Auf vorgewärmten Tellern anrichten und mit knusprigem Guanciale toppen', tags: ['ANRICHTEN'] }
        }
      },
      es: {
        title: 'Espaguetis a la Carbonara',
        preStartSteps: [
          'Poner a hervir una olla grande con agua salada',
          'Templar 4 platos hondos para mantener la emulsión brillante',
          'Rallar fino el Pecorino Romano y moler pimienta negra gruesa'
        ],
        nodes: {
          ing_pasta: { name: 'Espaguetis', note: 'trefilados al bronce' },
          ing_guanciale: { name: 'Guanciale', note: 'tiras de 5mm' },
          ing_yolks: { name: 'Yemas de huevo', note: 'temp. ambiente' },
          ing_pecorino: { name: 'Pecorino Romano', note: 'rallado fino' },
          ing_pepper: { name: 'Pimienta Negra', note: 'recién molida' },
          lav_boil: { title: 'Cocer la pasta al dente; reservar 1 taza de agua de cocción', tags: ['HERVIR', '9 MIN'] },
          lav_render: { title: 'Dorar el guanciale desde sartén fría hasta que quede crujiente', tags: ['SALTEAR', 'FUEGO MEDIO', '7 MIN'] },
          lav_paste: { title: 'Batir yemas, Pecorino y pimienta hasta formar una pasta espesa', tags: ['BATIR'] },
          lav_emulsify: { title: 'Saltear la pasta fuera del fuego con la grasa; emulsionar la pasta de yema con agua de cocción', tags: ['EMULSIONAR', '2 MIN'] },
          out_serve: { title: 'Emplatar en nido y terminar con guanciale crujiente y más Pecorino', tags: ['EMPLATAR'] }
        }
      },
      ja: {
        title: 'スパゲッティ・カルボナーラ',
        preStartSteps: [
          '大きな鍋にたっぷりの塩湯を沸かす',
          'ソースが冷めないよう深皿4枚を軽く温めておく',
          'ペコリーノ・ロマーノを細かくすりおろし、黒胡椒を粗挽きにする'
        ],
        nodes: {
          ing_pasta: { name: 'スパゲッティ', note: 'ブロンズダイス' },
          ing_guanciale: { name: 'グアンチャーレ', note: '5mm幅の拍子木切り' },
          ing_yolks: { name: '卵黄', note: '常温' },
          ing_pecorino: { name: 'ペコリーノ・ロマーノ', note: 'すりおろし' },
          ing_pepper: { name: '黒胡椒', note: '粗挽き' },
          lav_boil: { title: 'アルデンテ手前まで茹で、茹で汁を1カップ取り置く', tags: ['茹でる', '9 MIN'] },
          lav_render: { title: '冷たいフライパンから脂を引き出しカリッと炒める', tags: ['炒める', '中火', '7 MIN'] },
          lav_paste: { title: '卵黄・ペコリーノ・黒胡椒を濃厚なペースト状に混ぜる', tags: ['泡立てる'] },
          lav_emulsify: { title: '火を止めたフライパンで麺と脂を絡め、茹で汁と卵黄ペーストで素早く乳化させる', tags: ['乳化', '2 MIN'] },
          out_serve: { title: '温めた皿に盛り付け、カリカリのグアンチャーレとチーズを散らす', tags: ['盛り付け'] }
        }
      },
      pt: {
        title: 'Esparguete à Carbonara',
        preStartSteps: [
          'Levar uma panela grande com água salgada a ferver',
          'Aquecer ligeiramente 4 pratos fundos para manter o molho cremoso',
          'Ralar finamente o Pecorino Romano e moer pimenta preta grossa'
        ],
        nodes: {
          ing_pasta: { name: 'Esparguete', note: 'trefilado a bronze' },
          ing_guanciale: { name: 'Guanciale', note: 'tiras de 5mm' },
          ing_yolks: { name: 'Gemas de ovo', note: 'temp. ambiente' },
          ing_pecorino: { name: 'Pecorino Romano', note: 'ralado fino' },
          ing_pepper: { name: 'Pimenta Preta', note: 'moída na hora' },
          lav_boil: { title: 'Cozer a massa al dente; reservar 1 chávena da água da cozedura', tags: ['FERVER', '9 MIN'] },
          lav_render: { title: 'Saltear o guanciale desde frigideira fria até ficar crocante', tags: ['REFOGAR', 'LUME MÉDIO', '7 MIN'] },
          lav_paste: { title: 'Bater gemas, Pecorino e pimenta até formar uma pasta espessa', tags: ['BATER'] },
          lav_emulsify: { title: 'Envolver a massa fora do lume na gordura; emulsionar a pasta de gemas com água da cozedura', tags: ['EMULSIONAR', '2 MIN'] },
          out_serve: { title: 'Empratar e finalizar com guanciale crocante e Pecorino extra', tags: ['EMPRATAR'] }
        }
      }
    },
    nodes: [
      { id: 'ing_pasta', type: 'ingredient', x: 40, y: 50, qty: 400, unit: 'g' },
      { id: 'ing_guanciale', type: 'ingredient', x: 40, y: 175, qty: 180, unit: 'g' },
      { id: 'ing_yolks', type: 'ingredient', x: 40, y: 310, qty: 6, unit: 'pcs' },
      { id: 'ing_pecorino', type: 'ingredient', x: 40, y: 435, qty: 90, unit: 'g' },
      { id: 'ing_pepper', type: 'ingredient', x: 40, y: 560, qty: 2, unit: 'tsp' },
      { id: 'lav_boil', type: 'lavoration', x: 350, y: 50 },
      { id: 'lav_render', type: 'lavoration', x: 350, y: 175 },
      { id: 'lav_paste', type: 'lavoration', x: 350, y: 425 },
      { id: 'lav_emulsify', type: 'lavoration', x: 680, y: 210 },
      { id: 'out_serve', type: 'output', x: 1000, y: 210 }
    ],
    edges: [
      { id: 'e1', from: 'ing_pasta', to: 'lav_boil' },
      { id: 'e2', from: 'ing_guanciale', to: 'lav_render' },
      { id: 'e3', from: 'ing_yolks', to: 'lav_paste' },
      { id: 'e4', from: 'ing_pecorino', to: 'lav_paste' },
      { id: 'e5', from: 'ing_pepper', to: 'lav_paste' },
      { id: 'e6', from: 'lav_boil', to: 'lav_emulsify' },
      { id: 'e7', from: 'lav_render', to: 'lav_emulsify' },
      { id: 'e8', from: 'lav_paste', to: 'lav_emulsify' },
      { id: 'e9', from: 'lav_emulsify', to: 'out_serve' }
    ]
  },

  cookies: {
    baseServings: 16,
    l10n: {
      en: {
        title: 'Brown-Butter Chocolate Chip Cookies',
        preStartSteps: [
          'Preheat oven to 180°C and line two baking trays with parchment paper',
          'Bring eggs to room temperature and chop dark chocolate into chunks'
        ],
        nodes: {
          c_butter: { name: 'Unsalted Butter', note: 'cubed' },
          c_brown: { name: 'Dark Brown Sugar', note: 'packed' },
          c_white: { name: 'Caster Sugar', note: '' },
          c_eggs: { name: 'Eggs (1 Whole + 1 Yolk)', note: 'room temp' },
          c_flour: { name: 'All-Purpose Flour', note: '' },
          c_soda: { name: 'Baking Soda & Salt', note: 'fine sea salt' },
          c_choc: { name: '70% Dark Chocolate', note: 'hand-chopped' },
          c_brown_lav: { title: 'Melt butter until nutty golden brown solids form; cool slightly', tags: ['SIMMER', 'MED HEAT', '5 MIN'] },
          c_whisk_wet: { title: 'Whisk browned butter with sugars, then beat in eggs until pale ribbon', tags: ['WHISK'] },
          c_sift_dry: { title: 'Whisk flour, baking soda, and sea salt together', tags: ['WHISK'] },
          c_fold_dough: { title: 'Fold dry mix and chocolate chunks into batter; chill dough', tags: ['FOLD', 'CHILL', '30 MIN'] },
          c_bake: { title: 'Scoop 55g mounds onto parchment; bake until edges are golden & centers soft', tags: ['BAKE', '180°C', '12 MIN'] }
        }
      },
      fr: {
        title: 'Cookies au Beurre Noisette & Chocolat',
        preStartSteps: [
          'Préchauffer le four à 180°C et chemiser deux plaques de papier cuisson',
          'Sortir les œufs à température ambiante et concasser le chocolat noir'
        ],
        nodes: {
          c_butter: { name: 'Beurre Doux', note: 'en cubes' },
          c_brown: { name: 'Sucre Muscovado', note: 'tassé' },
          c_white: { name: 'Sucre Fin', note: '' },
          c_eggs: { name: 'Œufs (1 entier + 1 jaune)', note: 'temp. ambiante' },
          c_flour: { name: 'Farine T55', note: '' },
          c_soda: { name: 'Bicarbonate & Sel', note: 'sel fin' },
          c_choc: { name: 'Chocolat Noir 70%', note: 'concassé' },
          c_brown_lav: { title: 'Cuire le beurre jusqu’à coloration noisette ; laisser tiédir', tags: ['MIJOTER', 'FEU MOYEN', '5 MIN'] },
          c_whisk_wet: { title: 'Fouetter le beurre noisette avec les sucres puis incorporer les œufs', tags: ['FOUETTER'] },
          c_sift_dry: { title: 'Mélanger la farine, le bicarbonate et le sel fin', tags: ['FOUETTER'] },
          c_fold_dough: { title: 'Incorporer les poudres et le chocolat sans trop travailler ; réfrigérer', tags: ['INCORPORER', 'RÉFRIGÉRER', '30 MIN'] },
          c_bake: { title: 'Former des boules de 55g ; enfourner jusqu’à ce que les bords soient dorés', tags: ['CUIRE', '180°C', '12 MIN'] }
        }
      },
      it: {
        title: 'Biscotti al Burro Nocciola e Cioccolato',
        preStartSteps: [
          'Preriscaldare il forno a 180°C e foderare due teglie con carta forno',
          'Portare le uova a temperatura ambiente e tritare grossolanamente il cioccolato'
        ],
        nodes: {
          c_butter: { name: 'Burro non salato', note: 'a cubetti' },
          c_brown: { name: 'Zucchero di Canna Scuro', note: '' },
          c_white: { name: 'Zucchero Semolato', note: '' },
          c_eggs: { name: 'Uova (1 intero + 1 tuorlo)', note: 'temp. ambiente' },
          c_flour: { name: 'Farina 00', note: '' },
          c_soda: { name: 'Bicarbonato e Sale', note: 'sale fino' },
          c_choc: { name: 'Cioccolato Fondente 70%', note: 'a pezzi' },
          c_brown_lav: { title: 'Fondere il burro fino a doratura nocciola; lasciar intiepidire', tags: ['SOBBOLLIRE', 'FUOCO MEDIO', '5 MIN'] },
          c_whisk_wet: { title: 'Sbattere burro nocciola e zuccheri, poi unire le uova fino a composto chiaro', tags: ['SBATTERE'] },
          c_sift_dry: { title: 'Mescolare farina, bicarbonato e sale fino', tags: ['SBATTERE'] },
          c_fold_dough: { title: 'Incorporare le polveri e il cioccolato; far riposare in frigo', tags: ['INCORPORARE', 'RAFFREDDARE', '30 MIN'] },
          c_bake: { title: 'Formare palline da 55g su teglia; cuocere finché i bordi sono dorati', tags: ['INFORNARE', '180°C', '12 MIN'] }
        }
      },
      de: {
        title: 'Braune-Butter Chocolate Chip Cookies',
        preStartSteps: [
          'Backofen auf 180°C vorheizen und zwei Bleche mit Backpapier auslegen',
          'Eier auf Zimmertemperatur bringen und Zartbitterschokolade grob hacken'
        ],
        nodes: {
          c_butter: { name: 'Ungesalzene Butter', note: 'gewürfelt' },
          c_brown: { name: 'Brauner Zucker', note: '' },
          c_white: { name: 'Feiner Zucker', note: '' },
          c_eggs: { name: 'Eier (1 Ei + 1 Eigelb)', note: 'zimmerwarm' },
          c_flour: { name: 'Weizenmehl Type 405', note: '' },
          c_soda: { name: 'Natron & Meersalz', note: 'fein' },
          c_choc: { name: 'Zartbitterschokolade 70%', note: 'gehackt' },
          c_brown_lav: { title: 'Butter nussbraun schmelzen lassen; leicht abkühlen', tags: ['KÖCHELN', 'MITTL. HITZE', '5 MIN'] },
          c_whisk_wet: { title: 'Braune Butter mit Zucker schaumig schlagen, dann Eier unterrühren', tags: ['SCHLAGEN'] },
          c_sift_dry: { title: 'Mehl, Natron und Salz vermischen', tags: ['SCHLAGEN'] },
          c_fold_dough: { title: 'Trockene Zutaten und Schokolade unterheben; Teig kühlen', tags: ['UNTERHEBEN', 'KÜHLEN', '30 MIN'] },
          c_bake: { title: '55g Teigkugeln aufs Blech setzen und goldbraun backen', tags: ['BACKEN', '180°C', '12 MIN'] }
        }
      },
      es: {
        title: 'Galletas de Mantequilla Tostada y Chocolate',
        preStartSteps: [
          'Precalentar el horno a 180°C y forrar dos bandejas con papel vegetal',
          'Templar los huevos a temperatura ambiente y trocear el chocolate negro'
        ],
        nodes: {
          c_butter: { name: 'Mantequilla sin sal', note: 'en cubos' },
          c_brown: { name: 'Azúcar Moreno Oscuro', note: '' },
          c_white: { name: 'Azúcar Blanco', note: '' },
          c_eggs: { name: 'Huevos (1 entero + 1 yema)', note: 'temp. ambiente' },
          c_flour: { name: 'Harina de Trigo', note: '' },
          c_soda: { name: 'Bicarbonato y Sal', note: 'sal fina' },
          c_choc: { name: 'Chocolate Negro 70%', note: 'troceado' },
          c_brown_lav: { title: 'Fundir la mantequilla hasta dorar con aroma a avellana; templar', tags: ['COCER LENTO', 'FUEGO MEDIO', '5 MIN'] },
          c_whisk_wet: { title: 'Batir la mantequilla tostada con los azúcares y añadir los huevos', tags: ['BATIR'] },
          c_sift_dry: { title: 'Mezclar la harina, el bicarbonato y la sal fina', tags: ['BATIR'] },
          c_fold_dough: { title: 'Incorporar los secos y el chocolate; refrigerar la masa', tags: ['INCORPORAR', 'ENFRIAR', '30 MIN'] },
          c_bake: { title: 'Formar bolas de 55g y hornear hasta que los bordes estén dorados', tags: ['HORNEAR', '180°C', '12 MIN'] }
        }
      },
      ja: {
        title: '焦がしバターのチョコチップクッキー',
        preStartSteps: [
          'オーブンを180°Cに予熱し、天板2枚にクッキングシートを敷く',
          '卵を常温に戻し、ダークチョコレートを粗く刻む'
        ],
        nodes: {
          c_butter: { name: '無塩バター', note: '角切り' },
          c_brown: { name: 'ブラウンシュガー', note: '' },
          c_white: { name: 'グラニュー糖', note: '' },
          c_eggs: { name: '全卵1個＋卵黄1個', note: '常温' },
          c_flour: { name: '薄力粉', note: '' },
          c_soda: { name: '重曹・塩', note: '細粒塩' },
          c_choc: { name: 'ダークチョコ 70%', note: '粗刻み' },
          c_brown_lav: { title: 'バターを香ばしいきつね色になるまで加熱し、粗熱を取る', tags: ['弱火で煮る', '中火', '5 MIN'] },
          c_whisk_wet: { title: '焦がしバターと砂糖をすり混ぜ、卵を加えて白っぽくなるまで泡立てる', tags: ['泡立てる'] },
          c_sift_dry: { title: '薄力粉・重曹・塩を均一に混ぜ合わせる', tags: ['泡立てる'] },
          c_fold_dough: { title: '粉類と刻みチョコをさっくり混ぜ合わせ、冷蔵庫で休ませる', tags: ['さっくり混ぜる', '冷やす', '30 MIN'] },
          c_bake: { title: '55gずつ丸めて並べ、縁がきつね色になるまで焼成する', tags: ['焼成', '180°C', '12 MIN'] }
        }
      },
      pt: {
        title: 'Bolachas de Manteiga Tostada e Chocolate',
        preStartSteps: [
          'Pré-aquecer o forno a 180°C e forrar dois tabuleiros com papel vegetal',
          'Deixar os ovos à temperatura ambiente e picar o chocolate preto'
        ],
        nodes: {
          c_butter: { name: 'Manteiga sem sal', note: 'em cubos' },
          c_brown: { name: 'Açúcar Mascavado', note: '' },
          c_white: { name: 'Açúcar Fino', note: '' },
          c_eggs: { name: 'Ovos (1 inteiro + 1 gema)', note: 'temp. ambiente' },
          c_flour: { name: 'Farinha de Trigo', note: '' },
          c_soda: { name: 'Bicarbonato e Sal', note: 'sal fino' },
          c_choc: { name: 'Chocolate Preto 70%', note: 'picado' },
          c_brown_lav: { title: 'Derreter a manteiga até dourar com aroma a avelã; arrefecer ligeiramente', tags: ['COZINHAR LENTO', 'LUME MÉDIO', '5 MIN'] },
          c_whisk_wet: { title: 'Bater a manteiga tostada com os açúcares e juntar os ovos', tags: ['BATER'] },
          c_sift_dry: { title: 'Misturar a farinha, o bicarbonato e o sal fino', tags: ['BATER'] },
          c_fold_dough: { title: 'Envolver os secos e o chocolate; refrigerar a massa', tags: ['ENVOLVER', 'ARREFECER', '30 MIN'] },
          c_bake: { title: 'Formar bolas de 55g e assar até os bordos ficarem dourados', tags: ['ASSAR', '180°C', '12 MIN'] }
        }
      }
    },
    nodes: [
      { id: 'c_butter', type: 'ingredient', x: 40, y: 50, qty: 170, unit: 'g' },
      { id: 'c_brown', type: 'ingredient', x: 40, y: 175, qty: 165, unit: 'g' },
      { id: 'c_white', type: 'ingredient', x: 40, y: 300, qty: 75, unit: 'g' },
      { id: 'c_eggs', type: 'ingredient', x: 40, y: 425, qty: 2, unit: 'pcs' },
      { id: 'c_flour', type: 'ingredient', x: 40, y: 550, qty: 240, unit: 'g' },
      { id: 'c_soda', type: 'ingredient', x: 40, y: 675, qty: 1, unit: 'tsp' },
      { id: 'c_choc', type: 'ingredient', x: 40, y: 800, qty: 200, unit: 'g' },
      { id: 'c_brown_lav', type: 'lavoration', x: 350, y: 50 },
      { id: 'c_whisk_wet', type: 'lavoration', x: 660, y: 210 },
      { id: 'c_sift_dry', type: 'lavoration', x: 350, y: 600 },
      { id: 'c_fold_dough', type: 'lavoration', x: 970, y: 410 },
      { id: 'c_bake', type: 'output', x: 1290, y: 410 }
    ],
    edges: [
      { id: 'ce1', from: 'c_butter', to: 'c_brown_lav' },
      { id: 'ce2', from: 'c_brown_lav', to: 'c_whisk_wet' },
      { id: 'ce3', from: 'c_brown', to: 'c_whisk_wet' },
      { id: 'ce4', from: 'c_white', to: 'c_whisk_wet' },
      { id: 'ce5', from: 'c_eggs', to: 'c_whisk_wet' },
      { id: 'ce6', from: 'c_flour', to: 'c_sift_dry' },
      { id: 'ce7', from: 'c_soda', to: 'c_sift_dry' },
      { id: 'ce8', from: 'c_whisk_wet', to: 'c_fold_dough' },
      { id: 'ce9', from: 'c_sift_dry', to: 'c_fold_dough' },
      { id: 'ce10', from: 'c_choc', to: 'c_fold_dough' },
      { id: 'ce11', from: 'c_fold_dough', to: 'c_bake' }
    ]
  },

  tiramisu: {
    baseServings: 8,
    l10n: {
      en: {
        title: 'Classic Italian Tiramisu',
        preStartSteps: [
          'Brew strong espresso and pour into a shallow dish to cool completely',
          'Prepare a 22×22 cm ceramic dish and keep mascarpone chilled'
        ],
        nodes: {
          t_yolks: { name: 'Pasteurized Egg Yolks', note: '' },
          t_sugar: { name: 'Caster Sugar', note: '' },
          t_masc: { name: 'Mascarpone Cheese', note: 'chilled' },
          t_cream: { name: 'Heavy Whipping Cream', note: '35% fat, cold' },
          t_espresso: { name: 'Cooled Espresso', note: 'unsweetened' },
          t_savoiardi: { name: 'Savoiardi Ladyfingers', note: 'crisp' },
          t_cocoa: { name: 'Unsweetened Cocoa Powder', note: 'Dutch-process' },
          t_sabayon: { title: 'Whisk yolks and sugar until pale, thick, and tripled in volume', tags: ['WHISK', '5 MIN'] },
          t_cream_fold: { title: 'Fold cold mascarpone into yolk ribbon, then fold in softly whipped cream', tags: ['FOLD'] },
          t_dip: { title: 'Briefly dip each ladyfinger in espresso (1 sec per side) without soaking', tags: ['EMULSIFY'] },
          t_assemble: { title: 'Layer dipped biscuits and cream twice; chill and dust with cocoa before serving', tags: ['CHILL', '4H CHILL', 'PLATE'] }
        }
      },
      fr: {
        title: 'Tiramisu Italien Classique',
        preStartSteps: [
          'Préparer un café expresso corsé et le laisser refroidir complètement',
          'Préparer un plat creux 22×22 cm et garder le mascarpone bien frais'
        ],
        nodes: {
          t_yolks: { name: 'Jaunes d’œufs pasteurisés', note: '' },
          t_sugar: { name: 'Sucre Fin', note: '' },
          t_masc: { name: 'Mascarpone', note: 'froid' },
          t_cream: { name: 'Crème Liquide Entière', note: '35% MG, froide' },
          t_espresso: { name: 'Café Expresso Refroidi', note: 'non sucré' },
          t_savoiardi: { name: 'Biscuits Savoiardi', note: 'secs' },
          t_cocoa: { name: 'Cacao Amer en Poudre', note: '' },
          t_sabayon: { title: 'Fouetter les jaunes et le sucre jusqu’à obtenir un ruban pâle et mousseux', tags: ['FOUETTER', '5 MIN'] },
          t_cream_fold: { title: 'Incorporer le mascarpone froid puis la crème montée souple', tags: ['INCORPORER'] },
          t_dip: { title: 'Tremper rapidement les biscuits dans l’expresso (1 sec par face)', tags: ['MIJOTER'] },
          t_assemble: { title: 'Alterner deux couches de biscuits et de crème ; réfrigérer et poudrer de cacao', tags: ['RÉFRIGÉRER', '4H FROID', 'DRESSER'] }
        }
      },
      it: {
        title: 'Tiramisù Classico Italiano',
        preStartSteps: [
          'Preparare un caffè espresso forte e lasciarlo raffreddare completamente',
          'Preparare una pirofila 22×22 cm e tenere il mascarpone in frigorifero'
        ],
        nodes: {
          t_yolks: { name: 'Tuorli pastorizzati', note: '' },
          t_sugar: { name: 'Zucchero Semolato', note: '' },
          t_masc: { name: 'Mascarpone', note: 'freddo' },
          t_cream: { name: 'Panna Fresca Liquida', note: 'fredda' },
          t_espresso: { name: 'Caffè Espresso Freddo', note: 'amaro' },
          t_savoiardi: { name: 'Savoiardi', note: 'croccanti' },
          t_cocoa: { name: 'Cacao Amaro in Polvere', note: '' },
          t_sabayon: { title: 'Montare tuorli e zucchero fino a ottenere un composto chiaro e spumoso', tags: ['SBATTERE', '5 MIN'] },
          t_cream_fold: { title: 'Incorporare il mascarpone freddo e poi la panna semi-montata', tags: ['INCORPORARE'] },
          t_dip: { title: 'Inzuppare velocemente i savoiardi nel caffè (1 sec per lato)', tags: ['EMULSIONARE'] },
          t_assemble: { title: 'Alternare due strati di savoiardi e crema; raffreddare e spolverare con cacao', tags: ['RAFFREDDARE', '4H FRIGO', 'IMPIATTARE'] }
        }
      },
      de: {
        title: 'Klassisches Italienisches Tiramisu',
        preStartSteps: [
          'Starken Espresso brühen und in einer flachen Schale vollständig abkühlen lassen',
          'Eine 22×22 cm Form bereitstellen und Mascarpone kalt halten'
        ],
        nodes: {
          t_yolks: { name: 'Pasteurisierte Eigelbe', note: '' },
          t_sugar: { name: 'Feiner Zucker', note: '' },
          t_masc: { name: 'Mascarpone', note: 'gekühlt' },
          t_cream: { name: 'Schlagsahne', note: 'kalt' },
          t_espresso: { name: 'Abgekühlter Espresso', note: 'ungesüßt' },
          t_savoiardi: { name: 'Löffelbiskuits', note: '' },
          t_cocoa: { name: 'Ungesüßtes Kakaopulver', note: '' },
          t_sabayon: { title: 'Eigelb und Zucker hell und cremig aufschlagen', tags: ['SCHLAGEN', '5 MIN'] },
          t_cream_fold: { title: 'Kalte Mascarpone und geschlagene Sahne vorsichtig unterheben', tags: ['UNTERHEBEN'] },
          t_dip: { title: 'Löffelbiskuits kurz in Espresso tauchen (1 Sek. pro Seite)', tags: ['EMULGIEREN'] },
          t_assemble: { title: 'Biskuits und Creme zweimal schichten; kühlen und mit Kakao bestäuben', tags: ['KÜHLEN', '4H KÜHLEN', 'ANRICHTEN'] }
        }
      },
      es: {
        title: 'Tiramisú Clásico Italiano',
        preStartSteps: [
          'Preparar café expreso intenso y dejarlo enfriar por completo',
          'Preparar una fuente de 22×22 cm y mantener el mascarpone frío'
        ],
        nodes: {
          t_yolks: { name: 'Yemas pasteurizadas', note: '' },
          t_sugar: { name: 'Azúcar Blanco', note: '' },
          t_masc: { name: 'Queso Mascarpone', note: 'frío' },
          t_cream: { name: 'Nata para Montar', note: 'fría' },
          t_espresso: { name: 'Café Expreso Frío', note: 'sin azúcar' },
          t_savoiardi: { name: 'Bizcochos Savoiardi', note: '' },
          t_cocoa: { name: 'Cacao Puro en Polvo', note: '' },
          t_sabayon: { title: 'Batir las yemas con el azúcar hasta triplicar su volumen', tags: ['BATIR', '5 MIN'] },
          t_cream_fold: { title: 'Incorporar el mascarpone frío y luego la nata semimontada', tags: ['INCORPORAR'] },
          t_dip: { title: 'Bañar brevemente los bizcochos en el café (1 seg por lado)', tags: ['EMULSIONAR'] },
          t_assemble: { title: 'Alternar dos capas de bizcocho y crema; refrigerar y espolvorear cacao', tags: ['ENFRIAR', '4H FRÍO', 'EMPLATAR'] }
        }
      },
      ja: {
        title: 'クラシック・イタリアン・ティラミス',
        preStartSteps: [
          '濃いめのエスプレッソを抽出し、浅いバットに入れて完全に冷ます',
          '22×22cmの器を用意し、マスカルポーネは直前まで冷やしておく'
        ],
        nodes: {
          t_yolks: { name: '殺菌卵黄', note: '' },
          t_sugar: { name: 'グラニュー糖', note: '' },
          t_masc: { name: 'マスカルポーネ', note: '冷蔵' },
          t_cream: { name: '生クリーム', note: '乳脂肪35%・冷蔵' },
          t_espresso: { name: '冷ましたエスプレッソ', note: '無糖' },
          t_savoiardi: { name: 'サヴォイアルディ（フィンガービスケット）', note: '' },
          t_cocoa: { name: '無糖ココアパウダー', note: '' },
          t_sabayon: { title: '卵黄と砂糖を白っぽくもったりするまで泡立てる', tags: ['泡立てる', '5 MIN'] },
          t_cream_fold: { title: '冷えたマスカルポーネと七分立ての生クリームをさっくり合わせる', tags: ['さっくり混ぜる'] },
          t_dip: { title: 'ビスケットをエスプレッソに片面1秒ずつ素早く浸す', tags: ['乳化'] },
          t_assemble: { title: 'ビスケットとクリームを2層に重ね、冷蔵庫で冷やしてココアを振る', tags: ['冷やす', '4H 冷蔵', '盛り付け'] }
        }
      },
      pt: {
        title: 'Tiramisu Clássico Italiano',
        preStartSteps: [
          'Preparar café expresso forte e deixar arrefecer completamente',
          'Preparar uma travessa de 22×22 cm e manter o mascarpone frio'
        ],
        nodes: {
          t_yolks: { name: 'Gemas pasteurizadas', note: '' },
          t_sugar: { name: 'Açúcar Fino', note: '' },
          t_masc: { name: 'Queijo Mascarpone', note: 'frio' },
          t_cream: { name: 'Natas para Bater', note: 'frias' },
          t_espresso: { name: 'Café Expresso Frio', note: 'sem açúcar' },
          t_savoiardi: { name: 'Palitos La Reine (Savoiardi)', note: '' },
          t_cocoa: { name: 'Cacau Puro em Pó', note: '' },
          t_sabayon: { title: 'Bater as gemas com o açúcar até obter um creme pálido e fofo', tags: ['BATER', '5 MIN'] },
          t_cream_fold: { title: 'Envolver o mascarpone frio e depois as natas batidas', tags: ['ENVOLVER'] },
          t_dip: { title: 'Mergulhar rapidamente os palitos no café (1 seg de cada lado)', tags: ['EMULSIONAR'] },
          t_assemble: { title: 'Alternar duas camadas de palitos e creme; refrigerar e polvilhar cacau', tags: ['ARREFECER', '4H FRIO', 'EMPRATAR'] }
        }
      }
    },
    nodes: [
      { id: 't_yolks', type: 'ingredient', x: 40, y: 50, qty: 5, unit: 'pcs' },
      { id: 't_sugar', type: 'ingredient', x: 40, y: 175, qty: 100, unit: 'g' },
      { id: 't_masc', type: 'ingredient', x: 40, y: 300, qty: 500, unit: 'g' },
      { id: 't_cream', type: 'ingredient', x: 40, y: 425, qty: 200, unit: 'ml' },
      { id: 't_espresso', type: 'ingredient', x: 40, y: 560, qty: 300, unit: 'ml' },
      { id: 't_savoiardi', type: 'ingredient', x: 40, y: 685, qty: 24, unit: 'pcs' },
      { id: 't_cocoa', type: 'ingredient', x: 40, y: 810, qty: 20, unit: 'g' },
      { id: 't_sabayon', type: 'lavoration', x: 350, y: 110 },
      { id: 't_cream_fold', type: 'lavoration', x: 660, y: 230 },
      { id: 't_dip', type: 'lavoration', x: 350, y: 620 },
      { id: 't_assemble', type: 'output', x: 1000, y: 440 }
    ],
    edges: [
      { id: 'te1', from: 't_yolks', to: 't_sabayon' },
      { id: 'te2', from: 't_sugar', to: 't_sabayon' },
      { id: 'te3', from: 't_sabayon', to: 't_cream_fold' },
      { id: 'te4', from: 't_masc', to: 't_cream_fold' },
      { id: 'te5', from: 't_cream', to: 't_cream_fold' },
      { id: 'te6', from: 't_espresso', to: 't_dip' },
      { id: 'te7', from: 't_savoiardi', to: 't_dip' },
      { id: 'te8', from: 't_cream_fold', to: 't_assemble' },
      { id: 'te9', from: 't_dip', to: 't_assemble' },
      { id: 'te10', from: 't_cocoa', to: 't_assemble' }
    ]
  }
};
