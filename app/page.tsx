import { SubjectCard } from "@/component/Home/SubjectCard";
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
          <SubjectCard
            key={subject.id}
            emnekode={subject.id}
            emnenavn={subject.name}
            institusjonskode={subject.department?.faculty.universityId}
          />
        ))}
      </div>
    </div>
  );
}
