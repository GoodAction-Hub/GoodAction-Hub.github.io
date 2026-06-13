const ACTIVITIES_LIST_TEXT = {
  activities_list_text_title: '公益慈善活动截止日期',
  activities_list_text_subtitle:
    '公益慈善会议、竞赛和活动重要截止日期概览，不再错过参与公益事业、奉献爱心和社会服务的机会',
  activities_list_text_search_placeholder: '搜索活动标题、标签、地点...',
  activities_list_text_search_button: '搜索',
  activities_list_text_filter_category: '类别筛选',
  activities_list_text_filter_tags: '标签筛选',
  activities_list_text_filter_all: '全部',
  activities_list_text_filter_reset: '清空筛选',
  activities_list_text_no_result_title: '未找到结果',
  activities_list_text_no_result_tip: '请尝试其他关键词',
  activities_list_text_previous_page: '上一页',
  activities_list_text_next_page: '下一页',
};

const ACTIVITIES_DETAIL_TEXT = {
  activities_detail_text_back_to_list: '返回列表',
  activities_detail_text_edit_on_github: '在 GitHub 上编辑',
  activities_detail_text_category_conference: '会议',
  activities_detail_text_category_competition: '竞赛',
  activities_detail_text_category_activity: '活动',
  activities_detail_text_ended: '已结束',
  activities_detail_text_timeline: '时间轴',
  activities_detail_text_location: '活动地点',
  activities_detail_text_comments: '评论',
};

const TUTORING_LIST_TEXT = {
  tutoring_list_text_title: '志愿辅导课程',
  tutoring_list_text_subtitle:
    '志愿者老师的备课资料库，含教案、示范视频与音频素材',
  tutoring_list_text_contribute_course: '+ 贡献课程',
  tutoring_list_text_search_placeholder: '搜索课程标题、标签、讲师...',
  tutoring_list_text_search_button: '搜索',
  tutoring_list_text_all_tags: '全部',
  tutoring_list_text_empty_title: '暂无符合条件的课程',
  tutoring_list_text_empty_tip: '请尝试更换关键词或标签',
  tutoring_list_text_minutes: '分钟',
  tutoring_list_text_view_course: '查看课程',
};

const TUTORING_DETAIL_TEXT = {
  tutoring_detail_text_back_to_list: '返回课程列表',
  tutoring_detail_text_edit_on_github: '在 GitHub 上编辑',
  tutoring_detail_text_minutes: '分钟',
  tutoring_detail_text_audio_resources: '音频资源',
  tutoring_detail_text_audio_unsupported_prefix: '您的浏览器不支持音频播放，',
  tutoring_detail_text_audio_unsupported_link: '点此下载',
  tutoring_detail_text_audio_unsupported_suffix: '。',
  tutoring_detail_text_video_resources: '视频资源',
  tutoring_detail_text_attachments: '附件下载',
};

const RESTAURANTS_LIST_TEXT = {
  restaurants_list_text_title: '无障碍友好美食指南',
  restaurants_list_text_subtitle: '发现包容性餐饮体验',
  restaurants_list_text_publish_restaurant: '+ 发布餐厅',
  restaurants_list_text_search_placeholder: '搜索餐厅名称、地址、标签...',
  restaurants_list_text_search_button: '搜索',
  restaurants_list_text_no_results: '暂无符合条件的餐厅',
  restaurants_list_text_tags_hearing: '听障友好',
  restaurants_list_text_tags_visual: '视障友好',
  restaurants_list_text_tags_wheelchair: '轮椅友好',
  restaurants_list_text_labels_features: '特色服务',
  restaurants_list_text_labels_food: '美食类型',
  restaurants_list_text_labels_address: '地址',
  restaurants_list_text_labels_navigate: '导航',
  restaurants_list_text_view_details: '查看详情',
  restaurants_list_text_view_details_title: '查看详情',
  restaurants_list_text_about_title: '关于无障碍美食',
  restaurants_list_text_about_p1:
    '无障碍美食致力于为残障人士提供平等的用餐体验。我们精选了各地的无障碍友好餐厅，涵盖听障、视障、轮椅使用者和认知障碍人士的需求。',
  restaurants_list_text_about_p2:
    '每家餐厅都经过实地考察，确保提供真正的无障碍服务。我们希望通过这个平台，让更多人了解和支持无障碍餐饮，共同创造一个更包容的社会。',
  restaurants_list_text_filters_all: '全部',
  restaurants_list_text_filters_hearing: '听障友好',
  restaurants_list_text_filters_visual: '视障友好',
  restaurants_list_text_filters_wheelchair: '轮椅友好',
  restaurants_list_text_filters_cognitive: '认知友好',
};

const RESTAURANTS_DETAIL_TEXT = {
  restaurants_detail_text_back: '返回',
  restaurants_detail_text_edit_on_github: '在 GitHub 上编辑',
  restaurants_detail_text_hearing_friendly: '听障友好',
  restaurants_detail_text_visual_friendly: '视障友好',
  restaurants_detail_text_food_type: '美食类型',
  restaurants_detail_text_features: '特色服务',
  restaurants_detail_text_restaurant_location: '餐厅位置',
  restaurants_detail_text_comments: '评论',
};

export default {
  ...ACTIVITIES_LIST_TEXT,
  ...ACTIVITIES_DETAIL_TEXT,
  ...TUTORING_LIST_TEXT,
  ...TUTORING_DETAIL_TEXT,
  ...RESTAURANTS_LIST_TEXT,
  ...RESTAURANTS_DETAIL_TEXT,
} as const;
