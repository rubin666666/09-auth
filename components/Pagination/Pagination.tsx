import css from "./Pagination.module.css";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function Pagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: PaginationProps) {
  return (
    <div className={css.actions}>
      <button type="button" className={css.button} disabled={page <= 1} onClick={onPrevious}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages || 1}
      </span>
      <button
        type="button"
        className={css.button}
        disabled={page >= totalPages}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}
