import { useEffect, useState } from "react";

function About() {
    const [content, setContent] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("https://script.google.com/macros/s/AKfycbzBEXNFt0565RzWVwSLyPiYdaVWSwMJZnJzIJHQedrgfJq0cacjGPLJZ65Tju0ZrOGU/exec")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Could not fetch content from Google Apps Script");
                }
                return response.json();
            })
            .then((data) => {
                if (data.error) {
                    throw new Error(data.error);
                }
                setContent(data);
            })
            .catch((err) => setError(err.message));
    }, []);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!content) {
        return <p className="text-blue-500">Loading...</p>;
    }

    return (
        <main className="text-black px-6 py-10">
            <section className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">About Me</h1>

                <p className="text-lg mb-10">
                    {content.introduction}
                </p>

                <h2 className="text-3xl font-semibold mb-4">
                    My Background
                </h2>

                <p className="text-lg mb-10">
                    {content.background}
                </p>

                <h2 className="text-3xl font-semibold mb-4">
                    What I’m Working Toward
                </h2>

                <p className="text-lg">
                    {content.goals}
                </p>
            </section>
        </main>
    );
}

export default About;