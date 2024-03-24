import BaseBlock from "components/BaseBlock";
import searchIcon from "assets/search.svg";
import { useState } from "react";

const SearchBar = () => {
  const [input, setInput] = useState<string>("");
  return (
    <BaseBlock className="search-bar">
      <input type="search" maxLength={30} value={input} onChange={event => setInput(event.target.value)} />
      <img src={searchIcon} alt="search icon" />
    </BaseBlock>
  );
};

export default SearchBar;
