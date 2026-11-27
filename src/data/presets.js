// The example recipe shown on first launch (and re-translated until edited), in all 7 languages.
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
  }
};
