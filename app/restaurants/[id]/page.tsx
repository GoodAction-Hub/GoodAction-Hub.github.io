import { ChinaMapWrapper } from '@/components/ChinaMapWrapper';
import { CommentBox } from '@/components/CommentBox';
import SafeTranslation from '@/components/SafeTranslation';
import { fetchBitesCatalog } from '@/lib/bitesCatalog';
import { ArrowLeft, MapPin, MessageSquare, Pencil } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DATA_EDIT_URL =
  'https://github.com/GoodAction-Hub/GoodAction-data/edit/main/restaurants.json';

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catalog = await fetchBitesCatalog();
  const restaurant = catalog.find((r) => r.id === id);
  if (!restaurant) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        {/* Back + Edit buttons */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/restaurants">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <SafeTranslation tKey="detail.back" fallback="返回" />
            </Button>
          </Link>
          <a href={DATA_EDIT_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              <Pencil className="w-4 h-4" />
              <SafeTranslation
                tKey="detail.editOnGitHub"
                fallback="在 GitHub 上编辑"
              />
            </Button>
          </a>
        </div>

        {/* Main card */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {restaurant.accessibility.deafFriendly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    👂{' '}
                    <SafeTranslation
                      tKey="bites.tags.hearing"
                      fallback="听障友好"
                    />
                  </span>
                )}
                {restaurant.accessibility.blindFriendly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    👁️{' '}
                    <SafeTranslation
                      tKey="bites.tags.visual"
                      fallback="视障友好"
                    />
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold leading-tight">
                {restaurant.name}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {restaurant.description}
              </p>
            </div>

            {/* Food types */}
            {restaurant.food && restaurant.food.length > 0 && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">
                  <SafeTranslation
                    tKey="bites.labels.food"
                    fallback="美食类型"
                  />
                  {': '}
                </span>
                {restaurant.food.map(({ name }) => name).join('、')}
              </div>
            )}

            {/* Tags / features */}
            {restaurant.tags.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  <SafeTranslation
                    tKey="bites.labels.features"
                    fallback="特色服务"
                  />
                </p>
                <ul className="flex flex-wrap gap-2">
                  {restaurant.tags.map((tag) => (
                    <li
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Address */}
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{restaurant.address}</span>
            </div>

            {/* Social values */}
            {restaurant.social_values?.[0] && (
              <div className="flex flex-wrap gap-2">
                {restaurant.social_values.map((value) => (
                  <span
                    key={value}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 text-xs"
                  >
                    {value}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5" />
              <SafeTranslation tKey="detail.location" fallback="活动地点" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChinaMapWrapper
              zoom={10}
              title={restaurant.name}
              address={restaurant.address}
            />
          </CardContent>
        </Card>

        {/* Comments section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5" />
              <SafeTranslation tKey="detail.comments" fallback="评论" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CommentBox />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
