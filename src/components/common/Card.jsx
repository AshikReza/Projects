export default function Card({ children }) {
  return (
    <div className="bg-white p-5 mx-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {children}
    </div>
  );
}