import { BaseFilter, DduItem } from "https://deno.land/x/ddu_vim@v3.4.2/types.ts";

type Params = Record<never, never>;

export class Filter extends BaseFilter<Params> {
  filter(): Promise<DduItem[]> {
    return Promise.resolve([]);
  }
  params(): Params {
    return {
    };
  }
}
