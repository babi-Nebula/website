const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".slide-dot"));
const previousButton = document.querySelector("#previousSlide");
const nextButton = document.querySelector("#nextSlide");
const pauseButton = document.querySelector("#pauseSlides");
const hero = document.querySelector(".hero");
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const year = document.querySelector("#currentYear");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const productGrid = document.querySelector("#productGrid");
const cartOpenButton = document.querySelector("#cartOpen");
const cartDrawer = document.querySelector("#cartDrawer");
const cartBackdrop = document.querySelector("#cartBackdrop");
const cartCloseButton = document.querySelector("#cartClose");
const cartItemsElement = document.querySelector("#cartItems");
const cartCountElement = document.querySelector("#cartCount");
const drawerCountElement = document.querySelector("#drawerCount");
const cartSubtotalElement = document.querySelector("#cartSubtotal");
const cartFooter = document.querySelector("#cartFooter");
const paymentOptions = document.querySelector("#paymentOptions");
const checkoutButton = document.querySelector("#checkoutButton");
const customerNameInput = document.querySelector("#orderCustomerName");
const customerEmailInput = document.querySelector("#orderCustomerEmail");
const customerCountryInput = document.querySelector("#orderCustomerCountry");
const orderConfirmation = document.querySelector("#orderConfirmation");
const contactOptionsOpen = document.querySelector("#contactOptionsOpen");
const contactOptionsDialog = document.querySelector("#contactOptionsDialog");
const contactOptionsClose = document.querySelector("#contactOptionsClose");
const marketSearchForm = document.querySelector("#marketSearch");
const marketSearchInput = document.querySelector("#marketSearchInput");
const marketSearchCategory = document.querySelector("#marketSearchCategory");
const productResultCount = document.querySelector("#productResultCount");
const searchModeButtons = Array.from(document.querySelectorAll("[data-search-mode]"));
const productOptions = document.querySelector("#productOptions");
const productOptionsForm = document.querySelector("#productOptionsForm");
const productOptionsClose = document.querySelector("#productOptionsClose");
const selectedProductName = document.querySelector("#selectedProductName");
const giftBagOption = document.querySelector("#giftBagOption");
const giftBagPrice = 150;

const defaultProducts = [
  {
    id: "jebena",
    name: "Traditional clay jebena",
    maker: "Coffee & pottery",
    category: "Coffee & pottery",
    price: 1800,
    image: "Asset/Authentic%20Tigray%20Red%20Clay%20Jebena%20-%20Spoutless%20Ethiopian%20Coffee%20Pot%2C%20Handcrafted%20Habesha%20Pitcher.jpg",
    alt: "Handmade red clay Ethiopian coffee pot",
    description: "A terracotta coffee pot inspired by the Ethiopian coffee ceremony.",
    label: "Coffee ritual",
  },
  {
    id: "woven-tray",
    name: "Colorful woven tray",
    maker: "Basketry & home",
    category: "Home & basketry",
    price: 950,
    image: "Asset/downnload.jpg",
    alt: "Round handwoven tray in bright Ethiopian colors",
    description: "A vibrant woven accent for serving or displaying at home.",
    label: "Handwoven",
  },
  {
    id: "hand-cross",
    name: "Ethiopian hand cross",
    maker: "Art & heritage",
    category: "Art & heritage",
    price: 2200,
    image: "Asset/Ethiopian%20Hand%20Cross.jpg",
    alt: "Intricately patterned Ethiopian hand cross",
    description: "An ornamental cross with traditional openwork and detailed design.",
    label: "Heritage",
  },
  {
    id: "djembe",
    name: "Hand-carved djembe",
    maker: "Music & culture",
    category: "Music & culture",
    price: 3400,
    image: "Asset/Djembe%20stock.jpg",
    alt: "Carved wooden djembe drum with a rope-tuned top",
    description: "A striking carved drum inspired by East African musical traditions.",
    label: "Music",
  },
  {
    id: "wooden-spoon",
    name: "Carved serving spoon",
    maker: "Art & heritage",
    category: "Art & heritage",
    price: 680,
    image: "Asset/%28%23144%29%20Quatre%20cuillers%2C%20Boni%2C%20Somalie.jpg",
    alt: "Decorative hand-carved wooden spoon",
    description: "A carved wooden spoon with engraved details and a sculpted handle.",
    label: "Carved by hand",
  },
  {
    id: "coffee-mortar",
    name: "Coffee ceremony mortar",
    maker: "Coffee & pottery",
    category: "Coffee & pottery",
    price: 1250,
    image: "Asset/download11.jpg",
    alt: "Decorated wooden mortar and pestle",
    description: "A wooden mortar and pestle for preparing coffee and spices.",
    label: "Coffee ritual",
  },
  {
    id: "headrest",
    name: "Carved wooden headrest",
    maker: "Art & heritage",
    category: "Art & heritage",
    price: 2600,
    image: "Asset/Boni%20Headrest%203%2C%20Somalia.jpg",
    alt: "Sculptural carved wooden headrest with detailed patterns",
    description: "A sculptural piece highlighting the artistry of carved wood.",
    label: "Artisan craft",
  },
  {
    id: "woven-plate",
    name: "Natural woven plate",
    maker: "Basketry & home",
    category: "Home & basketry",
    price: 1100,
    image: "Asset/%D8%A7%D8%B7%D9%84%D8%B9%20%D8%B9%D9%84%D9%89%20%D9%87%D8%B0%D8%A7%20%D8%A7%D9%84%D9%85%D9%86%D8%B4%D9%88%D8%B1%20%D9%85%D9%86%20Htj.jpg",
    alt: "Round natural-fiber plate woven in a geometric pattern",
    description: "A handwoven plate with warm natural fibers and a geometric border.",
    label: "Handwoven",
  },
];

let products = window.ENQUStore?.read("products", null);
if (!Array.isArray(products)) {
  products = defaultProducts.map((product) => ({ ...product, status: "active" }));
  window.ENQUStore?.write("products", products);
}

const messages = {
  en: {
    "page.title": "ENQU MADE — Art, culture, creativity",
    "meta.description": "Explore Ethiopian art, culture, and creativity with ENQU MADE.",
    "announcement.tagline": "Made with meaning. Rooted in Ethiopia.",
    "announcement.link": "Discover the stories",
    "brand.home": "ENQU MADE home",
    "brand.subtitle": "ETHIOPIAN ART & CULTURE",
    "menu.open": "Open navigation",
    "menu.close": "Close navigation",
    "nav.label": "Main navigation",
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.categories": "Categories",
    "nav.delivery": "Delivery",
    "nav.makers": "Our makers",
    "nav.story": "Our story",
    "nav.bag": "Bag",
    "language.label": "Choose language",
    "hero.label": "Featured cultural stories",
    "hero.eyebrow1": "A LIVING HERITAGE",
    "hero.title1": "Where every<br />story <em>finds its rhythm.</em>",
    "hero.description1": "Step into the color, sound, and spirit of Ethiopian creativity. Discover the stories that bring us together.",
    "hero.action1": "Shop cultural pieces",
    "hero.credit1": "THE ART OF CELEBRATION",
    "hero.alt1": "Colorful painting of Ethiopian musicians and a drummer in traditional dress",
    "hero.eyebrow2": "BOLD BY NATURE",
    "hero.title2": "Art that sees<br />the world <em>differently.</em>",
    "hero.description2": "Meet the vivid colors and fearless perspectives of a new generation of Ethiopian artists.",
    "hero.action2": "Meet the artists",
    "hero.credit2": "A NEW PERSPECTIVE",
    "hero.alt2": "Expressive contemporary painting of three Ethiopian women",
    "hero.eyebrow3": "CRAFTED THROUGH TIME",
    "hero.title3": "Tradition, carried<br /><em>into tomorrow.</em>",
    "hero.description3": "Generations of artistry live on in every detail, pattern, and brushstroke.",
    "hero.action3": "Explore cultural crafts",
    "hero.credit3": "A LEGACY IN COLOR",
    "hero.alt3": "Traditional Ethiopian religious painting in warm reds, golds, and greens",
    "hero.eyebrow4": "MANY VOICES, ONE HOME",
    "hero.title4": "A brighter picture<br />of <em>what connects us.</em>",
    "hero.description4": "A celebration of the people, places, and ideas shaping Ethiopia today.",
    "hero.action4": "Find a piece with a story",
    "hero.credit4": "COLORS OF COMMUNITY",
    "hero.alt4": "Vibrant stained-glass artwork depicting people and Ethiopian landscapes",
    "hero.location": "ADDIS ABABA · ETHIOPIA",
    "carousel.label": "Slideshow controls",
    "carousel.previous": "Previous slide",
    "carousel.next": "Next slide",
    "carousel.choose": "Choose a slide",
    "carousel.slide1": "Show slide 1",
    "carousel.slide2": "Show slide 2",
    "carousel.slide3": "Show slide 3",
    "carousel.slide4": "Show slide 4",
    "carousel.pause": "Pause slideshow",
    "carousel.play": "Play slideshow",
    "carousel.pauseText": "Pause",
    "carousel.playText": "Play",
    "intro.eyebrow": "A MARKETPLACE FOR CULTURE",
    "intro.title": "Discover the things<br /><em>that carry a story.</em>",
    "intro.description": "Shop handmade crafts, coffee ceremony pieces, traditional art, and objects inspired by Ethiopian heritage. Every piece connects you to the creativity and culture behind it.",
    "intro.action": "Explore the categories",
    "shop.eyebrow": "THE ENQU MARKETPLACE",
    "shop.title": "Objects with <em>heritage.</em>",
    "shop.note": "A curated collection of cultural crafts and creative finds.",
    "shop.categories": "Product categories",
    "shop.filters": "Filter products by category",
    "shop.disclaimer": "Product listings and prices are sample content for this marketplace preview.",
    "category.all": "All pieces",
    "category.coffee": "Coffee & pottery",
    "category.home": "Home & basketry",
    "category.music": "Music & culture",
    "category.art": "Art & heritage",
    "makers.imageAlt": "Illustration celebrating Ethiopian style and creativity",
    "makers.eyebrow": "MADE BY PEOPLE, SHAPED BY CULTURE",
    "makers.title": "Meet the makers<br />behind the <em>meaning.</em>",
    "makers.description": "Discover the people, skills, and cultural knowledge behind the things you bring home. Our marketplace celebrates craft and the stories that travel with it.",
    "makers.action": "Connect with ENQU MADE",
    "makers.profilesEyebrow": "THE PEOPLE BEHIND THE CRAFT",
    "makers.profilesTitle": "Meet the <em>artisans.</em>",
    "makers.profilesDescription": "Get to know the people sharing their creativity and cultural craft.",
    "makers.profileLabel": "ARTISAN PROFILE",
    "makers.profileNote": "A featured artisan in the ENQU MADE cultural marketplace.",
    "makers.viewProfile": "View profile",
    "makers.hideProfile": "Hide profile",
    "makers.felekeBio": "Explore Feleke’s featured work in the ENQU MADE marketplace. Contact the team to ask about current pieces and commissions.",
    "makers.hanaBio": "Explore Hana Getachew’s featured work in the ENQU MADE marketplace. Contact the team to ask about current pieces and commissions.",
    "makers.mahletBio": "Explore Mahlet Afework’s featured work in the ENQU MADE marketplace. Contact the team to ask about current pieces and commissions.",
    "makers.mekdesBio": "Explore Mekdes Mesfin’s featured work in the ENQU MADE marketplace. Contact the team to ask about current pieces and commissions.",
    "makers.emailFeleke": "Email ENQU MADE about Feleke",
    "makers.emailHana": "Email ENQU MADE about Hana Getachew",
    "makers.emailMahlet": "Email ENQU MADE about Mahlet Afework",
    "makers.emailMekdes": "Email ENQU MADE about Mekdes Mesfin",
    "makers.felekeAlt": "Portrait of artisan Feleke",
    "makers.hanaAlt": "Portrait of artisan Hana Getachew",
    "makers.mahletAlt": "Portrait of artisan Mahlet Afework",
    "makers.mekdesAlt": "Portrait of artisan Mekdes Mesfin",
    "story.eyebrow": "ROOTED IN CULTURE, OPEN TO WHAT'S NEXT",
    "story.title": "Every creation carries<br />a piece of <em>where it began.</em>",
    "story.description": "We believe the best way to celebrate a place is to listen to the people who make it what it is. ENQU MADE shares Ethiopian creativity with care, curiosity, and pride.",
    "story.action": "Start a conversation",
    "story.country": "ETHIOPIA",
    "contact.eyebrow": "FOR CUSTOMERS, MAKERS & COLLABORATORS",
    "contact.title": "Let culture travel<br /><em>further.</em>",
    "contact.action": "Contact us",
    "footer.top": "Back to top ↑",
    "cart.open": "Open shopping bag",
    "cart.drawer": "Shopping bag",
    "cart.eyebrow": "YOUR SELECTION",
    "cart.title": "Shopping bag",
    "cart.close": "Close shopping bag",
    "cart.empty": "Your bag is empty. Find a piece with a story to bring home.",
    "cart.remove": "Remove",
    "cart.quantity": "Qty",
    "cart.subtotal": "Subtotal",
    "payment.choose": "Choose a payment method",
    "payment.chapa": "Chapa",
    "payment.international": "For international customers",
    "payment.telebirr": "Telebirr",
    "payment.cbe": "CBE Birr",
    "payment.chapa": "Chapa",
    "payment.card": "Visa / Mastercard (international)",
    "payment.telebirr": "Telebirr",
    "payment.cbe": "CBE Birr",
    "payment.online": "Online payment",
    "payment.mobile": "Mobile money",
    "payment.bank": "Bank transfer",
    "payment.bankNote": "Pay by transfer",
    "payment.cod": "Cash on delivery",
    "payment.codNote": "Pay when delivered",
    "payment.notice": "Payment methods, including Visa and Mastercard for international customers, are not connected yet. Sending an order request does not charge you; ENQU MADE will confirm availability and payment details.",
    "payment.request": "Request order",
    "payment.emailGreeting": "Hello ENQU MADE,",
    "payment.emailRequest": "I would like to request this order:",
    "payment.emailSubtotal": "Subtotal",
    "payment.emailMethod": "Preferred payment method",
    "payment.emailConfirm": "Please confirm availability, delivery, and payment details.",
    "product.add": "Add to bag +",
    "product.added": "Added ✓",
    "product.maker": "Artisan craft",
    "product.labelCoffee": "Coffee ritual",
    "product.labelWoven": "Handwoven",
    "product.labelHeritage": "Heritage",
    "product.labelMusic": "Music",
    "product.labelCarved": "Carved by hand",
    "product.labelArtisan": "Artisan craft",
    "product.qtyOne": "item",
    "product.qtyMany": "items",
    "product.currency": "ETB",
  },
  am: {
    "page.title": "ENQU MADE — ጥበብ፣ ባህል፣ ፈጠራ",
    "meta.description": "የኢትዮጵያን ጥበብ፣ ባህል እና ፈጠራ ከENQU MADE ጋር ያግኙ።",
    "announcement.tagline": "በትርጉም የተሠራ። ሥሩ ኢትዮጵያ ነው።",
    "announcement.link": "ታሪኮቹን ያግኙ",
    "brand.home": "የENQU MADE መነሻ",
    "brand.subtitle": "የኢትዮጵያ ጥበብ እና ባህል",
    "menu.open": "ምናሌውን ክፈት",
    "menu.close": "ምናሌውን ዝጋ",
    "nav.label": "ዋና ምናሌ",
    "nav.home": "መነሻ",
    "nav.shop": "ይግዙ",
    "nav.categories": "ምድቦች",
    "nav.makers": "ፈጣሪዎቻችን",
    "nav.story": "ስለ እኛ",
    "nav.bag": "ቦርሳ",
    "language.label": "ቋንቋ ይምረጡ",
    "hero.label": "የተመረጡ የባህል ታሪኮች",
    "hero.eyebrow1": "ሕያው ቅርስ",
    "hero.title1": "እያንዳንዱ ታሪክ<br /><em>የራሱ ምት አለው።</em>",
    "hero.description1": "በኢትዮጵያ ፈጠራ ቀለም፣ ድምፅ እና መንፈስ ውስጥ ይግቡ። የሚያገናኙንን ታሪኮች ያግኙ።",
    "hero.action1": "የባህል ዕቃዎችን ይግዙ",
    "hero.credit1": "የደስታ ጥበብ",
    "hero.alt1": "ባህላዊ ልብስ የለበሱ ኢትዮጵያውያን ሙዚቀኞችን የሚያሳይ ሥዕል",
    "hero.eyebrow2": "በተፈጥሮው ደፋር",
    "hero.title2": "ዓለምን<br /><em>በተለየ የሚያይ ጥበብ።</em>",
    "hero.description2": "የአዲሱን ትውልድ ኢትዮጵያውያን አርቲስቶች ደማቅ ቀለምና ደፋር አመለካከት ያግኙ።",
    "hero.action2": "አርቲስቶቹን ያግኙ",
    "hero.credit2": "አዲስ አመለካከት",
    "hero.alt2": "ሦስት ኢትዮጵያውያን ሴቶችን የሚያሳይ ዘመናዊ ሥዕል",
    "hero.eyebrow3": "በዘመናት የተቀረጸ",
    "hero.title3": "ባህል ተሸክሞ<br /><em>ወደ ነገ።</em>",
    "hero.description3": "የትውልድ ጥበብ በእያንዳንዱ ዝርዝር፣ ቅጥ እና የብሩሽ ንክኪ ውስጥ ይኖራል።",
    "hero.action3": "የባህል ሥራዎችን ይመልከቱ",
    "hero.credit3": "በቀለም የተላለፈ ቅርስ",
    "hero.alt3": "በቀይ፣ ወርቅማ እና አረንጓዴ ቀለም የተሳለ ባህላዊ የኢትዮጵያ ሥዕል",
    "hero.eyebrow4": "ብዙ ድምፆች፣ አንድ ቤት",
    "hero.title4": "የሚያገናኘንን<br /><em>በአዲስ ዓይን እንይ።</em>",
    "hero.description4": "ዛሬ ኢትዮጵያን የሚቀርጹትን ሰዎች፣ ቦታዎች እና ሐሳቦች ያክብሩ።",
    "hero.action4": "ታሪክ ያለው ዕቃ ያግኙ",
    "hero.credit4": "የማኅበረሰብ ቀለማት",
    "hero.alt4": "ሰዎችንና የኢትዮጵያን መልክዓ ምድር የሚያሳይ ባለቀለም የመስታወት ጥበብ",
    "hero.location": "አዲስ አበባ · ኢትዮጵያ",
    "carousel.label": "የስላይድ መቆጣጠሪያዎች",
    "carousel.previous": "ቀዳሚው ስላይድ",
    "carousel.next": "ቀጣዩ ስላይድ",
    "carousel.choose": "ስላይድ ይምረጡ",
    "carousel.slide1": "ስላይድ 1 አሳይ",
    "carousel.slide2": "ስላይድ 2 አሳይ",
    "carousel.slide3": "ስላይድ 3 አሳይ",
    "carousel.slide4": "ስላይድ 4 አሳይ",
    "carousel.pause": "ስላይዱን ለአፍታ አቁም",
    "carousel.play": "ስላይዱን አጫውት",
    "carousel.pauseText": "አቁም",
    "carousel.playText": "አጫውት",
    "intro.eyebrow": "ለባህል የተዘጋጀ ገበያ",
    "intro.title": "ታሪክ የያዙ<br /><em>ዕቃዎችን ያግኙ።</em>",
    "intro.description": "በእጅ የተሠሩ የእጅ ጥበብ ዕቃዎችን፣ የቡና ሥነ ሥርዓት ዕቃዎችን፣ ባህላዊ ጥበብን እና በኢትዮጵያ ቅርስ የተነሱ ዕቃዎችን ይግዙ። እያንዳንዱ ዕቃ ከፈጠራውና ከባህሉ ጋር ያገናኛችኋል።",
    "intro.action": "ምድቦቹን ይመልከቱ",
    "shop.eyebrow": "የENQU ገበያ",
    "shop.title": "<em>ቅርስ የያዙ</em> ዕቃዎች።",
    "shop.note": "በጥንቃቄ የተመረጡ የባህል ዕደ ጥበብ ሥራዎችና የፈጠራ ውጤቶች።",
    "shop.categories": "የምርት ምድቦች",
    "shop.filters": "ምርቶችን በምድብ ያጣሩ",
    "shop.disclaimer": "የምርት ዝርዝሮችና ዋጋዎች ለዚህ የገበያ ቅድመ እይታ ናሙና ናቸው።",
    "category.all": "ሁሉም ዕቃዎች",
    "category.coffee": "ቡና እና ሸክላ",
    "category.home": "የቤት እና ሽመና",
    "category.music": "ሙዚቃ እና ባህል",
    "category.art": "ጥበብ እና ቅርስ",
    "makers.imageAlt": "የኢትዮጵያን ዘይቤና ፈጠራ የሚያከብር ሥዕል",
    "makers.eyebrow": "በሰዎች የተሠራ፣ በባህል የተቀረጸ",
    "makers.title": "ትርጉም የሚሰጡትን<br /><em>ፈጣሪዎች ያግኙ።</em>",
    "makers.description": "ወደ ቤትዎ ከሚወስዷቸው ዕቃዎች ጀርባ ያሉትን ሰዎች፣ ክህሎቶችና ባህላዊ እውቀት ያግኙ። ገበያችን የእጅ ጥበብንና አብረው የሚጓዙ ታሪኮችን ያከብራል።",
    "makers.action": "ከENQU MADE ጋር ይገናኙ",
    "makers.profilesEyebrow": "ከእጅ ጥበቡ ጀርባ ያሉ ሰዎች",
    "makers.profilesTitle": "<em>የእጅ ጥበብ ፈጣሪዎችን</em> ያግኙ።",
    "makers.profilesDescription": "ፈጠራቸውንና ባህላዊ የእጅ ጥበባቸውን የሚያካፍሉ ሰዎችን ያግኙ።",
    "makers.profileLabel": "የእጅ ጥበብ ፈጣሪ መገለጫ",
    "makers.profileNote": "በENQU MADE የባህል ገበያ የቀረበ የእጅ ጥበብ ፈጣሪ።",
    "makers.felekeAlt": "የእጅ ጥበብ ፈጣሪ ፈለቀ ምስል",
    "makers.hanaAlt": "የእጅ ጥበብ ፈጣሪ ሐና ጌታቸው ምስል",
    "makers.mahletAlt": "የእጅ ጥበብ ፈጣሪ ማህሌት አፈወርቅ ምስል",
    "makers.mekdesAlt": "የእጅ ጥበብ ፈጣሪ መቅደስ መስፍን ምስል",
    "story.eyebrow": "በባህል ሥር የሰደደ፣ ለነገ ዝግጁ",
    "story.title": "እያንዳንዱ ፈጠራ<br /><em>የመጣበትን ቦታ ይይዛል።</em>",
    "story.description": "አንድን ቦታ ለማክበር ምርጡ መንገድ ያንን ቦታ የሚፈጥሩትን ሰዎች ማዳመጥ ነው ብለን እናምናለን። ENQU MADE የኢትዮጵያን ፈጠራ በጥንቃቄ፣ በጉጉትና በኩራት ያካፍላል።",
    "story.action": "ውይይት ይጀምሩ",
    "story.country": "ኢትዮጵያ",
    "contact.eyebrow": "ለደንበኞች፣ ለፈጣሪዎች እና ለተባባሪዎች",
    "contact.title": "ባህል የበለጠ<br /><em>ርቆ ይድረስ።</em>",
    "contact.action": "ያግኙን",
    "footer.top": "ወደ ላይ ይመለሱ ↑",
    "cart.open": "የግዢ ቦርሳውን ክፈት",
    "cart.drawer": "የግዢ ቦርሳ",
    "cart.eyebrow": "የመረጧቸው",
    "cart.title": "የግዢ ቦርሳ",
    "cart.close": "የግዢ ቦርሳውን ዝጋ",
    "cart.empty": "ቦርሳዎ ባዶ ነው። ወደ ቤት የሚወስዱትን ታሪክ ያለው ዕቃ ያግኙ።",
    "cart.remove": "አስወግድ",
    "cart.quantity": "ብዛት",
    "cart.subtotal": "ንዑስ ድምር",
    "payment.choose": "የክፍያ ዘዴ ይምረጡ",
    "payment.online": "የመስመር ላይ ክፍያ",
    "payment.mobile": "የሞባይል ገንዘብ",
    "payment.bank": "የባንክ ዝውውር",
    "payment.bankNote": "በዝውውር ይክፈሉ",
    "payment.cod": "በሚደርስበት ጊዜ ክፍያ",
    "payment.codNote": "ሲደርስ ይክፈሉ",
    "payment.notice": "የክፍያ ዘዴዎቹ ገና አልተገናኙም። የትዕዛዝ ጥያቄ መላክ ክፍያ አያስከፍልም፤ ENQU MADE መኖሩንና የክፍያ ዝርዝሮችን ያረጋግጣል።",
    "payment.request": "ትዕዛዝ ይጠይቁ",
    "payment.emailGreeting": "ሰላም ENQU MADE፣",
    "payment.emailRequest": "ይህን ትዕዛዝ መጠየቅ እፈልጋለሁ፦",
    "payment.emailSubtotal": "ንዑስ ድምር",
    "payment.emailMethod": "የሚመርጡት የክፍያ ዘዴ",
    "payment.emailConfirm": "እባክዎ መኖሩን፣ ማድረሻውንና የክፍያ ዝርዝሮችን ያረጋግጡ።",
    "product.add": "ወደ ቦርሳ ጨምር +",
    "product.added": "ተጨምሯል ✓",
    "product.maker": "የእጅ ጥበብ ሥራ",
    "product.labelCoffee": "የቡና ሥነ ሥርዓት",
    "product.labelWoven": "በእጅ የተሸመነ",
    "product.labelHeritage": "ቅርስ",
    "product.labelMusic": "ሙዚቃ",
    "product.labelCarved": "በእጅ የተቀረጸ",
    "product.labelArtisan": "የእጅ ጥበብ ሥራ",
    "product.qtyOne": "ዕቃ",
    "product.qtyMany": "ዕቃዎች",
    "product.currency": "ብር",
  },
  om: {
    "page.title": "ENQU MADE — Aartii, aadaa, kalaqa",
    "meta.description": "Aadaa, aartii fi kalaqa Itoophiyaa ENQU MADE waliin argadhaa.",
    "announcement.tagline": "Kaayyoodhaan hojjetame. Hidda isaa Itoophiyaa keessaa qaba.",
    "announcement.link": "Seenaa isaanii ilaalaa",
    "brand.home": "Fuula jalqabaa ENQU MADE",
    "brand.subtitle": "AARTII FI AADAA ITOOPHIYAA",
    "menu.open": "Maalimaa bani",
    "menu.close": "Maalimaa cufi",
    "nav.label": "Maalimaa ijoo",
    "nav.home": "Jalqaba",
    "nav.shop": "Bitadhaa",
    "nav.categories": "Ramaddiiwwan",
    "nav.makers": "Hojjettoota keenya",
    "nav.story": "Seenaa keenya",
    "nav.bag": "Borsaa",
    "language.label": "Afaan filadhaa",
    "hero.label": "Seenaawwan aadaa filataman",
    "hero.eyebrow1": "DHALOOTA JIRAATU",
    "hero.title1": "Seenaa hunda keessatti<br /><em>sirni mataa isaa jira.</em>",
    "hero.description1": "Halluu, sagalee fi hafuura kalaqa Itoophiyaa keessa seenaa. Seenaawwan nu walitti hidhan argadhaa.",
    "hero.action1": "Meeshaalee aadaa bitadhaa",
    "hero.credit1": "AARTII AYYAANAA",
    "hero.alt1": "Suuraa muuziqeessota Itoophiyaa uffata aadaa uffatanii fi nama dibbee rukutu agarsiisu",
    "hero.eyebrow2": "UUMAAN IYYUU JABAATA",
    "hero.title2": "Aartii addunyaa<br /><em>karaa addaatiin argu.</em>",
    "hero.description2": "Halluuwwan ifaa fi yaada ija jabina dhaloota haaraa aartistoota Itoophiyaa argadhaa.",
    "hero.action2": "Aartistoota argadhaa",
    "hero.credit2": "ILAALCHA HAARAA",
    "hero.alt2": "Suuraa ammayyaa dubartoota Itoophiyaa sadii agarsiisu",
    "hero.eyebrow3": "YEROO DHEERAADHAAN HOJJETAME",
    "hero.title3": "Aadaan dabarfamee<br /><em>gara boruutti.</em>",
    "hero.description3": "Dandeettiin dhalootaa hundi bal'ina, boca fi tuqaalee buroosii keessatti jiraata.",
    "hero.action3": "Hojiiwwan aadaa ilaalaa",
    "hero.credit3": "DHALOOTA HALLUUN",
    "hero.alt3": "Fakkii amantii aadaa Itoophiyaa diimaa, warqee fi magariisaan hojjetame",
    "hero.eyebrow4": "SAGALEE BAAY'EE, MANA TOKKO",
    "hero.title4": "Waan nu walitti fidu<br /><em>haala haaraan ilaalaa.</em>",
    "hero.description4": "Namoota, iddoowwan fi yaadawwan Itoophiyaa har'a bocan kabajaa.",
    "hero.action4": "Meeshaa seenaa qabu argadhaa",
    "hero.credit4": "HALLUUWWAN HAWAASAA",
    "hero.alt4": "Hojii foddaa halluu qabu namoota fi lafa Itoophiyaa agarsiisu",
    "hero.location": "FINFINNEE · ITOOPHIYAA",
    "carousel.label": "To'annoo suuraa",
    "carousel.previous": "Suuraa duraa",
    "carousel.next": "Suuraa itti aanu",
    "carousel.choose": "Suuraa filadhaa",
    "carousel.slide1": "Suuraa 1 agarsiisi",
    "carousel.slide2": "Suuraa 2 agarsiisi",
    "carousel.slide3": "Suuraa 3 agarsiisi",
    "carousel.slide4": "Suuraa 4 agarsiisi",
    "carousel.pause": "Suuraa dhaabi",
    "carousel.play": "Suuraa taphachiisi",
    "carousel.pauseText": "Dhaabi",
    "carousel.playText": "Taphachiisi",
    "intro.eyebrow": "GABAA AADAA",
    "intro.title": "Meeshaalee<br /><em>seenaa of keessaa qaban argadhaa.</em>",
    "intro.description": "Hojii harkaa, meeshaalee sirna bunaa, aartii aadaa fi meeshaalee hambaa Itoophiyaatiin kaka'an bitadhaa. Meeshaan hundi kalaqaa fi aadaa duuba isaa jiru waliin isin wal qunnamsiisa.",
    "intro.action": "Ramaddiiwwan ilaalaa",
    "shop.eyebrow": "GABAA ENQU",
    "shop.title": "Meeshaalee <em>hambaa qaban.</em>",
    "shop.note": "Hojiiwwan harkaa aadaa fi uumama filataman.",
    "shop.categories": "Ramaddiiwwan oomishaa",
    "shop.filters": "Oomisha ramaddiidhaan calali",
    "shop.disclaimer": "Tarree fi gatiin oomishaa fakkeenya gabaa kanaati.",
    "category.all": "Meeshaalee hunda",
    "category.coffee": "Bunaa fi suphe",
    "category.home": "Mana fi hodhaa",
    "category.music": "Muuziqaa fi aadaa",
    "category.art": "Aartii fi hambaa",
    "makers.imageAlt": "Suuraa akkaataa fi kalaqa Itoophiyaa kabaju",
    "makers.eyebrow": "NAMOOTAAN HOJJETAME, AADAAN BOCAME",
    "makers.title": "Hojjettoota<br /><em>hiika kennan argadhaa.</em>",
    "makers.description": "Namoota, dandeettii fi beekumsa aadaa meeshaalee mana geessan duuba jiran argadhaa. Gabaan keenya hojii harkaa fi seenaa isaa kabaja.",
    "makers.action": "ENQU MADE waliin wal qunnamaa",
    "makers.profilesEyebrow": "NAMOOTA HOJII HARKAA DUUBA JIRAN",
    "makers.profilesTitle": "<em>Hojjettoota harkaa</em> argadhaa.",
    "makers.profilesDescription": "Namoota kalaqa isaanii fi hojii harkaa aadaa qooddatan beekaa.",
    "makers.profileLabel": "SEENSA HOJJETAA HARKAA",
    "makers.profileNote": "Hojjetaa harkaa gabaa aadaa ENQU MADE keessatti dhihaatu.",
    "makers.felekeAlt": "Suuraa hojjetaa harkaa Feleke",
    "makers.hanaAlt": "Suuraa hojjetaa harkaa Hana Getachew",
    "makers.mahletAlt": "Suuraa hojjetaa harkaa Mahlet Afework",
    "makers.mekdesAlt": "Suuraa hojjetaa harkaa Mekdes Mesfin",
    "story.eyebrow": "HIDDA AADAA QABA, BORUUF BANAA DHA",
    "story.title": "Uumamni hundi<br /><em>waan irraa madde qaba.</em>",
    "story.description": "Bakka tokko kabajuuf, namoota isa bocan dhaggeeffachuun gaarii dha jennee amanna. ENQU MADE kalaqa Itoophiyaa kunuunsaan, fedhii fi boonsaan qooda.",
    "story.action": "Mari'iinsa jalqabaa",
    "story.country": "ITOOPHIYAA",
    "contact.eyebrow": "BITTOOTA, HOJJETTOOTA FI WALIIN HOJJETTOOTA",
    "contact.title": "Aadaan haa imalu<br /><em>fagoo ga'uuf.</em>",
    "contact.action": "Nu qunnamaa",
    "footer.top": "Gara gubbaatti deebi'i ↑",
    "cart.open": "Borsaa bittaa bani",
    "cart.drawer": "Borsaa bittaa",
    "cart.eyebrow": "FILANNOO KEESSAN",
    "cart.title": "Borsaa bittaa",
    "cart.close": "Borsaa bittaa cufi",
    "cart.empty": "Borsaan keessan duwwaa dha. Meeshaa seenaa qabu mana geessitan barbaadaa.",
    "cart.remove": "Haqi",
    "cart.quantity": "Baay'ina",
    "cart.subtotal": "Waliigala xiqqaa",
    "payment.choose": "Mala kaffaltii filadhaa",
    "payment.online": "Kaffaltii interneetii",
    "payment.mobile": "Maallaqa moobaayilaa",
    "payment.bank": "Gara baankii dabarsuu",
    "payment.bankNote": "Dabarsaan kaffalaa",
    "payment.cod": "Yeroo geejjibsiisan kaffaluu",
    "payment.codNote": "Yeroo geessan kaffalaa",
    "payment.notice": "Malli kaffaltii ammaaf hin walqabne. Gaaffii ajajaa erguun kaffaltii hin fudhatu; ENQU MADE argamuu fi odeeffannoo kaffaltii mirkaneessa.",
    "payment.request": "Ajaja gaafadhaa",
    "payment.emailGreeting": "Akkam ENQU MADE,",
    "payment.emailRequest": "Ajaja kana gaafachuu nan barbaada:",
    "payment.emailSubtotal": "Waliigala xiqqaa",
    "payment.emailMethod": "Mala kaffaltii filatame",
    "payment.emailConfirm": "Maaloo argamuu, geejjibaa fi kaffaltii mirkaneessaa.",
    "product.add": "Borsaa keessa kaa'i +",
    "product.added": "Dabalame ✓",
    "product.maker": "Hojii harkaa",
    "product.labelCoffee": "Sirna bunaa",
    "product.labelWoven": "Harkaan hodhame",
    "product.labelHeritage": "Hambaa",
    "product.labelMusic": "Muuziqaa",
    "product.labelCarved": "Harkaan bocame",
    "product.labelArtisan": "Hojii harkaa",
    "product.qtyOne": "meeshaa",
    "product.qtyMany": "meeshaalee",
    "product.currency": "ETB",
  },
  pt: {
    "page.title": "ENQU MADE — Arte, cultura e criatividade",
    "meta.description": "Explore a arte, a cultura e a criatividade etíopes com a ENQU MADE.",
    "announcement.tagline": "Feito com propósito. Com raízes na Etiópia.",
    "announcement.link": "Descubra as histórias",
    "brand.home": "Início da ENQU MADE",
    "brand.subtitle": "ARTE E CULTURA ETÍOPES",
    "menu.open": "Abrir navegação",
    "menu.close": "Fechar navegação",
    "nav.label": "Navegação principal",
    "nav.home": "Início",
    "nav.shop": "Loja",
    "nav.categories": "Categorias",
    "nav.makers": "Nossos artesãos",
    "nav.story": "Nossa história",
    "nav.bag": "Sacola",
    "language.label": "Escolha o idioma",
    "hero.label": "Histórias culturais em destaque",
    "hero.eyebrow1": "UMA HERANÇA VIVA",
    "hero.title1": "Onde cada história<br /><em>encontra seu ritmo.</em>",
    "hero.description1": "Entre nas cores, nos sons e no espírito da criatividade etíope. Descubra histórias que nos aproximam.",
    "hero.action1": "Comprar peças culturais",
    "hero.credit1": "A ARTE DE CELEBRAR",
    "hero.alt1": "Pintura colorida de músicos etíopes e um percussionista com roupas tradicionais",
    "hero.eyebrow2": "OUSADA POR NATUREZA",
    "hero.title2": "Uma arte que vê<br /><em>o mundo de outro jeito.</em>",
    "hero.description2": "Conheça as cores vibrantes e as perspectivas corajosas de uma nova geração de artistas etíopes.",
    "hero.action2": "Conhecer os artistas",
    "hero.credit2": "UMA NOVA PERSPECTIVA",
    "hero.alt2": "Pintura contemporânea expressiva de três mulheres etíopes",
    "hero.eyebrow3": "CRIADA AO LONGO DO TEMPO",
    "hero.title3": "A tradição segue<br /><em>rumo ao amanhã.</em>",
    "hero.description3": "Gerações de arte vivem em cada detalhe, padrão e pincelada.",
    "hero.action3": "Explorar artesanato cultural",
    "hero.credit3": "UM LEGADO EM CORES",
    "hero.alt3": "Pintura religiosa tradicional etíope em tons quentes de vermelho, dourado e verde",
    "hero.eyebrow4": "MUITAS VOZES, UM LAR",
    "hero.title4": "Uma imagem mais viva<br /><em>do que nos une.</em>",
    "hero.description4": "Uma celebração das pessoas, dos lugares e das ideias que moldam a Etiópia hoje.",
    "hero.action4": "Encontre uma peça com história",
    "hero.credit4": "CORES DA COMUNIDADE",
    "hero.alt4": "Vitrais vibrantes que retratam pessoas e paisagens etíopes",
    "hero.location": "ADIS ABEBA · ETIÓPIA",
    "carousel.label": "Controles da apresentação",
    "carousel.previous": "Slide anterior",
    "carousel.next": "Próximo slide",
    "carousel.choose": "Escolha um slide",
    "carousel.slide1": "Mostrar slide 1",
    "carousel.slide2": "Mostrar slide 2",
    "carousel.slide3": "Mostrar slide 3",
    "carousel.slide4": "Mostrar slide 4",
    "carousel.pause": "Pausar apresentação",
    "carousel.play": "Retomar apresentação",
    "carousel.pauseText": "Pausar",
    "carousel.playText": "Reproduzir",
    "intro.eyebrow": "UM MERCADO DE CULTURA",
    "intro.title": "Descubra objetos<br /><em>que carregam histórias.</em>",
    "intro.description": "Compre artesanato, peças para a cerimônia do café, arte tradicional e objetos inspirados na herança etíope. Cada peça aproxima você da criatividade e da cultura por trás dela.",
    "intro.action": "Explorar categorias",
    "shop.eyebrow": "O MERCADO ENQU",
    "shop.title": "Objetos com <em>herança.</em>",
    "shop.note": "Uma seleção cuidadosa de artesanato cultural e criações originais.",
    "shop.categories": "Categorias de produtos",
    "shop.filters": "Filtrar produtos por categoria",
    "shop.disclaimer": "Produtos e preços são exemplos para esta prévia do mercado.",
    "category.all": "Todas as peças",
    "category.coffee": "Café e cerâmica",
    "category.home": "Casa e cestos",
    "category.music": "Música e cultura",
    "category.art": "Arte e herança",
    "makers.imageAlt": "Ilustração que celebra o estilo e a criatividade etíopes",
    "makers.eyebrow": "FEITO POR PESSOAS, MOLDADO PELA CULTURA",
    "makers.title": "Conheça quem cria<br /><em>com tanto significado.</em>",
    "makers.description": "Conheça as pessoas, as habilidades e os saberes culturais por trás do que você leva para casa. Nosso mercado celebra o artesanato e as histórias que o acompanham.",
    "makers.action": "Conecte-se com a ENQU MADE",
    "makers.profilesEyebrow": "AS PESSOAS POR TRÁS DO ARTESANATO",
    "makers.profilesTitle": "Conheça os <em>artesãos.</em>",
    "makers.profilesDescription": "Conheça quem compartilha sua criatividade e seu artesanato cultural.",
    "makers.profileLabel": "PERFIL DE ARTESÃO",
    "makers.profileNote": "Um artesão em destaque no mercado cultural da ENQU MADE.",
    "makers.felekeAlt": "Retrato do artesão Feleke",
    "makers.hanaAlt": "Retrato da artesã Hana Getachew",
    "makers.mahletAlt": "Retrato da artesã Mahlet Afework",
    "makers.mekdesAlt": "Retrato da artesã Mekdes Mesfin",
    "story.eyebrow": "COM RAÍZES NA CULTURA, ABERTO AO FUTURO",
    "story.title": "Cada criação leva<br /><em>um pedaço de sua origem.</em>",
    "story.description": "Acreditamos que a melhor forma de celebrar um lugar é ouvir quem o torna único. A ENQU MADE compartilha a criatividade etíope com cuidado, curiosidade e orgulho.",
    "story.action": "Começar uma conversa",
    "story.country": "ETIÓPIA",
    "contact.eyebrow": "PARA CLIENTES, ARTESÃOS E PARCEIROS",
    "contact.title": "Leve a cultura<br /><em>mais longe.</em>",
    "contact.action": "Fale conosco",
    "footer.top": "Voltar ao topo ↑",
    "cart.open": "Abrir sacola de compras",
    "cart.drawer": "Sacola de compras",
    "cart.eyebrow": "SUA SELEÇÃO",
    "cart.title": "Sacola de compras",
    "cart.close": "Fechar sacola",
    "cart.empty": "Sua sacola está vazia. Encontre uma peça com história para levar para casa.",
    "cart.remove": "Remover",
    "cart.quantity": "Qtd.",
    "cart.subtotal": "Subtotal",
    "payment.choose": "Escolha uma forma de pagamento",
    "payment.online": "Pagamento online",
    "payment.mobile": "Dinheiro móvel",
    "payment.bank": "Transferência bancária",
    "payment.bankNote": "Pague por transferência",
    "payment.cod": "Pagamento na entrega",
    "payment.codNote": "Pague ao receber",
    "payment.notice": "As formas de pagamento ainda não estão conectadas. Enviar um pedido não gera cobrança; a ENQU MADE confirmará a disponibilidade e os dados de pagamento.",
    "payment.request": "Solicitar pedido",
    "payment.emailGreeting": "Olá, ENQU MADE,",
    "payment.emailRequest": "Gostaria de solicitar este pedido:",
    "payment.emailSubtotal": "Subtotal",
    "payment.emailMethod": "Forma de pagamento preferida",
    "payment.emailConfirm": "Confirme a disponibilidade, a entrega e os dados de pagamento, por favor.",
    "product.add": "Adicionar à sacola +",
    "product.added": "Adicionado ✓",
    "product.maker": "Artesanato",
    "product.labelCoffee": "Ritual do café",
    "product.labelWoven": "Feito à mão",
    "product.labelHeritage": "Herança",
    "product.labelMusic": "Música",
    "product.labelCarved": "Talhado à mão",
    "product.labelArtisan": "Artesanato",
    "product.qtyOne": "item",
    "product.qtyMany": "itens",
    "product.currency": "ETB",
  },
  it: {
    "page.title": "ENQU MADE — Arte, cultura e creatività",
    "meta.description": "Scopri l'arte, la cultura e la creatività etiopi con ENQU MADE.",
    "announcement.tagline": "Creato con cura. Con radici in Etiopia.",
    "announcement.link": "Scopri le storie",
    "brand.home": "Home ENQU MADE",
    "brand.subtitle": "ARTE E CULTURA ETIOPI",
    "menu.open": "Apri la navigazione",
    "menu.close": "Chiudi la navigazione",
    "nav.label": "Navigazione principale",
    "nav.home": "Home",
    "nav.shop": "Acquista",
    "nav.categories": "Categorie",
    "nav.makers": "I nostri artigiani",
    "nav.story": "La nostra storia",
    "nav.bag": "Borsa",
    "language.label": "Scegli la lingua",
    "hero.label": "Storie culturali in evidenza",
    "hero.eyebrow1": "UN PATRIMONIO VIVO",
    "hero.title1": "Dove ogni storia<br /><em>trova il suo ritmo.</em>",
    "hero.description1": "Entra nei colori, nei suoni e nello spirito della creatività etiope. Scopri le storie che ci uniscono.",
    "hero.action1": "Acquista oggetti culturali",
    "hero.credit1": "L'ARTE DI CELEBRARE",
    "hero.alt1": "Dipinto colorato di musicisti etiopi e un percussionista in abiti tradizionali",
    "hero.eyebrow2": "AUDACE PER NATURA",
    "hero.title2": "Un'arte che vede<br /><em>il mondo in modo diverso.</em>",
    "hero.description2": "Scopri i colori vivaci e gli sguardi coraggiosi di una nuova generazione di artisti etiopi.",
    "hero.action2": "Incontra gli artisti",
    "hero.credit2": "UNA NUOVA PROSPETTIVA",
    "hero.alt2": "Dipinto contemporaneo espressivo di tre donne etiopi",
    "hero.eyebrow3": "CREATO NEL TEMPO",
    "hero.title3": "La tradizione viaggia<br /><em>verso il domani.</em>",
    "hero.description3": "Generazioni di arte vivono in ogni dettaglio, motivo e pennellata.",
    "hero.action3": "Esplora l'artigianato culturale",
    "hero.credit3": "UN'EREDITÀ DI COLORI",
    "hero.alt3": "Dipinto religioso tradizionale etiope nei toni caldi del rosso, oro e verde",
    "hero.eyebrow4": "MOLTE VOCI, UNA CASA",
    "hero.title4": "Un'immagine più luminosa<br /><em>di ciò che ci unisce.</em>",
    "hero.description4": "Un omaggio alle persone, ai luoghi e alle idee che plasmano l'Etiopia di oggi.",
    "hero.action4": "Trova un oggetto con una storia",
    "hero.credit4": "I COLORI DELLA COMUNITÀ",
    "hero.alt4": "Vetrata colorata che raffigura persone e paesaggi etiopi",
    "hero.location": "ADDIS ABEBA · ETIOPIA",
    "carousel.label": "Controlli della presentazione",
    "carousel.previous": "Diapositiva precedente",
    "carousel.next": "Diapositiva successiva",
    "carousel.choose": "Scegli una diapositiva",
    "carousel.slide1": "Mostra diapositiva 1",
    "carousel.slide2": "Mostra diapositiva 2",
    "carousel.slide3": "Mostra diapositiva 3",
    "carousel.slide4": "Mostra diapositiva 4",
    "carousel.pause": "Metti in pausa la presentazione",
    "carousel.play": "Riprendi la presentazione",
    "carousel.pauseText": "Pausa",
    "carousel.playText": "Avvia",
    "intro.eyebrow": "UN MERCATO PER LA CULTURA",
    "intro.title": "Scopri oggetti<br /><em>che custodiscono una storia.</em>",
    "intro.description": "Acquista artigianato, oggetti per la cerimonia del caffè, arte tradizionale e creazioni ispirate al patrimonio etiope. Ogni pezzo ti avvicina alla creatività e alla cultura che lo hanno ispirato.",
    "intro.action": "Esplora le categorie",
    "shop.eyebrow": "IL MERCATO ENQU",
    "shop.title": "Oggetti con <em>una storia.</em>",
    "shop.note": "Una selezione curata di artigianato culturale e creazioni originali.",
    "shop.categories": "Categorie di prodotti",
    "shop.filters": "Filtra i prodotti per categoria",
    "shop.disclaimer": "Prodotti e prezzi sono esempi per questa anteprima del mercato.",
    "category.all": "Tutti gli articoli",
    "category.coffee": "Caffè e ceramica",
    "category.home": "Casa e intrecci",
    "category.music": "Musica e cultura",
    "category.art": "Arte e patrimonio",
    "makers.imageAlt": "Illustrazione che celebra lo stile e la creatività etiopi",
    "makers.eyebrow": "CREATO DALLE PERSONE, PLASMATO DALLA CULTURA",
    "makers.title": "Incontra gli artigiani<br /><em>e le loro storie.</em>",
    "makers.description": "Scopri le persone, le competenze e il sapere culturale dietro agli oggetti che porti a casa. Il nostro mercato celebra l'artigianato e le storie che lo accompagnano.",
    "makers.action": "Entra in contatto con ENQU MADE",
    "makers.profilesEyebrow": "LE PERSONE DIETRO L'ARTIGIANATO",
    "makers.profilesTitle": "Incontra gli <em>artigiani.</em>",
    "makers.profilesDescription": "Scopri le persone che condividono la loro creatività e il loro artigianato culturale.",
    "makers.profileLabel": "PROFILO ARTIGIANO",
    "makers.profileNote": "Un artigiano presentato nel mercato culturale ENQU MADE.",
    "makers.felekeAlt": "Ritratto dell'artigiano Feleke",
    "makers.hanaAlt": "Ritratto dell'artigiana Hana Getachew",
    "makers.mahletAlt": "Ritratto dell'artigiana Mahlet Afework",
    "makers.mekdesAlt": "Ritratto dell'artigiana Mekdes Mesfin",
    "story.eyebrow": "RADICATI NELLA CULTURA, APERTI AL FUTURO",
    "story.title": "Ogni creazione custodisce<br /><em>un pezzo delle sue origini.</em>",
    "story.description": "Crediamo che il modo migliore per celebrare un luogo sia ascoltare chi lo rende speciale. ENQU MADE condivide la creatività etiope con cura, curiosità e orgoglio.",
    "story.action": "Inizia una conversazione",
    "story.country": "ETIOPIA",
    "contact.eyebrow": "PER CLIENTI, ARTIGIANI E COLLABORATORI",
    "contact.title": "Lasciamo viaggiare<br /><em>la cultura.</em>",
    "contact.action": "Contattaci",
    "footer.top": "Torna su ↑",
    "cart.open": "Apri la borsa degli acquisti",
    "cart.drawer": "Borsa degli acquisti",
    "cart.eyebrow": "LA TUA SELEZIONE",
    "cart.title": "Borsa degli acquisti",
    "cart.close": "Chiudi la borsa",
    "cart.empty": "La borsa è vuota. Trova un oggetto con una storia da portare a casa.",
    "cart.remove": "Rimuovi",
    "cart.quantity": "Q.tà",
    "cart.subtotal": "Subtotale",
    "payment.choose": "Scegli un metodo di pagamento",
    "payment.online": "Pagamento online",
    "payment.mobile": "Denaro mobile",
    "payment.bank": "Bonifico bancario",
    "payment.bankNote": "Paga con bonifico",
    "payment.cod": "Pagamento alla consegna",
    "payment.codNote": "Paga alla consegna",
    "payment.notice": "I pagamenti non sono ancora collegati. Inviare una richiesta d'ordine non comporta alcun addebito; ENQU MADE confermerà disponibilità e dettagli di pagamento.",
    "payment.request": "Richiedi l'ordine",
    "payment.emailGreeting": "Ciao ENQU MADE,",
    "payment.emailRequest": "Vorrei richiedere questo ordine:",
    "payment.emailSubtotal": "Subtotale",
    "payment.emailMethod": "Metodo di pagamento preferito",
    "payment.emailConfirm": "Confermate disponibilità, consegna e dettagli di pagamento.",
    "product.add": "Aggiungi alla borsa +",
    "product.added": "Aggiunto ✓",
    "product.maker": "Artigianato",
    "product.labelCoffee": "Rito del caffè",
    "product.labelWoven": "Intrecciato a mano",
    "product.labelHeritage": "Patrimonio",
    "product.labelMusic": "Musica",
    "product.labelCarved": "Intagliato a mano",
    "product.labelArtisan": "Artigianato",
    "product.qtyOne": "articolo",
    "product.qtyMany": "articoli",
    "product.currency": "ETB",
  },
  fr: {
    "page.title": "ENQU MADE — Art, culture et créativité",
    "meta.description": "Découvrez l'art, la culture et la créativité éthiopiens avec ENQU MADE.",
    "announcement.tagline": "Créé avec sens. Ancré en Éthiopie.",
    "announcement.link": "Découvrez les histoires",
    "brand.home": "Accueil ENQU MADE",
    "brand.subtitle": "ART ET CULTURE ÉTHIOPIENS",
    "menu.open": "Ouvrir la navigation",
    "menu.close": "Fermer la navigation",
    "nav.label": "Navigation principale",
    "nav.home": "Accueil",
    "nav.shop": "Boutique",
    "nav.categories": "Catégories",
    "nav.makers": "Nos créateurs",
    "nav.story": "Notre histoire",
    "nav.bag": "Panier",
    "language.label": "Choisir la langue",
    "hero.label": "Récits culturels à la une",
    "hero.eyebrow1": "UN HÉRITAGE VIVANT",
    "hero.title1": "Là où chaque histoire<br /><em>trouve son rythme.</em>",
    "hero.description1": "Entrez dans les couleurs, les sons et l'esprit de la créativité éthiopienne. Découvrez les histoires qui nous rapprochent.",
    "hero.action1": "Acheter des pièces culturelles",
    "hero.credit1": "L'ART DE CÉLÉBRER",
    "hero.alt1": "Peinture colorée de musiciens éthiopiens et d'un percussionniste en tenue traditionnelle",
    "hero.eyebrow2": "AUDACIEUSE PAR NATURE",
    "hero.title2": "Un art qui voit<br /><em>le monde autrement.</em>",
    "hero.description2": "Découvrez les couleurs vives et les regards audacieux d'une nouvelle génération d'artistes éthiopiens.",
    "hero.action2": "Rencontrer les artistes",
    "hero.credit2": "UN NOUVEAU REGARD",
    "hero.alt2": "Peinture contemporaine expressive de trois femmes éthiopiennes",
    "hero.eyebrow3": "FAÇONNÉ AU FIL DU TEMPS",
    "hero.title3": "La tradition se transmet<br /><em>vers demain.</em>",
    "hero.description3": "Des générations de savoir-faire vivent dans chaque détail, motif et coup de pinceau.",
    "hero.action3": "Explorer l'artisanat culturel",
    "hero.credit3": "UN HÉRITAGE EN COULEURS",
    "hero.alt3": "Peinture religieuse traditionnelle éthiopienne aux tons chauds rouges, dorés et verts",
    "hero.eyebrow4": "PLUSIEURS VOIX, UN FOYER",
    "hero.title4": "Une image plus lumineuse<br /><em>de ce qui nous relie.</em>",
    "hero.description4": "Une célébration des personnes, des lieux et des idées qui façonnent l'Éthiopie d'aujourd'hui.",
    "hero.action4": "Trouver une pièce qui a une histoire",
    "hero.credit4": "LES COULEURS DE LA COMMUNAUTÉ",
    "hero.alt4": "Vitrail coloré représentant des personnes et des paysages éthiopiens",
    "hero.location": "ADDIS-ABEBA · ÉTHIOPIE",
    "carousel.label": "Commandes du diaporama",
    "carousel.previous": "Diapositive précédente",
    "carousel.next": "Diapositive suivante",
    "carousel.choose": "Choisir une diapositive",
    "carousel.slide1": "Afficher la diapositive 1",
    "carousel.slide2": "Afficher la diapositive 2",
    "carousel.slide3": "Afficher la diapositive 3",
    "carousel.slide4": "Afficher la diapositive 4",
    "carousel.pause": "Mettre le diaporama en pause",
    "carousel.play": "Reprendre le diaporama",
    "carousel.pauseText": "Pause",
    "carousel.playText": "Lire",
    "intro.eyebrow": "UNE PLACE DE MARCHÉ POUR LA CULTURE",
    "intro.title": "Découvrez des objets<br /><em>porteurs d'une histoire.</em>",
    "intro.description": "Achetez de l'artisanat, des pièces pour la cérémonie du café, de l'art traditionnel et des objets inspirés du patrimoine éthiopien. Chaque pièce vous relie à la créativité et à la culture qui l'ont façonnée.",
    "intro.action": "Explorer les catégories",
    "shop.eyebrow": "LA PLACE DE MARCHÉ ENQU",
    "shop.title": "Des objets <em>chargés d'histoire.</em>",
    "shop.note": "Une sélection soignée d'artisanat culturel et de créations originales.",
    "shop.categories": "Catégories de produits",
    "shop.filters": "Filtrer les produits par catégorie",
    "shop.disclaimer": "Les produits et les prix sont des exemples pour cet aperçu de la place de marché.",
    "category.all": "Toutes les pièces",
    "category.coffee": "Café et poterie",
    "category.home": "Maison et vannerie",
    "category.music": "Musique et culture",
    "category.art": "Art et patrimoine",
    "makers.imageAlt": "Illustration célébrant le style et la créativité éthiopiens",
    "makers.eyebrow": "FAIT PAR DES PERSONNES, FAÇONNÉ PAR LA CULTURE",
    "makers.title": "Rencontrez les créateurs<br /><em>et leurs histoires.</em>",
    "makers.description": "Découvrez les personnes, les savoir-faire et les connaissances culturelles derrière les objets que vous emportez. Notre place de marché célèbre l'artisanat et les récits qui l'accompagnent.",
    "makers.action": "Échanger avec ENQU MADE",
    "makers.profilesEyebrow": "LES PERSONNES DERRIÈRE L'ARTISANAT",
    "makers.profilesTitle": "Rencontrez les <em>artisans.</em>",
    "makers.profilesDescription": "Découvrez les personnes qui partagent leur créativité et leur savoir-faire culturel.",
    "makers.profileLabel": "PROFIL D'ARTISAN",
    "makers.profileNote": "Un artisan présenté sur la place de marché culturelle ENQU MADE.",
    "makers.felekeAlt": "Portrait de l'artisan Feleke",
    "makers.hanaAlt": "Portrait de l'artisane Hana Getachew",
    "makers.mahletAlt": "Portrait de l'artisane Mahlet Afework",
    "makers.mekdesAlt": "Portrait de l'artisane Mekdes Mesfin",
    "story.eyebrow": "ANCRÉS DANS LA CULTURE, TOURNÉS VERS L'AVENIR",
    "story.title": "Chaque création porte<br /><em>une part de ses origines.</em>",
    "story.description": "Nous croyons que la meilleure façon de célébrer un lieu est d'écouter celles et ceux qui le façonnent. ENQU MADE partage la créativité éthiopienne avec soin, curiosité et fierté.",
    "story.action": "Entamer la conversation",
    "story.country": "ÉTHIOPIE",
    "contact.eyebrow": "POUR LES CLIENTS, LES CRÉATEURS ET LES PARTENAIRES",
    "contact.title": "Faisons voyager<br /><em>la culture.</em>",
    "contact.action": "Nous contacter",
    "footer.top": "Retour en haut ↑",
    "cart.open": "Ouvrir le panier",
    "cart.drawer": "Panier",
    "cart.eyebrow": "VOTRE SÉLECTION",
    "cart.title": "Panier",
    "cart.close": "Fermer le panier",
    "cart.empty": "Votre panier est vide. Trouvez une pièce avec une histoire à emporter.",
    "cart.remove": "Retirer",
    "cart.quantity": "Qté",
    "cart.subtotal": "Sous-total",
    "payment.choose": "Choisissez un mode de paiement",
    "payment.online": "Paiement en ligne",
    "payment.mobile": "Argent mobile",
    "payment.bank": "Virement bancaire",
    "payment.bankNote": "Payer par virement",
    "payment.cod": "Paiement à la livraison",
    "payment.codNote": "Payer à la réception",
    "payment.notice": "Les paiements ne sont pas encore connectés. L'envoi d'une demande de commande ne vous facture rien ; ENQU MADE confirmera la disponibilité et les modalités de paiement.",
    "payment.request": "Demander la commande",
    "payment.emailGreeting": "Bonjour ENQU MADE,",
    "payment.emailRequest": "Je souhaite demander cette commande :",
    "payment.emailSubtotal": "Sous-total",
    "payment.emailMethod": "Mode de paiement souhaité",
    "payment.emailConfirm": "Veuillez confirmer la disponibilité, la livraison et les modalités de paiement.",
    "product.add": "Ajouter au panier +",
    "product.added": "Ajouté ✓",
    "product.maker": "Artisanat",
    "product.labelCoffee": "Rituel du café",
    "product.labelWoven": "Tissé à la main",
    "product.labelHeritage": "Patrimoine",
    "product.labelMusic": "Musique",
    "product.labelCarved": "Sculpté à la main",
    "product.labelArtisan": "Artisanat",
    "product.qtyOne": "article",
    "product.qtyMany": "articles",
    "product.currency": "ETB",
  },
  zh: {
    "page.title": "ENQU MADE — 艺术、文化与创意",
    "meta.description": "与 ENQU MADE 一起探索埃塞俄比亚的艺术、文化与创意。",
    "announcement.tagline": "匠心制作，根植埃塞俄比亚。",
    "announcement.link": "探索背后的故事",
    "brand.home": "ENQU MADE 首页",
    "brand.subtitle": "埃塞俄比亚艺术与文化",
    "menu.open": "打开导航",
    "menu.close": "关闭导航",
    "nav.label": "主导航",
    "nav.home": "首页",
    "nav.shop": "选购",
    "nav.categories": "分类",
    "nav.makers": "创作者",
    "nav.story": "品牌故事",
    "nav.bag": "购物袋",
    "language.label": "选择语言",
    "hero.label": "精选文化故事",
    "hero.eyebrow1": "鲜活传承",
    "hero.title1": "每一个故事<br /><em>都有自己的节奏。</em>",
    "hero.description1": "走进埃塞俄比亚创意的色彩、声音与精神，发现让我们彼此相连的故事。",
    "hero.action1": "选购文化作品",
    "hero.credit1": "庆典的艺术",
    "hero.alt1": "描绘身着传统服饰的埃塞俄比亚乐师和鼓手的彩色画作",
    "hero.eyebrow2": "天生大胆",
    "hero.title2": "以不同的眼光<br /><em>看见世界。</em>",
    "hero.description2": "认识新一代埃塞俄比亚艺术家鲜明的色彩与大胆视角。",
    "hero.action2": "认识艺术家",
    "hero.credit2": "全新视角",
    "hero.alt2": "描绘三位埃塞俄比亚女性的当代表现主义画作",
    "hero.eyebrow3": "历经岁月雕琢",
    "hero.title3": "传统不断延续，<br /><em>走向明天。</em>",
    "hero.description3": "世代传承的技艺，融于每个细节、纹样与笔触之中。",
    "hero.action3": "探索文化手工艺",
    "hero.credit3": "色彩中的传承",
    "hero.alt3": "以红、金、绿暖色调绘制的埃塞俄比亚传统宗教画",
    "hero.eyebrow4": "声音万千，同属一方",
    "hero.title4": "用更明亮的视角<br /><em>看见彼此的联结。</em>",
    "hero.description4": "致敬塑造今日埃塞俄比亚的人们、土地与思想。",
    "hero.action4": "寻找一件有故事的作品",
    "hero.credit4": "社区的色彩",
    "hero.alt4": "描绘人物与埃塞俄比亚风景的彩色玻璃艺术作品",
    "hero.location": "亚的斯亚贝巴 · 埃塞俄比亚",
    "carousel.label": "轮播图控制",
    "carousel.previous": "上一张",
    "carousel.next": "下一张",
    "carousel.choose": "选择轮播图",
    "carousel.slide1": "显示第1张",
    "carousel.slide2": "显示第2张",
    "carousel.slide3": "显示第3张",
    "carousel.slide4": "显示第4张",
    "carousel.pause": "暂停轮播",
    "carousel.play": "播放轮播",
    "carousel.pauseText": "暂停",
    "carousel.playText": "播放",
    "intro.eyebrow": "文化创意市集",
    "intro.title": "发现承载故事的<br /><em>文化之物。</em>",
    "intro.description": "选购手工艺品、咖啡仪式用品、传统艺术，以及灵感源自埃塞俄比亚文化遗产的作品。每件作品都连接着背后的创意与文化。",
    "intro.action": "浏览分类",
    "shop.eyebrow": "ENQU 精选市集",
    "shop.title": "承载<em>文化传承</em>的作品。",
    "shop.note": "精心甄选的文化手工艺品与创意作品。",
    "shop.categories": "商品分类",
    "shop.filters": "按分类筛选商品",
    "shop.disclaimer": "商品与价格为本市集预览示例。",
    "category.all": "全部作品",
    "category.coffee": "咖啡与陶器",
    "category.home": "家居与编织",
    "category.music": "音乐与文化",
    "category.art": "艺术与传承",
    "makers.imageAlt": "展现埃塞俄比亚风格与创意的插画",
    "makers.eyebrow": "由人创造，以文化塑形",
    "makers.title": "认识创作者，<br /><em>聆听作品背后的故事。</em>",
    "makers.description": "了解带回家的作品背后的人们、技艺与文化知识。我们的市集珍视手工艺，也珍视随作品一同流传的故事。",
    "makers.action": "联系 ENQU MADE",
    "makers.profilesEyebrow": "手工艺背后的人们",
    "makers.profilesTitle": "认识<em>手工艺创作者。</em>",
    "makers.profilesDescription": "认识分享创意与传统手工技艺的创作者。",
    "makers.profileLabel": "创作者档案",
    "makers.profileNote": "ENQU MADE 文化市集精选的手工艺创作者。",
    "makers.felekeAlt": "手工艺创作者 Feleke 的肖像",
    "makers.hanaAlt": "手工艺创作者 Hana Getachew 的肖像",
    "makers.mahletAlt": "手工艺创作者 Mahlet Afework 的肖像",
    "makers.mekdesAlt": "手工艺创作者 Mekdes Mesfin 的肖像",
    "story.eyebrow": "根植文化，面向未来",
    "story.title": "每一件创作，<br /><em>都承载着它的来处。</em>",
    "story.description": "我们相信，庆祝一个地方的最好方式，是倾听创造它的人。ENQU MADE 满怀关怀、好奇与自豪，分享埃塞俄比亚的创意。",
    "story.action": "开始交流",
    "story.country": "埃塞俄比亚",
    "contact.eyebrow": "面向顾客、创作者与合作伙伴",
    "contact.title": "让文化走得<br /><em>更远。</em>",
    "contact.action": "联系我们",
    "footer.top": "返回顶部 ↑",
    "cart.open": "打开购物袋",
    "cart.drawer": "购物袋",
    "cart.eyebrow": "已选商品",
    "cart.title": "购物袋",
    "cart.close": "关闭购物袋",
    "cart.empty": "购物袋还是空的。带一件有故事的作品回家吧。",
    "cart.remove": "移除",
    "cart.quantity": "数量",
    "cart.subtotal": "小计",
    "payment.choose": "选择付款方式",
    "payment.online": "在线支付",
    "payment.mobile": "手机支付",
    "payment.bank": "银行转账",
    "payment.bankNote": "通过转账付款",
    "payment.cod": "货到付款",
    "payment.codNote": "送达时付款",
    "payment.notice": "付款方式尚未接入。提交订单请求不会扣款；ENQU MADE 将确认商品库存及付款详情。",
    "payment.request": "提交订单请求",
    "payment.emailGreeting": "您好，ENQU MADE：",
    "payment.emailRequest": "我想订购以下商品：",
    "payment.emailSubtotal": "小计",
    "payment.emailMethod": "首选付款方式",
    "payment.emailConfirm": "请确认商品库存、配送与付款详情。",
    "product.add": "加入购物袋 +",
    "product.added": "已加入 ✓",
    "product.maker": "手工艺",
    "product.labelCoffee": "咖啡仪式",
    "product.labelWoven": "手工编织",
    "product.labelHeritage": "文化传承",
    "product.labelMusic": "音乐",
    "product.labelCarved": "手工雕刻",
    "product.labelArtisan": "手工艺",
    "product.qtyOne": "件",
    "product.qtyMany": "件",
    "product.currency": "ETB",
  },
};

const productMessages = {
  jebena: {
    am: ["ባህላዊ የሸክላ ጀበና", "በኢትዮጵያ የቡና ሥነ ሥርዓት የተነሳ የሸክላ ቡና ማፍያ።"],
    om: ["Jebena suphee aadaa", "Qodaa bunaa suphee sirna bunaa Itoophiyaa irraa kaka'e."],
    pt: ["Jebena tradicional de barro", "Jarra de barro inspirada na cerimônia etíope do café."],
    it: ["Jebena tradizionale in terracotta", "Una caffettiera in terracotta ispirata alla cerimonia etiope del caffè."],
    fr: ["Jebena traditionnel en terre cuite", "Une cafetière en terre cuite inspirée de la cérémonie éthiopienne du café."],
    zh: ["传统陶土咖啡壶", "灵感源自埃塞俄比亚咖啡仪式的陶土咖啡壶。"],
  },
  "woven-tray": {
    am: ["ባለቀለም የተሸመነ ትሪ", "ለማቅረብ ወይም ለቤት ማስዋቢያ የሚሆን ደማቅ የሽመና ዕቃ።"],
    om: ["Sinii hodhamaa halluu qabu", "Hojii hodhaa ifaa dhiheessuuf yookaan mana miidhagsuuf."],
    pt: ["Bandeja colorida trançada", "Uma peça vibrante para servir ou decorar a casa."],
    it: ["Vassoio intrecciato colorato", "Un vivace complemento per servire o decorare la casa."],
    fr: ["Plateau tressé coloré", "Une pièce colorée pour servir ou décorer la maison."],
    zh: ["彩色编织托盘", "色彩鲜明，可用于盛放物品或装饰家居。"],
  },
  "hand-cross": {
    am: ["የኢትዮጵያ የእጅ መስቀል", "በባህላዊ ቅርጽና በዝርዝር ክፍት ቅርጽ የተሠራ ማስዋቢያ።"],
    om: ["Fannoo harka Itoophiyaa", "Miidhagina aadaa fi bocawwan bal'inaan qindaa'an."],
    pt: ["Cruz etíope de mão", "Uma peça ornamental com desenhos tradicionais detalhados."],
    it: ["Croce etiope da mano", "Oggetto ornamentale con trafori e dettagli tradizionali."],
    fr: ["Croix éthiopienne à main", "Une pièce ornementale aux motifs ajourés traditionnels."],
    zh: ["埃塞俄比亚手持十字架", "采用传统镂空工艺与精细纹样的装饰作品。"],
  },
  djembe: {
    am: ["በእጅ የተቀረጸ ጄምቤ", "በምሥራቅ አፍሪካ የሙዚቃ ባህል የተነሳ የተቀረጸ ከበሮ።"],
    om: ["Djembe harkaan bocame", "Dibbee bocame aadaa muuziqaa Afrikaa Bahaa irraa kaka'e."],
    pt: ["Djembe esculpido à mão", "Tambor esculpido inspirado nas tradições musicais da África Oriental."],
    it: ["Djembe intagliato a mano", "Tamburo intagliato ispirato alle tradizioni musicali dell'Africa orientale."],
    fr: ["Djembe sculpté à la main", "Un tambour sculpté inspiré des traditions musicales d'Afrique de l'Est."],
    zh: ["手工雕刻金贝鼓", "灵感源自东非音乐传统的雕刻木鼓。"],
  },
  "wooden-spoon": {
    am: ["የተቀረጸ ማቅረቢያ ማንኪያ", "በተቀረጸ የእጅ ያጌጠ የእንጨት ማንኪያ።"],
    om: ["Spoonii nyaata dhiheessuuf bocame", "Spoonii mukaa faaya harkaan bocame qabu."],
    pt: ["Colher de servir entalhada", "Colher de madeira entalhada com cabo decorado."],
    it: ["Cucchiaio da portata intagliato", "Cucchiaio in legno con manico scolpito e decorato."],
    fr: ["Cuillère de service sculptée", "Cuillère en bois ornée d'un manche sculpté."],
    zh: ["雕刻木制餐勺", "手工雕刻的木勺，柄部带有精美纹饰。"],
  },
  "coffee-mortar": {
    am: ["የቡና ሥነ ሥርዓት ሙቀራ", "ቡናና ቅመሞችን ለመደቁስ የሚሆን የእንጨት ሙቀራና ወንፊት።"],
    om: ["Mara bunaa", "Mara fi ulee muka bunaa fi mi'eessuuf oolu."],
    pt: ["Pilão para a cerimônia do café", "Pilão de madeira para preparar café e especiarias."],
    it: ["Mortaio per la cerimonia del caffè", "Mortaio in legno per preparare caffè e spezie."],
    fr: ["Mortier pour la cérémonie du café", "Mortier en bois pour préparer le café et les épices."],
    zh: ["咖啡仪式研钵", "用于研磨咖啡豆和香料的木制研钵与杵。"],
  },
  headrest: {
    am: ["የተቀረጸ የእንጨት መተኛ መደገፊያ", "የእንጨት ቅርጻ ቅርጽ ጥበብን የሚያሳይ ዕቃ።"],
    om: ["Mataa irratti boqonnaa mukaa", "Meeshaa bocni mukaa fi faayni isaa mul'isu."],
    pt: ["Apoio de cabeça em madeira entalhada", "Peça escultural que destaca a arte da madeira entalhada."],
    it: ["Poggiatesta in legno intagliato", "Oggetto scultoreo che valorizza l'arte dell'intaglio."],
    fr: ["Appui-tête en bois sculpté", "Une pièce sculpturale qui met en valeur l'art du bois."],
    zh: ["雕刻木制枕架", "展现木雕工艺的雕塑感作品。"],
  },
  "woven-plate": {
    am: ["ተፈጥሯዊ የሽመና ሳህን", "በተፈጥሯዊ ፋይበርና በጂኦሜትሪ ድንበር የተሠራ።"],
    om: ["Saanii hodhamaa uumamaa", "Hodhaa faayibara uumamaa fi daangaa boca ji'omeetirii qabu."],
    pt: ["Prato de fibras naturais", "Peça trançada à mão com fibras naturais e borda geométrica."],
    it: ["Piatto intrecciato naturale", "Intrecciato a mano con fibre naturali e bordo geometrico."],
    fr: ["Assiette tressée naturelle", "Tressée à la main avec des fibres naturelles et une bordure géométrique."],
    zh: ["天然编织盘", "采用天然纤维手工编织，饰有几何图案边框。"],
  },
};

const featureMessages = {
  en: [
    ["MADE WITH MEANING","Coffee culture,<br /><em>beautifully carried.</em>","Bring the warmth of an Ethiopian coffee ceremony into your home.","Handmade red clay Ethiopian coffee pot"],
    ["WOVEN BY HAND","Handwoven stories<br /><em>for your home.</em>","Colorful basketry shaped by skill, patience, and tradition.","Colorful handwoven Ethiopian tray"],
    ["CRAFT ROOTED IN HERITAGE","Tradition in every<br /><em>detail.</em>","Discover meaningful pieces made to be treasured.","Illustration celebrating Ethiopian beauty and culture"],
    ["VOICES OF ETHIOPIA","Stories passed down<br /><em>through generations.</em>","Celebrate the people and heritage that shape Ethiopian culture.","Portrait of a Karrayyu tribe warrior from Ethiopia"],
  ],
  am: [
    ["በትርጉም የተሠራ","የቡና ባህል፣<br /><em>በውበት የቀረበ።</em>","የኢትዮጵያን የቡና ሥነ ሥርዓት ሙቀት ወደ ቤትዎ ይዘው ይግቡ።","በእጅ የተሠራ የኢትዮጵያ የሸክላ ጀበና"],
    ["በእጅ የተሸመነ","የሽመና ታሪኮች፣<br /><em>ለቤትዎ።</em>","በችሎታ፣ በትዕግሥትና በባህል የተሠሩ ባለቀለም ቅርጫቶች።","ባለቀለም በእጅ የተሸመነ የኢትዮጵያ ትሪ"],
    ["በቅርስ ላይ የተመሠረተ ጥበብ","ባህል በእያንዳንዱ<br /><em>ዝርዝር።</em>","ለዘላለም የሚከበሩ ትርጉም ያላቸውን እቃዎች ያግኙ።","የኢትዮጵያን ውበትና ባህል የሚያከብር ሥዕል"],
    ["የኢትዮጵያ ድምፆች","ከትውልድ ወደ ትውልድ<br /><em>የሚተላለፉ ታሪኮች።</em>","የኢትዮጵያን ባህል ለሚቀርጹ ሰዎችና ቅርሶች ክብር ይስጡ።","የኢትዮጵያ ቀራዩ ጎሳ ተዋጊ ምስል"],
  ],
  om: [
    ["HIIKAAN HOJJETAME","Aadaa buna,<br /><em>bareedinaan dhihaate.</em>","Ho'ina sirna buna Itoophiyaa gara mana keetii fidi.","Jebena suphee diimaa Itoophiyaa harkaan hojjetame"],
    ["HARKAAN FO'AME","Seenaa hodhaa,<br /><em>mana keetiif.</em>","Saaphana halluu adda addaa dandeettii fi aadaa keessatti hundaa'e.","Saanii halluu qabu harkaan hodhame"],
    ["OGUMMAA AADAA IRRAA MADDE","Aadaan bal'ina<br /><em>hundumaa keessa.</em>","Wantoota hiika qaban kan gatii guddaa qabaniif ta'an argadhu.","Suuraa bareedina fi aadaa Itoophiyaa agarsiisu"],
    ["SAGALEE ITOOPHIYAA","Seenaa dhalootaa<br /><em>dhalootatti darbu.</em>","Namootaa fi dhaala aadaa Itoophiyaa bifa kennan kabaji.","Fakkii loltuu gosa Karrayyuu Itoophiyaa"],
  ],
  pt: [
    ["FEITO COM SIGNIFICADO","Cultura do café,<br /><em>com beleza.</em>","Leve para casa o calor da cerimónia etíope do café.","Jebena etíope de barro vermelho feito à mão"],
    ["TECIDO À MÃO","Histórias tecidas<br /><em>para a sua casa.</em>","Cestos coloridos feitos com talento, paciência e tradição.","Tabuleiro etíope colorido, tecido à mão"],
    ["ARTESANATO COM RAÍZES","Tradição em cada<br /><em>detalhe.</em>","Descubra peças especiais feitas para guardar.","Ilustração que celebra a beleza e a cultura etíopes"],
    ["VOZES DA ETIÓPIA","Histórias passadas<br /><em>entre gerações.</em>","Celebre as pessoas e a herança que moldam a cultura etíope.","Retrato de um guerreiro da tribo Karrayyu da Etiópia"],
  ],
  it: [
    ["CREATO CON SIGNIFICATO","La cultura del caffè,<br /><em>con bellezza.</em>","Porta a casa il calore della cerimonia etiope del caffè.","Jebena etiope in argilla rossa fatta a mano"],
    ["INTRECCIATO A MANO","Storie intrecciate<br /><em>per la tua casa.</em>","Cesti colorati plasmati da abilità, pazienza e tradizione.","Vassoio etiope colorato intrecciato a mano"],
    ["ARTIGIANATO RADICATO NELLA STORIA","Tradizione in ogni<br /><em>dettaglio.</em>","Scopri oggetti speciali da custodire nel tempo.","Illustrazione che celebra la bellezza e la cultura etiopi"],
    ["VOCI D'ETIOPIA","Storie tramandate<br /><em>di generazione in generazione.</em>","Celebra le persone e il patrimonio che plasmano la cultura etiope.","Ritratto di un guerriero della tribù Karrayyu in Etiopia"],
  ],
  fr: [
    ["FAIT AVEC DU SENS","La culture du café,<br /><em>avec élégance.</em>","Invitez chez vous la chaleur de la cérémonie éthiopienne du café.","Jebena éthiopienne en argile rouge façonnée à la main"],
    ["TISSÉ À LA MAIN","Des histoires tissées<br /><em>pour votre intérieur.</em>","Des paniers colorés façonnés avec savoir-faire, patience et tradition.","Plateau éthiopien coloré tissé à la main"],
    ["UN SAVOIR-FAIRE ANCRÉ DANS L'HÉRITAGE","La tradition dans<br /><em>chaque détail.</em>","Découvrez des pièces précieuses à garder.","Illustration célébrant la beauté et la culture éthiopiennes"],
    ["LES VOIX DE L'ÉTHIOPIE","Des histoires transmises<br /><em>de génération en génération.</em>","Célébrez les personnes et l'héritage qui façonnent la culture éthiopienne.","Portrait d'un guerrier de la tribu Karrayyu d'Éthiopie"],
  ],
  zh: [
    ["匠心制作","咖啡文化，<br /><em>优雅相伴。</em>","把埃塞俄比亚咖啡仪式的温暖带回家。","手工制作的埃塞俄比亚红陶咖啡壶"],
    ["手工编织","编织而成的故事，<br /><em>点亮你的家。</em>","以技艺、耐心与传统编织出缤纷篮艺。","色彩缤纷的埃塞俄比亚手工编织托盘"],
    ["扎根文化传承","传统融入每个<br /><em>细节。</em>","发现值得珍藏的特别作品。","展现埃塞俄比亚之美与文化的插画"],
    ["埃塞俄比亚之声","代代相传的<br /><em>故事。</em>","致敬塑造埃塞俄比亚文化的人们与传承。","埃塞俄比亚卡雷尤部族战士肖像"],
  ],
};
const featureCtaMessages = { en:"Explore the collection", am:"ስብስቡን ይመልከቱ", om:"Kuusaa ilaali", pt:"Explore a coleção", it:"Esplora la collezione", fr:"Explorer la collection", zh:"探索系列" };

const localeCodes = {
  en: "en",
  am: "am",
  om: "om",
  pt: "pt-PT",
  it: "it-IT",
  fr: "fr-FR",
  zh: "zh-CN",
};

const productCategoryKeys = {
  "Coffee & pottery": "category.coffee",
  "Home & basketry": "category.home",
  "Music & culture": "category.music",
  "Art & heritage": "category.art",
};

const productLabelKeys = {
  "Coffee ritual": "product.labelCoffee",
  Handwoven: "product.labelWoven",
  Heritage: "product.labelHeritage",
  Music: "product.labelMusic",
  "Carved by hand": "product.labelCarved",
  "Artisan craft": "product.labelArtisan",
};

const paymentMethodKeys = {
  chapa: "payment.chapa",
  "international-card": "payment.card",
  telebirr: "payment.telebirr",
  cbe: "payment.cbe",
  bank: "payment.bank",
  cod: "payment.cod",
};

let activeSlide = slides.findIndex((slide) => slide.dataset.slide === "3");
if (activeSlide < 0) {
  activeSlide = 0;
}
let autoplayTimer;
let manuallyPaused = reducedMotion.matches;
let pointerInside = false;
let focusInside = false;
let currentLanguage = "en";
const cart = new Map();
let pendingProductId = null;
function openProductOptions(product) {
  if (orderConfirmation) orderConfirmation.hidden = true;
  pendingProductId = product.id;
  if (selectedProductName) selectedProductName.textContent = localizedProduct(product).name;
  if (giftBagOption) giftBagOption.checked = false;
  productOptions?.showModal();
}
function addProductToCart(product, giftBag = false) {
  const cartItem = cart.get(product.id);
  cart.set(product.id, {
    product,
    quantity: (cartItem?.quantity || 0) + 1,
    giftBagQuantity: (cartItem?.giftBagQuantity || 0) + (giftBag ? 1 : 0),
  });
  renderCart();
  updatePaymentAction();
  setCartOpen(true);
}
let activeCategory = "All";
let productSearchTerm = "";
let productSearchMode = "products";
const languageSelect = document.querySelector("#languageSelect");

function message(key) {
  return messages[currentLanguage]?.[key] || messages.en[key] || key;
}

function localizedProduct(product) {
  const translation = productMessages[product.id]?.[currentLanguage];
  return {
    ...product,
    name: translation?.[0] || product.name,
    description: translation?.[1] || product.description,
    maker: message(productCategoryKeys[product.category]) || message("product.maker"),
    label: message(productLabelKeys[product.label]) || message("product.maker"),
  };
}

function formatPrice(price) {
  const number = new Intl.NumberFormat(localeCodes[currentLanguage]).format(price);
  return `${message("product.currency")} ${number}`;
}

function escapeMarkup(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function applyTranslations() {
  const dictionary = messages[currentLanguage] || messages.en;
  const localizedFeatures = featureMessages[currentLanguage] || featureMessages.en;

  document.documentElement.lang = currentLanguage;
  document.title = message("page.title");
  document.querySelectorAll("[data-feature-field]").forEach((element) => {
    const slideIndex = Number(element.dataset.featureSlide || 0);
    const fieldIndex = { kicker:0, title:1, description:2, cta:-1 }[element.dataset.featureField];
    const translation = fieldIndex === -1 ? featureCtaMessages[currentLanguage] : localizedFeatures[slideIndex]?.[fieldIndex];
    if (translation) {
      if (element.dataset.featureField === "title") element.innerHTML = translation;
      else element.textContent = translation;
    }
  });
  document.querySelectorAll("[data-feature-alt]").forEach((element) => {
    const translation = localizedFeatures[Number(element.dataset.featureAlt)]?.[3];
    if (translation) element.alt = translation;
  });
  const featureSection = document.querySelector(".featured-showcase");
  featureSection?.setAttribute("aria-label", message("carousel.label"));
  document.querySelector("#featurePrevious")?.setAttribute("aria-label", message("carousel.previous"));
  document.querySelector("#featureNext")?.setAttribute("aria-label", message("carousel.next"));
  document.querySelectorAll(".feature-dot").forEach((dot, index) => dot.setAttribute("aria-label", message(`carousel.slide${index + 1}`)));
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const translation = dictionary[key] || messages.en[key];
    if (translation) {
      element.textContent = translation;
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const key = element.getAttribute("data-i18n-html");
    const translation = dictionary[key] || messages.en[key];
    if (translation) {
      element.innerHTML = translation;
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.getAttribute("data-i18n-aria");
    const translation = dictionary[key] || messages.en[key];
    if (translation) {
      element.setAttribute("aria-label", translation);
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const [attribute, key] = element.getAttribute("data-i18n-attr").split(":");
    const translation = dictionary[key] || messages.en[key];
    if (translation) {
      element.setAttribute(attribute, translation);
    }
  });

  if (languageSelect) {
    languageSelect.value = currentLanguage;
  }
  if (menuToggle) {
    menuToggle.setAttribute(
      "aria-label",
      message(menuToggle.getAttribute("aria-expanded") === "true" ? "menu.close" : "menu.open"),
    );
  }
  if (pauseButton) {
    pauseButton.setAttribute(
      "aria-label",
      message(manuallyPaused ? "carousel.play" : "carousel.pause"),
    );
    pauseButton.textContent = message(manuallyPaused ? "carousel.playText" : "carousel.pauseText");
  }

  const selectedCategory =
    document.querySelector(".category-filter.is-selected")?.dataset.category || "All";
  renderProducts(selectedCategory);
  renderCart();
  updatePaymentAction();
}

function renderProducts(category = "All") {
  if (!productGrid) {
    return;
  }

  const activeProducts = products.filter((product) => (product.status || "active") === "active");
  const categoryProducts =
    category === "All"
      ? activeProducts
      : activeProducts.filter((product) => product.category === category);
  const query = productSearchTerm.toLocaleLowerCase();
  const visibleProducts = query
    ? categoryProducts.filter((product) => {
        const localized = localizedProduct(product);
        if (productSearchMode === "manufacturers") {
          return String(product.seller || product.maker || "").toLocaleLowerCase().includes(query);
        }
        return [localized.name, localized.maker, localized.description, product.category]
          .some((value) => String(value || "").toLocaleLowerCase().includes(query));
      })
    : categoryProducts;

  if (productResultCount) {
    productResultCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "result" : "results"}`;
  }

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<p class="empty-products">No products match that search. Try another term or category.</p>';
    return;
  }

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => {
        const localized = localizedProduct(product);
        return `
        <article class="product-card">
          <div class="product-image">
            <img src="${escapeMarkup(product.image)}" alt="${escapeMarkup(localized.name)}" loading="lazy" />
            <span class="product-label">${escapeMarkup(localized.label)}</span>
          </div>
          <div class="product-info">
            <p class="product-category">${escapeMarkup(localized.maker)}</p>
            <h3 class="product-title">${escapeMarkup(localized.name)}</h3>
            <p class="product-description">${escapeMarkup(localized.description)}</p>
            <div class="product-purchase">
              <span class="product-price">${formatPrice(product.price)}</span>
              <button class="add-to-bag" type="button" data-add-to-bag="${escapeMarkup(product.id)}" aria-label="${message("product.add")} ${escapeMarkup(localized.name)}">${message("product.add")}</button>
            </div>
          </div>
        </article>`;
      },
    )
    .join("");
}

function renderCart() {
  if (!cartItemsElement) {
    return;
  }

  const itemCount = Array.from(cart.values()).reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const subtotal = Array.from(cart.values()).reduce(
    (total, item) => total + item.product.price * item.quantity + giftBagPrice * (item.giftBagQuantity || 0),
    0,
  );

  if (cartCountElement) {
    cartCountElement.textContent = String(itemCount);
  }
  if (drawerCountElement) {
    drawerCountElement.textContent = `(${itemCount})`;
  }
  cartOpenButton?.setAttribute(
    "aria-label",
    `${message("cart.open")}, ${itemCount} ${message(itemCount === 1 ? "product.qtyOne" : "product.qtyMany")}`,
  );
  if (cartSubtotalElement) {
    cartSubtotalElement.textContent = formatPrice(subtotal);
  }
  if (cartFooter) {
    cartFooter.hidden = itemCount === 0;
  }

  if (itemCount === 0) {
    cartItemsElement.innerHTML = `<p class="cart-empty">${message("cart.empty")}</p>`;
    if (paymentOptions) {
      paymentOptions.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
        input.checked = false;
      });
    }
    if (checkoutButton) {
      checkoutButton.disabled = true;
      checkoutButton.textContent = message("payment.choose");
    }
    return;
  }

  cartItemsElement.innerHTML = Array.from(cart.values())
    .map(({ product, quantity, giftBagQuantity = 0 }) => {
      const localized = localizedProduct(product);
      return `
        <article class="cart-item">
          <img src="${escapeMarkup(product.image)}" alt="${escapeMarkup(localized.name)}" />
          <div>
            <h3>${escapeMarkup(localized.name)}</h3>
            <p>${message("cart.quantity")} ${quantity} · ${escapeMarkup(localized.maker)}</p>
            ${giftBagQuantity ? `<p class="cart-gift-bag">${giftBagQuantity} × ENQU gift bag</p>` : ""}
            <button class="cart-remove" type="button" data-remove-from-bag="${escapeMarkup(product.id)}">${message("cart.remove")}</button>
          </div>
          <span class="cart-item-price">${formatPrice(product.price * quantity + giftBagPrice * giftBagQuantity)}</span>
        </article>`;
    })
    .join("");
}

function updatePaymentAction() {
    const selectedMethod = paymentOptions?.querySelector(
      'input[name="paymentMethod"]:checked',
    );
    if (!checkoutButton) {
      return;
    }

    checkoutButton.disabled = !selectedMethod || cart.size === 0;
    checkoutButton.textContent = selectedMethod
      ? `${message("payment.request")} · ${message(paymentMethodKeys[selectedMethod.value])}`
      : message("payment.choose");
}

function setCartOpen(isOpen) {
  if (!cartDrawer || !cartBackdrop) {
    return;
  }

  cartDrawer.classList.toggle("is-open", isOpen);
  cartDrawer.setAttribute("aria-hidden", String(!isOpen));
  cartDrawer.toggleAttribute("inert", !isOpen);
  cartBackdrop.hidden = !isOpen;
  document.body.classList.toggle("cart-open", isOpen);

  if (isOpen) {
    cartCloseButton?.focus();
  } else {
    cartOpenButton?.focus();
  }
}

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    if (isActive) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }
  });
}

function stopAutoplay() {
  window.clearInterval(autoplayTimer);
  autoplayTimer = undefined;
}

function startAutoplay() {
  stopAutoplay();
  if (manuallyPaused || pointerInside || focusInside || slides.length < 2) {
    return;
  }

  autoplayTimer = window.setInterval(() => {
    showSlide(activeSlide + 1);
  }, 6000);
}

function updatePauseButton() {
  if (!pauseButton) {
    return;
  }
  pauseButton.textContent = message(
    manuallyPaused ? "carousel.playText" : "carousel.pauseText",
  );
  pauseButton.setAttribute(
    "aria-label",
    message(manuallyPaused ? "carousel.play" : "carousel.pause"),
  );
}

previousButton?.addEventListener("click", () => {
  showSlide(activeSlide - 1);
  startAutoplay();
});

nextButton?.addEventListener("click", () => {
  showSlide(activeSlide + 1);
  startAutoplay();
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slideTo));
    startAutoplay();
  });
});

document.querySelectorAll(".category-filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category || "All";
    if (marketSearchCategory) {
      marketSearchCategory.value = activeCategory;
    }
    document.querySelectorAll(".category-filter").forEach((filter) => {
      const isSelected = filter === button;
      filter.classList.toggle("is-selected", isSelected);
      filter.setAttribute("aria-pressed", String(isSelected));
    });
    renderProducts(activeCategory);
  });
});

marketSearchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  productSearchTerm = marketSearchInput?.value.trim() || "";
  activeCategory = marketSearchCategory?.value || activeCategory;
  document.querySelectorAll(".category-filter").forEach((button) => {
    const selected = button.dataset.category === activeCategory;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  renderProducts(activeCategory);
  document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

searchModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.searchMode;
    productSearchMode = mode || "products";
    searchModeButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    if (marketSearchInput) {
      marketSearchInput.placeholder = productSearchMode === "manufacturers"
        ? "Search makers and artisan studios"
        : "What are you looking for?";
    }
  });
});

document.querySelectorAll("[data-search-term]").forEach((button) => {
  button.addEventListener("click", () => {
    if (marketSearchInput) {
      marketSearchInput.value = button.dataset.searchTerm || "";
    }
    marketSearchForm?.requestSubmit();
  });
});

document.querySelector(".artisan-grid")?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }
  const toggle = target.closest(".artisan-toggle");
  if (!toggle) {
    return;
  }
  const expanded = toggle.getAttribute("aria-expanded") !== "true";
  const details = document.getElementById(toggle.getAttribute("aria-controls"));
  toggle.setAttribute("aria-expanded", String(expanded));
  if (details) {
    details.hidden = !expanded;
  }
  toggle.textContent = message(expanded ? "makers.hideProfile" : "makers.viewProfile");
});

  productGrid?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const addButton = target.closest("[data-add-to-bag]");
  if (addButton) {
    const product = products.find(
      (item) => item.id === addButton.getAttribute("data-add-to-bag"),
    );
    if (product) {
      addProductToCart(product);
    }
  }
});

productOptionsForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const product = products.find((item) => item.id === pendingProductId);
  if (!product) {
    return;
  }
  addProductToCart(product, giftBagOption?.checked);
  productOptions?.close();
  pendingProductId = null;
});

productOptionsClose?.addEventListener("click", () => productOptions?.close());

productOptions?.addEventListener("click", (event) => {
  if (event.target === productOptions) {
    productOptions.close();
  }
});

cartItemsElement?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const removeButton = target.closest("[data-remove-from-bag]");
  const productId = removeButton?.getAttribute("data-remove-from-bag");
  if (productId) {
    cart.delete(productId);
    renderCart();
    updatePaymentAction();
  }
});

paymentOptions?.addEventListener("change", updatePaymentAction);

checkoutButton?.addEventListener("click", async () => {
  const selectedMethod = paymentOptions?.querySelector(
    'input[name="paymentMethod"]:checked',
  );
  if (!selectedMethod || cart.size === 0) {
    return;
  }

  const customerName = customerNameInput?.value.trim();
  const customerEmail = customerEmailInput?.value.trim();
  const customerCountry = customerCountryInput?.value.trim();
  if (!customerName || !customerEmail || !customerCountry) {
    [customerNameInput, customerEmailInput, customerCountryInput].find((input) => input && !input.checkValidity())?.reportValidity();
    return;
  }
  const items = Array.from(cart.values()).map(({ product, quantity, giftBagQuantity = 0 }) => ({
    productId: product.id,
    quantity,
    giftBagQuantity,
  }));
  checkoutButton.disabled = true;
  const previousButtonText = checkoutButton.textContent;
  checkoutButton.textContent = "Sending order…";
  let order;
  try {
    order = await window.ENQUApi.request("/orders", {
      method: "POST",
      body: JSON.stringify({
        customer: { name: customerName, email: customerEmail, country: customerCountry },
        items,
        paymentMethod: message(paymentMethodKeys[selectedMethod.value]),
      }),
    });
  } catch (error) {
    if (orderConfirmation) {
      orderConfirmation.textContent = error.message || "Order request could not be sent. Please try again.";
      orderConfirmation.hidden = false;
    }
    checkoutButton.disabled = false;
    checkoutButton.textContent = previousButtonText;
    return;
  }
  if (orderConfirmation) {
    orderConfirmation.textContent = `Order request ${order.id} was saved. ENQU MADE will contact you to confirm delivery and payment; no payment has been taken.`;
    orderConfirmation.hidden = false;
  }
  cart.clear();
  renderCart();
  updatePaymentAction();
  paymentOptions.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
    input.checked = false;
  });
  customerNameInput.value = "";
  customerEmailInput.value = "";
  customerCountryInput.value = "";
});

cartOpenButton?.addEventListener("click", () => setCartOpen(true));
document.querySelectorAll("[data-open-cart]").forEach((button) => {
  button.addEventListener("click", () => setCartOpen(true));
});
cartCloseButton?.addEventListener("click", () => setCartOpen(false));
cartBackdrop?.addEventListener("click", () => setCartOpen(false));
contactOptionsOpen?.addEventListener("click", () => contactOptionsDialog?.showModal());
contactOptionsClose?.addEventListener("click", () => contactOptionsDialog?.close());
contactOptionsDialog?.addEventListener("click", (event) => {
  if (event.target === contactOptionsDialog) {
    contactOptionsDialog.close();
  }
});

pauseButton?.addEventListener("click", () => {
  manuallyPaused = !manuallyPaused;
  updatePauseButton();
  startAutoplay();
});

hero?.addEventListener("pointerenter", () => {
  pointerInside = true;
  stopAutoplay();
});

hero?.addEventListener("pointerleave", () => {
  pointerInside = false;
  startAutoplay();
});

hero?.addEventListener("focusin", () => {
  focusInside = true;
  stopAutoplay();
});

hero?.addEventListener("focusout", (event) => {
  if (!hero.contains(event.relatedTarget)) {
    focusInside = false;
    startAutoplay();
  }
});

reducedMotion.addEventListener("change", (event) => {
  manuallyPaused = event.matches;
  updatePauseButton();
  startAutoplay();
});

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute(
    "aria-label",
    message(isExpanded ? "menu.open" : "menu.close"),
  );
  mainNav?.classList.toggle("is-open", !isExpanded);
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", message("menu.open"));
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer?.classList.contains("is-open")) {
    setCartOpen(false);
    return;
  }
  if (event.key === "Escape" && mainNav?.classList.contains("is-open")) {
    mainNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", message("menu.open"));
    menuToggle?.focus();
  }
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const savedLanguage = localStorage.getItem("enqu-made-language");
if (savedLanguage && messages[savedLanguage]) {
  currentLanguage = savedLanguage;
}

languageSelect?.addEventListener("change", () => {
  if (!messages[languageSelect.value]) {
    return;
  }
  currentLanguage = languageSelect.value;
  localStorage.setItem("enqu-made-language", currentLanguage);
  applyTranslations();
});

applyTranslations();
window.ENQUApi?.request("/products").then((catalog) => {
  if (!Array.isArray(catalog) || !catalog.length) return;
  products = catalog;
  window.ENQUStore?.write("products", products);
  renderProducts(document.querySelector(".category-filter.is-selected")?.dataset.category || "All");
}).catch(() => {});
startAutoplay();

const featureTrack = document.querySelector(".feature-track");
const featureSlides = Array.from(document.querySelectorAll(".feature-slide"));
const featureDots = Array.from(document.querySelectorAll(".feature-dot"));
const featurePrevious = document.querySelector("#featurePrevious");
const featureNext = document.querySelector("#featureNext");
const featurePause = document.querySelector("#featurePause");
let activeFeature = 0;
let featurePaused = reducedMotion.matches;
let featureTimer;

function showFeature(index) {
  if (!featureTrack || !featureSlides.length) return;
  activeFeature = (index + featureSlides.length) % featureSlides.length;
  featureTrack.style.transform = `translateX(-${activeFeature * 25}%)`;
  featureSlides.forEach((slide, slideIndex) => {
    slide.setAttribute("aria-hidden", String(slideIndex !== activeFeature));
  });
  featureDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeFeature);
    if (dotIndex === activeFeature) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
}

function scheduleFeature() {
  window.clearInterval(featureTimer);
  if (!featurePaused && featureSlides.length > 1) {
    featureTimer = window.setInterval(() => showFeature(activeFeature + 1), 5600);
  }
  if (featurePause) {
    featurePause.textContent = featurePaused ? "▶" : "Ⅱ";
    featurePause.setAttribute("aria-label", message(featurePaused ? "carousel.play" : "carousel.pause"));
  }
}

featurePrevious?.addEventListener("click", () => showFeature(activeFeature - 1));
featureNext?.addEventListener("click", () => showFeature(activeFeature + 1));
featureDots.forEach((dot) => dot.addEventListener("click", () => showFeature(Number(dot.dataset.featureTo))));
featurePause?.addEventListener("click", () => { featurePaused = !featurePaused; scheduleFeature(); });
document.querySelector(".featured-showcase")?.addEventListener("mouseenter", () => window.clearInterval(featureTimer));
document.querySelector(".featured-showcase")?.addEventListener("mouseleave", scheduleFeature);
document.querySelector(".featured-showcase")?.addEventListener("focusin", () => window.clearInterval(featureTimer));
document.querySelector(".featured-showcase")?.addEventListener("focusout", scheduleFeature);
reducedMotion.addEventListener?.("change", (event) => { if (event.matches) featurePaused = true; scheduleFeature(); });
scheduleFeature();
