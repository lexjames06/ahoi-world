"use client";
import { Selector } from "@ahoi-world/atoms";
import { SelectorOption } from "@ahoi-world/atoms/Selector";
import { useRouter } from "next/navigation";

type Props = {
  category?: string;
  categories: string[];
	loading?: boolean;
};

export function CategoriesSelector({ category, categories, loading = false }: Props) {
  const router = useRouter();

  const onCategoryClick = (category: string): void => {
		if (category === "all") {
			router.push("/posts");
      return;
		}

		router.push(`/posts?category=${category}`);
	};

	const convertToSelectorOptions = (categories: string[]): SelectorOption[] => {
		return categories.map((category) => ({
			key: category,
			value: category.replace(/_/g, " "),
		}));
	};

	const options = convertToSelectorOptions(categories);

  return (
    <Selector loading={loading} activeOption={category ?? null} options={options} onSelect={onCategoryClick} includeAll />
  );
};