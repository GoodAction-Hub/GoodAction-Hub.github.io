import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  Pencil,
  Video,
  Volume2,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchTutoringBody, fetchTutoringCatalog } from '@/lib/tutoring';
import styles from './markdown.module.css';

const DATA_EDIT_URL =
  'https://github.com/GoodAction-Hub/GoodAction-data/edit/main/data/tutoring.yml';

export default async function TutoringDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = await fetchTutoringCatalog();
  const course = catalog.find((c) => c.slug === slug);
  if (!course) notFound();

  const body = course.bodyUrl ? await fetchTutoringBody(course.bodyUrl) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/tutoring">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回课程列表
            </Button>
          </Link>
          <a href={DATA_EDIT_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              <Pencil className="w-4 h-4" />在 GitHub 上编辑
            </Button>
          </a>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 space-y-5">
            {course.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.cover}
                alt={course.title}
                className="w-full max-h-72 object-cover rounded-lg"
              />
            )}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
              {course.title}
            </h1>
            <p className="text-gray-700">{course.summary}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {course.instructor && (
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  {course.instructor}
                </span>
              )}
              {course.stage && (
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {course.stage}
                </span>
              )}
              {course.durationMin && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {course.durationMin} 分钟
                </span>
              )}
            </div>

            {course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {body && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <article className={styles.markdown}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {body}
                </ReactMarkdown>
              </article>
            </CardContent>
          </Card>
        )}

        {course.videos.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3 inline-flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                视频资源
              </h2>
              <ul className="space-y-2">
                {course.videos.map((v) => (
                  <li key={v.url}>
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      {v.title}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {course.audios.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3 inline-flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-purple-600" />
                音频资源
              </h2>
              <ul className="space-y-3">
                {course.audios.map((a) => (
                  <li key={a.url}>
                    <div className="text-sm text-gray-700 mb-1">{a.title}</div>
                    <audio
                      controls
                      preload="none"
                      src={a.url}
                      className="w-full"
                    >
                      您的浏览器不支持音频播放，<a href={a.url}>点此下载</a>。
                    </audio>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {course.attachments.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3 inline-flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                附件下载
              </h2>
              <ul className="space-y-2">
                {course.attachments.map((f) => (
                  <li key={f.url}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      {f.title}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
