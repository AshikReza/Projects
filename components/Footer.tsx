export default function Footer() {
  return (
    <footer
      className="
        py-5 text-sm 
        c-space
        bg-white text-neutral-600 
        dark:bg-black dark:text-neutral-300
      "
    >
      <div className="mx-16 sm:mx-32 md:mx-40 flex flex-wrap items-center justify-between">
        <div className="flex gap-1.5">
          <p>Terms & Conditions</p>
          <p>|</p>
          <p>Privacy Policy</p>
        </div>
        <p className="text-sm dark:text-neutral-300 text-neutral-600">
          Developed with ❤️ by{" "}
          <a
            href="https://ashik-reza.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Ashik
          </a>
        </p>
        <p>© 2025 | All rights reserved.</p>
      </div>
    </footer>
  );
}
