import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.5.3/file.ts";
import {
  BaseFilter,
  DduItem,
  DduOptions,
} from "https://deno.land/x/ddu_vim@v2.8.3/types.ts";
import { Denops } from "https://deno.land/x/denops_core@v5.0.0/denops.ts";

type Params = {
  format: string;
};

export class Filter extends BaseFilter<Params> {
  filter(args: {
    denops: Denops;
    options: DduOptions;
    filterParams: Params;
    items: DduItem[];
  }): Promise<DduItem[]> {
    return Promise.resolve(
      args.items
        .map((item: DduItem) => {
          const text: string = args.filterParams.format
            .replaceAll("%D", item.display ?? item.word)
          return {
            ...item,
            display: text,
          };
        }),
    );
  }
  params(): Params {
    return {
      format: "%D",
    };
  }
}
