import DetailMovie from '@/components/movie/detailMovie/detailMovie';

const DetailMoviePage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  let res = await fetch(`${process.env.BASE_URL}/movie/getMovieId/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  res = await res.json();

  return (
    <DetailMovie
      //@ts-ignore
      movie={res?.data ?? {}}
    />
  );
};

export default DetailMoviePage;
