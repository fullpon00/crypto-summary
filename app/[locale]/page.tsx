export default function HomePage({ params }: { params: { locale: string } }) {
  return <div>Home - {params.locale}</div>
}
