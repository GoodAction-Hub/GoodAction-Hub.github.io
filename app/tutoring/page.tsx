import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Search,
} from 'lucide-react';
import { getVisiblePages, parsePage } from '@/lib/pagination';
import { fetchTutoringCatalog } from '@/lib/tutoring';

const PAGE_SIZE = 10;

type PageSearchParams = Promise<{
  page?: string;
  query?: string;
  tag?: string;
}>;

function buildPageHref(page: number, query: string, tag: string): string {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (tag) params.set('tag', tag);
  if (page > 1) params.set('page', String(page));
  const queryString = params.toString();
  return queryString ? `/tutoring?${queryString}` : '/tutoring';
}

function buildTagHref(nextTag: string, query: string): string {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (nextTag) params.set('tag', nextTag);
  const queryString = params.toString();
  return queryString ? `/tutoring?${queryString}` : '/tutoring';
}

export default async function TutoringPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { page: rawPage, query: rawQuery, tag: rawTag } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const selectedTag = rawTag?.trim() ?? '';

  const courses = await fetchTutoringCatalog();

  const allTags = Array.from(new Set(courses.flatMap((course) => course.tags)));

  const filteredCourses = courses.filter((course) => {
    if (selectedTag && !course.tags.includes(selectedTag)) return false;
    if (!query) return true;

    const q = query.toLowerCase();
    return (
      course.title.toLowerCase().includes(q) ||
      course.summary.toLowerCase().includes(q) ||
      course.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      (course.instructor ?? '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const currentPage = Math.min(parsePage(rawPage), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedCourses = filteredCourses.slice(start, start + PAGE_SIZE);
  const visiblePages = getVisiblePages(totalPages, currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            志愿辅导课程
          </h1>
          <p className="text-lg text-gray-700 mb-4 font-medium">
            志愿者老师的备课资料库，含教案、示范视频与音频素材
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="https://github.com/GoodAction-Hub/GoodAction-data/edit/main/data/tutoring.yml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
            >
              + 贡献课程
            </a>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <form action="/tutoring" method="get">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder="搜索课程标题、标签、讲师..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />
              {selectedTag && (
                <input type="hidden" name="tag" value={selectedTag} />
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium"
              >
                搜索
              </button>
            </div>
          </form>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildTagHref('', query)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  !selectedTag
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={buildTagHref(tag === selectedTag ? '' : tag, query)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    tag === selectedTag
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {pagedCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              暂无符合条件的课程
            </h3>
            <p className="text-gray-600">请尝试更换关键词或标签</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedCourses.map((course) => (
              <Link
                key={course.slug}
                href={`/tutoring/${course.slug}`}
                className="group bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {course.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.cover}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3 flex-1">
                    {course.summary}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    {course.instructor && (
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {course.instructor}
                      </span>
                    )}
                    {course.stage && (
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.stage}
                      </span>
                    )}
                    {course.durationMin && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.durationMin} 分钟
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {course.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 group-hover:gap-2 transition-all">
                    查看课程 <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={buildPageHref(currentPage - 1, query, selectedTag)}
                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
              >
                上一页
              </Link>
            )}
            {visiblePages.map((page) => (
              <Link
                key={page}
                href={buildPageHref(page, query, selectedTag)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-md border text-sm ${
                  page === currentPage
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                {page}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link
                href={buildPageHref(currentPage + 1, query, selectedTag)}
                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
              >
                下一页
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
