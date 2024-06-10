import { ReactNode, useState } from "react";
import { SetURLSearchParams } from "react-router-dom";
import styles from "./SearchBar.module.css";

export default function SearchBar(props: {
  setSearchParams: SetURLSearchParams;
}): ReactNode {
  const [search, setSearch] = useState("");

  function submitSearch(e: any) {
    e.preventDefault();
    props.setSearchParams((prev) => {
      prev.set("query", search);
      prev.delete("page");
      return prev;
    });
  }

  return (
    <form className={styles.container} onSubmit={submitSearch}>
      <input
        className={styles.searchInput}
        id="search"
        aria-label="Search"
        autoComplete="off"
        autoCorrect="off"
        type="text"
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
        required
      />
      <button className={styles.searchBtn} aria-label="Search">
        {"🔍"}
      </button>
    </form>
  );
}
