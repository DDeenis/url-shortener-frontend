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
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
          History
        </h2>
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
            <SelectTrigger aria-label="Fruit" class="w-[180px] bg-white">
              <SelectValue<string>>
                {(state) => periodSelectMap[state.selectedOption()]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
          <Input
            class="ml-2 bg-white"
            placeholder="Search by URL"
            type="text"
          />
        </div>
        <div class="w-full mt-4 border-t border-gray-300 dark:border-gray-600">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="text-gray-800 dark:text-gray-200 font-bold">
                  Short URL
                </TableHead>
                <TableHead class="text-gray-800 dark:text-gray-200 font-bold">
                  Original URL
                </TableHead>
                <TableHead class="text-gray-800 dark:text-gray-200 font-bold">
                  Date
                </TableHead>
                <TableHead class="text-gray-800 dark:text-gray-200 font-bold">
                  Redirects
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell class="text-gray-800 dark:text-gray-200 break-words overflow-ellipsis">
                  shortened.url/123456
                  <IconCopy class="text-blue-500 inline ml-2" />
                </TableCell>
                <TableCell class="text-gray-800 dark:text-gray-200 break-words overflow-ellipsis">
                  original.url/long-url
                  <IconCopy class="text-blue-500 inline ml-2" />
                </TableCell>
                <TableCell class="text-gray-800 dark:text-gray-200">
                  2023-11-21
                </TableCell>
                <TableCell class="text-gray-800 dark:text-gray-200 overflow-hidden overflow-ellipsis">
                  122
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* <div class="grid grid-cols-4 gap-4 py-2 border-b border-gray-300 dark:border-gray-600 font-bold">
            <p class="text-gray-800 dark:text-gray-200 overflow-hidden overflow-ellipsis">
              Short URL
            </p>
            <p class="text-gray-800 dark:text-gray-200 overflow-hidden overflow-ellipsis">
              Original URL
            </p>
            <time class="text-gray-600 dark:text-gray-400">Date</time>
            <p class="text-gray-800 dark:text-gray-200 overflow-hidden overflow-ellipsis">
              Redirects
            </p>
          </div>
          <div class="grid grid-cols-4 gap-4 py-2 border-b border-gray-300 dark:border-gray-600">
            <div class="flex items-center space-x-2">
              <p class="text-gray-800 dark:text-gray-200 break-words overflow-ellipsis line-clamp-2">
                shortened.url/123456
              </p>
              <IconCopy class="text-blue-500" />
            </div>
            <div class="flex items-center space-x-2">
              <p class="text-gray-800 dark:text-gray-200 break-words overflow-ellipsis line-clamp-2">
                original.url/long-url
              </p>
              <IconCopy class="text-blue-500" />
            </div>
            <time class="text-gray-600 dark:text-gray-400">2023-11-21</time>
            <p class="text-gray-800 dark:text-gray-200 overflow-hidden overflow-ellipsis">
              150
            </p>
          </div> */}
          <div class="flex justify-center space-x-4 mt-4">
            <Button
              class="text-blue-500 border-blue-500 bg-white"
              variant="outline"
            >
              Previous
            </Button>
            <Button
              class="text-blue-500 border-blue-500 bg-white"
              variant="outline"
            >
              1
            </Button>
            <Button
              class="text-blue-500 border-blue-500 bg-white"
              variant="outline"
            >
              2
            </Button>
            <Button
              class="text-blue-500 border-blue-500 bg-white"
              variant="outline"
            >
              3
            </Button>
            <Button class="bg-blue-500 text-white">Next</Button>
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
