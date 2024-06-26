import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./MuseumCollections.module.css";
import { clevelandMuseumAPI } from "../../api/api";
import SearchBar from "../SearchBar/SearchBar";
import PageNav from "../PageNav/PageNav";
import ClevelandMuseumOfArtCard from "../MuseumCollectionCards/ClevelandMuseumOfArtCard";

export default function ClevelandMuseumOfArt(): ReactNode {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [resultsTotal, setResultsTotal] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    setIsLoading(true);
    setError("");
    setPrompt("");
    clevelandMuseumAPI
      .get(
        `/artworks/?q=${query}&has_image=1&limit=20&skip=${
          (Number(page) - 1) * 20
        }`
      )
      .then(
        ({
          data: {
            data,
            info: { total },
          },
        }) => {
          !data ? setSearchResults([]) : setSearchResults(data);
          setResultsTotal(total);
          total === 0 ? setPrompt("No matching results found :(") : null;
          setIsLoading(false);
        }
      )
      .catch(() => {
        setError("Something went wrong. Please try again later.");
        setPrompt("");
        setIsLoading(false);
      });
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cleveland Museum of Art Collection</h2>
      {isLoading ? (
        <div className={styles.loader} aria-label="Loading"></div>
      ) : (
        <>
          <SearchBar setSearchParams={setSearchParams} currentQuery={query} />
          {error ? (
            <div
              className={`${styles.errorContainer} ${styles.errorContainerMain}`}>
              <p className={styles.notFound}>{error}</p>
            </div>
          ) : (
            <>
              {prompt ? <p className={styles.prompt}>{prompt}</p> : null}
              {searchResults.length > 0 ? (
                <PageNav
                  page={page}
                  setSearchParams={setSearchParams}
                  resultsTotal={resultsTotal}
                  hideText={false}
                />
              ) : null}
              <ul className={styles.listContainer}>
                {searchResults.map((artefact) => {
                  return (
                    <li key={artefact.id}>
                      <ClevelandMuseumOfArtCard artefact={artefact} />
                    </li>
                  );
                })}
              </ul>
              {searchResults.length > 0 ? (
                <PageNav
                  page={page}
                  setSearchParams={setSearchParams}
                  resultsTotal={resultsTotal}
                  hideText={true}
                />
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  );
}
