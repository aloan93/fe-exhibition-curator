import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Homepage.module.css";
import { metMuseumAPI } from "../../api/api";
import SearchBar from "../SearchBar/SearchBar";
import HomepageCard from "../HomepageCard/HomepageCard";
import PageNav from "../PageNav/PageNav";

export default function Homepage(): ReactNode {
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [searchResultsTotal, setSearchResultsTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = searchParams.get("page") || "1";
  const paginatedSearchResults = searchResults.slice(
    Number(page) * 20 - 20,
    Number(page) * 20
  );

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      setError("");
      metMuseumAPI
        .get(`/search?q=${query}&hasImages=true`)
        .then(({ data: { total, objectIDs } }) => {
          !objectIDs ? setSearchResults([]) : setSearchResults(objectIDs);
          setSearchResultsTotal(total);
          setIsLoading(false);
        })
        .catch((err) => {
          setError("Something went wrong. Please try again later.");
          setIsLoading(false);
          console.log(err);
        });
    } else {
      setSearchResults([]);
      setSearchResultsTotal(0);
    }
  }, [query]);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SearchBar setSearchParams={setSearchParams} />
          {error ? <p>{error}</p> : null}
          {searchResults.length > 0 ? (
            <PageNav
              page={page}
              setSearchParams={setSearchParams}
              searchResultsTotal={searchResultsTotal}
            />
          ) : null}
          <div className={styles.listContainer}>
            {paginatedSearchResults.map((id) => {
              return <HomepageCard key={id} id={id} />;
            })}
          </div>
          {searchResults.length > 0 ? (
            <PageNav
              page={page}
              setSearchParams={setSearchParams}
              searchResultsTotal={searchResultsTotal}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
