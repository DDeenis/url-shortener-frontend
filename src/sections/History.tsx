import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { type JSX, createSignal } from "solid-js";
import { Input } from "~/components/ui/input";
import { Sections, setCurrentSection } from "~/state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const periodSelectMap: Record<string, string> = {
  last7days: "Last 7 days",
  last30days: "Last 30 days",
  allTime: "All Time",
};

export default function HistorySection() {
  const [value, setValue] = createSignal("");

  const observer = new IntersectionObserver(
    () => {
      setCurrentSection(Sections.History);
      //   location.hash = Sections.History;
      history.replaceState({}, "", "#" + Sections.History);
    },
    {
      threshold: 1,
    }
  );

  return (
    <div
      class="snap-start h-screen flex flex-col items-center justify-center space-y-6"
      id={Sections.History}
      ref={(el) => observer.observe(el)}
    >
      <div class="w-full max-w-3xl flex flex-col items-center">
        <h2 class="text-2xl font-bold text-primary">History</h2>
        <div class="flex justify-between items-center w-full mt-4">
          <Select
            value={value()}
            onChange={setValue}
            placeholder="Filter by date"
            multiple={false}
            options={["last7days", "last30days", "allTime"]}
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                {periodSelectMap[props.item.rawValue]}
              </SelectItem>
            )}
          >
            <SelectTrigger aria-label="Period" class="w-[180px]">
              <SelectValue<string>>
                {(state) => periodSelectMap[state.selectedOption()]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
          <Input class="ml-2" placeholder="Search by URL" type="text" />
        </div>
        <div class="w-full mt-4 border-t border-secondary">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="font-bold">Short URL</TableHead>
                <TableHead class="font-bold">Original URL</TableHead>
                <TableHead class="font-bold">Date</TableHead>
                <TableHead class="font-bold">Redirects</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell class="break-words overflow-ellipsis">
                  shortened.url/123456
                  <IconCopy class="text-primary inline ml-2" />
                </TableCell>
                <TableCell class="break-words overflow-ellipsis">
                  original.url/long-url
                  <IconCopy class="text-primary inline ml-2" />
                </TableCell>
                <TableCell>2023-11-21</TableCell>
                <TableCell class="overflow-hidden overflow-ellipsis">
                  122
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div class="flex justify-center space-x-4 mt-4">
            <Button class="text-primary border-primary" variant="outline">
              Previous
            </Button>
            <Button class="text-primary border-primary" variant="outline">
              1
            </Button>
            <Button class="text-primary border-primary" variant="outline">
              2
            </Button>
            <Button class="text-primary border-primary" variant="outline">
              3
            </Button>
            <Button class="bg-primary text-primary-foreground">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconCopy(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
