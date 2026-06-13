const ACTIVITIES_LIST_TEXT = {
  activities_list_text_title: '公益慈善活動截止日期',
  activities_list_text_subtitle:
    '公益慈善會議、競賽和活動重要截止日期概覽，不再錯過參與公益事業、奉獻愛心和社會服務的機會',
  activities_list_text_search_placeholder: '搜尋活動標題、標籤、地點...',
  activities_list_text_search_button: '搜尋',
  activities_list_text_filter_category: '類別篩選',
  activities_list_text_filter_tags: '標籤篩選',
  activities_list_text_filter_all: '全部',
  activities_list_text_filter_reset: '清空篩選',
  activities_list_text_no_result_title: '未找到結果',
  activities_list_text_no_result_tip: '請嘗試其他關鍵詞',
  activities_list_text_previous_page: '上一頁',
  activities_list_text_next_page: '下一頁',
};

const ACTIVITIES_DETAIL_TEXT = {
  activities_detail_text_back_to_list: '返回列表',
  activities_detail_text_edit_on_github: '在 GitHub 上編輯',
  activities_detail_text_category_conference: '會議',
  activities_detail_text_category_competition: '競賽',
  activities_detail_text_category_activity: '活動',
  activities_detail_text_ended: '已結束',
  activities_detail_text_timeline: '時間軸',
  activities_detail_text_location: '活動地點',
  activities_detail_text_comments: '評論',
};

const TUTORING_LIST_TEXT = {
  tutoring_list_text_title: '志願輔導課程',
  tutoring_list_text_subtitle:
    '志願者老師的備課資料庫，含教案、示範影片與音訊素材',
  tutoring_list_text_contribute_course: '+ 貢獻課程',
  tutoring_list_text_search_placeholder: '搜尋課程標題、標籤、講師...',
  tutoring_list_text_search_button: '搜尋',
  tutoring_list_text_all_tags: '全部',
  tutoring_list_text_empty_title: '暫無符合條件的課程',
  tutoring_list_text_empty_tip: '請嘗試更換關鍵詞或標籤',
  tutoring_list_text_minutes: '分鐘',
  tutoring_list_text_view_course: '查看課程',
};

const TUTORING_DETAIL_TEXT = {
  tutoring_detail_text_back_to_list: '返回課程列表',
  tutoring_detail_text_edit_on_github: '在 GitHub 上編輯',
  tutoring_detail_text_minutes: '分鐘',
  tutoring_detail_text_audio_resources: '音訊資源',
  tutoring_detail_text_audio_unsupported_prefix: '您的瀏覽器不支援音訊播放，',
  tutoring_detail_text_audio_unsupported_link: '點此下載',
  tutoring_detail_text_audio_unsupported_suffix: '。',
  tutoring_detail_text_video_resources: '影片資源',
  tutoring_detail_text_attachments: '附件下載',
};

const RESTAURANTS_LIST_TEXT = {
  restaurants_list_text_title: '無障礙友善美食指南',
  restaurants_list_text_subtitle: '發現包容性餐飲體驗',
  restaurants_list_text_publish_restaurant: '+ 發布餐廳',
  restaurants_list_text_search_placeholder: '搜尋餐廳名稱、地址、標籤...',
  restaurants_list_text_search_button: '搜尋',
  restaurants_list_text_no_results: '暫無符合條件的餐廳',
  restaurants_list_text_tags_hearing: '聽障友善',
  restaurants_list_text_tags_visual: '視障友善',
  restaurants_list_text_tags_wheelchair: '輪椅友善',
  restaurants_list_text_labels_features: '特色服務',
  restaurants_list_text_labels_food: '美食類型',
  restaurants_list_text_labels_address: '地址',
  restaurants_list_text_labels_navigate: '導航',
  restaurants_list_text_view_details: '查看詳情',
  restaurants_list_text_view_details_title: '查看詳情',
  restaurants_list_text_about_title: '關於無障礙美食',
  restaurants_list_text_about_p1:
    '無障礙美食致力於為身心障礙人士提供平等的用餐體驗。我們精選各地的無障礙友善餐廳，涵蓋聽障、視障、輪椅使用者和認知障礙人士的需求。',
  restaurants_list_text_about_p2:
    '每家餐廳都經過實地考察，確保提供真正的無障礙服務。我們希望透過這個平台，讓更多人了解和支持無障礙餐飲，共同創造更包容的社會。',
  restaurants_list_text_filters_all: '全部',
  restaurants_list_text_filters_hearing: '聽障友善',
  restaurants_list_text_filters_visual: '視障友善',
  restaurants_list_text_filters_wheelchair: '輪椅友善',
  restaurants_list_text_filters_cognitive: '認知友善',
};

const RESTAURANTS_DETAIL_TEXT = {
  restaurants_detail_text_back: '返回',
  restaurants_detail_text_edit_on_github: '在 GitHub 上編輯',
  restaurants_detail_text_hearing_friendly: '聽障友善',
  restaurants_detail_text_visual_friendly: '視障友善',
  restaurants_detail_text_food_type: '美食類型',
  restaurants_detail_text_features: '特色服務',
  restaurants_detail_text_restaurant_location: '餐廳位置',
  restaurants_detail_text_comments: '評論',
};

export default {
  ...ACTIVITIES_LIST_TEXT,
  ...ACTIVITIES_DETAIL_TEXT,
  ...TUTORING_LIST_TEXT,
  ...TUTORING_DETAIL_TEXT,
  ...RESTAURANTS_LIST_TEXT,
  ...RESTAURANTS_DETAIL_TEXT,
} as const;
