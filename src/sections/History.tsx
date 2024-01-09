import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { createEffect, For } from "solid-js";
import { Input } from "~/components/ui/input";
import { PAGE_SIZE, Sections, setCurrentSection, setUrls, urls } from "~/state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { debounce, getFullShortUrl } from "~/lib/utils";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import { showToast } from "~/components/ui/toast";
import { SetStoreFunction, createStore } from "solid-js/store";
import { createForm } from "~/lib/forms";
import { Switch } from "~/components/ui/switch";

function getPastDate(minusDays: number) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - minusDays);
  return now;
}

function toDateString(date: Date) {
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
}

const periodSelectMap: Record<string, string> = {
  last7days: "Last 7 days",
  last30days: "Last 30 days",
  allTime: "All Time",
};
const periodDateMap: Record<string, Date | null> = {
  last7days: getPastDate(7),
  last30days: getPastDate(30),
  allTime: null,
};

const fetchUrls = debounce(
  ({
    searchParams,
    setFilterStore,
    currentPage,
  }: {
    searchParams: URLSearchParams;
    setFilterStore: SetStoreFunction<{
      page: number;
      pageSize: number;
      hasPrev: boolean;
      hasNext: boolean;
      isLoading: boolean;
    }>;
    currentPage: number;
  }) => {
    return fetch(`/api/url?${searchParams.toString()}`)
      .then((r) => r.json())

      .then((r) => {
        if (typeof r === "string") {
          throw r;
        }

        setUrls(r.data);
        setFilterStore({
          hasNext: r.meta.hasNext,
          hasPrev: currentPage > 1,
          isLoading: false,
        });
        return r.data;
      })
      .catch((err) => {
        console.error(err);
        setFilterStore("isLoading", false);
      });
  },
  300
);

export default function HistorySection() {
  const [filterStore, setFilterStore] = createStore({
    page: 1,
    pageSize: PAGE_SIZE,
    hasPrev: false,
    hasNext: false,
    isLoading: false,
  });
  const form = createForm<{ query: string; dateQuery?: string }>();

  const queryOptions = form.register("query");
  let el: HTMLDivElement | undefined;

  const useVisibilityObserver = createVisibilityObserver({ threshold: 1 });
  const visible = useVisibilityObserver(() => el);

  createEffect(() => {
    if (visible()) {
      setCurrentSection(Sections.History);
      history.replaceState({}, "", "#" + Sections.History);
    }
  });

  createEffect(() => {
    const after = form.value.dateQuery
      ? periodDateMap[form.value.dateQuery]
      : null;
    const searchParams = new URLSearchParams();
    searchParams.set("page", filterStore.page.toString());
    searchParams.set("pageSize", filterStore.pageSize.toString());
    form.value.query && searchParams.set("query", form.value.query);
    after && searchParams.set("after", toDateString(after));

    setFilterStore("isLoading", true);
    fetchUrls({
      searchParams,
      setFilterStore,
      currentPage: filterStore.page,
    });
  });

  const nextPage = () => {
    setFilterStore("page", (v) => v + 1);
  };

  const prevPage = () => {
    setFilterStore("page", (v) => (v > 1 ? v - 1 : v));
  };

  const copyContent = (el: EventTarget & Element) => {
    if (el.textContent) {
      navigator.clipboard.writeText(el.textContent);
      showToast({
        title: "Copied!",
        description: "Your link was copied to clipboard",
      });
    }
  };

  const onToggle = (id: string) => () => {
    setUrls((urls) =>
      urls.map((u) => (u.id === id ? { ...u, deactivated: !u.deactivated } : u))
    );
    fetch(`/api/url/${id}/toggle`, {
      method: "PUT",
    });
  };

  return (
    <div
      class="snap-start h-screen max-h-screen flex flex-col items-center justify-center space-y-6"
      id={Sections.History}
      ref={el}
    >
      <div class="w-full max-w-3xl flex flex-col items-center">
        <h2 class="text-2xl font-bold text-primary">History</h2>
        <div class="flex justify-between items-center w-full mt-4">
          <Select
            value={form.value.dateQuery ?? ""}
            onChange={(v) => form.setValue("dateQuery", v)}
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
          <Input
            class="ml-2"
            placeholder="Search by URL"
            type="text"
            {...queryOptions}
          />
        </div>
        <div class="w-full mt-4 border-t border-secondary">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="font-bold">Short URL</TableHead>
                <TableHead class="font-bold">Original URL</TableHead>
                <TableHead class="font-bold">Date</TableHead>
                <TableHead class="font-bold">Redirects</TableHead>
                <TableHead class="font-bold">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <For each={urls()}>
                {(url) => (
                  <TableRow>
                    <TableCell class="break-all overflow-ellipsis">
                      <span
                        class="line-clamp-2 cursor-pointer"
                        onClick={(e) => copyContent(e.target)}
                      >
                        {getFullShortUrl(url.id)}
                      </span>
                    </TableCell>
                    <TableCell class="break-all overflow-ellipsis">
                      <span
                        class="line-clamp-2 cursor-pointer"
                        onClick={(e) => copyContent(e.target)}
                      >
                        {url.originalUrl}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(`${url.createdAt} UTC`).toLocaleDateString()}
                    </TableCell>
                    <TableCell class="overflow-hidden overflow-ellipsis text-center">
                      {url.redirects}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={!url.deactivated}
                        onClick={onToggle(url.id)}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
          <div class="flex justify-center space-x-4 mt-4">
            <Button
              class="bg-primary text-primary-foreground"
              disabled={!filterStore.hasPrev || filterStore.isLoading}
              onClick={prevPage}
            >
              Previous
            </Button>
            <Button variant={"outline"}>{filterStore.page}</Button>
            <Button
              class="bg-primary text-primary-foreground"
              disabled={!filterStore.hasNext || filterStore.isLoading}
              onClick={nextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// function IconCopy(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       stroke-width="2"
//       stroke-linecap="round"
//       stroke-linejoin="round"
//     >
//       <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
//       <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
//     </svg>
//   );
// }
