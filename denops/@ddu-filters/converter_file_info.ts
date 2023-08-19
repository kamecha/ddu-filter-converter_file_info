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
        .filter((item: DduItem) => {
          return item.action !== undefined &&
            (item.action as ActionData).path !== undefined;
        })
        .map((item: DduItem) => {
          const action = item.action! as ActionData;
          const file_path = action.path!;
          const file_info: Deno.FileInfo = Deno.lstatSync(file_path);
          const text: string = args.filterParams.format
            .replaceAll("%D", item.display ?? item.word)
            .replaceAll("%T", fileInfoToType(file_info))
            .replaceAll(
              "%P",
              args.denops.meta.platform !== "windows"
                ? fileInfoToPermission(file_info)
                : "",
            )
            .replaceAll("%S", fileInfoToSize(file_info))
            .replaceAll("%M", fileInfoToLastModificationTime(file_info))
            .replaceAll("%A", fileInfoToLastAccessTime(file_info))
            .replaceAll("%C", fileInfoToCreationTime(file_info));
          return {
            ...item,
            display: text,
          };
        }),
    );
  }
  params(): Params {
    return {
      format: "%D\t%T%P %S\t%M %A %C",
    };
  }
}

// 8進数表記のpermissionを文字列変換
// linux
// 741 -> rwxr----x
// NOTE: Deno.FileInfo.modeはまだUNSTABLEなので、windowsでは動かない
function permissionToString(permission: string): string {
  const ret: string[] = [];
  // permission stinrg -> array
  for (const c of permission) {
    const perNum = parseInt(c, 8);
    const read = (perNum >> 2) & 1;
    const write = (perNum >> 1) & 1;
    const execute = perNum & 1;
    ret.push(`${read ? "r" : "-"}${write ? "w" : "-"}${execute ? "x" : "-"}`);
  }
  return ret.join("");
}

function fileInfoToPermission(file_info: Deno.FileInfo): string {
  if (file_info.mode === null) {
    return "?????????";
  }
  return permissionToString(file_info.mode.toString(8).slice(-3));
}

function fileInfoToType(file_info: Deno.FileInfo): string {
  return file_info.isSymlink
    ? "l"
    : file_info.isDirectory
    ? "d"
    : file_info.isFile
    ? "-"
    : "?";
}

function fileInfoToSize(file_info: Deno.FileInfo): string {
  return file_info.size.toString();
}

function fileInfoToLastModificationTime(file_info: Deno.FileInfo): string {
  return file_info.mtime?.toLocaleDateString() ?? "";
}

function fileInfoToLastAccessTime(file_info: Deno.FileInfo): string {
  return file_info.atime?.toLocaleDateString() ?? "";
}

function fileInfoToCreationTime(file_info: Deno.FileInfo): string {
  return file_info.birthtime?.toLocaleDateString() ?? "";
}
