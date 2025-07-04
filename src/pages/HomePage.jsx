import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";

export default function HomePage() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch("/data/subjects.json")
      .then((res) => res.json())
      .then(setSubjects);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold p-5 mb-6">Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link to={`/subjects/${subject.id}`} key={subject.id}>
            <Card>
              <h2 className="text-2xl font-bold text-blue-600">{subject.name}</h2>
              <p className="text-gray-600 mt-2">{subject.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}