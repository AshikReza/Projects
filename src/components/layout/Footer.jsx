export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-10">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>© {new Date().getFullYear()} HSC Notes Pro. All Rights Reserved.</p>
      </div>
    </footer>
  );
}