import getPopularSubjects from "@/lib/actions/getPopularSubjects";

export default async function Home() {
  const popularSubjects = await getPopularSubjects();

  return (
    <div className="space-y-8 mt-4">
      <h1 className="text-4xl font-bold">Thot - Karakterstatestikk</h1>
      <p className="text-lg">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae
        asperiores maxime nam ut id quasi magni quisquam aspernatur quibusdam
        eligendi earum dicta voluptatem temporibus, exercitationem veniam.
        Consequuntur magnam corrupti eligendi?
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {popularSubjects.map((subject) => (
          <div
            key={subject.emnekode}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold">{subject.emnekode}</h3>
            <p className="text-muted-foreground mt-2">{subject.emnenavn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
