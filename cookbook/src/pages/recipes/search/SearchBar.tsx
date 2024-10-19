import SearchIcon from "components/icons/SearchIcon";
import { useState } from "react";

interface SearchBarProps {
  readonly initialValue: string;
}

const SearchBar = ({ initialValue }: SearchBarProps) => {
  const [input, setInput] = useState<string>(initialValue);
  return (
    <div className="search-bar block floating interactive-element">
      <input type="search" name="name" maxLength={100} value={input} onChange={event => setInput(event.target.value)} />
      <SearchIcon />
    </div>
  );
};

export default SearchBar;
