import { BookOpenCheck } from "lucide-react";

export default function SubjectWelcomePage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-gray-50 p-4">
            <BookOpenCheck className="h-16 w-16 mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold">HSC Notes Pro-তে স্বাগতম</h2>
            <p className="mt-2">শুরু করার জন্য বাম পাশের তালিকা থেকে একটি অধ্যায় ও টপিক বেছে নিন।</p>
        </div>
    );
}