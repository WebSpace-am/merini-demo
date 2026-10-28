/* MERINI demo catalogue.
   Photos: @merinifurniture.yvn. Prices are demo values (AMD), anchored on the
   245,000 ֏ special-price sofa posted on their Instagram. */

window.MERINI = window.MERINI || {};

MERINI.contact = {
  phones: ['+374 99 575111', '+374 98 535111'],
  whatsapp: '37499575111',
  instagram: 'https://www.instagram.com/merinifurniture.yvn/',
  facebook: 'https://www.facebook.com/merinikahuyq',
  tiktok: 'https://www.tiktok.com/@merinifurniture',
  hours: '10:00 – 20:00'
};

MERINI.categories = [
  { id: 'sofas',     img: 'assets/sofa-curve.jpg',     name: { hy: 'Բազմոցներ',  en: 'Sofas',     ru: 'Диваны' } },
  { id: 'kitchens',  img: 'assets/kitchen-taupe.jpg',  name: { hy: 'Խոհանոցներ', en: 'Kitchens',  ru: 'Кухни' } },
  { id: 'wardrobes', img: 'assets/wardrobe-white.jpg', name: { hy: 'Պահարաններ', en: 'Wardrobes', ru: 'Шкафы' } },
  { id: 'bedroom',   img: 'assets/bed-light.jpg',      name: { hy: 'Ննջասենյակ', en: 'Bedroom',   ru: 'Спальня' } },
  { id: 'living',    img: 'assets/tv-wall.jpg',        name: { hy: 'Հյուրասենյակ', en: 'Living',  ru: 'Гостиная' } },
  { id: 'hallway',   img: 'assets/hallway.jpg',        name: { hy: 'Նախասենյակ', en: 'Hallway',   ru: 'Прихожая' } }
];

/* Finish palettes shown as swatches on product pages */
MERINI.finishes = {
  upholstery: [
    { id: 'boucle',   hex: '#E6DED0', name: { hy: 'Բուկլե, կրեմ',      en: 'Bouclé, cream',     ru: 'Букле, крем' } },
    { id: 'oat',      hex: '#D3C6B1', name: { hy: 'Վուշ, վարսակ',      en: 'Linen, oat',        ru: 'Лён, овсяный' } },
    { id: 'dove',     hex: '#B8B3AB', name: { hy: 'Աղավնի մոխրագույն', en: 'Dove grey',         ru: 'Голубино-серый' } },
    { id: 'chestnut', hex: '#7A5A40', name: { hy: 'Շենիլ, շագանակ',    en: 'Chenille, chestnut', ru: 'Шенилл, каштан' } },
    { id: 'wine',     hex: '#6A2533', name: { hy: 'Թավիշ, գինեգույն',  en: 'Velvet, wine',      ru: 'Бархат, винный' } },
    { id: 'navy',     hex: '#1E2A44', name: { hy: 'Թավիշ, մուգ կապույտ', en: 'Velvet, navy',    ru: 'Бархат, тёмно-синий' } }
  ],
  cabinetry: [
    { id: 'taupe',    hex: '#9A8E80', name: { hy: 'Գորշ, փայլատ',   en: 'Taupe matte',    ru: 'Тауп, матовый' } },
    { id: 'graphite', hex: '#3C3F44', name: { hy: 'Գրաֆիտ, փայլատ', en: 'Graphite matte', ru: 'Графит, матовый' } },
    { id: 'walnut',   hex: '#6B4A33', name: { hy: 'Ընկուզենի',      en: 'Walnut',         ru: 'Орех' } },
    { id: 'oak',      hex: '#B8915F', name: { hy: 'Կաղնի',          en: 'Natural oak',    ru: 'Натуральный дуб' } },
    { id: 'ivory',    hex: '#EEE8DC', name: { hy: 'Փղոսկր',         en: 'Ivory',          ru: 'Слоновая кость' } }
  ]
};

MERINI.products = [
  {
    id: 'onda', cat: 'sofas', img: 'assets/sofa-curve.jpg', price: 520000, finish: 'upholstery', tag: 'new',
    name: 'Onda', type: { hy: 'Կոր մոդուլային բազմոց', en: 'Curved modular sofa', ru: 'Изогнутый модульный диван' },
    dims: '320 × 240 × 78 cm',
    desc: {
      hy: 'Փափուկ, քանդակային կոր՝ կրեմագույն բուկլե գործվածքով։ Մոդուլային հատվածները թույլ են տալիս բազմոցը տեղադրել անկյունում կամ բաց տարածքի կենտրոնում։',
      en: 'A soft, sculpted curve in cream bouclé. Modular sections let it wrap around a corner or open up the middle of a room.',
      ru: 'Мягкий скульптурный изгиб в кремовом букле. Модульные секции позволяют поставить диван в угол или в центр открытого пространства.'
    }
  },
  {
    id: 'terra', cat: 'sofas', img: 'assets/sofa-chestnut.jpg', price: 690000, finish: 'upholstery',
    name: 'Terra', type: { hy: 'Մոդուլային բազմոց', en: 'Modular sofa', ru: 'Модульный диван' },
    dims: '360 × 200 × 72 cm',
    desc: {
      hy: 'Խորը, ցածր նստատեղեր՝ ռելիեֆային շագանակագույն շենիլով։ Մոդուլային կղզի՝ ստեղծված երկար ու հանգիստ երեկոների համար։',
      en: 'Deep, low seats in textured chestnut chenille: a modular island made for long, unhurried evenings.',
      ru: 'Глубокие низкие сиденья в фактурной каштановой шенилле: модульный остров для долгих спокойных вечеров.'
    }
  },
  {
    id: 'lusso', cat: 'sofas', img: 'assets/sofa-lusso.jpg', price: 480000, finish: 'upholstery',
    name: 'Lusso', type: { hy: 'Անկյունային բազմոց', en: 'Corner sofa', ru: 'Угловой диван' },
    dims: '290 × 230 × 84 cm',
    desc: {
      hy: 'Մաքուր գծերով անկյունային բազմոց՝ վարսակագույն գործվածքով, նուրբ սև ոտքերով և կաշվե երանգի բարձերով։',
      en: 'A clean-lined corner sofa in oatmeal weave on slim black legs, finished with leather-tone cushions.',
      ru: 'Угловой диван с чистыми линиями в овсяной рогожке на тонких чёрных ножках, с подушками в тон кожи.'
    }
  },
  {
    id: 'grigio', cat: 'sofas', img: 'assets/sofa-grey.jpg', price: 245000, oldPrice: 310000, finish: 'upholstery', tag: 'offer',
    name: 'Grigio', type: { hy: 'Բազմոց շեզլոնգով', en: 'Chaise sofa', ru: 'Диван с шезлонгом' },
    dims: '300 × 170 × 82 cm',
    desc: {
      hy: 'Մեր ամենավաճառվողը՝ ընդարձակ բազմոց շեզլոնգով, փափուկ մոխրավուն գործվածքով և հանովի պաստառներով։',
      en: 'Our bestseller: a generous chaise sofa in soft dove grey, with removable covers.',
      ru: 'Наш бестселлер: просторный диван с шезлонгом в мягком серо-бежевом цвете, со съёмными чехлами.'
    }
  },
  {
    id: 'bordeaux', cat: 'sofas', img: 'assets/sofa-bordeaux.jpg', price: 430000, finish: 'upholstery',
    name: 'Bordeaux', type: { hy: 'Բազմոց և պուֆ', en: 'Sofa & pouf', ru: 'Диван и пуф' },
    dims: '280 × 105 × 80 cm',
    desc: {
      hy: 'Գինեգույն թավիշ, կլորավուն արմնկակալներ և համապատասխան պուֆ։ Ցանկացած սենյակի գլխավոր շեշտը։',
      en: 'Rich wine velvet, rounded arms and a matching pouf. The statement piece of any room.',
      ru: 'Насыщенный винный бархат, округлые подлокотники и пуф в комплекте. Главный акцент любой комнаты.'
    }
  },
  {
    id: 'noce', cat: 'kitchens', img: 'assets/kitchen-taupe.jpg', price: 1450000, from: true, finish: 'cabinetry',
    name: 'Noce', type: { hy: 'Խոհանոց ըստ չափի', en: 'Made-to-measure kitchen', ru: 'Кухня по размерам' },
    dims: { hy: 'Ըստ ձեր չափերի', en: 'Made to your measurements', ru: 'По вашим размерам' },
    desc: {
      hy: 'Գորշավուն փայլատ ճակատներ և տաք ընկուզենի, ներկառուցված տեխնիկա և պահարանների տակ LED լուսավորություն։',
      en: 'Taupe matte fronts meet warm walnut, with integrated appliances and LED light under the wall units.',
      ru: 'Матовые фасады цвета тауп и тёплый орех, встроенная техника и LED-подсветка под навесными шкафами.'
    }
  },
  {
    id: 'grafite', cat: 'kitchens', img: 'assets/kitchen-graphite.jpg', price: 1650000, from: true, finish: 'cabinetry', tag: 'new',
    name: 'Grafite', type: { hy: 'Խոհանոց ըստ չափի', en: 'Made-to-measure kitchen', ru: 'Кухня по размерам' },
    dims: { hy: 'Ըստ ձեր չափերի', en: 'Made to your measurements', ru: 'По вашим размерам' },
    desc: {
      hy: 'Առանց բռնակների գրաֆիտե խոհանոց՝ լուսավորված ապակե ցուցափեղկով։ Պատրաստվում է ձեր տարածքի չափերով։',
      en: 'Handle-less graphite cabinetry with a lit glass vitrine, built to the exact size of your space.',
      ru: 'Графитовая кухня без ручек с подсвеченной стеклянной витриной, изготовленная точно по размерам вашего помещения.'
    }
  },
  {
    id: 'bianco', cat: 'wardrobes', img: 'assets/wardrobe-white.jpg', price: 560000, from: true, finish: 'cabinetry',
    name: 'Bianco', type: { hy: 'Պահարան', en: 'Wardrobe', ru: 'Шкаф' },
    dims: { hy: 'Հատակից առաստաղ, ըստ չափի', en: 'Floor to ceiling, made to measure', ru: 'От пола до потолка, по размерам' },
    desc: {
      hy: 'Հատակից առաստաղ սպիտակ պահարան՝ բարակ սև բռնակներով և կաղնե մակերեսով կոմոդով։',
      en: 'A floor-to-ceiling white wardrobe with slim black handles and an oak-topped chest of drawers.',
      ru: 'Белый шкаф от пола до потолка с тонкими чёрными ручками и комодом со столешницей под дуб.'
    }
  },
  {
    id: 'champagne', cat: 'hallway', img: 'assets/hallway.jpg', price: 640000, from: true, finish: 'cabinetry',
    name: 'Champagne', type: { hy: 'Նախասենյակի համալիր', en: 'Hallway system', ru: 'Система для прихожей' },
    dims: { hy: 'Ըստ չափի', en: 'Made to measure', ru: 'По размерам' },
    desc: {
      hy: 'Փղոսկրագույն պահարան՝ ոսկեգույն բռնակներով, բաց դարակներով և փափուկ պատով նստարանով։',
      en: 'An ivory wardrobe with brushed-gold handles, open shelving and an upholstered bench and wall panel.',
      ru: 'Шкаф цвета слоновой кости с золотистыми ручками, открытыми полками, мягкой банкеткой и стеновой панелью.'
    }
  },
  {
    id: 'rovere', cat: 'living', img: 'assets/tv-wall.jpg', price: 380000, from: true, finish: 'cabinetry',
    name: 'Rovere', type: { hy: 'Հեռուստացույցի պատ', en: 'Media wall', ru: 'ТВ-стена' },
    dims: { hy: 'Ըստ չափի', en: 'Made to measure', ru: 'По размерам' },
    desc: {
      hy: 'Կաղնե շերտեր, լուսավորված բաց դարակներ և սև քարե պանել՝ էկրանի շուրջ։',
      en: 'Oak slats, lit open shelving and a black stone-effect panel frame the screen.',
      ru: 'Дубовые рейки, открытые полки с подсветкой и панель под чёрный камень обрамляют экран.'
    }
  },
  {
    id: 'alba', cat: 'bedroom', img: 'assets/bed-light.jpg', price: 360000, finish: 'upholstery',
    name: 'Alba', type: { hy: 'Փափուկ մահճակալ', en: 'Upholstered bed', ru: 'Мягкая кровать' },
    dims: '180 × 200 cm',
    desc: {
      hy: 'Ցածր փափուկ մահճակալ՝ կրեմագույն վուշով և խորը, փափուկ գլխատախտակով։',
      en: 'A low upholstered bed in cream linen with a deep, soft headboard.',
      ru: 'Низкая мягкая кровать в кремовом льне с глубоким мягким изголовьем.'
    }
  }
];

/* Size options for upholstered pieces: price delta in AMD */
MERINI.sizes = {
  sofas: [
    { id: 's3', add: 0,      name: { hy: '3-տեղանի', en: '3-seater', ru: '3-местный' } },
    { id: 's4', add: 60000,  name: { hy: '4-տեղանի', en: '4-seater', ru: '4-местный' } },
    { id: 'sc', add: 120000, name: { hy: 'Անկյունային', en: 'Corner', ru: 'Угловой' } }
  ],
  bedroom: [
    { id: 'b160', add: 0,     name: { hy: '160 × 200', en: '160 × 200', ru: '160 × 200' } },
    { id: 'b180', add: 40000, name: { hy: '180 × 200', en: '180 × 200', ru: '180 × 200' } },
    { id: 'b200', add: 80000, name: { hy: '200 × 200', en: '200 × 200', ru: '200 × 200' } }
  ]
};
