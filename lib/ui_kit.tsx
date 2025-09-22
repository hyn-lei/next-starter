import { locales } from "@/data";
import { CategoryRelation } from "@/lib/types";
import fs from "fs";
import path from "path";

export const formatCategory = (relations: CategoryRelation[]) => {
  // console.log(relations)
  if (relations.length === 0) {
    return <></>;
  }

  return (
    <div className={"flex space-x-6"}>
      {relations.map((relation, index) => {
        return (
          <div
            className={
              "text-text bg-primary/70 rounded-md px-4 py-2 tracking-wider"
            }
            key={"c-r-" + index}
          >
            <a href={"/category/" + relation.post_categories_id.slug}>
              {relation.post_categories_id.name}
            </a>
          </div>
        );
      })}
    </div>
  );
};

export const formatTag = (relations: string[]) => {
  // console.log(relations)
  if (relations.length === 0) {
    return <></>;
  }

  return (
    <div className={"flex space-x-6"}>
      {relations.map((relation, index) => {
        return (
          <div
            className={"text-accent px-4 py-2 tracking-wider"}
            key={"c-r-" + index}
          >
            <a href={"/tag/" + relation}>#{relation}</a>
          </div>
        );
      })}
    </div>
  );
};

export function memoryRender(value: string) {
  const pValue = parseFloat(value);
  if (pValue < 1) {
    return (pValue * 1024).toFixed(0) + "MB";
  } else {
    return pValue.toString() + "GB";
  }
}

export function trafficRender(value: string) {
  const pValue = parseFloat(value);
  return pValue.toString() + "TB";
}

export function arrayRender(value: string[]) {
  if (value && value.length > 0) {
    const divs = value.map((str: string, index: number) => (
      <div key={"array-render-" + index}>{str}</div>
    ));
    return <div className={""}>{divs}</div>;
  }
  return <div></div>;
}

export function payTypeRender(value: string[]) {
  if (value && value.length > 0) {
    const divs = value.map((str: string, index: number) => (
      <li key={"array-render-" + index}>{str}</li>
    ));
    return <ul className={"flex space-x-4"}>{divs}</ul>;
  }
  return <div></div>;
}

export const dynamicCss = [
  "grid-cols-3 md:grid-cols-3",
  "fill-green-500 stroke-green-500",
  "fill-blue-500 stroke-blue-500 space-y-0.5",
];
