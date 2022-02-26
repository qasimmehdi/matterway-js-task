import { FormEvent, useCallback, useEffect, useState } from "react";

interface IGenre {
  name: string;
  url: string;
}

function App() {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    fetch("http://localhost:8000/books/genres")
      .then((response) => response.json())
      .then((data) => {
        setGenres(data);
      })
      .catch((error) => alert(error.response.message));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      fetch("http://localhost:8000/books/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          genreUrl: selectedGenre,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          alert(error.response.message);
        });
    },
    [selectedGenre]
  );

  const handleGenereSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedGenre(e.target.value);
    },
    []
  );

  return (
    <div className="md:grid md:grid-cols-12 h-screen place-content-center">
      <div className="md:mt-0 md:col-start-5 md:col-span-4 sm:rounded-md bg-gray-50 shadow-lg">
        <h2 className="text-lg text-center my-4 font-medium leading-6 text-gray-900">
          Find a book
        </h2>
        <form className="mx-4" onSubmit={handleSubmit}>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleGenereSelect}
          >
            <option value="">Select a genre</option>

            {genres.map((genre) => (
              <option key={genre.url} value={genre.url}>
                {genre.name}
              </option>
            ))}
          </select>

          <div className="px-4 py-3 text-right sm:px-6">
            <span className="relative inline-flex">
              <button
                disabled={!selectedGenre || isLoading}
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-500"
              >
                {isLoading ? "Findinf a book..." : "Find a book"}
              </button>
              {isLoading && (
                <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
              )}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
