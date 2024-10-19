import SearchIcon from "components/icons/SearchIcon";

interface SearchBarProps {
  readonly value: string;
  readonly setValue: (newValue: string) => void;
}

const SearchBar = ({ value, setValue }: SearchBarProps) => {
  return (
    <div className="search-bar block floating interactive-element">
      <input type="search" name="name" maxLength={100} value={value} onChange={event => setValue(event.target.value)} />
      <SearchIcon />
    </div>
  );
};

export default SearchBar;
