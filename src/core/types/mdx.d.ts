declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const meta: {
    slug: string;
    title: string;
    description: string;
    order: number;
  };

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
