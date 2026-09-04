/* ==========================================================================
   دار القفطان أم أروى — i18n.js
   Lightweight, dependency-free multi-language engine (AR / FR / EN).
   - Reads/writes the chosen language to localStorage so it persists
     across pages.
   - Applies translations to any element carrying a data-i18n / 
     data-i18n-attr set of attributes.
   - Switches <html lang> and <html dir> (Arabic = RTL, French/English = LTR).
   - Exposes window.i18n = { t, getLang, setLang } for other scripts
     (e.g. the product modal in script.js) to use.
   ========================================================================== */

(function () {

  var STORAGE_KEY = "site-lang";
  var DEFAULT_LANG = "ar";
  var RTL_LANGS = ["ar"];

  var TRANSLATIONS = {

    /* ---------------- Shared: header / nav / footer / whatsapp ---------------- */
    brand_prefix:      { ar: "دار القفطان", fr: "Maison Caftan" },
    brand_name:        { ar: "أم أروى", fr: "Oum Arwa" },
    brand_full:        { ar: "دار القفطان أم أروى", fr: "Maison Caftan Oum Arwa" },

    nav_home:          { ar: "الرئيسية", fr: "Accueil" },
    nav_caftans:       { ar: "القفاطين", fr: "Caftans" },
    nav_services:      { ar: "خدماتنا", fr: "Nos services" },
    nav_about:         { ar: "من نحن", fr: "À propos" },
    nav_contact:       { ar: "تواصل معنا", fr: "Contactez-nous" },

    whatsapp_short:    { ar: "تواصل عبر واتساب", fr: "Contact WhatsApp" },
    hamburger_aria:    { ar: "فتح القائمة", fr: "Ouvrir le menu" },
    lang_switch_aria:  { ar: "اختيار اللغة", fr: "Choisir la langue" },

    footer_tagline:      { ar: "قفاطين مغربية فاخرة، بين الأصالة والأناقة، للبيع والكراء.", fr: "Caftans marocains de luxe, entre authenticité et élégance, à la vente et à la location." },
    footer_quicklinks:   { ar: "روابط سريعة", fr: "Liens rapides" },
    footer_contact_title:{ ar: "تواصل معنا", fr: "Contactez-nous" },
    footer_whatsapp_label:{ ar: "واتساب", fr: "WhatsApp" },
    footer_contact_form: { ar: "نموذج التواصل", fr: "Formulaire de contact" },
    footer_hours_title:  { ar: "أوقات العمل", fr: "Horaires d'ouverture" },
    footer_hours_weekdays:{ ar: "الاثنين - السبت: 9:00 - 19:00", fr: "Lundi - Samedi : 9h00 - 19h00" },
    footer_hours_sunday: { ar: "الأحد: مغلق", fr: "Dimanche : Fermé" },
    footer_copyright:    { ar: "© 2026 دار القفطان أم أروى - جميع الحقوق محفوظة", fr: "© 2026 Maison Caftan Oum Arwa - Tous droits réservés" },

    view_details:      { ar: "عرض التفاصيل", fr: "Voir les détails" },
    modal_close_aria:  { ar: "إغلاق", fr: "Fermer" },
    modal_whatsapp:    { ar: "استفسار عبر واتساب", fr: "Demande via WhatsApp" },
    cta_whatsapp:      { ar: "تواصلي معنا عبر واتساب", fr: "Contactez-nous via WhatsApp" },

    /* ---------------- Home page ---------------- */
    idx_title:         { ar: "دار القفطان أم أروى | قفاطين مغربية فاخرة للبيع والكراء", fr: "Maison Caftan Oum Arwa | Caftans marocains de luxe à vendre et à louer" },
    idx_meta_desc:     { ar: "دار القفطان أم أروى، محل متخصص في بيع وكراء القفاطين المغربية الفاخرة. تصاميم أصيلة لكل مناسبة.", fr: "Maison Caftan Oum Arwa, boutique spécialisée dans la vente et la location de caftans marocains de luxe. Des créations authentiques pour chaque occasion." },
    idx_hero_h1:       { ar: "أناقة مغربية أصيلة لكل مناسبة", fr: "Une élégance marocaine authentique pour chaque occasion" },
    idx_hero_p:        { ar: "نقدّم لكِ مجموعة مختارة من القفاطين المغربية الفاخرة، بين البيع والكراء، بلمسة تجمع بين التراث الأصيل والذوق العصري. تجربة شخصية ترافقكِ من الاختيار إلى الإطلالة الكاملة.", fr: "Nous vous proposons une sélection de caftans marocains de luxe, à la vente ou à la location, alliant patrimoine authentique et goût moderne. Une expérience personnalisée qui vous accompagne du choix jusqu'au look final." },
    idx_hero_cta1:     { ar: "اكتشفي مجموعتنا", fr: "Découvrez notre collection" },
    idx_hero_cta2:     { ar: "تواصلي معنا", fr: "Contactez-nous" },
    idx_hero_scroll_aria:{ ar: "مرري للأسفل لمشاهدة المزيد", fr: "Faites défiler pour voir plus" },
    idx_why_eyebrow:   { ar: "لماذا تختاريننا", fr: "Pourquoi nous choisir" },
    idx_why_h2:        { ar: "تجربة تليق بمناسبتك", fr: "Une expérience à la hauteur de votre occasion" },
    idx_why1_h3:       { ar: "تصاميم مغربية أصيلة", fr: "Créations marocaines authentiques" },
    idx_why1_p:        { ar: "قفاطين مستوحاة من التراث المغربي العريق بلمسات تطريز يدوية.", fr: "Des caftans inspirés du riche patrimoine marocain, avec des touches de broderie artisanale." },
    idx_why2_h3:       { ar: "جودة وأناقة", fr: "Qualité et élégance" },
    idx_why2_p:        { ar: "اختيار دقيق للأقمشة والخيوط لضمان مظهر فاخر يدوم طويلًا.", fr: "Une sélection minutieuse des tissus et des fils pour garantir une allure luxueuse et durable." },
    idx_why3_h3:       { ar: "خيارات للبيع والكراء", fr: "Options d'achat et de location" },
    idx_why3_p:        { ar: "مرونة في الاختيار بما يناسب مناسبتك وميزانيتك.", fr: "Une flexibilité de choix adaptée à votre occasion et à votre budget." },
    idx_why4_h3:       { ar: "خدمة واهتمام بالزبونة", fr: "Service et attention à la cliente" },
    idx_why4_p:        { ar: "مرافقة شخصية تساعدك على اختيار القفطان الأنسب لكِ.", fr: "Un accompagnement personnalisé pour vous aider à choisir le caftan qui vous convient le mieux." },
    idx_cta_h2:        { ar: "هل تبحثين عن قفطان مميز لمناسبتك؟", fr: "Vous cherchez un caftan unique pour votre occasion ?" },

    /* ---------------- Caftans page ---------------- */
    caf_title:         { ar: "القفاطين | دار القفطان أم أروى", fr: "Caftans | Maison Caftan Oum Arwa" },
    caf_meta_desc:     { ar: "تصفحي مجموعة قفاطين دار القفطان أم أروى: قفاطين الأعراس، المناسبات، والتصاميم العصرية، للبيع والكراء.", fr: "Découvrez la collection de caftans de la Maison Caftan Oum Arwa : caftans de mariage, d'occasions et créations modernes, à la vente et à la location." },
    caf_header_eyebrow:{ ar: "مجموعتنا", fr: "Notre collection" },
    caf_header_h1:     { ar: "القفاطين", fr: "Caftans" },
    caf_header_p:      { ar: "تصفحي تشكيلتنا من القفاطين المغربية، وصفّي حسب الفئة التي تناسب مناسبتك.", fr: "Parcourez notre sélection de caftans marocains et filtrez selon la catégorie qui correspond à votre occasion." },

    filter_all:        { ar: "الكل", fr: "Tous" },
    filter_occasions:  { ar: "قفاطين المناسبات", fr: "Caftans de cérémonie" },
    filter_modern:     { ar: "تصاميم عصرية", fr: "Créations modernes" },
    filter_sale:       { ar: "للبيع", fr: "À vendre" },
    filter_rent:       { ar: "للكراء", fr: "À louer" },

    caf1_alt:   { ar: "قفطان مغربي أزرق للأعراس", fr: "Caftan marocain bleu pour mariage" },
    caf1_tag:   { ar: "للبيع", fr: "À vendre" },
    caf1_title: { ar: "قفطان \"لالة زهرة\" الأزرق", fr: "Caftan « Lalla Zahra » Bleu" },
    caf1_desc:  { ar: "قفطان أعراس بتطريز يدوي دقيق وقماش حريري فاخر.", fr: "Caftan de mariage à la broderie artisanale fine et au tissu soyeux luxueux." },
    caf1_desc_long:{ ar: "قفطان أعراس بتطريز يدوي دقيق على قماش حريري أزرق فاخر، مع حزام مذهّب. تصميم مثالي لليلة العمر، متوفر بعدة مقاسات.", fr: "Caftan de mariage à la broderie artisanale fine sur tissu soyeux bleu luxueux, avec ceinture dorée. Un design idéal pour la nuit de vos rêves, disponible en plusieurs tailles." },
    caf1_price: { ar: "2,400 درهم", fr: "2 400 MAD" },

    caf2_alt:   { ar: "قفطان مغربي أخضر عصري", fr: "Caftan marocain vert moderne" },
    caf2_tag:   { ar: "للكراء", fr: "À louer" },
    caf2_title: { ar: "قفطان \"ياسمين\" الأخضر", fr: "Caftan « Yasmine » Vert" },
    caf2_desc:  { ar: "تصميم عصري بخطوط بسيطة وألوان هادئة.", fr: "Un design moderne aux lignes épurées et aux couleurs douces." },
    caf2_desc_long:{ ar: "قفطان بقصّة عصرية وألوان هادئة، مناسب للسهرات والمناسبات المسائية. متوفر للكراء بأسعار مناسبة حسب المدة.", fr: "Caftan à la coupe moderne et aux couleurs douces, idéal pour les soirées et événements du soir. Disponible à la location à des prix adaptés selon la durée." },
    caf2_price: { ar: "350 درهم / اليوم", fr: "350 MAD / jour" },

    caf3_alt:   { ar: "قفطان مغربي أبيض بالدانتيل", fr: "Caftan marocain blanc en dentelle" },
    caf3_tag:   { ar: "للبيع", fr: "À vendre" },
    caf3_title: { ar: "قفطان \"أمل\" الأبيض", fr: "Caftan « Amal » Blanc" },
    caf3_desc:  { ar: "لمسة من الدانتيل الفاخر مع تطريز ذهبي ناعم.", fr: "Une touche de dentelle luxueuse avec une broderie dorée délicate." },
    caf3_desc_long:{ ar: "قفطان أبيض بلمسات دانتيل فاخر وتطريز ذهبي ناعم على الأكمام والياقة، للإطلالة الراقية في المناسبات الخاصة.", fr: "Caftan blanc avec des touches de dentelle luxueuse et une broderie dorée délicate sur les manches et le col, pour une allure raffinée lors d'occasions spéciales." },
    caf3_price: { ar: "1,800 درهم", fr: "1 800 MAD" },

    caf4_alt:   { ar: "قفطان مغربي كلاسيكي أبيض", fr: "Caftan marocain classique blanc" },
    caf4_tag:   { ar: "للبيع", fr: "À vendre" },
    caf4_title: { ar: "قفطان \"نور\" الكلاسيكي", fr: "Caftan « Nour » Classique" },
    caf4_desc:  { ar: "قصّة كلاسيكية أنيقة تناسب المناسبات العائلية.", fr: "Une coupe classique élégante adaptée aux occasions familiales." },
    caf4_desc_long:{ ar: "قصّة كلاسيكية بخطوط أنيقة وتطريز متوسط، خيار موفّق للمناسبات العائلية والرسمية على حد سواء.", fr: "Coupe classique aux lignes élégantes et broderie modérée, un choix réussi pour les occasions familiales comme officielles." },
    caf4_price: { ar: "1,600 درهم", fr: "1 600 MAD" },

    caf5_alt:   { ar: "قفطان مغربي خفيف صيفي", fr: "Caftan marocain léger d'été" },
    caf5_tag:   { ar: "للكراء", fr: "À louer" },
    caf5_title: { ar: "قفطان \"سلمى\" الصيفي", fr: "Caftan « Salma » d'Été" },
    caf5_desc:  { ar: "قماش خفيف وتصميم مريح للسهرات الصيفية.", fr: "Tissu léger et design confortable pour les soirées d'été." },
    caf5_desc_long:{ ar: "قفطان بقماش خفيف وتصميم مريح، مثالي للسهرات الصيفية والمناسبات الخارجية. متوفر للكراء بمقاسات متعددة.", fr: "Caftan en tissu léger et design confortable, idéal pour les soirées d'été et les événements en extérieur. Disponible à la location en plusieurs tailles." },
    caf5_price: { ar: "280 درهم / اليوم", fr: "280 MAD / jour" },

    caf6_alt:   { ar: "قفطان مغربي فاخر بتطريز ذهبي", fr: "Caftan marocain luxueux à broderie dorée" },
    caf6_tag:   { ar: "للبيع", fr: "À vendre" },
    caf6_title: { ar: "قفطان \"مريم\" الذهبي", fr: "Caftan « Maryam » Doré" },
    caf6_desc:  { ar: "تطريز ذهبي غني على قماش كريمي فاخر.", fr: "Broderie dorée riche sur un tissu crème luxueux." },
    caf6_desc_long:{ ar: "قفطان أعراس بتطريز ذهبي غني على قماش كريمي فاخر، لإطلالة ملكية تليق بالمناسبات الكبرى.", fr: "Caftan de mariage à la broderie dorée riche sur tissu crème luxueux, pour une allure royale digne des grandes occasions." },
    caf6_price: { ar: "3,200 درهم", fr: "3 200 MAD" },

    caf7_alt:   { ar: "قفطان مغربي متدفق فاخر", fr: "Caftan marocain fluide luxueux" },
    caf7_tag:   { ar: "للبيع", fr: "À vendre" },
    caf7_title: { ar: "قفطان \"حياة\" المتدفق", fr: "Caftan « Hayat » Fluide" },
    caf7_desc:  { ar: "تصميم متدفق بقماش ناعم وألوان دافئة.", fr: "Design fluide en tissu doux et couleurs chaleureuses." },
    caf7_desc_long:{ ar: "قفطان بقصّة متدفقة وقماش ناعم بألوان دافئة، يمنحكِ إطلالة أنيقة ومريحة في آن واحد.", fr: "Caftan à la coupe fluide et au tissu doux aux couleurs chaleureuses, pour une allure élégante et confortable à la fois." },
    caf7_price: { ar: "2,100 درهم", fr: "2 100 MAD" },

    caf8_alt:   { ar: "قفطان مغربي أبيض عصري", fr: "Caftan marocain blanc moderne" },
    caf8_tag:   { ar: "للبيع", fr: "À vendre" },
    caf8_title: { ar: "قفطان \"إيمان\" الأبيض", fr: "Caftan « Iman » Blanc" },
    caf8_desc:  { ar: "لمسة عصرية بسيطة بقماش أبيض ناصع.", fr: "Une touche moderne et sobre en tissu blanc éclatant." },
    caf8_desc_long:{ ar: "قفطان بتصميم عصري بسيط وقماش أبيض ناصع، خيار أنيق لمن تبحث عن البساطة الفاخرة.", fr: "Caftan au design moderne et sobre, en tissu blanc éclatant, un choix élégant pour celles qui recherchent une simplicité luxueuse." },
    caf8_price: { ar: "1,450 درهم", fr: "1 450 MAD" },

    caf9_alt:   { ar: "قفطان مغربي أبيض للمناسبات", fr: "Caftan marocain blanc de cérémonie" },
    caf9_tag:   { ar: "للبيع", fr: "À vendre" },
    caf9_title: { ar: "قفطان \"رانيا\" الفاخر", fr: "Caftan « Rania » de Luxe" },
    caf9_desc:  { ar: "تصميم فاخر بتفاصيل دقيقة يناسب الحفلات الكبرى.", fr: "Un design luxueux aux détails fins, idéal pour les grandes fêtes." },
    caf9_desc_long:{ ar: "قفطان بتفاصيل دقيقة وقصّة فاخرة، يناسب حفلات الأعراس والمناسبات الكبرى. متوفر للاقتناء بمقاسات متعددة.", fr: "Caftan aux détails fins et à la coupe luxueuse, adapté aux mariages et grandes occasions. Disponible à l'achat en plusieurs tailles." },
    caf9_price: { ar: "2,750 درهم", fr: "2 750 MAD" },

    /* ---------------- Services page ---------------- */
    srv_title:         { ar: "خدماتنا | دار القفطان أم أروى", fr: "Nos services | Maison Caftan Oum Arwa" },
    srv_meta_desc:     { ar: "خدمات دار القفطان أم أروى: بيع القفاطين، كراء القفاطين، والمساعدة في اختيار القفطان المناسب لمناسبتك.", fr: "Services de la Maison Caftan Oum Arwa : vente de caftans, location de caftans et aide au choix du caftan adapté à votre occasion." },
    srv_header_eyebrow:{ ar: "خدماتنا", fr: "Nos services" },
    srv_header_h1:     { ar: "كل ما تحتاجينه لإطلالتك المثالية", fr: "Tout ce dont vous avez besoin pour un look parfait" },
    srv_header_p:      { ar: "نرافقكِ خطوة بخطوة، من اختيار القفطان إلى تجهيزه ليوم مناسبتك.", fr: "Nous vous accompagnons étape par étape, du choix du caftan à sa préparation pour le jour de votre événement." },
    srv1_h3:           { ar: "بيع القفاطين", fr: "Vente de caftans" },
    srv1_p:            { ar: "مجموعة متجددة من القفاطين المغربية الجاهزة للاقتناء، بتصاميم متنوعة تناسب مختلف الأذواق والمناسبات، من الزفاف إلى السهرات الخاصة.", fr: "Une collection renouvelée de caftans marocains prêts à l'achat, avec des créations variées adaptées à tous les goûts et occasions, du mariage aux soirées privées." },
    srv2_h3:           { ar: "كراء القفاطين", fr: "Location de caftans" },
    srv2_p:            { ar: "خيار عملي واقتصادي لمن ترغب في إطلالة فاخرة دون الحاجة لاقتناء القفطان بشكل دائم، بمدد كراء مرنة تناسب مناسبتك.", fr: "Une option pratique et économique pour celles qui souhaitent une allure luxueuse sans avoir à acheter le caftan de façon permanente, avec des durées de location flexibles adaptées à votre occasion." },
    srv3_h3:           { ar: "المساعدة في اختيار القفطان المناسب", fr: "Aide au choix du caftan adapté" },
    srv3_p:            { ar: "استشارة شخصية داخل المحل تساعدكِ على اختيار اللون والتصميم الأنسب لمناسبتك ولون بشرتك وقوامك.", fr: "Une consultation personnalisée en boutique pour vous aider à choisir la couleur et le design les plus adaptés à votre occasion, votre teint et votre silhouette." },
    srv_cta_h2:        { ar: "هل تحتاجين مساعدة في اختيار قفطانك؟", fr: "Besoin d'aide pour choisir votre caftan ?" },

    /* ---------------- About page ---------------- */
    abt_title:         { ar: "من نحن | دار القفطان أم أروى", fr: "À propos | Maison Caftan Oum Arwa" },
    abt_meta_desc:     { ar: "تعرّفي على دار القفطان أم أروى، شغفنا بالقفطان المغربي الأصيل، ورؤيتنا في تقديم الأناقة التقليدية بلمسة عصرية.", fr: "Découvrez la Maison Caftan Oum Arwa, notre passion pour le caftan marocain authentique et notre vision d'une élégance traditionnelle à la touche moderne." },
    abt_hero_eyebrow:  { ar: "من نحن", fr: "À propos de nous" },
    abt_hero_h1:       { ar: "شغف بالقفطان المغربي منذ البداية", fr: "Une passion pour le caftan marocain depuis toujours" },
    abt_hero_p1:       { ar: "وُلدت دار القفطان أم أروى من حب عميق للتراث المغربي وللقفطان بشكل خاص، بكل ما يحمله من تاريخ وفن وتفاصيل دقيقة تعكس هوية المرأة المغربية.", fr: "La Maison Caftan Oum Arwa est née d'un amour profond pour le patrimoine marocain et pour le caftan en particulier, avec toute l'histoire, l'art et les détails fins qu'il reflète de l'identité de la femme marocaine." },
    abt_hero_p2:       { ar: "نحرص في كل قطعة نقدّمها على المزج بين الأصالة التي توارثناها جيلًا بعد جيل، وبين لمسة عصرية تجعل القفطان مناسبًا لحياة اليوم، سواء كنتِ تبحثين عن قطعة تقتنينها أو تكرينها ليوم واحد لا يُنسى.", fr: "Dans chaque pièce que nous proposons, nous veillons à allier l'authenticité transmise de génération en génération à une touche moderne qui rend le caftan adapté à la vie d'aujourd'hui, que vous cherchiez une pièce à acquérir ou à louer pour un jour inoubliable." },
    abt_vision_h3:     { ar: "رؤيتنا", fr: "Notre vision" },
    abt_vision_p:      { ar: "أن نكون الوجهة الأولى في المنطقة لكل امرأة تبحث عن قفطان مغربي أصيل يعكس أناقتها وشخصيتها، بجودة تليق بكل مناسبة.", fr: "Être la première destination de la région pour chaque femme à la recherche d'un caftan marocain authentique reflétant son élégance et sa personnalité, avec une qualité à la hauteur de chaque occasion." },
    abt_mission_h3:    { ar: "رسالتنا", fr: "Notre mission" },
    abt_mission_p:     { ar: "تقديم تجربة شراء وكراء مريحة وشخصية، ترافق فيها كل زبونة من لحظة الاختيار إلى يوم الإطلالة، بأسلوب راقٍ وبأسعار عادلة.", fr: "Offrir une expérience d'achat et de location confortable et personnalisée, accompagnant chaque cliente du moment du choix jusqu'au jour de l'apparition, avec raffinement et à des prix justes." },

    /* ---------------- Contact page ---------------- */
    cnt_title:         { ar: "تواصل معنا | دار القفطان أم أروى", fr: "Contactez-nous | Maison Caftan Oum Arwa" },
    cnt_meta_desc:     { ar: "تواصلي مع دار القفطان أم أروى عبر الهاتف أو واتساب أو زيارة المحل. نسعد باستقبال استفساراتك.", fr: "Contactez la Maison Caftan Oum Arwa par téléphone, WhatsApp ou en visitant la boutique. Nous serons ravis de recevoir vos questions." },
    cnt_header_h1:     { ar: "يسعدنا التواصل معكِ", fr: "Nous serions ravis d'échanger avec vous" },
    cnt_header_p:      { ar: "لأي استفسار حول القفاطين أو الحجز، تواصلي معنا بالطريقة التي تناسبك.", fr: "Pour toute question sur les caftans ou une réservation, contactez-nous de la manière qui vous convient." },
    cnt_info_title:    { ar: "معلومات التواصل", fr: "Coordonnées" },
    cnt_phone_label:   { ar: "الهاتف", fr: "Téléphone" },
    cnt_address_label: { ar: "العنوان", fr: "Adresse" },
    cnt_address_value: { ar: "شارع محمد الخامس، المدينة", fr: "Avenue Mohammed V, Médina" },
    cnt_call_btn:      { ar: "اتصلي بنا", fr: "Appelez-nous" },
    cnt_whatsapp_btn:  { ar: "راسلينا عبر واتساب", fr: "Écrivez-nous sur WhatsApp" },
    cnt_map_title:     { ar: "موقع دار القفطان أم أروى على الخريطة (موقع افتراضي قابل للتعديل)", fr: "Emplacement de la Maison Caftan Oum Arwa sur la carte (emplacement fictif, modifiable)" }
  };

  function getLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    return (saved && TRANSLATIONS.nav_home[saved]) ? saved : DEFAULT_LANG;
  }

  function t(key) {
    var lang = getLang();
    if (TRANSLATIONS[key] && TRANSLATIONS[key][lang] !== undefined) {
      return TRANSLATIONS[key][lang];
    }
    // fallback to Arabic if a key is missing in the target language
    if (TRANSLATIONS[key] && TRANSLATIONS[key][DEFAULT_LANG] !== undefined) {
      return TRANSLATIONS[key][DEFAULT_LANG];
    }
    return "";
  }

  function applyToDocument(lang) {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", RTL_LANGS.indexOf(lang) !== -1 ? "rtl" : "ltr");

    // Plain text content
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (TRANSLATIONS[key]) el.textContent = TRANSLATIONS[key][lang] || TRANSLATIONS[key][DEFAULT_LANG];
    });

    // Attributes: data-i18n-attr="attrName:key|attrName2:key2"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var pairs = el.getAttribute("data-i18n-attr").split("|");
      pairs.forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0];
        var key = parts[1];
        if (attr && key && TRANSLATIONS[key]) {
          el.setAttribute(attr, TRANSLATIONS[key][lang] || TRANSLATIONS[key][DEFAULT_LANG]);
        }
      });
    });

    // Active state on language switch buttons
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
  }

  function setLang(lang) {
    if (!TRANSLATIONS.nav_home[lang]) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    applyToDocument(lang);
  }

  function wireSwitchers() {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyToDocument(getLang());
    wireSwitchers();
  });

  window.i18n = { t: t, getLang: getLang, setLang: setLang };

})();
