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
  ...ACTIVITIES_LIST_TEXT,
  ...ACTIVITIES_DETAIL_TEXT,
  ...TUTORING_LIST_TEXT,
  ...TUTORING_DETAIL_TEXT,
  ...RESTAURANTS_LIST_TEXT,
  ...RESTAURANTS_DETAIL_TEXT,
} as const;
