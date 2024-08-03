import SearchIcon from "components/icons/SearchIcon";
import { useState } from "react";

const SearchBar = () => {
  const [input, setInput] = useState<string>();
  return (
    <div className="search-bar block floating interactive-element">
      <input type="search" name="name" maxLength={30} value={input} onChange={event => setInput(event.target.value)} />
      <SearchIcon />
    </div>
  );
};

export default SearchBar;
