import searchIcon from "assets/search.svg";
import { useState } from "react";

const SearchBar = () => {
  const [input, setInput] = useState<string>();
  return (
    <div className="search-bar block floating">
      <input type="search" name="name" maxLength={30} value={input} onChange={event => setInput(event.target.value)} />
      <img src={searchIcon} alt="search icon" />
    </div>
  );
};

export default SearchBar;
