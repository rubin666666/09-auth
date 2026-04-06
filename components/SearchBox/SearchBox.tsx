import css from "./SearchBox.module.css";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <label className={css.field}>
      <span>Search</span>
      <input
        className={css.input}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Find notes"
      />
    </label>
  );
}
