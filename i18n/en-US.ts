const BASE_TEXT = {
  'ui.title': 'Open Source Deadlines',
  'info.description':
    'An overview of important deadlines for open source conferences, competitions, and events, so you never miss an opportunity to contribute, learn, and connect with the community.',
  'info.timezone':
    "All deadlines are converted to Beijing Time by default. If you are unsure of your current time zone, please click 'Auto Detect' next to the time zone selector.",
  'info.disclaimer':
    '*Disclaimer: The data on this site is manually maintained and for reference only.',
  'events.notFound': 'No events found',
  'events.hint':
    'Try adjusting the filters or search terms to see more events.',
  'events.loading': 'Loading events...',
  'events.ended': 'Ended',
  'events.outdated': 'Outdated',
  'events.allDeadlinesPassed': 'All deadlines have passed',
  'events.nextDeadline': 'Next Deadline',
  'events.timeline': 'Timeline',
  'events.swipe': 'Swipe',
  'acknowledgments.stack': 'Built with Next.js and shadcn/ui',
  'acknowledgments.contributor': 'inscripoem',
  'acknowledgments.organization': 'HUST Open Atom Club',
  'acknowledgments.support': 'Maintained',
  'acknowledgments.develop': 'Developed',
  'filter.searchPlaceholder': 'Enter topics, locations, time to explore!',
  'filter.searchTimezone': 'Search timezone...',
  'filter.autoDetect': 'Auto Detect',
  'filter.onlyFavorites': 'Favorites Only',
  'filter.category': 'Category',
  'filter.all': 'All',
  'filter.category_conference': 'Conference',
  'filter.category_competition': 'Competition',
  'filter.category_activity': 'Activity',
  'filter.location': 'Location',
  'date.days': 'Days',
  'date.hours': 'Hours',
  'date.minutes': 'Minutes',
  'date.seconds': 'Seconds',
  'pagination.first': 'Go to first page',
  'pagination.previous': 'Go to previous page',
  'pagination.next': 'Go to next page',
  'pagination.last': 'Go to last page',
  'calendar.title': 'Calendar',
  'calendar.download': 'Download .ics',
  'calendar.google': 'Google',
  'calendar.outlook': 'Outlook.com',
  'calendar.yahoo': 'Yahoo',
  'calendar.apple': 'Apple / iCal',
  'calendar.saveDescription': 'iCalendar file',
  'ui_text.search_placeholder': 'Search ...',
  'ui_text.github_repo': 'GitHub Repo',
  'mainnav.mobile.open': 'Open navigation menu',
  'mainnav.mobile.close': 'Close navigation menu',
  'home.selector.title': 'GoodAction Hub Home',
  'home.selector.subtitle':
    'Choose a module to enter: charity activity deadlines, accessible dining guide, or volunteer tutoring courses.',
  'home.search.label': 'Explore',
  'home.search.aria': 'Search recommendations',
  'home.qr.alt': 'GoodActionHub community QR code',
  'detail.back': 'Back',
  'detail.viewDetails': 'View details',
  'detail.editOnGitHub': 'Edit on GitHub',
  'detail.location': 'Location',
  'detail.comments': 'Comments',
  'detail.openInAmap': 'Open in Amap',
  'detail.loadingMap': 'Loading map...',
  'detail.mapUnavailable': 'Map preview unavailable',
  'recommend.loadFailed': 'Failed to load data',
  'recommend.fetchError': 'Failed to fetch data',
  original_timezone: 'Original timezone',
  'bites.title': 'Barrier-Free Dining Guide',
  'bites.subtitle': 'Equal dining experiences for everyone',
  'bites.about.title': 'About Barrier‑Free Dining',
  'bites.about.p1':
    'Barrier‑free dining is more than physical accessibility; it is a mindset of respect and inclusion. Through professional service, thoughtful design, and a commitment to equality, these restaurants ensure every guest enjoys a delightful dining experience. They not only create employment opportunities for people with disabilities, but also raise public awareness of the importance of accessible services.',
  'bites.about.p2':
    'With this guide, we hope to help everyone discover more warm, inclusive restaurants and encourage more food and beverage businesses to focus on accessibility, together fostering a more inclusive and friendly social environment.',
  'bites.filters.all': 'All Restaurants',
  'bites.filters.hearing': 'Deaf-friendly',
  'bites.filters.visual': 'Blind-friendly',
  'bites.filters.wheelchair': 'Wheelchair-friendly',
  'bites.filters.cognitive': 'Cognitive-friendly',
  'bites.tags.hearing': 'Deaf-friendly',
  'bites.tags.visual': 'Blind-friendly',
  'bites.tags.wheelchair': 'Wheelchair-friendly',
  'bites.tags.cognitive': 'Cognitive-friendly',
  'bites.labels.features': 'Accessibility Features',
  'bites.labels.food': 'Food Specialties:',
  'bites.labels.value': 'Social Value:',
  'bites.labels.address': 'Address:',
  'bites.labels.copy': 'Copy',
  'bites.labels.copied': 'Copied!',
  'bites.labels.navigate': 'Navigate',
  'bites.labels.ai_recommend': 'AI Food Recommendation',
  'bites.labels.experience': 'Featured Experience:',
  'bites.labels.highlights': 'Highlights:',
  'bites.ai_dialog.title':
    'Enter location and preferences to get AI recommendations',
  'bites.ai_dialog.description':
    'Powered by Spark LLM; prioritizes accessibility-friendly dining (sign language venues, blind-friendly themes, etc.).',
  'bites.ai_dialog.labels.location': 'Location',
  'bites.ai_dialog.labels.preferences': 'Food Preferences',
  'bites.ai_dialog.placeholders.location':
    "e.g., Jiang'an District, Wuhan; Xihu District, Hangzhou",
  'bites.ai_dialog.placeholders.preferences':
    'e.g., coffee, bakery, Sichuan cuisine; budget, per capita, chain or specialty',
  'bites.ai_dialog.actions.generate': 'Generate AI Recommendations',
  'bites.ai_dialog.actions.generating': 'Generating Recommendations',
  'bites.ai_dialog.actions.close': 'Close',
  'bites.ai_dialog.errors.empty': 'No matching recommendations were found',
  'bites.ai_dialog.errors.generic':
    'AI recommendation failed. Please try again later.',
  'bites.ai_dialog.errors.unavailable_with_results':
    'AI recommendation is unavailable right now, so fallback suggestions are shown.',
  'bites.restaurants.peige.name': 'Peige Chimney Cake Bakery',
  'bites.restaurants.peige.description':
    'A specialty bakery dedicated to warm service for Deaf customers, renowned for its unique chimney cakes and barrier‑free communication. Professional sign‑language service helps every guest order with ease.',
  'bites.restaurants.peige.food':
    'Chimney cakes, European soft breads, handmade pastries',
  'bites.restaurants.peige.value':
    'Employs Deaf staff and fosters an inclusive atmosphere',
  'bites.restaurants.peige.address':
    'Room 105-3, No. 29 Hanshan Road, Luyang District, Hefei, Anhui',
  'bites.restaurants.muma_dark.name': 'Muma Fairy Tale Dark Dining',
  'bites.restaurants.muma_dark.description':
    'In fully dark surroundings guided by visually impaired staff, offering a unique tactile and auditory dining experience.',
  'bites.restaurants.muma_dark.food':
    'French cuisine, Japanese cuisine, private custom',
  'bites.restaurants.muma_dark.experience':
    'Dine in darkness to experience food through different senses',
  'bites.restaurants.muma_dark.value':
    'Has provided employment opportunities for hundreds of persons with disabilities over 12 years',
  'bites.restaurants.muma_dark.address':
    '8th Floor, Xixi Friendship Hotel, 109 Xidan North Street, Xicheng District, Beijing',
  'bites.restaurants.starbucks_wende.name':
    'Starbucks Oriental Wende Sign Language Store (Guangzhou)',
  'bites.restaurants.starbucks_wende.description':
    'Guangzhou’s first Starbucks sign‑language store offering sign‑language communication and barrier‑free wayfinding to create an easy, equal experience for Deaf customers.',
  'bites.restaurants.starbucks_wende.food': 'Specialty coffee, light desserts',
  'bites.restaurants.starbucks_wende.value':
    'Sign‑language service, visual menus, quiet‑friendly space',
  'bites.restaurants.starbucks_wende.address':
    'Level 1, Oriental Wende Plaza, 68 Wende North Road, Yuexiu District, Guangzhou',
  'bites.restaurants.quanjude_qianmen.name':
    'Quanjude Qianmen Branch (Beijing)',
  'bites.restaurants.quanjude_qianmen.description':
    'An accessibility showcase branch of the traditional Beijing brand, offering Braille menus, accessible dining areas, adaptive tableware and guide‑dog friendly measures, and providing basic sign‑language training to staff to enhance equal dining.',
  'bites.restaurants.quanjude_qianmen.food':
    'Beijing roast duck, Beijing‑style cuisine',
  'bites.restaurants.quanjude_qianmen.value':
    'Accessibility showcase, promotes training manual for serving customers with disabilities',
  'bites.restaurants.quanjude_qianmen.address':
    'Qianmen Street, Dongcheng District, Beijing (Quanjude Qianmen Branch)',
  'bites.restaurants.naga_tree.name':
    'Naga Tree Accessible Coffee & Pizza Collective (Dashilan, Beijing)',
  'bites.restaurants.naga_tree.description':
    'China’s first “accessible coffee & pizza collective”, featuring a ramp at the entrance, low‑mounted call button, wind‑chime sound localization, wide double doors and handrails. It serves multiple disability groups and advocates inclusion.',
  'bites.restaurants.naga_tree.highlights':
    'Coffee and pizza collective; “collective” of accessibility features',
  'bites.restaurants.naga_tree.address':
    'Dashilan area near Qianmen, Beijing (Naga Tree Café)',
  'bites.restaurants.silent_yuxi.name': 'Silent Restaurant (Yuxi, Yunnan)',
  'bites.restaurants.silent_yuxi.description':
    'Operated by Deaf staff, with sign‑language learning and caring service that remove communication barriers and provide a warm, equal dining experience.',
  'bites.restaurants.silent_yuxi.food':
    'Braised tofu and other homestyle dishes',
  'bites.restaurants.silent_yuxi.value':
    'Provides jobs for Deaf people and emphasizes healing and inclusion',
  'bites.restaurants.silent_yuxi.address':
    'Yuxi City, Yunnan (Silent Restaurant)',
  'bites.restaurants.yuanliang_798.name':
    'Yuanliang Skewers (798 Art District, Beijing)',
  'bites.restaurants.yuanliang_798.description':
    'A small shop founded by a person with autism, practicing grocery shopping and customer service, actively integrating into society.',
  'bites.restaurants.yuanliang_798.food': 'Skewers, snacks',
  'bites.restaurants.yuanliang_798.value':
    'Founded by an autistic owner; practices independent living and social integration',
  'bites.restaurants.yuanliang_798.address':
    '798 Art District, Chaoyang District, Beijing (Yuanliang Skewers)',
  'bites.restaurants.rainbow_angel.name': 'Rainbow Angel Café (Shanghai)',
  'bites.restaurants.rainbow_angel.food': 'Coffee drinks, desserts',
  'bites.restaurants.rainbow_angel.value':
    'Inclusive employment for youth with intellectual disabilities; promotes public awareness',
  'bites.restaurants.rainbow_angel.address':
    'Shanghai City (Rainbow Angel Café)',
  'bites.restaurants.mina_tongzhou.name':
    'Mina Restaurant (Tongzhou District, Beijing)',
  'bites.restaurants.mina_tongzhou.description':
    'Employs hearing‑impaired staff; offers sign‑language services and tools, encouraging customers to experience non‑verbal communication and understand the Deaf community.',
  'bites.restaurants.mina_tongzhou.food':
    'Seared fish fillet with Sichuan pepper, noodle dishes',
  'bites.restaurants.mina_tongzhou.value':
    'Promotes understanding of Deaf culture through service and non‑verbal communication',
  'bites.restaurants.mina_tongzhou.address':
    'Tongzhou District, Beijing (Mina Restaurant)',
  'bites.restaurants.silent_hotpot.name':
    'Silent Hotpot (Liangjiang New Area, Chongqing)',
  'bites.restaurants.silent_hotpot.description':
    'A Deaf‑friendly hotpot restaurant with sign‑language menus and call devices. Visual communication and community events deepen social inclusion and provide employment opportunities for Deaf staff.',
  'bites.restaurants.silent_hotpot.food': 'Nourishing chicken soup hotpot',
  'bites.restaurants.silent_hotpot.value':
    'Employs Deaf staff, organizes community service hotpot for seniors, promotes public understanding and inclusion',
  'bites.restaurants.silent_hotpot.address':
    'Liangjiang New Area, Chongqing (Silent Hotpot)',
  'bites.restaurants.chunchu.name':
    'Chunchu Café (near Beijing School for the Blind)',
  'bites.restaurants.chunchu.description':
    'Near the Beijing School for the Blind, it provides barista job training for special‑education students including autism. With teacher accompaniment, trainees complete cleaning, stocking, coffee making and takeaway packing. Structured processes create a friendly, quiet work and dining environment.',
  'bites.restaurants.chunchu.food': 'Coffee, bread',
  'bites.restaurants.chunchu.value':
    'Provides internship and employment support for autistic and other cognitively disabled youth, improving vocational skills and social integration',
  'bites.restaurants.chunchu.address':
    'Haidian District, Beijing (Chunchu Café)',
  'bites.restaurants.starbucks_dc.name':
    'Starbucks Accessibility Store (Washington, D.C., Union Market)',
  'bites.restaurants.starbucks_dc.description':
    'The first “accessibility store” at Washington, D.C.’s Union Market, featuring automatic doors, open layout, low counters and a friendly ordering system (voice assistance, screen zoom, menu pictures). Lighting and soundproofing are optimized, and obstacles are cleared from pathways to enhance experiences for wheelchair users and customers with visual impairments.',
  'bites.restaurants.starbucks_dc.food': 'Coffee beverages, drip coffee',
  'bites.restaurants.starbucks_dc.value':
    'Serves everyone through universal accessible design, strengthening customer emotional connection and employee engagement',
  'bites.restaurants.starbucks_dc.address':
    'Union Market, Washington, D.C., USA (Accessible Starbucks)',
} as const;

const ACTIVITIES_LIST_TEXT = {
  activities_list_text_title: 'Charity Activity Deadlines',
  activities_list_text_subtitle:
    'An overview of important deadlines for charity conferences, competitions, and activities.',
  activities_list_text_search_placeholder: 'Search title, tags, location...',
  activities_list_text_search_button: 'Search',
  activities_list_text_filter_category: 'Category',
  activities_list_text_filter_tags: 'Tags',
  activities_list_text_filter_all: 'All',
  activities_list_text_filter_reset: 'Reset',
  activities_list_text_publish_activity: '+ Publish Activity',
  activities_list_text_timezone_note:
    'All deadlines are converted to Beijing Time by default. If you are unsure of your current time zone, please click "Auto Detect" next to the time zone selector.',
  activities_list_text_disclaimer:
    '*Disclaimer: The data on this site is manually maintained and for reference only.',
  activities_list_text_footer:
    'Charity activity tracking platform - making care easier to pass along and public good simpler to take part in',
  activities_list_text_no_result_title: 'No results found',
  activities_list_text_no_result_tip: 'Try a different keyword',
  activities_list_text_previous_page: 'Previous',
  activities_list_text_next_page: 'Next',
};

const ACTIVITIES_DETAIL_TEXT = {
  activities_detail_text_back_to_list: 'Back to List',
  activities_detail_text_edit_on_github: 'Edit on GitHub',
  activities_detail_text_category_conference: 'Conference',
  activities_detail_text_category_competition: 'Competition',
  activities_detail_text_category_activity: 'Activity',
  activities_detail_text_ended: 'Ended',
  activities_detail_text_timeline: 'Timeline',
  activities_detail_text_location: 'Location',
  activities_detail_text_comments: 'Comments',
};

const TUTORING_LIST_TEXT = {
  tutoring_list_text_title: 'Volunteer Tutoring Courses',
  tutoring_list_text_subtitle:
    'A teaching prep library for volunteer tutors with lesson plans, demo videos, and audio materials.',
  tutoring_list_text_contribute_course: '+ Contribute Course',
  tutoring_list_text_search_placeholder:
    'Search course title, tags, instructor...',
  tutoring_list_text_search_button: 'Search',
  tutoring_list_text_all_tags: 'All',
  tutoring_list_text_empty_title: 'No matching courses found',
  tutoring_list_text_empty_tip: 'Try different keywords or tags',
  tutoring_list_text_minutes: 'min',
  tutoring_list_text_view_course: 'View Course',
};

const TUTORING_DETAIL_TEXT = {
  tutoring_detail_text_back_to_list: 'Back to Course List',
  tutoring_detail_text_edit_on_github: 'Edit on GitHub',
  tutoring_detail_text_minutes: 'min',
  tutoring_detail_text_audio_resources: 'Audio Resources',
  tutoring_detail_text_audio_unsupported_prefix:
    'Your browser does not support audio playback, ',
  tutoring_detail_text_audio_unsupported_link: 'download here',
  tutoring_detail_text_audio_unsupported_suffix: '.',
  tutoring_detail_text_video_resources: 'Video Resources',
  tutoring_detail_text_attachments: 'Attachments',
};

const RESTAURANTS_LIST_TEXT = {
  restaurants_list_text_title: 'Accessible Restaurant Guide',
  restaurants_list_text_subtitle: 'Discover inclusive dining experiences',
  restaurants_list_text_publish_restaurant: '+ Publish Restaurant',
  restaurants_list_text_search_placeholder:
    'Search restaurant name, address, tags...',
  restaurants_list_text_search_button: 'Search',
  restaurants_list_text_no_results: 'No matching restaurants found',
  restaurants_list_text_tags_hearing: 'Hearing Friendly',
  restaurants_list_text_tags_visual: 'Visual Friendly',
  restaurants_list_text_tags_wheelchair: 'Wheelchair Friendly',
  restaurants_list_text_labels_features: 'Features',
  restaurants_list_text_labels_food: 'Cuisine',
  restaurants_list_text_labels_address: 'Address',
  restaurants_list_text_labels_navigate: 'Navigate',
  restaurants_list_text_view_details: 'View Details',
  restaurants_list_text_view_details_title: 'View Details',
  restaurants_list_text_about_title: 'About Accessible Dining',
  restaurants_list_text_about_p1:
    'Accessible dining aims to provide equal dining experiences for people with disabilities. We curate accessibility-friendly restaurants across regions, covering the needs of people with hearing, visual, mobility, and cognitive disabilities.',
  restaurants_list_text_about_p2:
    'Each restaurant is reviewed to ensure practical accessibility services. Through this platform, we hope more people can understand and support inclusive dining, and help build a more inclusive society.',
  restaurants_list_text_filters_all: 'All',
  restaurants_list_text_filters_hearing: 'Hearing Friendly',
  restaurants_list_text_filters_visual: 'Visual Friendly',
  restaurants_list_text_filters_wheelchair: 'Wheelchair Friendly',
  restaurants_list_text_filters_cognitive: 'Cognitive Friendly',
};

const RESTAURANTS_DETAIL_TEXT = {
  restaurants_detail_text_back: 'Back',
  restaurants_detail_text_edit_on_github: 'Edit on GitHub',
  restaurants_detail_text_hearing_friendly: 'Hearing Friendly',
  restaurants_detail_text_visual_friendly: 'Visual Friendly',
  restaurants_detail_text_food_type: 'Cuisine',
  restaurants_detail_text_features: 'Features',
  restaurants_detail_text_restaurant_location: 'Restaurant Location',
  restaurants_detail_text_comments: 'Comments',
};

export default {
  ...BASE_TEXT,
  ...ACTIVITIES_LIST_TEXT,
  ...ACTIVITIES_DETAIL_TEXT,
  ...TUTORING_LIST_TEXT,
  ...TUTORING_DETAIL_TEXT,
  ...RESTAURANTS_LIST_TEXT,
  ...RESTAURANTS_DETAIL_TEXT,
} as const;
