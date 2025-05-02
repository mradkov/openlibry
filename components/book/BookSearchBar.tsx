import { BookPlus, LayoutGrid, LayoutList, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface BookSearchBarPropType {
  handleInputChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => Promise<void>;
  handleNewBook: React.MouseEventHandler<HTMLButtonElement>;
  bookSearchInput: string;
  toggleView: React.MouseEventHandler<HTMLButtonElement>;
  detailView: boolean;
}

export default function BookSearchBar({
  handleInputChange,
  handleNewBook,
  bookSearchInput,
  toggleView,
  detailView,
}: BookSearchBarPropType) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button onClick={toggleView} variant="ghost" size="icon">
              {detailView ? (
                <LayoutGrid className="size-6" />
              ) : (
                <LayoutList className="size-6" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Превключване на изгледа</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="relative grow flex items-center">
        <Input
          value={bookSearchInput}
          onChange={async (e) => await handleInputChange(e)}
          placeholder="Търсене на книга.."
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Search className="absolute right-1.5 top-1.5 text-input" />
            </TooltipTrigger>
            <TooltipContent>Търсене</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="m-0">
            <Button variant="ghost" size="icon" onClick={handleNewBook}>
              <BookPlus className="size-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Създаване на нова книга</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
