(() => {
  'use strict';
  const translations = {
    hi: {
      skipMain: 'मुख्य भाग पर जाएँ', navHome: 'मुखपृष्ठ', navEvents: 'समारोह', navRsvp: 'जवाब दें', navGuestbook: 'शुभकामनाएँ', menuLabel: 'मेनू', languageLabel: 'भाषा', pauseMotion: 'गतिविधि रोकें',
      coverPrelude: 'दो परिवारों का उत्सव', coverTitle: 'दिल से एक निमंत्रण।', coverSubtitle: 'अपनी भाषा चुनें, फिर इस उत्सव का द्वार खोलें।', chooseLanguage: 'Welcome · स्वागत · સ્વાગત', openInvitation: 'निमंत्रण खोलें ✦', skipAnimation: 'एनिमेशन छोड़ें',
      heroPrelude: 'हमारे परिवारों के आशीर्वाद से', heroInvite: 'आपको अपने विवाह में स्नेहपूर्वक आमंत्रित करते हैं', heroTaglineFirst: 'दो परंपराएँ।', heroTaglineSecond: 'एक सुंदर शुरुआत।', heroDate: '१२ और १३ दिसंबर २०२६', heroVenue: 'प्रवेग टेंट सिटी नर्मदा · स्टैच्यू ऑफ यूनिटी', exploreEvents: 'समारोह देखें', rsvpNow: 'अपना जवाब दें', scrollToStory: 'हमारी कहानी के लिए नीचे जाएँ ↓',
      storyPrelude: 'दिल से, आपके लिए', storyHeading: 'हमारी कहानी आपके साथ और सुंदर है।', storyText: 'दो परिवार, दो परंपराएँ और एक साझा भविष्य। इस नए अध्याय की शुरुआत पर हम उस प्यार और आशीर्वाद के लिए आभारी हैं जो हमें यहाँ तक लाए हैं। अपने विवाह की खुशी, संगीत और यादगार पल आपके साथ बाँटने का हमें बेसब्री से इंतज़ार है।',
      parentsPrelude: 'प्यार और आशीर्वाद के साथ', parentsHeading: 'हमारे माता-पिता का आशीर्वाद', parentsIntro: 'हमारे परिवार आपको इस उत्सव में स्नेहपूर्वक आमंत्रित करते हैं।', brideFamily: 'दुल्हन का परिवार', groomFamily: 'दूल्हे का परिवार', daughterOf: 'पुत्री', sonOf: 'पुत्र',
      revealPrelude: 'एक छोटी सी खुशी', revealHeading: 'खुरचकर उत्सव का पता लगाएँ', revealIntro: 'एक तारीख़ और एक जगह, जिन्हें जानना खास है।', saveDate: 'तारीख़ याद रखें', dateReveal: 'दिसंबर २०२६ · दो खुशियों भरे दिन', ourVenue: 'हमारा आयोजन स्थल', venueReveal: 'स्टैच्यू ऑफ यूनिटी · गुजरात', tapRevealDate: 'तारीख़ देखने के लिए टैप करें', tapRevealVenue: 'स्थान देखने के लिए टैप करें', directions: 'रास्ता देखें ↗', viewSchedule: 'पूरा कार्यक्रम देखें ↗',
      eventsPrelude: 'पाँच पल · एक उत्सव', eventsHeading: 'हर पल का अपना रंग है', swipeHint: 'आगे आने वाले पलों को स्वाइप या स्क्रॉल करके देखें।', engagement: 'सगाई', mandvo: 'मांडवो', haldi: 'हल्दी', sangeet: 'संगीत', wedding: 'विवाह', engagementMood: 'सुनहरी शुरुआत', mandvoMood: 'मंगल आशीर्वाद', haldiMood: 'रंग और हँसी', sangeetMood: 'बॉलीवुड की रात', weddingMood: 'एक सुंदर शुरुआत', discoverJourney: 'पूरी यात्रा देखें',
      closingPrelude: 'आपका साथ हमारा सबसे बड़ा उपहार है', closingHeading: 'खुशी, संगीत और आशीर्वाद में हमारे साथ रहें।', closingText: 'नर्मदा में ये दिन आपके साथ मनाना हमें बहुत अच्छा लगेगा।', leaveBlessing: 'शुभकामना लिखें',
      eventsPageTitle: 'उत्सव की कहानी', eventsPageIntro: 'दो खुशियों भरे दिनों के रंग, संगीत और आशीर्वाद का अनुभव करें। स्क्रॉल करें और हर दृश्य को जीवंत होते देखें।', saveCalendar: 'तारीख़ कैलेंडर में जोड़ें', allAtVenue: 'सभी समारोह प्रवेग टेंट सिटी नर्मदा, स्टैच्यू ऑफ यूनिटी में होंगे।', atVenue: 'प्रवेग टेंट सिटी नर्मदा',
      eventOne: '०१ / सगाई', eventTwo: '०२ / मांडवो', eventThree: '०३ / हल्दी', eventFour: '०४ / संगीत', eventFive: '०५ / विवाह', engagementDescription: 'दो परिवार एक सुंदर शुरुआत का उत्सव मनाने साथ आते हैं।', mandvoDescription: 'विवाह के उत्सव की शुभ शुरुआत के लिए आशीर्वाद का मंगल मिलन।', haldiDescription: 'रंगों, आशीर्वाद और हँसी से भरी एक दोपहर।', sangeetDescription: 'तारों के नीचे संगीत, नृत्य और उत्सव की शाम।', weddingDescription: 'दो परिवार, दो परंपराएँ और एक सुंदर साथ।', engagementTime: '१२ दिसंबर · सुबह ९ बजे', mandvoTime: '१२ दिसंबर · दोपहर १ बजे से', haldiTime: '१२ दिसंबर · शाम ४ बजे', sangeetTime: '१२ दिसंबर · रात ९ बजे', weddingTime: '१३ दिसंबर · सुबह ८ बजे से', scrollScene: 'दृश्य को जीवंत करने के लिए स्क्रॉल करें', eventsFinalPrelude: 'आपसे मिलने का इंतज़ार है', eventsFinalHeading: 'पाँच समारोह। एक यादगार मिलन।', eventsFinalText: 'सुनहरी सुबह से संगीत भरी रात तक, हम आशा करते हैं कि आप हर खुशी में शामिल होंगे।',
      rsvpPrelude: 'आपसे मिलने की आशा है', rsvpTitle: 'हमारे दिल में आपके लिए जगह है।', rsvpIntro: 'बताइए, क्या आप १२ और १३ दिसंबर को हमारे साथ उत्सव मनाएँगे?', previewNotice: 'डिज़ाइन पूर्वावलोकन · अभी जवाब सहेजे नहीं जा रहे हैं।', ourCelebration: 'हमारा उत्सव', rsvpAsideTitle: 'हर पल, साथ में।', rsvpAsideText: 'आपका एक जवाब पाँचों समारोहों के लिए है। हर कार्यक्रम के लिए अलग जवाब देने की ज़रूरत नहीं है।', datePill: 'दिसंबर २०२६', guestName: 'आपका नाम', familyName: 'परिवार का नाम', namePlaceholder: 'अपना नाम लिखें', familyPlaceholder: 'अपने परिवार का नाम लिखें', attendanceQuestion: 'क्या आप हमारे साथ आएँगे?', accept: 'खुशी से आएँगे', maybe: 'शायद / अभी तय नहीं', decline: 'आ नहीं पाएँगे', partySize: 'आने वाले लोगों की संख्या (वैकल्पिक)', phone: 'फ़ोन (वैकल्पिक)', email: 'ईमेल (वैकल्पिक)', optional: '(वैकल्पिक)', phonePlaceholder: 'विवाह की जानकारी के लिए', emailPlaceholder: 'ज़रूरत होने पर जवाब के लिए', blessing: 'आशीर्वाद या संदेश (वैकल्पिक)', blessingPlaceholder: 'दिल से एक संदेश लिखें', shareBlessing: 'मेरा आशीर्वाद स्वीकृति के बाद सार्वजनिक शुभकामना पृष्ठ पर भी दिखाएँ।', rsvpPrivacy: 'आपकी संपर्क जानकारी निजी रहेगी। आपका संदेश केवल आपकी अनुमति और स्वीकृति के बाद सार्वजनिक होगा।', sendRsvp: 'जवाब भेजें', rsvpAfter: 'आप आ सकें या दूर से प्यार भेजें, हमारी कहानी का हिस्सा होने के लिए हम आभारी हैं।',
      guestbookPrelude: 'दिल से लिखे संदेश', guestbookTitle: 'शुभकामनाएँ और प्रार्थनाएँ', guestbookIntro: 'उन लोगों के प्यार भरे शब्द जो हमारे जीवन को रोशन करते हैं।', guestbookFormTitle: 'एक संदेश जिसे हम सहेजेंगे।', guestbookFormIntro: 'हमारे लिए एक शुभकामना, प्रार्थना या प्यारी याद लिखें।', relation: 'परिवार का नाम या रिश्ता (वैकल्पिक)', relationPlaceholder: 'हम आपको कैसे जानते हैं', yourMessage: 'आपका आशीर्वाद या प्रार्थना', guestbookPlaceholder: 'अपना संदेश यहाँ लिखें', guestbookPrivacy: 'संदेश स्वीकृति के बाद ही इस सार्वजनिक पृष्ठ पर दिखेंगे। वही लिखें जिसे आप सार्वजनिक रूप से साझा करना चाहते हैं।', postBlessing: 'शुभकामना भेजें', blessingsFor: 'धृति और पूजन के लिए शुभकामनाएँ', guestbookWallTitle: 'शब्द जो हमेशा साथ रहेंगे।', guestbookEmpty: 'हमारी शुभकामना-पुस्तिका आपके आशीर्वाद की प्रतीक्षा कर रही है।', approvedOnly: 'यहाँ केवल स्वीकृत संदेश दिखेंगे।', guestbookBottom: 'आपका साथ और आशीर्वाद इस उत्सव को और भी खास बनाते हैं।',
      footerDate: '१२–१३ दिसंबर २०२६ · नर्मदा, गुजरात', footerNote: 'हमारे परिवारों के प्यार और आशीर्वाद के साथ।', timezone: 'सभी समय भारतीय मानक समय (IST) के अनुसार हैं।'
    },
    gu: {
      skipMain: 'મુખ્ય ભાગ પર જાઓ', navHome: 'મુખપૃષ્ઠ', navEvents: 'પ્રસંગો', navRsvp: 'જવાબ આપો', navGuestbook: 'શુભેચ્છાઓ', menuLabel: 'મેનુ', languageLabel: 'ભાષા', pauseMotion: 'ગતિ રોકો',
      coverPrelude: 'બે પરિવારની ઉજવણી', coverTitle: 'હૃદયથી આમંત્રણ।', coverSubtitle: 'તમારી ભાષા પસંદ કરો, પછી ઉજવણીનું દ્વાર ખોલો।', chooseLanguage: 'Welcome · स्वागत · સ્વાગત', openInvitation: 'આમંત્રણ ખોલો ✦', skipAnimation: 'એનિમેશન છોડો',
      heroPrelude: 'અમારા પરિવારના આશીર્વાદ સાથે', heroInvite: 'તમને તેમના લગ્નની ઉજવણીમાં પ્રેમથી આમંત્રિત કરે છે', heroTaglineFirst: 'બે પરંપરા.', heroTaglineSecond: 'એક સુંદર શરૂઆત.', heroDate: '૧૨ અને ૧૩ ડિસેમ્બર ૨૦૨૬', heroVenue: 'પ્રવેગ ટેન્ટ સિટી નર્મદા · સ્ટેચ્યુ ઑફ યુનિટી', exploreEvents: 'પ્રસંગો જુઓ', rsvpNow: 'જવાબ આપો', scrollToStory: 'અમારી વાર્તા માટે નીચે સ્ક્રોલ કરો ↓',
      storyPrelude: 'અમારા હૃદયથી તમારા માટે', storyHeading: 'અમારી વાર્તા તમારા સાથથી વધુ સુંદર છે.', storyText: 'બે પરિવાર, બે પરંપરા અને એક સહિયારું ભવિષ્ય. આ નવા અધ્યાયની શરૂઆતમાં અહીં સુધી પહોંચાડનાર પ્રેમ અને આશીર્વાદ માટે અમે આભારી છીએ. અમારા લગ્નની ખુશી, સંગીત અને યાદગાર પળો તમારી સાથે વહેંચવા અમે આતુર છીએ.',
      parentsPrelude: 'પ્રેમ અને આશીર્વાદ સાથે', parentsHeading: 'અમારા માતા-પિતાના આશીર્વાદ', parentsIntro: 'અમારા પરિવાર તમને આ ઉજવણીમાં પ્રેમથી આમંત્રિત કરે છે.', brideFamily: 'કન્યાનો પરિવાર', groomFamily: 'વરનો પરિવાર', daughterOf: 'પુત્રી', sonOf: 'પુત્ર',
      revealPrelude: 'એક નાનું સરપ્રાઇઝ', revealHeading: 'સ્ક્રેચ કરીને ઉજવણી જાણો', revealIntro: 'એક તારીખ અને એક જગ્યા, જે જાણવી ખાસ છે.', saveDate: 'તારીખ યાદ રાખો', dateReveal: 'ડિસેમ્બર ૨૦૨૬ · આનંદના બે દિવસ', ourVenue: 'અમારું સ્થળ', venueReveal: 'સ્ટેચ્યુ ઑફ યુનિટી · ગુજરાત', tapRevealDate: 'તારીખ જોવા ટૅપ કરો', tapRevealVenue: 'સ્થળ જોવા ટૅપ કરો', directions: 'રસ્તો જુઓ ↗', viewSchedule: 'સંપૂર્ણ કાર્યક્રમ જુઓ ↗',
      eventsPrelude: 'પાંચ પળ · એક ઉજવણી', eventsHeading: 'દરેક પળનો પોતાનો રંગ છે', swipeHint: 'આગળની ઉજવણી જોવા સ્વાઇપ કે સ્ક્રોલ કરો.', engagement: 'સગાઈ', mandvo: 'માંડવો', haldi: 'હળદી', sangeet: 'સંગીત', wedding: 'લગ્ન', engagementMood: 'સોનેરી શરૂઆત', mandvoMood: 'મંગળ આશીર્વાદ', haldiMood: 'રંગ અને હાસ્ય', sangeetMood: 'બૉલીવુડની રાત', weddingMood: 'એક સુંદર શરૂઆત', discoverJourney: 'આખી યાત્રા જુઓ',
      closingPrelude: 'તમારી હાજરી અમારી સૌથી મોટી ભેટ છે', closingHeading: 'ખુશી, સંગીત અને આશીર્વાદમાં અમારી સાથે જોડાઓ.', closingText: 'નર્મદા ખાતે આ દિવસો તમારી સાથે ઉજવવાનું અમને ખૂબ ગમશે.', leaveBlessing: 'શુભેચ્છા લખો',
      eventsPageTitle: 'ઉજવણીની સફર', eventsPageIntro: 'આનંદના બે દિવસના રંગ, સંગીત અને આશીર્વાદ અનુભવો. દરેક દૃશ્ય જીવંત થતું જોવા સ્ક્રોલ કરો.', saveCalendar: 'તારીખો કૅલેન્ડરમાં ઉમેરો', allAtVenue: 'બધા પ્રસંગો પ્રવેગ ટેન્ટ સિટી નર્મદા, સ્ટેચ્યુ ઑફ યુનિટી ખાતે યોજાશે.', atVenue: 'પ્રવેગ ટેન્ટ સિટી નર્મદા',
      eventOne: '૦૧ / સગાઈ', eventTwo: '૦૨ / માંડવો', eventThree: '૦૩ / હળદી', eventFour: '૦૪ / સંગીત', eventFive: '૦૫ / લગ્ન', engagementDescription: 'બે પરિવાર એક સુંદર શરૂઆત ઉજવવા ભેગા થાય છે.', mandvoDescription: 'લગ્નની ઉજવણીની શુભ શરૂઆત માટે આશીર્વાદનો મંગળ મેળાવડો.', haldiDescription: 'રંગ, આશીર્વાદ અને હાસ્યથી ભરેલી બપોર.', sangeetDescription: 'તારાઓ નીચે સંગીત, નૃત્ય અને ઉજવણીની સાંજ.', weddingDescription: 'બે પરિવાર, બે પરંપરા અને એક સુંદર સાથ.', engagementTime: '૧૨ ડિસેમ્બર · સવારે ૯ વાગ્યે', mandvoTime: '૧૨ ડિસેમ્બર · બપોરે ૧ વાગ્યાથી', haldiTime: '૧૨ ડિસેમ્બર · સાંજે ૪ વાગ્યે', sangeetTime: '૧૨ ડિસેમ્બર · રાત્રે ૯ વાગ્યે', weddingTime: '૧૩ ડિસેમ્બર · સવારે ૮ વાગ્યાથી', scrollScene: 'દૃશ્ય જીવંત કરવા સ્ક્રોલ કરો', eventsFinalPrelude: 'તમારી રાહ જોઈ રહ્યા છીએ', eventsFinalHeading: 'પાંચ પ્રસંગો. એક અવિસ્મરણીય મેળાવડો.', eventsFinalText: 'સોનેરી સવારથી સંગીતભરી રાત સુધી, દરેક ખુશીમાં તમે જોડાઓ એવી આશા છે.',
      rsvpPrelude: 'તમને મળવાની આશા છે', rsvpTitle: 'અમારા હૃદયમાં તમારા માટે જગ્યા છે.', rsvpIntro: 'જણાવો, શું તમે ૧૨ અને ૧૩ ડિસેમ્બરે અમારી સાથે ઉજવણી કરશો?', previewNotice: 'ડિઝાઇન પૂર્વાવલોકન · હાલમાં જવાબ સાચવવામાં આવતા નથી.', ourCelebration: 'અમારી ઉજવણી', rsvpAsideTitle: 'દરેક પળ, સાથે.', rsvpAsideText: 'તમારો એક જવાબ પાંચેય પ્રસંગો માટે છે. દરેક પ્રસંગ માટે અલગ જવાબ આપવાની જરૂર નથી.', datePill: 'ડિસેમ્બર ૨૦૨૬', guestName: 'તમારું નામ', familyName: 'પરિવારનું નામ', namePlaceholder: 'તમારું નામ લખો', familyPlaceholder: 'તમારા પરિવારનું નામ લખો', attendanceQuestion: 'શું તમે અમારી સાથે જોડાશો?', accept: 'આનંદથી આવીશું', maybe: 'કદાચ / હજી નક્કી નથી', decline: 'આવી નહીં શકીએ', partySize: 'આવનાર લોકોની સંખ્યા (વૈકલ્પિક)', phone: 'ફોન (વૈકલ્પિક)', email: 'ઈમેલ (વૈકલ્પિક)', optional: '(વૈકલ્પિક)', phonePlaceholder: 'લગ્નની માહિતી માટે', emailPlaceholder: 'જરૂર પડે તો જવાબ માટે', blessing: 'આશીર્વાદ અથવા સંદેશ (વૈકલ્પિક)', blessingPlaceholder: 'હૃદયથી એક સંદેશ લખો', shareBlessing: 'મારા આશીર્વાદને મંજૂરી પછી જાહેર શુભેચ્છા પાને પણ બતાવો.', rsvpPrivacy: 'તમારી સંપર્ક વિગતો ખાનગી રહેશે. તમારો સંદેશ તમારી મંજૂરી અને સમીક્ષા પછી જ જાહેર થશે.', sendRsvp: 'જવાબ મોકલો', rsvpAfter: 'તમે આવી શકો કે દૂરથી પ્રેમ મોકલો, અમારી વાર્તાનો ભાગ બનવા બદલ અમે આભારી છીએ.',
      guestbookPrelude: 'હૃદયથી લખેલા સંદેશ', guestbookTitle: 'શુભેચ્છાઓ અને પ્રાર્થનાઓ', guestbookIntro: 'અમારું જીવન ઉજળું કરનાર લોકોના પ્રેમાળ શબ્દો.', guestbookFormTitle: 'એક સંદેશ જે અમે સાચવી રાખીશું.', guestbookFormIntro: 'અમારા માટે શુભેચ્છા, પ્રાર્થના કે મીઠી યાદ લખો.', relation: 'પરિવારનું નામ અથવા સંબંધ (વૈકલ્પિક)', relationPlaceholder: 'અમે તમને કેવી રીતે ઓળખીએ છીએ', yourMessage: 'તમારા આશીર્વાદ અથવા પ્રાર્થના', guestbookPlaceholder: 'તમારો સંદેશ અહીં લખો', guestbookPrivacy: 'સંદેશો મંજૂરી પછી જ આ જાહેર પાને દેખાશે. તમને જાહેર કરવું યોગ્ય લાગે તે જ લખો.', postBlessing: 'શુભેચ્છા મોકલો', blessingsFor: 'ધૃતિ અને પૂજન માટે શુભેચ્છાઓ', guestbookWallTitle: 'શબ્દો જે હંમેશાં સાથ રહેશે.', guestbookEmpty: 'અમારી શુભેચ્છા-પુસ્તિકા તમારા આશીર્વાદની રાહ જોઈ રહી છે.', approvedOnly: 'અહીં માત્ર મંજૂર સંદેશો દેખાશે.', guestbookBottom: 'તમારી હાજરી અને આશીર્વાદ આ ઉજવણીને વધુ ખાસ બનાવે છે.',
      footerDate: '૧૨–૧૩ ડિસેમ્બર ૨૦૨૬ · નર્મદા, ગુજરાત', footerNote: 'અમારા પરિવારના પ્રેમ અને આશીર્વાદ સાથે.', timezone: 'બધા સમય ભારતીય માનક સમય (IST) મુજબ છે.'
    }
  };
  const dynamic = {
    en: { resumeMotion: 'Resume motion', pauseMotion: 'Pause motion', revealed: 'Revealed', scratchPrompt: 'SCRATCH TO REVEAL', previewFormStatus: 'This is a design preview. Your response has not been saved.' },
    hi: { resumeMotion: 'गतिविधि फिर चालू करें', pauseMotion: 'गतिविधि रोकें', revealed: 'दिख गया', scratchPrompt: 'खुरचकर देखें', previewFormStatus: 'यह डिज़ाइन पूर्वावलोकन है। आपका जवाब सहेजा नहीं गया है।' },
    gu: { resumeMotion: 'ગતિ ફરી શરૂ કરો', pauseMotion: 'ગતિ રોકો', revealed: 'જોઈ લીધું', scratchPrompt: 'સ્ક્રેચ કરીને જુઓ', previewFormStatus: 'આ ડિઝાઇન પૂર્વાવલોકન છે. તમારો જવાબ સાચવાયો નથી.' }
  };
  Object.assign(dynamic.en, { saving: 'Sending…', rsvpSaved: 'Thank you. Your RSVP has been saved.', blessingSaved: 'Thank you. Your blessing has been sent for approval.', submitError: 'Please check your details and try again. Refresh the page if the problem continues.', rateLimited: 'Too many submissions. Please try again in ten minutes.', networkError: 'We could not confirm your submission. Please check your connection before trying again.' });
  Object.assign(dynamic.hi, { saving: 'भेज रहे हैं…', rsvpSaved: 'धन्यवाद। आपका जवाब सहेज लिया गया है।', blessingSaved: 'धन्यवाद। आपका आशीर्वाद स्वीकृति के लिए भेज दिया गया है।', submitError: 'कृपया जानकारी जाँचें और फिर कोशिश करें। समस्या बनी रहे तो पेज रीफ़्रेश करें।', rateLimited: 'बहुत सारे जवाब आए हैं। कृपया दस मिनट बाद कोशिश करें।', networkError: 'आपका जवाब मिलने की पुष्टि नहीं हो सकी। दोबारा कोशिश करने से पहले कनेक्शन जाँचें।' });
  Object.assign(dynamic.gu, { saving: 'મોકલી રહ્યા છીએ…', rsvpSaved: 'આભાર. તમારો જવાબ સાચવવામાં આવ્યો છે.', blessingSaved: 'આભાર. તમારા આશીર્વાદ મંજૂરી માટે મોકલવામાં આવ્યા છે.', submitError: 'કૃપા કરીને વિગતો તપાસીને ફરી પ્રયાસ કરો. સમસ્યા રહે તો પેજ રિફ્રેશ કરો.', rateLimited: 'ઘણા જવાબ મળ્યા છે. કૃપા કરીને દસ મિનિટ પછી પ્રયાસ કરો.', networkError: 'તમારો જવાબ મળ્યાની ખાતરી થઈ શકી નથી. ફરી પ્રયાસ કરતા પહેલાં કનેક્શન તપાસો.' });
  Object.assign(dynamic.en, { coverTitle:'A little envelope. A lifetime of love.', coverSubtitle:'Choose the language you feel at home in.', openInvitation:'Open invite', chooseLanguageTitle:'Make yourself at home.', continueInvite:'Continue' });
  Object.assign(translations.hi, { coverTitle:'एक निमंत्रण। जीवन भर का साथ।', coverSubtitle:'अपनी पसंद की भाषा चुनें।', openInvitation:'निमंत्रण खोलें', chooseLanguageTitle:'आपका स्वागत है।', continueInvite:'आगे बढ़ें' });
  Object.assign(translations.gu, { coverTitle:'એક આમંત્રણ. જીવનભરનો સાથ.', coverSubtitle:'તમારી પસંદની ભાષા પસંદ કરો.', openInvitation:'આમંત્રણ ખોલો', chooseLanguageTitle:'તમારું સ્વાગત છે.', continueInvite:'આગળ વધો' });
  Object.assign(dynamic.en, { replayInvite:'Replay invitation', openInvitation:'Open invitation', directions:'Get directions', viewSchedule:'View full schedule' });
  Object.assign(translations.hi, { replayInvite:'निमंत्रण फिर देखें', openInvitation:'निमंत्रण खोलें', directions:'रास्ता देखें', viewSchedule:'पूरा कार्यक्रम देखें' });
  Object.assign(translations.gu, { replayInvite:'આમંત્રણ ફરી જુઓ', openInvitation:'આમંત્રણ ખોલો', directions:'રસ્તો જુઓ', viewSchedule:'સંપૂર્ણ કાર્યક્રમ જુઓ' });
  Object.assign(dynamic.en, { heartMonth:'December 2026', heartReveal:'Reveal our celebration', heartHint:'Scratch a little love. Uncover two beautiful days.', heartScratch:'SCRATCH TO REVEAL' });
  Object.assign(translations.hi, { heartMonth:'दिसंबर २०२६', heartReveal:'हमारा उत्सव देखें', heartHint:'थोड़ा प्यार खुरचें। दो सुंदर दिन जानें।', heartScratch:'खुरचकर देखें' });
  Object.assign(translations.gu, { heartMonth:'ડિસેમ્બર ૨૦૨૬', heartReveal:'અમારી ઉજવણી જુઓ', heartHint:'થોડો પ્રેમ સ્ક્રેચ કરો. બે સુંદર દિવસ જાણો.', heartScratch:'સ્ક્રેચ કરીને જુઓ' });
  Object.assign(translations.hi, {
    engagementName: 'सुनहरी सगाई', mandvoName: 'शुभ मांडवो', haldiName: 'रंगी सारी',
    sangeetName: 'ब्लाइंडिंग लाइट्स, बॉलीवुड नाइट्स', weddingName: 'मंगल मिलन',
    eventDetails: 'विवरण', eventSchedule: 'कार्यक्रम', jumpToEvent: 'समारोह चुनें', nextScene: 'अगला दृश्य',
    playEvents: 'समारोहों की झलक देखें', openEvent: 'इस समारोह की झलक', closeEvents: 'समारोह की झलक बंद करें',
    eventPlacards: 'समारोहों की झलकियाँ', previousEvent: 'पिछला समारोह', nextEvent: 'अगला समारोह',
    swipeEvents: 'अगले समारोह के लिए ऊपर स्वाइप करें', backToTimeline: 'कार्यक्रम पर लौटें', eventEffect: 'दृश्य में हलचल जोड़ें',
    engagementTheme: 'सुनहरी धूप · सहज बोहो अंदाज़ · सुनहरे रंग',
    mandvoTheme: 'गेंदा · पूजा · आशीर्वाद', haldiTheme: 'चमकीले रंग · रंगारंग · उल्लास',
    sangeetTheme: 'जगमगाती शाम · वेस्टर्न · कॉकटेल', weddingTheme: 'कोंकणी · गुजराती · विवाह की परंपराएँ',
    replyPageTitle: 'हाज़िरी और शुभकामनाएँ', confirmAttendance: 'आने की पुष्टि करें',
    allEventsRsvp: 'एक जवाब सभी पाँच समारोहों के लिए है।',
    attendingCount: 'आने वाले लोगों की संख्या, आपको मिलाकर', comingYes: 'हाँ, मैं आ रहा/रही हूँ',
    guestbookChoiceNotice: 'धृति और पूजन आपका नाम और संदेश सार्वजनिक शुभकामना पृष्ठ पर दिखाने के लिए चुन सकते हैं।',
    blessingPages: 'शुभकामनाओं के पन्ने', previousPage: 'पिछला', nextPage: 'अगला'
  });
  Object.assign(translations.gu, {
    engagementName: 'સુનહેરી સગાઈ', mandvoName: 'શુભ માંડવો', haldiName: 'રંગી સારી',
    sangeetName: 'બ્લાઇન્ડિંગ લાઇટ્સ, બોલિવૂડ નાઇટ્સ', weddingName: 'મંગલ મિલન',
    eventDetails: 'વિગતો', eventSchedule: 'કાર્યક્રમ', jumpToEvent: 'પ્રસંગ પસંદ કરો', nextScene: 'આગળનો પ્રસંગ',
    playEvents: 'પ્રસંગોની ઝલક જુઓ', openEvent: 'આ પ્રસંગની ઝલક', closeEvents: 'પ્રસંગની ઝલક બંધ કરો',
    eventPlacards: 'પ્રસંગોની ઝલક', previousEvent: 'પાછળનો પ્રસંગ', nextEvent: 'આગળનો પ્રસંગ',
    swipeEvents: 'આગળના પ્રસંગ માટે ઉપર સ્વાઇપ કરો', backToTimeline: 'કાર્યક્રમ પર પાછા જાઓ', eventEffect: 'દૃશ્યમાં હલચલ ઉમેરો',
    engagementTheme: 'સોનેરી તડકો · સહજ બોહો અંદાજ · સોનેરી રંગો',
    mandvoTheme: 'ગલગોટા · પૂજા · આશીર્વાદ', haldiTheme: 'ચમકતા રંગો · રંગબેરંગી · આનંદમય',
    sangeetTheme: 'ઝગમગતી સાંજ · વેસ્ટર્ન · કૉકટેલ', weddingTheme: 'કોંકણી · ગુજરાતી · લગ્નની પરંપરાઓ',
    replyPageTitle: 'હાજરી અને શુભેચ્છાઓ', confirmAttendance: 'હાજરીની ખાતરી આપો',
    allEventsRsvp: 'એક જવાબથી પાંચેય પ્રસંગો માટે હાજરી નોંધાય છે.',
    attendingCount: 'તમારી સહિત આવનારા લોકોની સંખ્યા', comingYes: 'હા, હું આવીશ',
    guestbookChoiceNotice: 'ધૃતિ અને પૂજન તમારું નામ અને સંદેશ જાહેર શુભેચ્છા પાનાં પર મૂકવા માટે પસંદ કરી શકે છે.',
    blessingPages: 'શુભેચ્છાઓનાં પાનાં', previousPage: 'પાછળનું', nextPage: 'આગળનું'
  });
  const metadata = {
    home: { hi: ['धृति और पूजन · विवाह निमंत्रण', '१२–१३ दिसंबर २०२६ को नर्मदा में हमारे विवाह उत्सव में शामिल हों।'], gu: ['ધૃતિ અને પૂજન · લગ્ન આમંત્રણ', '૧૨–૧૩ ડિસેમ્બર ૨૦૨૬ના રોજ નર્મદા ખાતે અમારી લગ્ન ઉજવણીમાં જોડાઓ.'] },
    events: { hi: ['समारोह · धृति और पूजन', '१२–१३ दिसंबर २०२६ के विवाह समारोहों की जानकारी।'], gu: ['પ્રસંગો · ધૃતિ અને પૂજન', '૧૨–૧૩ ડિસેમ્બર ૨૦૨૬ના લગ્ન પ્રસંગોની માહિતી.'] },
    rsvp: { hi: ['हाज़िरी और शुभकामनाएँ · धृति और पूजन', 'धृति और पूजन के विवाह में अपनी हाज़िरी बताएँ या शुभकामना लिखें।'], gu: ['હાજરી અને શુભેચ્છાઓ · ધૃતિ અને પૂજન', 'ધૃતિ અને પૂજનના લગ્નમાં હાજરી નોંધાવો કે શુભેચ્છા લખો.'] },
    guestbook: { hi: ['शुभकामनाएँ · धृति और पूजन', 'धृति और पूजन के लिए आशीर्वाद और शुभकामनाएँ लिखें।'], gu: ['શુભેચ્છાઓ · ધૃતિ અને પૂજન', 'ધૃતિ અને પૂજન માટે આશીર્વાદ અને શુભેચ્છાઓ લખો.'] }
  };
  const defaults = new WeakMap();
  const title = document.title;
  const description = document.querySelector('meta[name="description"]')?.content;
  document.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-aria]').forEach(node => {
    defaults.set(node, { text: node.textContent, placeholder: node.getAttribute('placeholder'), aria: node.getAttribute('aria-label') });
  });
  function text(key, lang) { return dynamic[lang]?.[key] || translations[lang]?.[key] || dynamic.en[key] || key; }
  function translate(lang) {
    document.querySelectorAll('[data-i18n]').forEach(node => node.textContent = lang === 'en' ? defaults.get(node).text : text(node.dataset.i18n, lang));
    document.querySelectorAll('[data-i18n-placeholder]').forEach(node => node.placeholder = lang === 'en' ? defaults.get(node).placeholder : text(node.dataset.i18nPlaceholder, lang));
    document.querySelectorAll('[data-i18n-aria]').forEach(node => node.setAttribute('aria-label', lang === 'en' ? defaults.get(node).aria : text(node.dataset.i18nAria, lang)));
    const page = document.body.dataset.page;
    document.title = lang === 'en' ? title : (metadata[page]?.[lang]?.[0] || title);
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = lang === 'en' ? description : (metadata[page]?.[lang]?.[1] || description);
  }
  window.WeddingI18n = { translate, text, translations };
})();
