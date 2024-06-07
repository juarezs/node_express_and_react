import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function FilterField({onFilter, ...props} : {onFilter: (filter: string) => void}) {
  const [filter, setFilter] = useState<string>('');
  const [debouncedValue] = useDebounce(filter, 500);

  useEffect(() => {
    onFilter(debouncedValue)
  }, [debouncedValue]);

  return (
    <div className="sm:w-full inline-flex mr-4 relative">
      <Input
        {...props}
        className={"min-w-36"}
        placeholder="Search"
        value={filter}
        onChange={(event) =>
          setFilter(event.target.value)
        }
      >
      </Input>
    </div>
  );
}
